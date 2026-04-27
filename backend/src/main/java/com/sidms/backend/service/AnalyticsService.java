package com.sidms.backend.service;

import com.sidms.backend.dto.analytics.*;
import com.sidms.backend.entity.*;
import com.sidms.backend.entity.enums.DisasterCategory;
import com.sidms.backend.entity.enums.WarningStatus;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final SpatialUnitRepository spatialUnitRepository;
    private final SpatialUnitWeatherNodeMappingRepository mappingRepository;
    private final WeatherNodeHistoricalDailyRepository historicalRepository;
    private final WarningSpatialUnitRepository warningSpatialUnitRepository;
    private final DisasterWarningRepository disasterWarningRepository;
    private final NodeTimeseriesRepository nodeTimeseriesRepository;
    private final StationObservationRepository stationObservationRepository;
    private final JaxaRainGridRepository jaxaRainGridRepository;
    private final BiasHistoryRepository biasHistoryRepository;
    private final WeatherNodeRepository weatherNodeRepository;
    private final StationMetadataRepository stationMetadataRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public AnalyticsService(SpatialUnitRepository spatialUnitRepository,
            SpatialUnitWeatherNodeMappingRepository mappingRepository,
            WeatherNodeHistoricalDailyRepository historicalRepository,
            WarningSpatialUnitRepository warningSpatialUnitRepository,
            DisasterWarningRepository disasterWarningRepository,
            NodeTimeseriesRepository nodeTimeseriesRepository,
            StationObservationRepository stationObservationRepository,
            JaxaRainGridRepository jaxaRainGridRepository,
            BiasHistoryRepository biasHistoryRepository,
            WeatherNodeRepository weatherNodeRepository,
            StationMetadataRepository stationMetadataRepository,
            StringRedisTemplate redisTemplate,
            ObjectMapper objectMapper) {
        this.spatialUnitRepository = spatialUnitRepository;
        this.mappingRepository = mappingRepository;
        this.historicalRepository = historicalRepository;
        this.warningSpatialUnitRepository = warningSpatialUnitRepository;
        this.disasterWarningRepository = disasterWarningRepository;
        this.nodeTimeseriesRepository = nodeTimeseriesRepository;
        this.stationObservationRepository = stationObservationRepository;
        this.jaxaRainGridRepository = jaxaRainGridRepository;
        this.biasHistoryRepository = biasHistoryRepository;
        this.weatherNodeRepository = weatherNodeRepository;
        this.stationMetadataRepository = stationMetadataRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public AnalyticsOverviewResponse getOverview(UUID spatialUnitId) {
        // 1. Check Redis cache
        String cacheKey = "analytics:overview:" + spatialUnitId;
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return objectMapper.readValue(cached, AnalyticsOverviewResponse.class);
            }
        } catch (Exception ignored) {
        }

        // 2. Load spatial unit
        SpatialUnit spatialUnit = spatialUnitRepository.findById(spatialUnitId)
                .orElseThrow(() -> new ResourceNotFoundException("Spatial unit not found: " + spatialUnitId));

        // 3. Load historical weather via IDW mappings (last 30 days)
        List<DailyWeatherDto> historicalTrend = computeHistoricalTrend(spatialUnitId);

        // 4. Load forecasts (next 14 days)
        List<ForecastDto> forecast = loadForecasts(spatialUnitId);

        // 5. Compute anomalies from historical data
        List<AnomalyDto> anomalies = computeAnomalies(historicalTrend);

        // 6. Compute monthly averages
        List<MonthlyStatsDto> monthlyAverages = computeMonthlyAverages(spatialUnitId);

        // 7. Warning history (including ancestor chains)
        WarningHistoryDto warningHistory = computeWarningHistory(spatialUnitId);

        // 8. Build response
        AnalyticsOverviewResponse response = AnalyticsOverviewResponse.builder()
                .spatialUnitId(spatialUnit.getId())
                .spatialUnitName(spatialUnit.getName())
                .type(spatialUnit.getType().name())
                .historicalTrend(historicalTrend)
                .forecast(forecast)
                .anomalies(anomalies)
                .monthlyAverages(monthlyAverages)
                .warningHistory(warningHistory)
                .build();

        // 9. Cache 2 hours
        try {
            redisTemplate.opsForValue().set(cacheKey,
                    objectMapper.writeValueAsString(response),
                    Duration.ofHours(2));
        } catch (Exception ignored) {
        }

        return response;
    }

    // ── Historical trend via IDW ────────────────────────────

    public List<DailyWeatherDto> computeHistoricalTrend(UUID spatialUnitId) {
        List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                .findBySpatialUnitIdOrderByRankAsc(spatialUnitId);

        if (mappings.isEmpty()) {
            return List.of();
        }

        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);

        // Collect all historical data per node
        Map<UUID, List<WeatherNodeHistoricalDaily>> nodeData = new HashMap<>();
        Map<UUID, Double> nodeWeights = new HashMap<>();

        for (SpatialUnitWeatherNodeMapping mapping : mappings) {
            nodeWeights.put(mapping.getWeatherNodeId(), mapping.getIdwWeight());
            List<WeatherNodeHistoricalDaily> history = historicalRepository.findByWeatherNodeIdAndDateBetween(
                    mapping.getWeatherNodeId(), startDate, endDate);
            if (!history.isEmpty()) {
                nodeData.put(mapping.getWeatherNodeId(), history);
            }
        }

        if (nodeData.isEmpty()) {
            return List.of();
        }

        // Group by date and compute IDW weighted averages
        Map<LocalDate, List<WeightedReading>> byDate = new TreeMap<>();

        for (Map.Entry<UUID, List<WeatherNodeHistoricalDaily>> entry : nodeData.entrySet()) {
            double weight = nodeWeights.getOrDefault(entry.getKey(), 1.0);
            for (WeatherNodeHistoricalDaily h : entry.getValue()) {
                byDate.computeIfAbsent(h.getDate(), k -> new ArrayList<>())
                        .add(new WeightedReading(h, weight));
            }
        }

        return byDate.entrySet().stream()
                .map(e -> {
                    double wTemp = 0, swTemp = 0;
                    double wPrecip = 0, swPrecip = 0;
                    double wHumidity = 0, swHumidity = 0;

                    for (WeightedReading wr : e.getValue()) {
                        if (wr.data.getTempMeanC() != null) {
                            wTemp += wr.data.getTempMeanC() * wr.weight;
                            swTemp += wr.weight;
                        }
                        if (wr.data.getPrecipSumMm() != null) {
                            wPrecip += wr.data.getPrecipSumMm() * wr.weight;
                            swPrecip += wr.weight;
                        }
                        if (wr.data.getHumidityMeanPct() != null) {
                            wHumidity += wr.data.getHumidityMeanPct() * wr.weight;
                            swHumidity += wr.weight;
                        }
                    }

                    return DailyWeatherDto.builder()
                            .date(e.getKey())
                            .tempMean(safeDivide(wTemp, swTemp))
                            .precipMm(safeDivide(wPrecip, swPrecip))
                            .humidityMean(safeDivide(wHumidity, swHumidity))
                            .build();
                })
                .collect(Collectors.toList());
    }

    // ── Forecasts (from node_timeseries with IDW) ───────────

    private List<ForecastDto> loadForecasts(UUID spatialUnitId) {
        List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                .findBySpatialUnitIdOrderByRankAsc(spatialUnitId);

        if (mappings.isEmpty()) {
            return List.of();
        }

        // Get top 6 nearest nodes with their weights
        List<SpatialUnitWeatherNodeMapping> topMappings = mappings.stream()
                .limit(6)
                .collect(Collectors.toList());

        List<UUID> nodeIds = topMappings.stream()
                .map(SpatialUnitWeatherNodeMapping::getWeatherNodeId)
                .collect(Collectors.toList());

        Map<UUID, Double> weightMap = topMappings.stream()
                .collect(Collectors.toMap(
                    SpatialUnitWeatherNodeMapping::getWeatherNodeId,
                    SpatialUnitWeatherNodeMapping::getIdwWeight));

        // Fetch node timeseries forecasts for next 14 days (336 hours)
        List<NodeTimeseries> allForecasts = nodeTimeseriesRepository.findByNodeIdInOrderByForecastHourAsc(nodeIds);

        // Group by forecast date (aggregate hourly to daily)
        Map<LocalDate, List<NodeTimeseriesForecast>> byDate = new TreeMap<>();

        for (NodeTimeseries ts : allForecasts) {
            if (ts.getValidFromUtc() == null || ts.getForecastHour() == null) continue;
            LocalDate forecastDate = ts.getValidFromUtc().plusHours(ts.getForecastHour()).toLocalDate();
            double weight = weightMap.getOrDefault(ts.getNodeId(), 1.0);

            byDate.computeIfAbsent(forecastDate, k -> new ArrayList<>())
                  .add(new NodeTimeseriesForecast(ts, weight));
        }

        // Compute IDW weighted averages per day
        List<ForecastDto> forecasts = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for (Map.Entry<LocalDate, List<NodeTimeseriesForecast>> entry : byDate.entrySet()) {
            LocalDate date = entry.getKey();
            if (date.isBefore(today) || date.isAfter(today.plusDays(14))) {
                continue; // Only next 14 days
            }

            double wPrecip = 0, swPrecip = 0;
            double wTemp = 0, swTemp = 0;
            double wTempMax = 0, swTempMax = 0;
            double wTempMin = 0, swTempMin = 0;
            List<Double> precipValues = new ArrayList<>();

            for (NodeTimeseriesForecast nf : entry.getValue()) {
                NodeTimeseries ts = nf.data;
                double w = nf.weight;

                // Accumulate precipitation (sum per day)
                if (ts.getPrecipitationMm() != null) {
                    wPrecip += ts.getPrecipitationMm().doubleValue() * w;
                    swPrecip += w;
                    precipValues.add(ts.getPrecipitationMm().doubleValue());
                }

                // Temperature (mean of hourly)
                if (ts.getTemperatureC() != null) {
                    double temp = ts.getTemperatureC().doubleValue();
                    // Apply bias correction
                    Optional<WeatherNode> nodeOpt = weatherNodeRepository.findById(ts.getNodeId());
                    double bias = nodeOpt.map(n -> n.getBiasTempC() != null ? n.getBiasTempC() : 0.0).orElse(0.0);
                    wTemp += (temp + bias) * w;
                    swTemp += w;
                }

                // Track max/min temps
                if (ts.getTempMaxC() != null) {
                    wTempMax += ts.getTempMaxC().doubleValue() * w;
                    swTempMax += w;
                }
                if (ts.getTempMinC() != null) {
                    wTempMin += ts.getTempMinC().doubleValue() * w;
                    swTempMin += w;
                }
            }

            Double avgPrecip = safeDivide(wPrecip, swPrecip);
            Double stdPrecip = computeStdDevFromList(precipValues);

            // Confidence bounds: ±1 standard error for 68% confidence
            Double upperBound = avgPrecip != null && stdPrecip != null ? avgPrecip + stdPrecip : null;
            Double lowerBound = avgPrecip != null && stdPrecip != null ? Math.max(0, avgPrecip - stdPrecip) : null;

            forecasts.add(ForecastDto.builder()
                    .date(date)
                    .predictedPrecip(avgPrecip)
                    .upperBound(upperBound)
                    .lowerBound(lowerBound)
                    .qualityScore(swPrecip > 0 ? 1.0 : 0.0) // Data coverage score
                    .build());
        }

        return forecasts;
    }

    // Helper class for node timeseries with weight
    private static class NodeTimeseriesForecast {
        final NodeTimeseries data;
        final double weight;

        NodeTimeseriesForecast(NodeTimeseries data, double weight) {
            this.data = data;
            this.weight = weight;
        }
    }

    private Double computeStdDevFromList(List<Double> values) {
        if (values.size() < 2) return 0.0;
        double mean = values.stream().mapToDouble(d -> d).average().orElse(0);
        double sumSq = values.stream().mapToDouble(d -> (d - mean) * (d - mean)).sum();
        return Math.sqrt(sumSq / (values.size() - 1));
    }

    public ForecastAccuracyDto getForecastAccuracy(UUID spatialUnitId, Integer days, String metric) {
        // Get spatial unit mappings
        List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                .findBySpatialUnitIdOrderByRankAsc(spatialUnitId);

        if (mappings.isEmpty()) {
            return ForecastAccuracyDto.builder()
                    .spatialUnitId(spatialUnitId)
                    .totalForecasts(0)
                    .mae(0.0)
                    .hitRate(0.0)
                    .build();
        }

        List<UUID> nodeIds = mappings.stream()
                .map(SpatialUnitWeatherNodeMapping::getWeatherNodeId)
                .collect(Collectors.toList());

        // Calculate accuracy from bias_history table (tracks model errors)
        LocalDateTime since = LocalDateTime.now().minusDays(days);

        // Get bias records for these nodes
        List<BiasHistory> biases = biasHistoryRepository.findByNodeIdInAndTimestampUtcAfter(nodeIds, since);

        if (biases.isEmpty()) {
            return ForecastAccuracyDto.builder()
                    .spatialUnitId(spatialUnitId)
                    .totalForecasts(0)
                    .mae(0.0)
                    .hitRate(0.0)
                    .build();
        }

        // Calculate MAE (Mean Absolute Error) from bias values
        double totalMae = 0;
        int count = 0;
        int hits = 0;

        for (BiasHistory bias : biases) {
            if (bias.getBiasValue() != null) {
                double biasVal = bias.getBiasValue().doubleValue();
                totalMae += Math.abs(biasVal);
                count++;
                // Consider it a "hit" if bias is within acceptable threshold
                if (Math.abs(biasVal) <= 2.0) hits++;
            }
        }

        double mae = count > 0 ? totalMae / count : 0.0;
        double hitRate = count > 0 ? (double) hits / count * 100 : 0.0;

        return ForecastAccuracyDto.builder()
                .spatialUnitId(spatialUnitId)
                .totalForecasts(count)
                .mae(round2(mae))
                .hitRate(round2(hitRate))
                .build();
    }

    public List<ForecastHistoryPointDto> getForecastHistoryPoints(UUID spatialUnitId, String metric, Integer days) {
        List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                .findBySpatialUnitIdOrderByRankAsc(spatialUnitId);

        if (mappings.isEmpty()) {
            return List.of();
        }

        List<UUID> nodeIds = mappings.stream()
                .map(SpatialUnitWeatherNodeMapping::getWeatherNodeId)
                .collect(Collectors.toList());

        // Get recent bias history
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        List<BiasHistory> biases = biasHistoryRepository.findByNodeIdInAndTimestampUtcAfter(nodeIds, since);

        List<ForecastHistoryPointDto> history = new ArrayList<>();

        // Get station observations for comparison
        List<StationObservation> observations = stationObservationRepository.findByTimestampUtcAfter(since);

        // Match observations to create history points
        for (StationObservation obs : observations) {
            if (obs.getTimestampUtc() == null) continue;

            Double actualValue = null;
            if ("temperature".equals(metric) && obs.getTemperatureC() != null) {
                actualValue = obs.getTemperatureC().doubleValue();
            } else if ("precipitation".equals(metric) && obs.getRainfallMm() != null) {
                actualValue = obs.getRainfallMm().doubleValue();
            }

            if (actualValue == null) continue;

            // Find matching bias record for the same time window
            Optional<BiasHistory> matchingBias = biases.stream()
                    .filter(b -> b.getTimestampUtc() != null &&
                            Math.abs(java.time.Duration.between(b.getTimestampUtc(), obs.getTimestampUtc()).toHours()) <= 3)
                    .findFirst();

            Double biasValue = matchingBias.map(b -> b.getBiasValue() != null ? b.getBiasValue().doubleValue() : null).orElse(null);
            Double predictedValue = biasValue != null ? actualValue + biasValue : null;
            Double absoluteError = biasValue != null ? Math.abs(biasValue) : null;

            double confidenceThreshold = "temperature".equals(metric) ? 2.0 : 5.0;
            boolean hit = absoluteError != null && absoluteError <= confidenceThreshold;

            history.add(ForecastHistoryPointDto.builder()
                    .targetDate(obs.getTimestampUtc().toLocalDate())
                    .predictedValue(predictedValue != null ? round2(predictedValue) : null)
                    .actualValue(round2(actualValue))
                    .absoluteError(absoluteError != null ? round2(absoluteError) : null)
                    .confidenceHit(hit)
                    .actualRecordedAt(obs.getTimestampUtc())
                    .build());
        }

        // Sort by date descending
        history.sort((a, b) -> b.getTargetDate().compareTo(a.getTargetDate()));

        return history.stream().limit(100).collect(Collectors.toList()); // Limit to 100 points
    }

    // ── Anomaly detection (on-the-fly from recent vs monthly norms) ─

    private List<AnomalyDto> computeAnomalies(List<DailyWeatherDto> trend) {
        if (trend.isEmpty()) {
            return List.of();
        }

        List<AnomalyDto> anomalies = new ArrayList<>();
        int currentMonth = LocalDate.now().getMonthValue();

        // Compute recent averages (last 7 days)
        List<DailyWeatherDto> recent = trend.stream()
                .filter(d -> d.getDate().isAfter(LocalDate.now().minusDays(7)))
                .collect(Collectors.toList());

        // Compute 30-day averages as baseline
        double baselineTemp = trend.stream()
                .filter(d -> d.getTempMean() != null)
                .mapToDouble(DailyWeatherDto::getTempMean)
                .average().orElse(0);
        double baselinePrecip = trend.stream()
                .filter(d -> d.getPrecipMm() != null)
                .mapToDouble(DailyWeatherDto::getPrecipMm)
                .average().orElse(0);

        double baselineTempStd = computeStdDev(
                trend.stream().filter(d -> d.getTempMean() != null)
                        .mapToDouble(DailyWeatherDto::getTempMean).toArray(),
                baselineTemp);
        double baselinePrecipStd = computeStdDev(
                trend.stream().filter(d -> d.getPrecipMm() != null)
                        .mapToDouble(DailyWeatherDto::getPrecipMm).toArray(),
                baselinePrecip);

        // Check recent temp anomaly
        if (!recent.isEmpty()) {
            double recentTemp = recent.stream()
                    .filter(d -> d.getTempMean() != null)
                    .mapToDouble(DailyWeatherDto::getTempMean)
                    .average().orElse(baselineTemp);

            if (baselineTempStd > 0) {
                double zScore = (recentTemp - baselineTemp) / baselineTempStd;
                if (Math.abs(zScore) > 1.5) {
                    anomalies.add(AnomalyDto.builder()
                            .metric("temperature")
                            .month(currentMonth)
                            .classification(zScore > 0 ? "ABOVE_NORMAL" : "BELOW_NORMAL")
                            .zScore(Math.round(zScore * 100.0) / 100.0)
                            .build());
                }
            }

            // Check recent precip anomaly
            double recentPrecip = recent.stream()
                    .filter(d -> d.getPrecipMm() != null)
                    .mapToDouble(DailyWeatherDto::getPrecipMm)
                    .average().orElse(baselinePrecip);

            if (baselinePrecipStd > 0) {
                double zScore = (recentPrecip - baselinePrecip) / baselinePrecipStd;
                if (Math.abs(zScore) > 1.5) {
                    anomalies.add(AnomalyDto.builder()
                            .metric("precipitation")
                            .month(currentMonth)
                            .classification(zScore > 0 ? "ABOVE_NORMAL" : "BELOW_NORMAL")
                            .zScore(Math.round(zScore * 100.0) / 100.0)
                            .build());
                }
            }
        }

        return anomalies;
    }

    // ── Monthly averages ────────────────────────────────────

    private List<MonthlyStatsDto> computeMonthlyAverages(UUID spatialUnitId) {
        List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                .findBySpatialUnitIdOrderByRankAsc(spatialUnitId);

        if (mappings.isEmpty()) {
            return List.of();
        }

        // Load all historical data for all mapped nodes (last 365 days)
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(365);

        Map<Integer, List<Double>> tempByMonth = new HashMap<>();
        Map<Integer, List<Double>> precipByMonth = new HashMap<>();
        Map<Integer, List<Double>> humidityByMonth = new HashMap<>();

        for (SpatialUnitWeatherNodeMapping mapping : mappings) {
            List<WeatherNodeHistoricalDaily> history = historicalRepository.findByWeatherNodeIdAndDateBetween(
                    mapping.getWeatherNodeId(), startDate, endDate);

            for (WeatherNodeHistoricalDaily h : history) {
                int month = h.getDate().getMonthValue();
                if (h.getTempMeanC() != null) {
                    tempByMonth.computeIfAbsent(month, k -> new ArrayList<>()).add(h.getTempMeanC());
                }
                if (h.getPrecipSumMm() != null) {
                    precipByMonth.computeIfAbsent(month, k -> new ArrayList<>()).add(h.getPrecipSumMm());
                }
                if (h.getHumidityMeanPct() != null) {
                    humidityByMonth.computeIfAbsent(month, k -> new ArrayList<>()).add(h.getHumidityMeanPct());
                }
            }
        }

        List<MonthlyStatsDto> stats = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            List<Double> temps = tempByMonth.getOrDefault(m, List.of());
            List<Double> precips = precipByMonth.getOrDefault(m, List.of());
            List<Double> humidities = humidityByMonth.getOrDefault(m, List.of());

            if (temps.isEmpty() && precips.isEmpty() && humidities.isEmpty()) {
                continue;
            }

            stats.add(MonthlyStatsDto.builder()
                    .month(m)
                    .avgTemp(round2(temps.stream().mapToDouble(d -> d).average().orElse(0)))
                    .avgPrecip(round2(precips.stream().mapToDouble(d -> d).average().orElse(0)))
                    .avgHumidity(round2(humidities.stream().mapToDouble(d -> d).average().orElse(0)))
                    .build());
        }

        return stats;
    }



    // ── Warning history (ancestor-aware) ────────────────────

    private WarningHistoryDto computeWarningHistory(UUID spatialUnitId) {
        // Build ancestor chain
        List<UUID> chain = getAncestorChain(spatialUnitId);

        // Find all warning links for the chain
        List<WarningSpatialUnit> links = warningSpatialUnitRepository.findBySpatialUnitIdIn(chain);

        List<UUID> warningIds = links.stream()
                .map(WarningSpatialUnit::getWarningId)
                .distinct()
                .collect(Collectors.toList());

        if (warningIds.isEmpty()) {
            return WarningHistoryDto.builder()
                    .totalWarnings(0)
                    .floodWarnings(0)
                    .landslideWarnings(0)
                    .lastWarningAt(null)
                    .build();
        }

        List<DisasterWarning> warnings = disasterWarningRepository.findAllById(warningIds);

        int floodCount = (int) warnings.stream()
                .filter(w -> w.getCategory() == DisasterCategory.FLOOD)
                .count();
        int landslideCount = (int) warnings.stream()
                .filter(w -> w.getCategory() == DisasterCategory.LANDSLIDE)
                .count();

        LocalDateTime lastWarningAt = warnings.stream()
                .map(DisasterWarning::getCreatedAt)
                .filter(Objects::nonNull)
                .max(LocalDateTime::compareTo)
                .orElse(null);

        return WarningHistoryDto.builder()
                .totalWarnings(warnings.size())
                .floodWarnings(floodCount)
                .landslideWarnings(landslideCount)
                .lastWarningAt(lastWarningAt)
                .build();
    }

    // ── Satellite Rainfall Comparison (JAXA vs Station vs Model) ─

    public List<SatelliteRainfallDto> getSatelliteRainfallComparison(UUID spatialUnitId, Integer days) {
        List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                .findBySpatialUnitIdOrderByRankAsc(spatialUnitId);

        if (mappings.isEmpty()) {
            return List.of();
        }

        SpatialUnit spatialUnit = spatialUnitRepository.findById(spatialUnitId).orElse(null);
        if (spatialUnit == null) return List.of();

        LocalDateTime since = LocalDateTime.now().minusDays(days);
        LocalDate today = LocalDate.now();

        // Get JAXA rainfall data for the spatial unit area
        double lat = spatialUnit.getLat() != null ? spatialUnit.getLat() : 7.0;
        double lng = spatialUnit.getLng() != null ? spatialUnit.getLng() : 80.0;

        // Find nearest JAXA grid points (±0.1 degree)
        List<JaxaRainGrid> jaxaData = jaxaRainGridRepository.findByGridLatBetweenAndGridLonBetweenAndTimestampUtcAfter(
                BigDecimal.valueOf(lat - 0.15), BigDecimal.valueOf(lat + 0.15),
                BigDecimal.valueOf(lng - 0.15), BigDecimal.valueOf(lng + 0.15),
                since);

        // Aggregate JAXA by date
        Map<LocalDate, List<Double>> jaxaByDate = jaxaData.stream()
                .filter(j -> j.getTimestampUtc() != null && j.getRainfallMm() != null)
                .collect(Collectors.groupingBy(
                    j -> j.getTimestampUtc().toLocalDate(),
                    Collectors.mapping(j -> j.getRainfallMm().doubleValue(), Collectors.toList())));

        // Find nearest stations
        List<StationMetadata> allStations = stationMetadataRepository.findAll();
        List<StationDistance> nearbyStations = allStations.stream()
                .map(s -> new StationDistance(s, calculateDistance(lat, lng, s.getLatitude().doubleValue(), s.getLongitude().doubleValue())))
                .filter(sd -> sd.distance <= 25.0) // Within 25km
                .sorted(Comparator.comparingDouble(sd -> sd.distance))
                .limit(3)
                .collect(Collectors.toList());

        // Get station observations
        Map<LocalDate, List<Double>> stationByDate = new HashMap<>();
        for (StationDistance sd : nearbyStations) {
            List<StationObservation> obs = stationObservationRepository
                    .findByStationIdAndTimestampUtcAfter(sd.station.getStationId(), since);
            for (StationObservation o : obs) {
                if (o.getTimestampUtc() != null && o.getRainfallMm() != null) {
                    stationByDate.computeIfAbsent(o.getTimestampUtc().toLocalDate(), k -> new ArrayList<>())
                            .add(o.getRainfallMm().doubleValue());
                }
            }
        }

        // Get model forecasts from node_timeseries
        List<UUID> nodeIds = mappings.stream().limit(6).map(SpatialUnitWeatherNodeMapping::getWeatherNodeId).collect(Collectors.toList());
        List<NodeTimeseries> forecasts = nodeTimeseriesRepository.findByNodeIdInOrderByForecastHourAsc(nodeIds);

        Map<LocalDate, List<Double>> modelByDate = forecasts.stream()
                .filter(n -> n.getValidFromUtc() != null && n.getForecastHour() != null && n.getPrecipitationMm() != null)
                .collect(Collectors.groupingBy(
                    n -> n.getValidFromUtc().plusHours(n.getForecastHour()).toLocalDate(),
                    Collectors.mapping(n -> n.getPrecipitationMm().doubleValue(), Collectors.toList())));

        // Build daily comparison
        List<SatelliteRainfallDto> results = new ArrayList<>();
        LocalDate startDate = today.minusDays(days);

        for (LocalDate date = startDate; !date.isAfter(today); date = date.plusDays(1)) {
            Double satelliteRain = jaxaByDate.getOrDefault(date, List.of()).stream()
                    .mapToDouble(d -> d).average().orElse(0.0);

            List<Double> stationValues = stationByDate.getOrDefault(date, List.of());
            Double stationRain = !stationValues.isEmpty() ?
                    stationValues.stream().mapToDouble(d -> d).sum() : null;

            List<Double> modelValues = modelByDate.getOrDefault(date, List.of());
            Double modelRain = !modelValues.isEmpty() ?
                    modelValues.stream().mapToDouble(d -> d).sum() : 0.0;

            // Determine primary source
            String primarySource;
            if (stationRain != null && stationValues.size() >= 3) {
                primarySource = "STATION";
            } else if (satelliteRain > 0 || !jaxaByDate.getOrDefault(date, List.of()).isEmpty()) {
                primarySource = "SATELLITE";
            } else {
                primarySource = "MODEL";
            }

            Double discrepancy = null;
            if (stationRain != null && stationRain > 0) {
                discrepancy = Math.round(((satelliteRain - stationRain) / stationRain) * 100.0 * 100.0) / 100.0;
            }

            results.add(SatelliteRainfallDto.builder()
                    .date(date)
                    .satelliteRainMm(satelliteRain > 0 ? round2(satelliteRain) : null)
                    .stationRainMm(stationRain != null ? round2(stationRain) : null)
                    .modelRainMm(modelRain > 0 ? round2(modelRain) : null)
                    .discrepancyPercent(discrepancy)
                    .primarySource(primarySource)
                    .build());
        }

        return results;
    }

    // ── Station Comparison (Ground Truth vs Model) ─────────

    public List<StationComparisonDto> getStationComparison(UUID spatialUnitId) {
        List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                .findBySpatialUnitIdOrderByRankAsc(spatialUnitId);

        if (mappings.isEmpty()) {
            return List.of();
        }

        SpatialUnit spatialUnit = spatialUnitRepository.findById(spatialUnitId).orElse(null);
        if (spatialUnit == null) return List.of();

        double targetLat = spatialUnit.getLat() != null ? spatialUnit.getLat() : 7.0;
        double targetLng = spatialUnit.getLng() != null ? spatialUnit.getLng() : 80.0;

        // Find all stations within 50km
        List<StationMetadata> allStations = stationMetadataRepository.findAll();
        List<StationDistance> nearbyStations = allStations.stream()
                .map(s -> new StationDistance(s, calculateDistance(targetLat, targetLng, s.getLatitude().doubleValue(), s.getLongitude().doubleValue())))
                .filter(sd -> sd.distance <= 50.0)
                .sorted(Comparator.comparingDouble(sd -> sd.distance))
                .collect(Collectors.toList());

        if (nearbyStations.isEmpty()) {
            return List.of();
        }

        List<UUID> nodeIds = mappings.stream().limit(6).map(SpatialUnitWeatherNodeMapping::getWeatherNodeId).collect(Collectors.toList());
        Map<UUID, Double> weightMap = mappings.stream().limit(6)
                .collect(Collectors.toMap(SpatialUnitWeatherNodeMapping::getWeatherNodeId, SpatialUnitWeatherNodeMapping::getIdwWeight));

        List<StationComparisonDto> results = new ArrayList<>();

        for (StationDistance sd : nearbyStations) {
            StationMetadata station = sd.station;

            // Get latest observation
            Optional<StationObservation> latestObs = stationObservationRepository
                    .findTopByStationIdOrderByTimestampUtcDesc(station.getStationId());

            if (latestObs.isEmpty()) continue;

            StationObservation obs = latestObs.get();
            int ageMinutes = obs.getTimestampUtc() != null ?
                    (int) java.time.Duration.between(obs.getTimestampUtc(), LocalDateTime.now()).toMinutes() : 9999;

            // Skip stale data (> 6 hours)
            if (ageMinutes > 360) continue;

            // Get interpolated values from model
            double interpTemp = 0, interpHumidity = 0, interpRain = 0;
            double swTemp = 0, swHum = 0, swRain = 0;

            List<NodeTimeseries> nodeForecasts = nodeTimeseriesRepository
                    .findTopByNodeIdInOrderByForecastHourAsc(nodeIds);

            for (NodeTimeseries nf : nodeForecasts) {
                double w = weightMap.getOrDefault(nf.getNodeId(), 0.0);
                if (w == 0) continue;

                if (nf.getTemperatureC() != null) {
                    interpTemp += nf.getTemperatureC().doubleValue() * w;
                    swTemp += w;
                }
                if (nf.getHumidityPct() != null) {
                    interpHumidity += nf.getHumidityPct().doubleValue() * w;
                    swHum += w;
                }
                if (nf.getPrecipitationMm() != null) {
                    interpRain += nf.getPrecipitationMm().doubleValue() * w;
                    swRain += w;
                }
            }

            Double finalInterpTemp = safeDivide(interpTemp, swTemp);
            Double finalInterpHum = safeDivide(interpHumidity, swHum);
            Double finalInterpRain = safeDivide(interpRain, swRain);

            Double stationTemp = obs.getTemperatureC() != null ? obs.getTemperatureC().doubleValue() : null;
            Double stationHum = obs.getHumidityPct() != null ? obs.getHumidityPct().doubleValue() : null;
            Double stationRain = obs.getRainfallMm() != null ? obs.getRainfallMm().doubleValue() : null;

            results.add(StationComparisonDto.builder()
                    .stationId(station.getStationId())
                    .stationName(station.getStationName())
                    .stationLat(station.getLatitude().doubleValue())
                    .stationLon(station.getLongitude().doubleValue())
                    .distanceKm(round2(sd.distance))
                    .stationTempC(stationTemp)
                    .stationHumidityPct(stationHum)
                    .stationRainfallMm(stationRain)
                    .interpolatedTempC(finalInterpTemp)
                    .interpolatedHumidityPct(finalInterpHum)
                    .interpolatedRainfallMm(finalInterpRain)
                    .tempBiasC(stationTemp != null && finalInterpTemp != null ? round2(finalInterpTemp - stationTemp) : null)
                    .humidityBiasPct(stationHum != null && finalInterpHum != null ? round2(finalInterpHum - stationHum) : null)
                    .rainfallBiasMm(stationRain != null && finalInterpRain != null ? round2(finalInterpRain - stationRain) : null)
                    .observationTime(obs.getTimestampUtc())
                    .dataQuality(ageMinutes <= 180 ? "STATION_DIRECT" : "MODEL_BIAS_CORRECTED")
                    .stationAgeMinutes(ageMinutes)
                    .build());
        }

        return results;
    }

    // ── Hourly Trend (for detailed time-series charts) ──────

    public List<HourlyTrendDto> getHourlyTrend(UUID spatialUnitId, Integer hours, String metric) {
        List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                .findBySpatialUnitIdOrderByRankAsc(spatialUnitId);

        if (mappings.isEmpty()) {
            return List.of();
        }

        List<UUID> nodeIds = mappings.stream().limit(6).map(SpatialUnitWeatherNodeMapping::getWeatherNodeId).collect(Collectors.toList());
        Map<UUID, Double> weightMap = mappings.stream().limit(6)
                .collect(Collectors.toMap(SpatialUnitWeatherNodeMapping::getWeatherNodeId, SpatialUnitWeatherNodeMapping::getIdwWeight));

        // Get hourly forecasts for requested period
        List<NodeTimeseries> forecasts = nodeTimeseriesRepository.findByNodeIdInOrderByForecastHourAsc(nodeIds);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime cutoff = now.minusHours(hours);

        // Group by timestamp and IDW interpolate
        Map<LocalDateTime, List<NodeTimeseriesForecast>> byTime = forecasts.stream()
                .filter(n -> n.getValidFromUtc() != null && n.getForecastHour() != null)
                .map(n -> new NodeTimeseriesForecast(n, weightMap.getOrDefault(n.getNodeId(), 0.0)))
                .filter(nf -> nf.data.getValidFromUtc().plusHours(nf.data.getForecastHour()).isAfter(cutoff))
                .collect(Collectors.groupingBy(
                    nf -> nf.data.getValidFromUtc().plusHours(nf.data.getForecastHour()),
                    TreeMap::new,
                    Collectors.toList()));

        List<HourlyTrendDto> results = new ArrayList<>();

        for (Map.Entry<LocalDateTime, List<NodeTimeseriesForecast>> entry : byTime.entrySet()) {
            LocalDateTime ts = entry.getKey();

            double wTemp = 0, swTemp = 0;
            double wPrecip = 0, swPrecip = 0;
            double wHum = 0, swHum = 0;
            double wWind = 0, swWind = 0;
            double wDir = 0, swDir = 0;
            double wPress = 0, swPress = 0;
            double wCloud = 0, swCloud = 0;
            List<String> symbols = new ArrayList<>();

            for (NodeTimeseriesForecast nf : entry.getValue()) {
                NodeTimeseries n = nf.data;
                double w = nf.weight;
                if (w == 0) continue;

                if (n.getTemperatureC() != null) {
                    wTemp += n.getTemperatureC().doubleValue() * w;
                    swTemp += w;
                }
                if (n.getPrecipitationMm() != null) {
                    wPrecip += n.getPrecipitationMm().doubleValue() * w;
                    swPrecip += w;
                }
                if (n.getHumidityPct() != null) {
                    wHum += n.getHumidityPct().doubleValue() * w;
                    swHum += w;
                }
                if (n.getWindSpeedMs() != null) {
                    wWind += n.getWindSpeedMs().doubleValue() * 3.6 * w; // Convert to km/h
                    swWind += w;
                }
                if (n.getWindDirectionDeg() != null) {
                    wDir += n.getWindDirectionDeg().doubleValue() * w;
                    swDir += w;
                }
                if (n.getPressureHpa() != null) {
                    wPress += n.getPressureHpa().doubleValue() * w;
                    swPress += w;
                }
                if (n.getCloudCoverPct() != null) {
                    wCloud += n.getCloudCoverPct().doubleValue() * w;
                    swCloud += w;
                }
                if (n.getSymbolCode() != null) {
                    symbols.add(n.getSymbolCode());
                }
            }

            // Pick most common symbol
            String symbol = symbols.isEmpty() ? null :
                symbols.stream().collect(Collectors.groupingBy(s -> s, Collectors.counting()))
                    .entrySet().stream().max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse(null);

            results.add(HourlyTrendDto.builder()
                    .timestamp(ts)
                    .temperatureC(safeDivide(wTemp, swTemp))
                    .precipitationMm(safeDivide(wPrecip, swPrecip))
                    .humidityPct(safeDivide(wHum, swHum))
                    .windSpeedKmh(safeDivide(wWind, swWind))
                    .windDirectionDeg(safeDivide(wDir, swDir))
                    .pressureHpa(safeDivide(wPress, swPress))
                    .cloudCoverPct(safeDivide(wCloud, swCloud))
                    .symbolCode(symbol)
                    .dataSource("YRNO")
                    .build());
        }

        // Limit to requested hours and reverse (newest first)
        return results.stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(hours)
                .collect(Collectors.toList());
    }

    // Helper class for station distance calculations
    private static class StationDistance {
        final StationMetadata station;
        final double distance;

        StationDistance(StationMetadata station, double distance) {
            this.station = station;
            this.distance = distance;
        }
    }

    // Calculate distance between two lat/lon points using Haversine formula
    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth's radius in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // ── Helpers ──────────────────────────────────────────────

    private List<UUID> getAncestorChain(UUID spatialUnitId) {
        List<UUID> chain = new ArrayList<>();
        UUID currentId = spatialUnitId;
        while (currentId != null) {
            chain.add(currentId);
            UUID parentId = spatialUnitRepository.findById(currentId)
                    .map(SpatialUnit::getParentId).orElse(null);
            currentId = parentId;
        }
        return chain;
    }

    private Double safeDivide(double numerator, double denominator) {
        if (denominator == 0)
            return null;
        return Math.round(numerator / denominator * 100.0) / 100.0;
    }

    private double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    private double computeStdDev(double[] values, double mean) {
        if (values.length < 2)
            return 0;
        double sumSq = 0;
        for (double v : values) {
            sumSq += (v - mean) * (v - mean);
        }
        return Math.sqrt(sumSq / (values.length - 1));
    }

    // Inner class for weighted readings
    private static class WeightedReading {
        final WeatherNodeHistoricalDaily data;
        final double weight;

        WeightedReading(WeatherNodeHistoricalDaily data, double weight) {
            this.data = data;
            this.weight = weight;
        }
    }
}
