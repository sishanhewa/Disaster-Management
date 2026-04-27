package com.sidms.backend.service;

import com.sidms.backend.dto.weather.SpatialUnitSearchResult;
import com.sidms.backend.entity.*;
import com.sidms.backend.entity.enums.SpatialType;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.repository.*;
import com.sidms.backend.util.CacheKeys;
import com.sidms.backend.dto.weather.advanced.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class WeatherService {

    private final SpatialUnitRepository spatialUnitRepository;
    private final SpatialUnitWeatherNodeMappingRepository mappingRepository;
    private final WeatherNodeLiveCacheRepository liveCacheRepository;
    private final GnStationAnchorRepository gnStationAnchorRepository;
    private final StationObservationRepository stationObservationRepository;
    private final StationMetadataRepository stationMetadataRepository;
    private final WeatherNodeRepository weatherNodeRepository;
    private final NodeTimeseriesRepository nodeTimeseriesRepository;
    private final JaxaRainGridRepository jaxaRainGridRepository;
    private final WeatherNodeCelestialRepository weatherNodeCelestialRepository;
    private final WeatherNodeHourlyForecastRepository weatherNodeHourlyForecastRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public WeatherService(SpatialUnitRepository spatialUnitRepository,
            SpatialUnitWeatherNodeMappingRepository mappingRepository,
            WeatherNodeLiveCacheRepository liveCacheRepository,
            GnStationAnchorRepository gnStationAnchorRepository,
            StationObservationRepository stationObservationRepository,
            StationMetadataRepository stationMetadataRepository,
            WeatherNodeRepository weatherNodeRepository,
            NodeTimeseriesRepository nodeTimeseriesRepository,
            JaxaRainGridRepository jaxaRainGridRepository,
            WeatherNodeCelestialRepository weatherNodeCelestialRepository,
            WeatherNodeHourlyForecastRepository weatherNodeHourlyForecastRepository,
            StringRedisTemplate redisTemplate,
            ObjectMapper objectMapper) {
        this.spatialUnitRepository = spatialUnitRepository;
        this.mappingRepository = mappingRepository;
        this.liveCacheRepository = liveCacheRepository;
        this.gnStationAnchorRepository = gnStationAnchorRepository;
        this.stationObservationRepository = stationObservationRepository;
        this.stationMetadataRepository = stationMetadataRepository;
        this.weatherNodeRepository = weatherNodeRepository;
        this.nodeTimeseriesRepository = nodeTimeseriesRepository;
        this.jaxaRainGridRepository = jaxaRainGridRepository;
        this.weatherNodeCelestialRepository = weatherNodeCelestialRepository;
        this.weatherNodeHourlyForecastRepository = weatherNodeHourlyForecastRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public AdvancedForecastResponse getWeatherForSpatialUnit(UUID spatialUnitId) {
        String cacheKey = "weather:spatial:adv:v2:" + spatialUnitId;
        DateTimeFormatter isoFormatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;

        // ── 0. Load spatial unit first ──
        SpatialUnit spatialUnit = spatialUnitRepository.findById(spatialUnitId)
                .orElseThrow(() -> new ResourceNotFoundException("Spatial unit not found: " + spatialUnitId));

        // ── 1. Check Redis cache ──────────────────────────────────────────────────
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return objectMapper.readValue(cached, AdvancedForecastResponse.class);
            }
        } catch (Exception ignored) {
        }

        // ── 2. Load IDW mappings ───────────────
        List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                .findBySpatialUnitIdOrderByRankAsc(spatialUnitId)
                .stream().limit(6).collect(Collectors.toList());

        if (mappings.isEmpty()) {
            throw new ResourceNotFoundException("No IDW mappings found for spatial unit: " + spatialUnitId);
        }

        List<UUID> nodeIds = mappings.stream()
                .map(SpatialUnitWeatherNodeMapping::getWeatherNodeId)
                .collect(Collectors.toList());

        Map<UUID, WeatherNodeLiveCache> liveMap = liveCacheRepository.findAllById(nodeIds).stream()
                .collect(Collectors.toMap(WeatherNodeLiveCache::getWeatherNodeId, c -> c));

        Map<UUID, WeatherNode> nodeMap = weatherNodeRepository.findAllById(nodeIds).stream()
                .collect(Collectors.toMap(WeatherNode::getId, n -> n));

        // ── 3. Current Weather Data (Station direct OR IDW) ─────────────────────────
        ForecastCurrent current = null;
        boolean usedStation = false;

        // Station anchor disabled for "current" to ensure consistency with forecasts.
        // Station observations are still used for bias correction and historical
        // accuracy.

        /*
         * Optional<GnStationAnchor> anchor =
         * gnStationAnchorRepository.findFirstByIdGnId(spatialUnitId);
         * if (anchor.isPresent()) {
         * Optional<StationObservation> stationObs = stationObservationRepository
         * .findTopByStationIdOrderByTimestampUtcDesc(anchor.get().getId().getStationId(
         * ));
         * if (stationObs.isPresent()) {
         * StationObservation obs = stationObs.get();
         * long ageMinutes = Duration.between(obs.getTimestampUtc(),
         * LocalDateTime.now(ZoneOffset.UTC)).toMinutes();
         * if (ageMinutes <= 180) { // 3 hours cutoff
         * Double t = toDouble(obs.getTemperatureC());
         * Double p = toDouble(obs.getRainfallMm());
         * Double ws = obs.getWindSpeedMs() != null ? obs.getWindSpeedMs().doubleValue()
         * * 3.6 : null;
         * current = ForecastCurrent.builder()
         * .temperature(Map.of("value", t != null ? t : 0.0, "feelsLike", t != null ? t
         * : 0.0))
         * .precipitation(Map.of("value", p != null ? p : 0.0))
         * .wind(Map.of("speed", ws != null ? ws : 0.0, "direction", 0.0))
         * .humidity(Map.of("value", toDouble(obs.getHumidityPct()) != null ?
         * toDouble(obs.getHumidityPct()) : 0.0))
         * .pressure(Map.of("value", 1013.25))
         * .cloudCover(Map.of("value", 0.0))
         * .uvIndex(Map.of("value", 0.0))
         * .visibility(Map.of("value", 10000.0))
         * .build();
         * usedStation = true;
         * }
         * }
         * }
         */

        List<NodeTimeseries> allYrNo = nodeTimeseriesRepository.findByNodeIdInOrderByForecastHourAsc(nodeIds);
        Map<LocalDateTime, List<NodeTimeseries>> yrNoByTime = allYrNo.stream()
                .collect(Collectors.groupingBy(NodeTimeseries::getValidFromUtc));
                
        LocalDateTime nowUtc = LocalDateTime.now(ZoneOffset.UTC);
        LocalDateTime currentBucket = yrNoByTime.keySet().stream()
                .filter(t -> !t.isAfter(nowUtc))
                .max(LocalDateTime::compareTo)
                .orElse(yrNoByTime.keySet().stream().min(LocalDateTime::compareTo).orElse(nowUtc.truncatedTo(java.time.temporal.ChronoUnit.HOURS)));

        if (!usedStation) {
            // Compute IDW Current
            double wTempC = 0, swTempC = 0, wFeels = 0, swFeels = 0;
            double wPrecip = 0, swPrecip = 0;
            double wWindSpeed = 0, swWindSpeed = 0, wWindDir = 0, swWindDir = 0;
            double wHumidity = 0, swHumidity = 0, wDew = 0, swDew = 0;
            double wPressure = 0, swPressure = 0;
            double wUvIndex = 0, swUvIndex = 0;
            double wCloudCover = 0, swCloudCover = 0, wVis = 0, swVis = 0;
            
            List<NodeTimeseries> currentBucketNodes = yrNoByTime.get(currentBucket);
            Map<UUID, NodeTimeseries> tsMap = currentBucketNodes != null ? 
                    currentBucketNodes.stream().collect(Collectors.toMap(NodeTimeseries::getNodeId, t -> t, (a, b) -> a)) : Map.of();

            for (SpatialUnitWeatherNodeMapping mapping : mappings) {
                UUID nodeId = mapping.getWeatherNodeId();
                double w = mapping.getIdwWeight();

                Double rawTempC = null, feels = null, precip = null, windSpeed = null, windDir = null,
                        humidity = null, dew = null, pressure = null, uvIndex = null, cloudCover = null, vis = null;

                NodeTimeseries ts = tsMap.get(nodeId);
                if (ts != null) {
                    rawTempC = toDouble(ts.getTemperatureC());
                    feels = rawTempC;
                    precip = toDouble(ts.getPrecipitationMm());
                    windSpeed = ts.getWindSpeedMs() != null ? ts.getWindSpeedMs().doubleValue() * 3.6 : null;
                    windDir = ts.getWindDirectionDeg() != null ? ts.getWindDirectionDeg().doubleValue() : null;
                    humidity = toDouble(ts.getHumidityPct());
                    dew = toDouble(ts.getDewPointC());
                    pressure = toDouble(ts.getPressureHpa());
                    uvIndex = toDouble(ts.getUvIndexClearSky());
                    cloudCover = toDouble(ts.getCloudCoverPct());
                    vis = null;
                } else {
                    WeatherNodeLiveCache cache = liveMap.get(nodeId);
                    if (cache != null) {
                        rawTempC = cache.getTempC();
                        feels = cache.getApparentTempC() != null ? cache.getApparentTempC() : rawTempC;
                        precip = cache.getPrecipitationMm();
                        windSpeed = cache.getWindSpeedKmh();
                        windDir = cache.getWindDirectionDeg();
                        humidity = cache.getHumidityPct();
                        pressure = cache.getPressureHpa();
                        uvIndex = cache.getUvIndex();
                        cloudCover = cache.getCloudCoverPct();
                        vis = null;
                    }
                }

                if (rawTempC != null) {
                    WeatherNode node = nodeMap.get(nodeId);
                    double bias = (node != null && node.getBiasTempC() != null) ? node.getBiasTempC() : 0.0;
                    wTempC += (rawTempC + bias) * w;
                    swTempC += w;
                    if (feels != null) {
                        wFeels += (feels + bias) * w;
                        swFeels += w;
                    }
                }
                if (precip != null) {
                    wPrecip += precip * w;
                    swPrecip += w;
                }
                if (windSpeed != null) {
                    wWindSpeed += windSpeed * w;
                    swWindSpeed += w;
                }
                if (windDir != null) {
                    wWindDir += windDir * w;
                    swWindDir += w;
                }
                if (humidity != null) {
                    wHumidity += humidity * w;
                    swHumidity += w;
                }
                if (dew != null) {
                    wDew += dew * w;
                    swDew += w;
                }
                if (pressure != null) {
                    wPressure += pressure * w;
                    swPressure += w;
                }
                if (uvIndex != null) {
                    wUvIndex += uvIndex * w;
                    swUvIndex += w;
                }
                if (cloudCover != null) {
                    wCloudCover += cloudCover * w;
                    swCloudCover += w;
                }
                if (vis != null) {
                    wVis += vis * w;
                    swVis += w;
                }
            }

            Double weightedTempC = safeDivide(wTempC, swTempC);
            Double finalTemp = applyElevationCorrection(weightedTempC, spatialUnit, mappings, nodeMap);

            Double weightedFeels = safeDivide(wFeels, swFeels);
            Double finalFeels = weightedFeels != null ? weightedFeels : finalTemp;

            Double fusedRainfall = getRainfallMm(
                    spatialUnit.getLat() != null ? spatialUnit.getLat() : 0.0,
                    spatialUnit.getLng() != null ? spatialUnit.getLng() : 0.0, mappings, tsMap,
                    liveCacheRepository);
            Double finalPrecipMm = fusedRainfall != null ? fusedRainfall : safeDivide(wPrecip, swPrecip);

            current = ForecastCurrent.builder()
                    .temperature(Map.of("value", finalTemp != null ? finalTemp : 0.0, "feelsLike",
                            finalFeels != null ? finalFeels : 0.0))
                    .precipitation(Map.of("value", finalPrecipMm != null ? finalPrecipMm : 0.0))
                    .wind(Map.of("speed",
                            safeDivide(wWindSpeed, swWindSpeed) != null ? safeDivide(wWindSpeed, swWindSpeed) : 0.0,
                            "direction",
                            safeDivide(wWindDir, swWindDir) != null ? safeDivide(wWindDir, swWindDir) : 0.0))
                    .humidity(Map.of("value",
                            safeDivide(wHumidity, swHumidity) != null ? safeDivide(wHumidity, swHumidity) : 0.0))
                    .pressure(Map.of("value",
                            safeDivide(wPressure, swPressure) != null ? safeDivide(wPressure, swPressure) : 1013.25))
                    .uvIndex(Map.of("value",
                            safeDivide(wUvIndex, swUvIndex) != null ? safeDivide(wUvIndex, swUvIndex) : 0.0))
                    .cloudCover(Map.of("value",
                            safeDivide(wCloudCover, swCloudCover) != null ? safeDivide(wCloudCover, swCloudCover)
                                    : 0.0))
                    .visibility(Map.of("value", safeDivide(wVis, swVis) != null ? safeDivide(wVis, swVis) : 10000.0))
                    .build();
        }

        // ── 4. Hourly Interpolation (shortIntervals) ─────────────────────────
        List<WeatherNodeHourlyForecast> allOm = weatherNodeHourlyForecastRepository
                .findByWeatherNodeIdInOrderByForecastTimeAsc(nodeIds);
        Map<LocalDateTime, List<WeatherNodeHourlyForecast>> omByTime = allOm.stream()
                .collect(Collectors.groupingBy(WeatherNodeHourlyForecast::getForecastTime));

        List<ForecastShortInterval> shortIntervals = new ArrayList<>();
        Map<UUID, Double> weightMap = mappings.stream().collect(Collectors
                .toMap(SpatialUnitWeatherNodeMapping::getWeatherNodeId, SpatialUnitWeatherNodeMapping::getIdwWeight));

        // Build YrNo intervals
        yrNoByTime.keySet().stream().sorted().forEach(time -> {
            List<NodeTimeseries> hourNodes = yrNoByTime.get(time);
            double wt = 0, swt = 0, wp = 0, swp = 0, wcc = 0, swcc = 0, wuv = 0, swuv = 0, wpress = 0, swpress = 0,
                    whum = 0, swhum = 0, wws = 0, swws = 0, wwd = 0, swwd = 0, wdew = 0, swdew = 0;
            List<String> hourSymbols = new ArrayList<>();

            for (NodeTimeseries ts : hourNodes) {
                double w = weightMap.getOrDefault(ts.getNodeId(), 0.0);
                if (w == 0)
                    continue;

                Double t = toDouble(ts.getTemperatureC());
                if (t != null) {
                    WeatherNode node = nodeMap.get(ts.getNodeId());
                    double bias = (node != null && node.getBiasTempC() != null) ? node.getBiasTempC() : 0.0;
                    wt += (t + bias) * w;
                    swt += w;
                }
                Double p = toDouble(ts.getPrecipitationMm());
                if (p != null) {
                    wp += p * w;
                    swp += w;
                }
                Double cc = toDouble(ts.getCloudCoverPct());
                if (cc != null) {
                    wcc += cc * w;
                    swcc += w;
                }
                Double uv = toDouble(ts.getUvIndexClearSky());
                if (uv != null) {
                    wuv += uv * w;
                    swuv += w;
                }
                Double press = toDouble(ts.getPressureHpa());
                if (press != null) {
                    wpress += press * w;
                    swpress += w;
                }
                Double hum = toDouble(ts.getHumidityPct());
                if (hum != null) {
                    whum += hum * w;
                    swhum += w;
                }
                Double ws = toDouble(ts.getWindSpeedMs());
                if (ws != null) {
                    wws += (ws * 3.6) * w;
                    swws += w;
                }
                Integer wd = ts.getWindDirectionDeg();
                if (wd != null) {
                    wwd += wd * w;
                    swwd += w;
                }
                Double dew = toDouble(ts.getDewPointC());
                if (dew != null) {
                    wdew += dew * w;
                    swdew += w;
                }

                if (ts.getSymbolCode() != null)
                    hourSymbols.add(ts.getSymbolCode());
            }
            
            String sym = pickMostRepresentativeSymbolFromStrings(hourSymbols);

            Double finalTemp = applyElevationCorrection(safeDivide(wt, swt), spatialUnit, mappings, nodeMap);

            Double finalFeels = finalTemp;
            if (finalTemp != null && finalTemp > 26.0) {
                Double h = safeDivide(whum, swhum);
                if (h != null) {
                    // Simple Heat Index approximation for tropical regions
                    finalFeels = finalTemp + 0.047 * (h - 50.0);
                }
            }

            shortIntervals.add(ForecastShortInterval.builder()
                    .start(time.atOffset(ZoneOffset.UTC).format(isoFormatter))
                    .end(time.plusHours(1).atOffset(ZoneOffset.UTC).format(isoFormatter))
                    .temperature(Map.of("value", finalTemp != null ? finalTemp : 0.0))
                    .feelsLike(Map.of("value", Math.round(finalFeels * 100.0) / 100.0))
                    .precipitation(Map.of("value", safeDivide(wp, swp) != null ? safeDivide(wp, swp) : 0.0))
                    .wind(Map.of("speed", safeDivide(wws, swws) != null ? safeDivide(wws, swws) : 0.0,
                            "direction", safeDivide(wwd, swwd) != null ? safeDivide(wwd, swwd) : 0.0))
                    .symbol(Map.of("code", sym))
                    .symbolCode(Map.of("next1Hour", sym))
                    .cloudCover(Map.of("value", safeDivide(wcc, swcc) != null ? safeDivide(wcc, swcc) : 0.0))
                    .uvIndex(Map.of("value", safeDivide(wuv, swuv) != null ? safeDivide(wuv, swuv) : 0.0))
                    .pressure(Map.of("value",
                            safeDivide(wpress, swpress) != null ? safeDivide(wpress, swpress) : 1013.25))
                    .humidity(Map.of("value", safeDivide(whum, swhum) != null ? safeDivide(whum, swhum) : 0.0))
                    .dewPoint(Map.of("value", safeDivide(wdew, swdew) != null ? safeDivide(wdew, swdew) : 0.0))
                    .build());
        });

        // Build OpenMeteo intervals
        LocalDateTime lastYrNoTime = yrNoByTime.isEmpty() ? LocalDateTime.MIN
                : yrNoByTime.keySet().stream().max(LocalDateTime::compareTo).get().plusHours(1);

        omByTime.keySet().stream().sorted().forEach(time -> {
            if (time.isBefore(lastYrNoTime))
                return;

            List<WeatherNodeHourlyForecast> hourNodes = omByTime.get(time);
            double wt = 0, swt = 0, wf = 0, swf = 0, wp = 0, swp = 0, wcc = 0, swcc = 0, wuv = 0, swuv = 0, wpress = 0,
                    swpress = 0, whum = 0, swhum = 0, wws = 0, swws = 0, wwd = 0, swwd = 0, wdew = 0, swdew = 0,
                    wvis = 0, swvis = 0;
            List<String> hourSymbols = new ArrayList<>();

            for (WeatherNodeHourlyForecast om : hourNodes) {
                double w = weightMap.getOrDefault(om.getWeatherNodeId(), 0.0);
                if (w == 0)
                    continue;

                if (om.getTempC() != null) {
                    WeatherNode node = nodeMap.get(om.getWeatherNodeId());
                    double bias = (node != null && node.getBiasTempC() != null) ? node.getBiasTempC() : 0.0;
                    wt += (om.getTempC() + bias) * w;
                    swt += w;
                    wf += ((om.getApparentTempC() != null ? om.getApparentTempC() : om.getTempC()) + bias) * w;
                    swf += w;
                }
                if (om.getPrecipitationMm() != null) {
                    wp += om.getPrecipitationMm() * w;
                    swp += w;
                }
                if (om.getCloudCoverPct() != null) {
                    wcc += om.getCloudCoverPct() * w;
                    swcc += w;
                }
                if (om.getUvIndex() != null) {
                    wuv += om.getUvIndex() * w;
                    swuv += w;
                }
                if (om.getPressureHpa() != null) {
                    wpress += om.getPressureHpa() * w;
                    swpress += w;
                }
                if (om.getRelativeHumidityPct() != null) {
                    whum += om.getRelativeHumidityPct() * w;
                    swhum += w;
                }
                if (om.getWindSpeedKmh() != null) {
                    wws += om.getWindSpeedKmh() * w;
                    swws += w;
                }
                if (om.getWindDirectionDeg() != null) {
                    wwd += om.getWindDirectionDeg() * w;
                    swwd += w;
                }
                if (om.getDewPointC() != null) {
                    wdew += om.getDewPointC() * w;
                    swdew += w;
                }
                if (om.getVisibilityM() != null) {
                    wvis += om.getVisibilityM() * w;
                    swvis += w;
                }

                if (om.getWeatherCode() != null)
                    hourSymbols.add(mapWmoToSymbol(om.getWeatherCode()));
            }

            String sym = pickMostRepresentativeSymbolFromStrings(hourSymbols);

            Double finalTemp = applyElevationCorrection(safeDivide(wt, swt), spatialUnit, mappings, nodeMap);

            shortIntervals.add(ForecastShortInterval.builder()
                    .start(time.atOffset(ZoneOffset.UTC).format(isoFormatter))
                    .end(time.plusHours(1).atOffset(ZoneOffset.UTC).format(isoFormatter))
                    .temperature(Map.of("value", finalTemp != null ? finalTemp : 0.0))
                    .feelsLike(Map.of("value",
                            safeDivide(wf, swf) != null ? safeDivide(wf, swf) : (finalTemp != null ? finalTemp : 0.0)))
                    .precipitation(Map.of("value", safeDivide(wp, swp) != null ? safeDivide(wp, swp) : 0.0))
                    .wind(Map.of("speed", safeDivide(wws, swws) != null ? safeDivide(wws, swws) : 0.0,
                            "direction", safeDivide(wwd, swwd) != null ? safeDivide(wwd, swwd) : 0.0))
                    .symbol(Map.of("code", sym))
                    .symbolCode(Map.of("next1Hour", sym))
                    .cloudCover(Map.of("value", safeDivide(wcc, swcc) != null ? safeDivide(wcc, swcc) : 0.0))
                    .uvIndex(Map.of("value", safeDivide(wuv, swuv) != null ? safeDivide(wuv, swuv) : 0.0))
                    .pressure(Map.of("value",
                            safeDivide(wpress, swpress) != null ? safeDivide(wpress, swpress) : 1013.25))
                    .humidity(Map.of("value", safeDivide(whum, swhum) != null ? safeDivide(whum, swhum) : 0.0))
                    .dewPoint(Map.of("value", safeDivide(wdew, swdew) != null ? safeDivide(wdew, swdew) : 0.0))
                    .build());
        });

        // ── 4.5 Compute Raw Daily Max/Min Temperatures ──
        Map<LocalDate, Double> dailyMaxRawTemp = new HashMap<>();
        Map<LocalDate, Double> dailyMinRawTemp = new HashMap<>();
        java.util.function.BiConsumer<LocalDate, Double> updateMinMax = (date, correctedT) -> {
            dailyMaxRawTemp.put(date, Math.max(dailyMaxRawTemp.getOrDefault(date, -Double.MAX_VALUE), correctedT));
            dailyMinRawTemp.put(date, Math.min(dailyMinRawTemp.getOrDefault(date, Double.MAX_VALUE), correctedT));
        };

        for (var entry : yrNoByTime.entrySet()) {
            LocalDate date = entry.getKey().toLocalDate();
            for (NodeTimeseries ts : entry.getValue()) {
                if (weightMap.getOrDefault(ts.getNodeId(), 0.0) == 0) continue;
                Double t = toDouble(ts.getTemperatureC());
                if (t != null) {
                    WeatherNode node = nodeMap.get(ts.getNodeId());
                    double bias = (node != null && node.getBiasTempC() != null) ? node.getBiasTempC() : 0.0;
                    double correctedTemp = applyElevationCorrectionForNode(t, node, spatialUnit);
                    updateMinMax.accept(date, Math.round((t + bias + correctedTemp - t) * 100.0) / 100.0);
                }
            }
        }
        for (var entry : omByTime.entrySet()) {
            LocalDate date = entry.getKey().toLocalDate();
            for (WeatherNodeHourlyForecast ts : entry.getValue()) {
                if (weightMap.getOrDefault(ts.getWeatherNodeId(), 0.0) == 0) continue;
                Double t = ts.getTempC();
                if (t != null) {
                    WeatherNode node = nodeMap.get(ts.getWeatherNodeId());
                    double bias = (node != null && node.getBiasTempC() != null) ? node.getBiasTempC() : 0.0;
                    double correctedTemp = applyElevationCorrectionForNode(t, node, spatialUnit);
                    updateMinMax.accept(date, Math.round((t + bias + correctedTemp - t) * 100.0) / 100.0);
                }
            }
        }

        // ── 5. Build Daily Intervals ─────────────────────────
        Map<LocalDate, ForecastDayInterval.ForecastDayIntervalBuilder> dailyMap = new TreeMap<>();
        Map<LocalDate, List<ForecastShortInterval>> dailyIntervalsMap = new HashMap<>();

        for (ForecastShortInterval si : shortIntervals) {
            LocalDate date = OffsetDateTime.parse(si.getStart()).toLocalDate();
            dailyIntervalsMap.computeIfAbsent(date, k -> new ArrayList<>()).add(si);

            dailyMap.putIfAbsent(date, ForecastDayInterval.builder()
                    .start(date.atStartOfDay().atOffset(ZoneOffset.UTC).format(isoFormatter))
                    .end(date.atTime(23, 59, 59).atOffset(ZoneOffset.UTC).format(isoFormatter))
                    .temperature(new HashMap<>(Map.of("min", Double.MAX_VALUE, "max", -Double.MAX_VALUE, "value", 0.0)))
                    .precipitation(new HashMap<>(Map.of("value", 0.0)))
                    .wind(new HashMap<>(Map.of("min", Double.MAX_VALUE, "max", 0.0, "direction", 0.0)))
                    .uvIndex(new HashMap<>(Map.of("max", 0.0))));

            var dayBuilder = dailyMap.get(date);
            var day = dayBuilder.build();

            double p = (double) si.getPrecipitation().getOrDefault("value", 0.0);
            day.getPrecipitation().put("value", day.getPrecipitation().get("value") + p);

            double w = (double) si.getWind().getOrDefault("speed", 0.0);
            if (w > (double) day.getWind().get("max")) {
                day.getWind().put("max", w);
                day.getWind().put("direction", (double) si.getWind().getOrDefault("direction", 0.0));
            }
            day.getWind().put("min", Math.min((double) day.getWind().get("min"), w));

            double uv = (double) si.getUvIndex().getOrDefault("value", 0.0);
            day.getUvIndex().put("max", Math.max((double) day.getUvIndex().get("max"), uv));
        }

        List<ForecastDayInterval> dayIntervals = new ArrayList<>();
        for (LocalDate date : dailyMap.keySet()) {
            var builder = dailyMap.get(date);
            List<ForecastShortInterval> daySIs = dailyIntervalsMap.get(date);
            
            var tempMap = new HashMap<String, Double>();
            double avgT = daySIs.stream().mapToDouble(si -> (double) si.getTemperature().getOrDefault("value", 0.0)).average().orElse(0.0);
            double minT = dailyMinRawTemp.getOrDefault(date, Double.MAX_VALUE);
            double maxT = dailyMaxRawTemp.getOrDefault(date, -Double.MAX_VALUE);
            
            // Fallback if no raw data found
            if (minT == Double.MAX_VALUE) minT = avgT;
            if (maxT == -Double.MAX_VALUE) maxT = avgT;
            
            tempMap.put("value", Math.round(avgT * 100.0) / 100.0);
            tempMap.put("min", minT);
            tempMap.put("max", maxT);
            
            builder.temperature(tempMap);
            builder.sixHourSymbols(deriveSymbolsForBlocks(daySIs, 6));
            builder.twelveHourSymbols(deriveSymbolsForBlocks(daySIs, 12));
            builder.twentyFourHourSymbol(pickMostRepresentativeSymbol(daySIs));
            builder.symbolConfidence("high");

            dayIntervals.add(builder.build());
        }

        // ── 5.5 Fetch Celestial Data (Sunrise/Sunset) ──
        String sunriseStr = null, sunsetStr = null;
        Integer isDayBit = nowUtc.getHour() >= 6 && nowUtc.getHour() < 18 ? 1 : 0;
        try {
            UUID nodeId = mappings.get(0).getWeatherNodeId();
            Optional<WeatherNodeCelestial> celestial = weatherNodeCelestialRepository.findByWeatherNodeIdAndRecordDate(nodeId, LocalDate.now(ZoneOffset.UTC));
            if (celestial.isPresent()) {
                DateTimeFormatter iso = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
                if (celestial.get().getSunriseTime() != null) sunriseStr = celestial.get().getSunriseTime().format(iso);
                if (celestial.get().getSunsetTime() != null) sunsetStr = celestial.get().getSunsetTime().format(iso);
                
                // Better isDay detection
                if (celestial.get().getSunriseTime() != null && celestial.get().getSunsetTime() != null) {
                    isDayBit = (nowUtc.isAfter(celestial.get().getSunriseTime().toLocalDateTime()) && 
                                nowUtc.isBefore(celestial.get().getSunsetTime().toLocalDateTime())) ? 1 : 0;
                }
            }
        } catch (Exception ignored) {}

        // ── 6. Final Response Assembly ─────────────────────────
        List<ForecastShortInterval> futureShorts = shortIntervals.stream()
                .filter(si -> !OffsetDateTime.parse(si.getStart()).toLocalDateTime().isBefore(currentBucket))
                .collect(Collectors.toList());

        Map<String, String> rootSymbol = Map.of("next1Hour", "cloudy");
        if (!futureShorts.isEmpty()) {
            rootSymbol = futureShorts.get(0).getSymbolCode();
        }

        // ── 5.7 Build Compatibility Maps (Hourly/Daily) ──
        Map<String, Object> hourlyMap = new HashMap<>();
        hourlyMap.put("time", shortIntervals.stream().map(ForecastShortInterval::getStart).collect(Collectors.toList()));
        hourlyMap.put("temperature_2m", shortIntervals.stream().map(si -> si.getTemperature().get("value")).collect(Collectors.toList()));
        hourlyMap.put("weather_code", shortIntervals.stream().map(si -> mapSymbolToWmo(si.getSymbolCode().get("next1Hour"))).collect(Collectors.toList()));

        Map<String, Object> dailyMapLegacy = new HashMap<>();
        dailyMapLegacy.put("time", dayIntervals.stream().map(ForecastDayInterval::getStart).collect(Collectors.toList()));
        dailyMapLegacy.put("temperature_2m_max", dayIntervals.stream().map(di -> di.getTemperature().get("max")).collect(Collectors.toList()));
        dailyMapLegacy.put("temperature_2m_min", dayIntervals.stream().map(di -> di.getTemperature().get("min")).collect(Collectors.toList()));
        dailyMapLegacy.put("weather_code", dayIntervals.stream().map(di -> mapSymbolToWmo(di.getTwentyFourHourSymbol())).collect(Collectors.toList()));
        dailyMapLegacy.put("precipitation_sum", dayIntervals.stream().map(di -> di.getPrecipitation().get("value")).collect(Collectors.toList()));
        dailyMapLegacy.put("uv_index_max", dayIntervals.stream().map(di -> di.getUvIndex() != null ? di.getUvIndex().get("max") : 0.0).collect(Collectors.toList()));

        AdvancedForecastResponse response = AdvancedForecastResponse.builder()
                .created(OffsetDateTime.now(ZoneOffset.UTC).format(isoFormatter))
                .radarIsDown(false)
                .symbolCode(rootSymbol)
                .hourly(hourlyMap)
                .daily(dailyMapLegacy)
                .spatialUnitId(spatialUnit.getId().toString())
                .spatialUnitName(spatialUnit.getName())
                .spatialUnitType(spatialUnit.getType().name())
                .tempC(current.getTemperature().get("value"))
                .apparentTempC(current.getTemperature().get("feelsLike"))
                .humidityPct(current.getHumidity().get("value"))
                .pressureHpa(current.getPressure().get("value"))
                .precipitationMm(current.getPrecipitation().get("value"))
                .windSpeedKmh(current.getWind().get("speed"))
                .windDirectionDeg(current.getWind().get("direction"))
                .cloudCoverPct(current.getCloudCover().get("value"))
                .uvIndex(current.getUvIndex().get("value"))
                .visibilityM(current.getVisibility().get("value"))
                .weatherCode(mapSymbolToWmo(rootSymbol.get("next1Hour")))
                .isDay(isDayBit)
                .sunrise(sunriseStr)
                .sunset(sunsetStr)
                .status(Map.of("code", "Ok"))
                .current(current)
                .shortIntervals(futureShorts)
                .dayIntervals(dayIntervals)
                ._links(Map.of("self", Map.of("href", "/api/v1/weather/spatial-unit/" + spatialUnitId)))
                .build();

        try {
            LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
            LocalDateTime nextHour = now.truncatedTo(java.time.temporal.ChronoUnit.HOURS).plusHours(1);
            long secondsToNextHour = java.time.Duration.between(now, nextHour).getSeconds();
            long cacheTtl = Math.min(secondsToNextHour, 15 * 60);
            if (cacheTtl <= 0) cacheTtl = 60;
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(response),
                    Duration.ofSeconds(cacheTtl));
        } catch (Exception ignored) {
        }

        return response;
    }

    private List<String> deriveSymbolsForBlocks(List<ForecastShortInterval> daySIs, int hoursPerBlock) {
        List<String> symbols = new ArrayList<>();
        int blocks = 24 / hoursPerBlock;
        for (int i = 0; i < blocks; i++) {
            int startHour = i * hoursPerBlock;
            int endHour = (i + 1) * hoursPerBlock;
            List<ForecastShortInterval> blockSIs = daySIs.stream()
                    .filter(si -> {
                        int h = OffsetDateTime.parse(si.getStart()).getHour();
                        return h >= startHour && h < endHour;
                    })
                    .collect(Collectors.toList());
            symbols.add(pickMostRepresentativeSymbol(blockSIs));
        }
        return symbols;
    }

    private String pickMostRepresentativeSymbol(List<ForecastShortInterval> sis) {
        if (sis == null || sis.isEmpty())
            return "cloudy";
        return sis.stream()
                .map(si -> si.getSymbolCode().getOrDefault("next1Hour", "cloudy"))
                .max(Comparator.comparingInt(this::getSymbolPriority))
                .orElse("cloudy");
    }

    private String pickMostRepresentativeSymbolFromStrings(List<String> symbols) {
        if (symbols == null || symbols.isEmpty())
            return "cloudy";
        return symbols.stream()
                .max(Comparator.comparingInt(this::getSymbolPriority))
                .orElse("cloudy");
    }

    private int getSymbolPriority(String sym) {
        if (sym == null)
            return 0;
        if (sym.contains("lightning"))
            return 100;
        if (sym.contains("heavyrain"))
            return 90;
        if (sym.contains("rain"))
            return 80;
        if (sym.contains("fog"))
            return 70;
        if (sym.contains("cloudy"))
            return 60;
        if (sym.contains("partlycloudy"))
            return 50;
        if (sym.contains("fair"))
            return 40;
        if (sym.contains("clear") || sym.contains("sun"))
            return 30;
        return 10;
    }

    public List<SpatialUnitSearchResult> searchSpatialUnits(String query) {
        if (query == null || query.isBlank())
            return List.of();
        String q = query.trim();
        String cacheKey = "search:locations:" + q.toLowerCase();
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null)
                return objectMapper.readValue(cached, objectMapper.getTypeFactory().constructCollectionType(List.class,
                        SpatialUnitSearchResult.class));
        } catch (Exception ignored) {
        }
        List<SpatialUnit> units = spatialUnitRepository
                .findByNameContainingIgnoreCaseOrNameSinhalaContainingIgnoreCaseOrNameTamilContainingIgnoreCase(q, q,
                        q);
        List<SpatialUnitSearchResult> results = units.stream().limit(20).map(su -> {
            String parentName = su.getParentId() != null
                    ? spatialUnitRepository.findById(su.getParentId()).map(SpatialUnit::getName).orElse(null)
                    : null;
            return SpatialUnitSearchResult.builder().id(su.getId()).pcode(su.getPcode()).name(su.getName())
                    .type(su.getType().name()).parentName(parentName).lat(su.getLat()).lng(su.getLng()).build();
        }).collect(Collectors.toList());
        if (!results.isEmpty()) {
            try {
                redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(results),
                        Duration.ofMinutes(60));
            } catch (Exception ignored) {
            }
        }
        return results;
    }

    public AdvancedForecastResponse getNearestSpatialUnit(Double lat, Double lng) {
        List<SpatialUnit> gnDivisions = spatialUnitRepository.findByType(SpatialType.GN_DIVISION);
        SpatialUnit nearest = gnDivisions.stream().filter(su -> su.getLat() != null && su.getLng() != null)
                .min(Comparator.comparingDouble(
                        su -> Math.sqrt(Math.pow(su.getLat() - lat, 2) + Math.pow(su.getLng() - lng, 2))))
                .orElseThrow(() -> new ResourceNotFoundException("No GN divisions found"));
        return getWeatherForSpatialUnit(nearest.getId());
    }

    public List<AdvancedForecastResponse> getAllTrackedWeather() {
        List<UUID> ids = mappingRepository.findAll().stream().map(SpatialUnitWeatherNodeMapping::getSpatialUnitId)
                .distinct().collect(Collectors.toList());
        return ids.stream().map(id -> {
            try {
                return getWeatherForSpatialUnit(id);
            } catch (Exception e) {
                return null;
            }
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    private Integer mapSymbolToWmo(String sym) {
        if (sym == null) return 3;
        if (sym.contains("clear") || sym.contains("fair") || sym.contains("sun")) return 0;
        if (sym.contains("partlycloudy")) return 2;
        if (sym.contains("cloudy")) return 3;
        if (sym.contains("fog")) return 45;
        if (sym.contains("lightrain")) return 51;
        if (sym.contains("rain")) return 63;
        if (sym.contains("heavyrain")) return 65;
        if (sym.contains("rainshowers")) return 80;
        if (sym.contains("snow")) return 73;
        if (sym.contains("lightning") || sym.contains("thunderstorm")) return 95;
        return 3;
    }

    private String mapWmoToSymbol(Integer code) {
        if (code == null)
            return "cloudy";
        if (code == 0)
            return "fair_day";
        if (code >= 1 && code <= 2)
            return "partlycloudy_day";
        if (code == 3)
            return "cloudy";
        if (code == 45 || code == 48)
            return "fog";
        if (code >= 51 && code <= 55)
            return "lightrain";
        if (code >= 61 && code <= 65)
            return "rain";
        if (code >= 71 && code <= 75)
            return "snow";
        if (code >= 80 && code <= 82)
            return "rainshowers_day";
        if (code >= 95)
            return "lightning";
        return "cloudy";
    }

    public CelestialEventsResponse getCelestialEvents(Double lat, Double lng) {
        List<SpatialUnit> gnDivisions = spatialUnitRepository.findByType(SpatialType.GN_DIVISION);
        SpatialUnit nearest = gnDivisions.stream().filter(su -> su.getLat() != null && su.getLng() != null)
                .min(Comparator.comparingDouble(
                        su -> Math.sqrt(Math.pow(su.getLat() - lat, 2) + Math.pow(su.getLng() - lng, 2))))
                .orElse(null);
        if (nearest == null)
            return CelestialEventsResponse.builder().build();
        List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                .findBySpatialUnitIdOrderByRankAsc(nearest.getId());
        if (mappings.isEmpty())
            return CelestialEventsResponse.builder().build();
        UUID nodeId = mappings.get(0).getWeatherNodeId();
        List<WeatherNodeCelestial> celestials = weatherNodeCelestialRepository.findAll().stream()
                .filter(c -> c.getWeatherNodeId().equals(nodeId))
                .filter(c -> !c.getRecordDate().isBefore(LocalDate.now(ZoneOffset.UTC)))
                .sorted(Comparator.comparing(WeatherNodeCelestial::getRecordDate)).limit(7)
                .collect(Collectors.toList());
        DateTimeFormatter iso = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
        List<CelestialEventsResponse.CelestialDay> days = new ArrayList<>();
        for (WeatherNodeCelestial c : celestials) {
            List<Map<String, Object>> sun = new ArrayList<>();
            if (c.getSunriseTime() != null)
                sun.add(Map.of("type", "sunrise", "time", c.getSunriseTime().format(iso)));
            if (c.getSunsetTime() != null)
                sun.add(Map.of("type", "sunset", "time", c.getSunsetTime().format(iso)));
            if (c.getSolarnoonTime() != null)
                sun.add(Map.of("type", "max", "time", c.getSolarnoonTime().format(iso), "elevation",
                        c.getSolarnoonElevation() != null ? c.getSolarnoonElevation() : 0.0));
            List<Map<String, Object>> moon = new ArrayList<>();
            if (c.getMoonriseTime() != null)
                moon.add(Map.of("type", "moonrise", "time", c.getMoonriseTime().format(iso)));
            if (c.getMoonsetTime() != null)
                moon.add(Map.of("type", "moonset", "time", c.getMoonsetTime().format(iso)));
            days.add(CelestialEventsResponse.CelestialDay.builder()
                    .date(c.getRecordDate().atStartOfDay().atOffset(ZoneOffset.UTC).format(iso))
                    .sun(Map.of("events", sun))
                    .moon(Map.of("events", moon, "phase", c.getMoonphase() != null ? c.getMoonphase() : 0.0)).build());
        }
        return CelestialEventsResponse.builder().days(days)
                ._links(Map.of("self", Map.of("href", "/api/v1/weather/celestial?lat=" + lat + "&lng=" + lng))).build();
    }

    private Double safeDivide(double n, double d) {
        if (d == 0)
            return null;
        return Math.round(n / d * 100.0) / 100.0;
    }

    private Double toDouble(BigDecimal bd) {
        return bd != null ? bd.doubleValue() : null;
    }

    private Double getRainfallMm(double lat, double lng, List<SpatialUnitWeatherNodeMapping> mappings,
            Map<UUID, NodeTimeseries> tsMap, WeatherNodeLiveCacheRepository liveRepo) {
        
        // P1: Satellite (JaxaRainGrid) - strictly <= 2 hours old
        try {
            double gridLat = Math.round(lat * 10.0) / 10.0 + 0.05;
            double gridLon = Math.round(lng * 10.0) / 10.0 + 0.05;
            Optional<JaxaRainGrid> grid = jaxaRainGridRepository
                    .findTopByGridLatBetweenAndGridLonBetweenAndTimestampUtcAfterOrderByTimestampUtcDesc(gridLat - 0.06,
                            gridLat + 0.06, gridLon - 0.06, gridLon + 0.06,
                            LocalDateTime.now(ZoneOffset.UTC).minusHours(2));
            if (grid.isPresent() && grid.get().getRainfallMm() != null) {
                return grid.get().getRainfallMm().doubleValue();
            }
        } catch (Exception e) {
            log.warn("Rainfall P1 failed: {}", e.getMessage());
        }

        // P2: Forecast Fallback (Yr.no) using the current bucket
        try {
            double wp = 0.0, swp = 0.0;
            for (SpatialUnitWeatherNodeMapping m : mappings) {
                double w = m.getIdwWeight();
                NodeTimeseries ts = tsMap.get(m.getWeatherNodeId());
                Double p = ts != null ? toDouble(ts.getPrecipitationMm()) : null;
                
                if (p == null) {
                    p = liveRepo.findById(m.getWeatherNodeId())
                            .map(WeatherNodeLiveCache::getPrecipitationMm).orElse(null);
                }
                
                if (p != null) {
                    wp += p * w;
                    swp += w;
                }
            }
            if (swp > 0)
                return safeDivide(wp, swp);
        } catch (Exception e) {
            log.warn("Rainfall P2 failed: {}", e.getMessage());
        }
        return null;
    }

    private double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return 6371.0 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    // ──────────────────────────────────────────────
    // Elevation Correction Helpers (extracted from duplicated code)
    // ──────────────────────────────────────────────

    /**
     * Apply elevation correction to a weighted temperature value.
     * Uses average elevation of all mapped nodes and spatial unit elevation.
     */
    private Double applyElevationCorrection(Double weightedTemp, SpatialUnit spatialUnit,
            List<SpatialUnitWeatherNodeMapping> mappings, Map<UUID, WeatherNode> nodeMap) {
        if (weightedTemp == null) return null;

        double avgNodeElevation = mappings.stream()
                .map(m -> nodeMap.get(m.getWeatherNodeId()))
                .filter(Objects::nonNull)
                .mapToDouble(n -> n.getElevationM() != null ? n.getElevationM().doubleValue() : 0.0)
                .average()
                .orElse(0.0);

        double unitElevation = spatialUnit.getElevationM() != null ? spatialUnit.getElevationM() : 0.0;
        double lapseCorrection = (unitElevation - avgNodeElevation) * -0.0065;

        return Math.round((weightedTemp + lapseCorrection) * 100.0) / 100.0;
    }

    /**
     * Apply elevation correction for a single node (for daily min/max calculations).
     */
    private double applyElevationCorrectionForNode(Double temp, WeatherNode node, SpatialUnit spatialUnit) {
        if (temp == null) return 0.0;

        double nodeElevation = node != null && node.getElevationM() != null
                ? node.getElevationM().doubleValue()
                : 0.0;
        double unitElevation = spatialUnit.getElevationM() != null ? spatialUnit.getElevationM() : 0.0;
        double lapseCorrection = (unitElevation - nodeElevation) * -0.0065;

        return Math.round((temp + lapseCorrection) * 100.0) / 100.0;
    }
}
