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
    private final ForecastProjectionRepository forecastProjectionRepository;
    private final WarningSpatialUnitRepository warningSpatialUnitRepository;
    private final DisasterWarningRepository disasterWarningRepository;
    private final ForecastComparisonRepository forecastComparisonRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public AnalyticsService(SpatialUnitRepository spatialUnitRepository,
            SpatialUnitWeatherNodeMappingRepository mappingRepository,
            WeatherNodeHistoricalDailyRepository historicalRepository,
            ForecastProjectionRepository forecastProjectionRepository,
            WarningSpatialUnitRepository warningSpatialUnitRepository,
            DisasterWarningRepository disasterWarningRepository,
            ForecastComparisonRepository forecastComparisonRepository,
            StringRedisTemplate redisTemplate,
            ObjectMapper objectMapper) {
        this.spatialUnitRepository = spatialUnitRepository;
        this.mappingRepository = mappingRepository;
        this.historicalRepository = historicalRepository;
        this.forecastProjectionRepository = forecastProjectionRepository;
        this.warningSpatialUnitRepository = warningSpatialUnitRepository;
        this.disasterWarningRepository = disasterWarningRepository;
        this.forecastComparisonRepository = forecastComparisonRepository;
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

    // ── Forecasts ───────────────────────────────────────────

    private List<ForecastDto> loadForecasts(UUID spatialUnitId) {
        LocalDate today = LocalDate.now();
        LocalDate end = today.plusDays(14);

        List<ForecastProjection> projections = forecastProjectionRepository
                .findBySpatialUnitIdAndMetricAndForecastDateBetween(
                        spatialUnitId, "precipitation", today, end);

        if (projections.isEmpty()) {
            // Try any metric
            projections = forecastProjectionRepository.findBySpatialUnitIdAndForecastDateBetween(
                    spatialUnitId, today, end);
        }

        // Group by date, pick precipitation or first available
        Map<LocalDate, ForecastProjection> byDate = new TreeMap<>();
        for (ForecastProjection fp : projections) {
            byDate.putIfAbsent(fp.getForecastDate(), fp);
        }

        return byDate.values().stream()
                .map(fp -> ForecastDto.builder()
                        .date(fp.getForecastDate())
                        .predictedPrecip(fp.getPointEstimate())
                        .lowerBound(fp.getLowerBound())
                        .upperBound(fp.getUpperBound())
                        .qualityScore(fp.getQualityScore())
                        .build())
                .collect(Collectors.toList());
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

    @org.springframework.transaction.annotation.Transactional
    public void saveForecastsForComparison(UUID spatialUnitId, UUID projectionId, String metric,
            List<Double> predictions, List<Double> lowerBounds, List<Double> upperBounds) {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();

        for (int day = 0; day < predictions.size(); day++) {
            LocalDate targetDate = today.plusDays(day + 1);

            Double lower = (lowerBounds != null && day < lowerBounds.size()) ? lowerBounds.get(day) : null;
            Double upper = (upperBounds != null && day < upperBounds.size()) ? upperBounds.get(day) : null;

            ForecastComparison comparison = ForecastComparison.builder()
                    .forecastProjectionId(projectionId)
                    .spatialUnitId(spatialUnitId)
                    .metric(metric)
                    .targetDate(targetDate)
                    .forecastGeneratedAt(now)
                    .predictedValue(predictions.get(day))
                    .confidenceLower(lower)
                    .confidenceUpper(upper)
                    .createdAt(now)
                    .build();

            forecastComparisonRepository.save(comparison);
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public void updateForecastWithActuals(UUID spatialUnitId, String metric, LocalDate targetDate, Double actualValue) {
        Optional<ForecastComparison> opt = forecastComparisonRepository
                .findFirstBySpatialUnitIdAndMetricAndTargetDateAndActualValueIsNullOrderByForecastGeneratedAtDesc(
                        spatialUnitId, metric, targetDate);

        if (opt.isEmpty())
            return;

        ForecastComparison comp = opt.get();
        comp.setActualValue(actualValue);
        comp.setActualRecordedAt(LocalDateTime.now());

        double error = Math.abs(actualValue - comp.getPredictedValue());
        comp.setAbsoluteError(error);

        if (comp.getPredictedValue() != 0) {
            comp.setPercentError((actualValue - comp.getPredictedValue()) / comp.getPredictedValue() * 100.0);
        } else {
            comp.setPercentError(0.0);
        }

        if (comp.getConfidenceLower() != null && comp.getConfidenceUpper() != null) {
            comp.setConfidenceHit(actualValue >= comp.getConfidenceLower() && actualValue <= comp.getConfidenceUpper());
        }

        forecastComparisonRepository.save(comp);
    }

    public ForecastAccuracyDto getForecastAccuracy(UUID spatialUnitId, Integer days, String metric) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(days != null ? days : 30);
        List<ForecastComparison> comparisons;

        if (metric != null && !metric.equals("all")) {
            comparisons = forecastComparisonRepository
                    .findBySpatialUnitIdAndMetricAndActualRecordedAtAfterOrderByTargetDateDesc(spatialUnitId, metric,
                            cutoff);
        } else {
            comparisons = forecastComparisonRepository
                    .findBySpatialUnitIdAndActualRecordedAtAfterOrderByTargetDateDesc(spatialUnitId, cutoff);
        }

        if (comparisons.isEmpty()) {
            return ForecastAccuracyDto.builder()
                    .spatialUnitId(spatialUnitId)
                    .totalForecasts(0)
                    .hitRate(0.0)
                    .mae(0.0)
                    .build();
        }

        double totalError = 0;
        int hits = 0;
        int confHits = 0;
        int count = comparisons.size();

        for (ForecastComparison c : comparisons) {
            totalError += c.getAbsoluteError() != null ? c.getAbsoluteError() : 0;
            if (c.getConfidenceHit() != null && c.getConfidenceHit()) {
                confHits++;
            }
        }

        return ForecastAccuracyDto.builder()
                .spatialUnitId(spatialUnitId)
                .totalForecasts(count)
                .mae(round2(totalError / count))
                .hitRate(round2((double) confHits / count * 100.0))
                .build();
    }

    public List<ForecastComparison> getForecastHistory(UUID spatialUnitId, String metric, Integer days) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(days != null ? days : 30);
        return forecastComparisonRepository.findBySpatialUnitIdAndMetricAndActualRecordedAtAfterOrderByTargetDateDesc(
                spatialUnitId, metric, cutoff);
    }

    public List<ForecastHistoryPointDto> getForecastHistoryPoints(UUID spatialUnitId, String metric, Integer days) {
        return getForecastHistory(spatialUnitId, metric, days).stream()
                .map(c -> ForecastHistoryPointDto.builder()
                        .targetDate(c.getTargetDate())
                        .predictedValue(c.getPredictedValue())
                        .actualValue(c.getActualValue())
                        .confidenceLower(c.getConfidenceLower())
                        .confidenceUpper(c.getConfidenceUpper())
                        .absoluteError(c.getAbsoluteError())
                        .percentError(c.getPercentError())
                        .confidenceHit(c.getConfidenceHit())
                        .forecastGeneratedAt(c.getForecastGeneratedAt())
                        .actualRecordedAt(c.getActualRecordedAt())
                        .build())
                .collect(Collectors.toList());
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
