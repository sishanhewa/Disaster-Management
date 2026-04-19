package com.sidms.backend.scheduler;

import com.sidms.backend.client.OpenMeteoClient;
import com.sidms.backend.config.ApiKeyConfig;
import com.sidms.backend.entity.WeatherNode;
import com.sidms.backend.entity.WeatherNodeLiveCache;
import com.sidms.backend.entity.WeatherNodeTelemetryLog;
import com.sidms.backend.entity.SpatialForecastSnapshot;
import com.sidms.backend.repository.ForecastProjectionRepository;
import com.sidms.backend.repository.SpatialForecastSnapshotRepository;
import com.sidms.backend.repository.SpatialUnitRepository;
import com.sidms.backend.repository.WeatherNodeLiveCacheRepository;
import com.sidms.backend.repository.WeatherNodeTelemetryLogRepository;
import com.sidms.backend.repository.WeatherNodeRepository;
import com.sidms.backend.service.AnalyticsService;
import com.sidms.backend.util.ApiKeyManager;
import com.sidms.backend.util.CacheKeys;
import com.sidms.backend.entity.ForecastProjection;
import com.sidms.backend.entity.SpatialUnit;
import com.sidms.backend.entity.enums.SpatialType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.sidms.backend.client.OpenWeatherMapClient;

import java.time.LocalDateTime;
import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Component
@Slf4j
@RequiredArgsConstructor
public class WeatherSyncScheduler {

    private final WeatherNodeRepository weatherNodeRepository;
    private final WeatherNodeLiveCacheRepository liveCacheRepository;
    private final ApiKeyConfig apiKeyConfig;
    private final OpenMeteoClient openMeteoClient;
    private final ApiKeyManager apiKeyManager;
    private final OpenWeatherMapClient openWeatherMapClient;
    private final RedisTemplate<String, Object> redisTemplate;
    private final RedisTemplate<String, String> stringRedisTemplate;
    private final JdbcTemplate jdbcTemplate;
    private final SpatialUnitRepository spatialUnitRepository;
    private final ForecastProjectionRepository forecastProjectionRepository;
    private final SpatialForecastSnapshotRepository spatialForecastSnapshotRepository;
    private final AnalyticsService analyticsService;
    private final WeatherNodeTelemetryLogRepository weatherNodeTelemetryLogRepository;

    // Remove @RequiredArgsConstructor or keep it and ensure all final fields are
    // accounted for
    // If using @RequiredArgsConstructor with final fields, it should work fine now.

    @Value("${app.sync.weather.enabled:true}")
    private boolean weatherSyncEnabled;

    @Value("${app.sync.weather.current-enabled:true}")
    private boolean currentWeatherSyncEnabled;

    @Value("${app.sync.weather.owm-fallback-max-calls-per-run:300}")
    private int owmFallbackMaxCallsPerRun;

    @Value("${app.sync.weather.aqi-enabled:false}")
    private boolean aqiEnabled;

    @Value("${app.sync.weather.aqi-max-calls-per-run:0}")
    private int aqiMaxCallsPerRun;

    @Value("${app.sync.debug.verbose:false}")
    private boolean verboseSyncDebug;

    @Value("${app.sync.weather.forecast-max-units:-1}")
    private int forecastMaxUnits;

    // ──────────────────────────────────────────────
    // Main sync: every 30 minutes
    // ──────────────────────────────────────────────
    @Scheduled(fixedDelayString = "${app.sync.weather.interval}", initialDelayString = "${app.sync.weather.initial-delay}")
    public void scheduledSyncWeatherNodes() {
        if (!weatherSyncEnabled) {
            log.info("Weather scheduled sync disabled (app.sync.weather.enabled=false)");
            return;
        }
        if (!currentWeatherSyncEnabled) {
            log.info("Current weather scheduled sync disabled (app.sync.weather.current-enabled=false)");
            return;
        }
        syncWeatherNodes();
    }

    @Transactional
    public void syncWeatherNodes() {
        if (!currentWeatherSyncEnabled) {
            log.info("Skipping current weather sync because app.sync.weather.current-enabled=false");
            return;
        }

        String runId = UUID.randomUUID().toString().substring(0, 8);
        log.info("⏳ Weather sync started runId={}", runId);
        long start = System.currentTimeMillis();

        List<WeatherNode> activeNodes = weatherNodeRepository.findByIsActiveTrue();
        if (activeNodes.isEmpty()) {
            log.warn("No active weather nodes found – skipping sync");
            return;
        }

        List<WeatherNode> standardNodes = activeNodes.stream()
                .filter(n -> !Boolean.TRUE.equals(n.getIsVolatile()))
                .collect(Collectors.toList());
        List<WeatherNode> volatileNodes = activeNodes.stream()
                .filter(n -> Boolean.TRUE.equals(n.getIsVolatile()))
                .collect(Collectors.toList());

        log.info("Weather sync runId={} nodes standard={} volatile={} fallbackBudget={} batchSize={}",
                runId,
                standardNodes.size(),
                volatileNodes.size(),
                owmFallbackMaxCallsPerRun,
                apiKeyConfig.getBatchSize());

        SyncStats stats = new SyncStats();
        syncStandardNodes(standardNodes, stats, runId);
        stats.owmVolatileCalls = syncVolatileNodes(volatileNodes);

        // Re-evaluate volatile flags based on current conditions
        reevaluateVolatileFlags();

        // Log API usage
        logApiUsage("open-meteo", apiKeyConfig.getOpenMeteoBaseUrl() + "/forecast", stats.openMeteoBatchCalls,
                System.currentTimeMillis() - start);
        int totalOwmCalls = stats.owmVolatileCalls + stats.owmFallbackCalls;
        if (totalOwmCalls > 0) {
            logApiUsage("openweathermap", "https://api.openweathermap.org/data/2.5/weather", totalOwmCalls,
                    System.currentTimeMillis() - start);
        }

        log.info(
                "✅ Weather sync completed runId={} in {}ms – {} Open-Meteo batches, {} OWM calls ({} volatile + {} fallback), AQI calls={} (enabled={} maxPerRun={}), {} nodes kept on stale cache",
                runId,
                System.currentTimeMillis() - start,
                stats.openMeteoBatchCalls,
                totalOwmCalls,
                stats.owmVolatileCalls,
                stats.owmFallbackCalls,
                stats.aqiCalls,
                aqiEnabled,
                aqiMaxCallsPerRun,
                stats.staleNodesRetained);

        // After sync, update forecast actuals for all spatial units
        updateAllForecastActuals();
    }

    private void updateAllForecastActuals() {
        log.info("Updating forecast actuals for all tracked spatial units");
        List<SpatialUnit> units = spatialUnitRepository.findByType(SpatialType.GN_DIVISION);
        for (SpatialUnit unit : units) {
            try {
                // Get historical trend (last 30 days) to find finalized actuals
                List<com.sidms.backend.dto.analytics.DailyWeatherDto> trend = analyticsService
                        .computeHistoricalTrend(unit.getId());
                for (com.sidms.backend.dto.analytics.DailyWeatherDto day : trend) {
                    // Only update for past dates that are likely finalized
                    if (day.getDate().isBefore(java.time.LocalDate.now())) {
                        if (day.getPrecipMm() != null) {
                            analyticsService.updateForecastWithActuals(unit.getId(), "precipitation", day.getDate(),
                                    day.getPrecipMm());
                        }
                        if (day.getTempMean() != null) {
                            analyticsService.updateForecastWithActuals(unit.getId(), "temperature", day.getDate(),
                                    day.getTempMean());
                        }
                    }
                }
            } catch (Exception e) {
                log.debug("Skip actuals update for unit {}: {}", unit.getName(), e.getMessage());
            }
        }
    }

    // Actually, reflection is messy. Let's just make computeHistoricalTrend public
    // in AnalyticsService or re-implement here.
    // Fixed below in follow-up.

    @Scheduled(cron = "0 30 1 * * *") // Every day at 01:30 AM
    @Transactional
    public void syncWeatherForecasts() {
        if (!weatherSyncEnabled) {
            log.info("Skipping forecast sync because app.sync.weather.enabled=false");
            return;
        }
        String runId = UUID.randomUUID().toString().substring(0, 8);
        log.info("⏳ Scheduled forecast sync started runId={}", runId);
        Set<UUID> syncedUnitIds = new HashSet<>();

        List<SpatialUnit> units = spatialUnitRepository.findByType(SpatialType.GN_DIVISION);
        List<SpatialUnit> targetUnits = units;
        if (forecastMaxUnits > 0 && forecastMaxUnits < units.size()) {
            targetUnits = units.stream().limit(forecastMaxUnits).collect(Collectors.toList());
        }

        log.info("Forecast sync runId={} targetUnits={} totalGnUnits={} maxUnitsSetting={}",
                runId,
                targetUnits.size(),
                units.size(),
                forecastMaxUnits);

        for (int i = 0; i < targetUnits.size(); i += 50) {
            List<SpatialUnit> batch = targetUnits.subList(i, Math.min(i + 50, targetUnits.size()));
            Instant batchStart = Instant.now();
            try {
                if (verboseSyncDebug) {
                    log.info("Forecast sync runId={} batchStart={} batchSize={} firstUnit={}",
                            runId,
                            i,
                            batch.size(),
                            batch.isEmpty() ? "-" : batch.get(0).getName());
                }

                String lats = batch.stream().map(u -> String.valueOf(u.getLat())).collect(Collectors.joining(","));
                String lngs = batch.stream().map(u -> String.valueOf(u.getLng())).collect(Collectors.joining(","));
                String params = "current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,is_day"
                        + "&hourly=temperature_2m,weather_code,precipitation,relative_humidity_2m"
                        + "&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,uv_index_max"
                        + "&forecast_days=7&timezone=auto";

                JsonNode root = openMeteoClient.getCurrentBatch(lats, lngs, params);
                if (root == null)
                    continue;

                if (root.isArray()) {
                    for (int j = 0; j < root.size() && j < batch.size(); j++) {
                        processUnitForecast(batch.get(j), root.get(j));
                        syncedUnitIds.add(batch.get(j).getId());
                    }
                } else if (!batch.isEmpty()) {
                    processUnitForecast(batch.get(0), root);
                    syncedUnitIds.add(batch.get(0).getId());
                }

                if (verboseSyncDebug) {
                    log.info("Forecast sync runId={} batchDone={} elapsedMs={}",
                            runId,
                            i,
                            Duration.between(batchStart, Instant.now()).toMillis());
                }
            } catch (Exception e) {
                log.error("Forecast batch sync failed runId={} batchStart={} firstUnit={} elapsedMs={} message={}",
                        runId,
                        i,
                        batch.isEmpty() ? "-" : batch.get(0).getName(),
                        Duration.between(batchStart, Instant.now()).toMillis(),
                        e.getMessage());
            }
        }

        evictAnalyticsOverviewCacheForUnits(syncedUnitIds, runId);
        log.info("✅ Scheduled forecast sync completed runId={}", runId);
    }

    private void evictAnalyticsOverviewCacheForUnits(Set<UUID> spatialUnitIds, String runId) {
        if (spatialUnitIds == null || spatialUnitIds.isEmpty()) {
            return;
        }

        try {
            Set<String> keys = spatialUnitIds.stream()
                    .map(id -> "analytics:overview:" + id)
                    .collect(Collectors.toSet());
            if (!keys.isEmpty()) {
                stringRedisTemplate.delete(keys);
                if (verboseSyncDebug) {
                    log.info("Forecast sync runId={} evicted analytics cache keys count={}", runId, keys.size());
                }
            }
        } catch (Exception e) {
            log.warn("Forecast sync runId={} failed to evict analytics overview cache: {}", runId, e.getMessage());
        }
    }

    private void processUnitForecast(SpatialUnit unit, JsonNode data) {
        persistSpatialForecastSnapshot(unit, data);
        cacheSpatialForecastPayload(unit, data);

        if (data != null && data.has("daily")) {
            JsonNode daily = data.get("daily");
            JsonNode times = daily.get("time");
            JsonNode precip = daily.get("precipitation_sum");

            if (times != null && precip != null && times.isArray() && precip.isArray()) {
                List<Double> predictions = new ArrayList<>();
                for (int i = 1; i < Math.min(precip.size(), 8); i++) { // Next 7 days
                    predictions.add(precip.get(i).asDouble());
                }

                // Create projection entry
                ForecastProjection projection = ForecastProjection.builder()
                        .spatialUnitId(unit.getId())
                        .forecastDate(java.time.LocalDate.now())
                        .metric("precipitation")
                        .pointEstimate(predictions.isEmpty() ? 0.0 : predictions.get(0))
                        .generatedAt(LocalDateTime.now())
                        .horizonDays(predictions.size())
                        .build();

                projection = forecastProjectionRepository.save(projection);
                analyticsService.saveForecastsForComparison(unit.getId(), projection.getId(), "precipitation",
                        predictions, null, null);
            }
        }
    }

    private void persistSpatialForecastSnapshot(SpatialUnit unit, JsonNode data) {
        if (unit == null || data == null || data.isNull()) {
            return;
        }

        try {
            LocalDateTime now = LocalDateTime.now();
            SpatialForecastSnapshot snapshot = spatialForecastSnapshotRepository
                    .findBySpatialUnitId(unit.getId())
                    .orElseGet(() -> SpatialForecastSnapshot.builder()
                            .spatialUnitId(unit.getId())
                            .build());

            snapshot.setSourceApi("open-meteo");
            snapshot.setPayload(data.toString());
            snapshot.setGeneratedAt(now);
            snapshot.setUpdatedAt(now);
            spatialForecastSnapshotRepository.save(snapshot);
        } catch (Exception e) {
            log.warn("Failed persisting forecast snapshot for unit={} reason={}", unit.getId(), e.getMessage());
        }
    }

    private void cacheSpatialForecastPayload(SpatialUnit unit, JsonNode data) {
        if (unit == null || data == null || data.isNull()) {
            return;
        }

        try {
            String key = CacheKeys.weatherForecastSpatial(unit.getId().toString());
            stringRedisTemplate.opsForValue().set(key, data.toString(), CacheKeys.TTL_FORECAST_SHORT);
        } catch (Exception e) {
            if (verboseSyncDebug) {
                log.warn("Failed caching forecast payload for unit={} reason={}", unit.getId(), e.getMessage());
            }
        }
    }

    // ──────────────────────────────────────────────
    // Standard nodes → Open-Meteo batch
    // ──────────────────────────────────────────────
    private void syncStandardNodes(List<WeatherNode> nodes, SyncStats stats, String runId) {
        if (nodes.isEmpty())
            return;

        int batchSize = apiKeyConfig.getBatchSize();
        int fallbackBudget = Math.max(0, owmFallbackMaxCallsPerRun);
        int[] aqiBudget = new int[] { Math.max(0, aqiMaxCallsPerRun) };

        for (int i = 0; i < nodes.size(); i += batchSize) {
            List<WeatherNode> batch = nodes.subList(i, Math.min(i + batchSize, nodes.size()));
            Instant batchStart = Instant.now();
            try {
                if (verboseSyncDebug) {
                    log.info("OpenMeteo sync runId={} batchStart={} batchSize={} firstNode={}",
                            runId,
                            i,
                            batch.size(),
                            batch.isEmpty() ? "-" : batch.get(0).getCode());
                }
                syncOpenMeteoBatch(batch, stats, aqiBudget);
                stats.openMeteoBatchCalls++;
                if (verboseSyncDebug) {
                    log.info("OpenMeteo sync runId={} batchDone={} elapsedMs={}",
                            runId,
                            i,
                            Duration.between(batchStart, Instant.now()).toMillis());
                }
            } catch (Exception e) {
                log.error("Open-Meteo batch sync failed runId={} batchStart={} batchSize={} elapsedMs={} message={}",
                        runId,
                        i,
                        batch.size(),
                        Duration.between(batchStart, Instant.now()).toMillis(),
                        e.getMessage());
                if (fallbackBudget > 0) {
                    int used = fallbackBatchToOwm(batch, fallbackBudget);
                    fallbackBudget -= used;
                    stats.owmFallbackCalls += used;
                    int stale = Math.max(0, batch.size() - used);
                    stats.staleNodesRetained += stale;
                    if (stale > 0) {
                        log.warn(
                                "OWM fallback budget exhausted or failed for {} node(s) in batch starting at index {}. Retaining stale DB/cache data.",
                                stale, i);
                    }
                } else {
                    stats.staleNodesRetained += batch.size();
                    log.warn(
                            "No OWM fallback budget left for batch starting at index {}. Retaining stale DB/cache data.",
                            i);
                }
            }
        }
    }

    private void syncOpenMeteoBatch(List<WeatherNode> batch, SyncStats stats, int[] aqiBudget) {
        Instant start = Instant.now();
        String latitudes = batch.stream().map(n -> String.valueOf(n.getLat())).collect(Collectors.joining(","));
        String longitudes = batch.stream().map(n -> String.valueOf(n.getLng())).collect(Collectors.joining(","));

        String currentParams = "current=temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m," +
                "precipitation,rain,showers,snowfall,wind_speed_10m,wind_gusts_10m,wind_direction_10m," +
                "cloud_cover,visibility,pressure_msl,uv_index,cape,weather_code," +
                "precipitation_probability,is_day" +
                "&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,pressure_msl,cloud_cover,dew_point_2m,weather_code,precipitation_probability"
                +
                "&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,sunrise,sunset,uv_index_max"
                +
                "&forecast_days=7&past_days=1&timezone=auto";

        JsonNode root = openMeteoClient.getCurrentBatch(latitudes, longitudes, currentParams);
        if (root == null) {
            log.warn("Open-Meteo returned null payload for batchSize={} elapsedMs={}",
                    batch.size(),
                    Duration.between(start, Instant.now()).toMillis());
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        // Single node response is an object, multi-node is an array
        if (root.isArray()) {
            for (int j = 0; j < root.size() && j < batch.size(); j++) {
                parseAndUpsertOpenMeteo(batch.get(j), root.get(j), now, root.toString());
            }
        } else {
            // Single node in batch
            if (!batch.isEmpty()) {
                parseAndUpsertOpenMeteo(batch.get(0), root, now, root.toString());
            }
        }

        if (verboseSyncDebug) {
            log.info("Open-Meteo batch processed batchSize={} responseShape={} responseItems={} elapsedMs={}",
                    batch.size(),
                    root.isArray() ? "ARRAY" : "OBJECT",
                    root.isArray() ? root.size() : 1,
                    Duration.between(start, Instant.now()).toMillis());
        }

        if (!aqiEnabled || aqiBudget[0] <= 0) {
            return;
        }

        // AQI is expensive: cap calls per sync run to avoid quota burn.
        for (WeatherNode node : batch) {
            if (aqiBudget[0] <= 0) {
                break;
            }
            try {
                JsonNode aqiData = openMeteoClient.getAirQualityCurrent(node.getLat(), node.getLng());
                if (aqiData != null) {
                    updateAqiData(node.getId(), aqiData, now);
                    stats.aqiCalls++;
                }
                aqiBudget[0]--;
            } catch (Exception e) {
                log.debug("AQI fetch skipped for node {}: {}", node.getCode(), e.getMessage());
            }
        }
    }

    private int fallbackBatchToOwm(List<WeatherNode> batch, int maxCalls) {
        if (maxCalls <= 0 || batch.isEmpty()) {
            return 0;
        }

        int calls = 0;
        for (WeatherNode node : batch) {
            if (calls >= maxCalls) {
                break;
            }

            try {
                JsonNode root = openWeatherMapClient.getCurrentWeather(node.getLat(), node.getLng());
                if (root == null) {
                    continue;
                }
                parseAndUpsertOwm(node, root, root.toString());
                calls++;
            } catch (Exception e) {
                log.warn("OWM fallback failed for node {}: {}", node.getCode(), e.getMessage());
            }
        }

        return calls;
    }

    private void updateAqiData(UUID nodeId, JsonNode aqiData, LocalDateTime now) {
        JsonNode current = aqiData.path("current");
        if (current.isMissingNode())
            return;

        Double aqi = getDouble(current, "us_aqi");
        Double pm10 = getDouble(current, "pm10");
        Double pm25 = getDouble(current, "pm2_5");

        if (aqi != null || pm10 != null || pm25 != null) {
            jdbcTemplate.update(
                    "UPDATE weather_node_live_cache SET us_aqi = COALESCE(?, us_aqi), " +
                            "pm10 = COALESCE(?, pm10), pm2_5 = COALESCE(?, pm2_5) " +
                            "WHERE weather_node_id = ?",
                    aqi, pm10, pm25, nodeId);
        }
    }

    private void parseAndUpsertOpenMeteo(WeatherNode node, JsonNode data, LocalDateTime now, String rawPayload) {
        JsonNode current = data.path("current");
        if (current.isMissingNode())
            return;

        WeatherNodeLiveCache cache = WeatherNodeLiveCache.builder()
                .weatherNodeId(node.getId())
                .sourceApi("open-meteo")
                .fetchedAt(now)
                .tempC(getDouble(current, "temperature_2m"))
                .apparentTempC(getDouble(current, "apparent_temperature"))
                .humidityPct(getDouble(current, "relative_humidity_2m"))
                .pressureHpa(getDouble(current, "pressure_msl"))
                .precipitationMm(getDouble(current, "precipitation"))
                .precipProbability(getDouble(current, "precipitation_probability"))
                .rainMm(getDouble(current, "rain"))
                .windSpeedKmh(getDouble(current, "wind_speed_10m"))
                .windGustKmh(getDouble(current, "wind_gusts_10m"))
                .windDirectionDeg(getDouble(current, "wind_direction_10m"))
                .cloudCoverPct(getDouble(current, "cloud_cover"))
                .visibilityM(getDouble(current, "visibility"))
                .uvIndex(getDouble(current, "uv_index"))
                .capeJkg(getDouble(current, "cape"))
                .weatherCode(getInt(current, "weather_code"))
                .rawPayload(rawPayload)
                .updatedAt(now)
                .build();

        liveCacheRepository.save(cache);

        // Insert telemetry log
        WeatherNodeTelemetryLog telemetry = WeatherNodeTelemetryLog.builder()
                .weatherNodeId(node.getId())
                .loggedAt(now)
                .sourceApi("open-meteo")
                .tempC(cache.getTempC())
                .precipitationMm(cache.getPrecipitationMm())
                .precipProbability(cache.getPrecipProbability())
                .rainMm(cache.getRainMm())
                .humidityPct(cache.getHumidityPct())
                .windSpeedKmh(cache.getWindSpeedKmh())
                .cloudCoverPct(cache.getCloudCoverPct())
                .capeJkg(cache.getCapeJkg())
                .uvIndex(cache.getUvIndex())
                .build();

        weatherNodeTelemetryLogRepository.save(telemetry);
    }

    // ──────────────────────────────────────────────
    // Volatile nodes → OpenWeatherMap (round-robin keys)
    // ──────────────────────────────────────────────
    private int syncVolatileNodes(List<WeatherNode> nodes) {
        if (nodes.isEmpty())
            return 0;

        int callCount = 0;

        for (WeatherNode node : nodes) {
            try {
                JsonNode root = openWeatherMapClient.getCurrentWeather(node.getLat(), node.getLng());
                if (root == null)
                    continue;

                parseAndUpsertOwm(node, root, root.toString());
                callCount++;
            } catch (Exception e) {
                log.error("OWM sync failed for node {}: {}", node.getCode(), e.getMessage());
            }
        }
        return callCount;
    }

    private void parseAndUpsertOwm(WeatherNode node, JsonNode root, String rawPayload) {
        LocalDateTime now = LocalDateTime.now();
        JsonNode main = root.path("main");
        JsonNode wind = root.path("wind");
        JsonNode clouds = root.path("clouds");

        WeatherNodeLiveCache cache = WeatherNodeLiveCache.builder()
                .weatherNodeId(node.getId())
                .sourceApi("openweathermap")
                .fetchedAt(now)
                .tempC(getDouble(main, "temp"))
                .apparentTempC(getDouble(main, "feels_like"))
                .humidityPct(getDouble(main, "humidity"))
                .pressureHpa(getDouble(main, "pressure"))
                .precipitationMm(getDouble(root.path("rain"), "1h"))
                .windSpeedKmh(multiplyOrNull(getDouble(wind, "speed"), 3.6)) // m/s → km/h
                .windGustKmh(multiplyOrNull(getDouble(wind, "gust"), 3.6))
                .windDirectionDeg(getDouble(wind, "deg"))
                .cloudCoverPct(getDouble(clouds, "all"))
                .visibilityM(getDouble(root, "visibility"))
                .weatherCode(getInt(root.path("weather").path(0), "id"))
                .rawPayload(rawPayload)
                .updatedAt(now)
                .build();

        liveCacheRepository.save(cache);

        // Insert telemetry log
        WeatherNodeTelemetryLog telemetry = WeatherNodeTelemetryLog.builder()
                .weatherNodeId(node.getId())
                .loggedAt(now)
                .sourceApi("openweathermap")
                .tempC(cache.getTempC())
                .precipitationMm(cache.getPrecipitationMm())
                .humidityPct(cache.getHumidityPct())
                .windSpeedKmh(cache.getWindSpeedKmh())
                .cloudCoverPct(cache.getCloudCoverPct())
                .capeJkg(cache.getCapeJkg())
                .uvIndex(cache.getUvIndex())
                .build();

        weatherNodeTelemetryLogRepository.save(telemetry);
    }

    // ──────────────────────────────────────────────
    // Re-evaluate volatile flag
    // ──────────────────────────────────────────────
    private void reevaluateVolatileFlags() {
        // Reset all to non-volatile first
        jdbcTemplate.update("UPDATE weather_nodes SET is_volatile = false WHERE is_active = true");

        // Mark nodes with heavy precipitation or high CAPE as volatile
        jdbcTemplate.update(
                "UPDATE weather_nodes wn SET is_volatile = true " +
                        "FROM weather_node_live_cache wlc " +
                        "WHERE wn.id = wlc.weather_node_id " +
                        "AND wn.is_active = true " +
                        "AND (wlc.precipitation_mm > 20 OR wlc.cape_jkg > 1000)");

        log.info("Volatile flag re-evaluation complete");
    }

    // ──────────────────────────────────────────────
    // Evict Redis weather caches (offset by 5s)
    // ──────────────────────────────────────────────
    @Scheduled(fixedDelayString = "${app.sync.weather.interval}", initialDelayString = "${app.sync.cache-evict.initial-delay}")
    public void evictWeatherCaches() {
        if (!weatherSyncEnabled || !currentWeatherSyncEnabled) {
            log.debug("Skipping weather cache eviction because weather/current sync is disabled");
            return;
        }

        log.info("Evicting weather:spatial:* Redis caches");
        try {
            Set<String> keys = stringRedisTemplate.keys("weather:spatial:*");
            if (keys != null && !keys.isEmpty()) {
                stringRedisTemplate.delete(keys);
                log.info("Evicted {} weather cache keys", keys.size());
            }
        } catch (Exception e) {
            log.warn("Redis cache eviction failed: {}", e.getMessage());
        }
    }

    // ──────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────
    private void logApiUsage(String provider, String endpoint, int callCount, long responseTimeMs) {
        for (int i = 0; i < callCount; i++) {
            jdbcTemplate.update(
                    "INSERT INTO api_usage_logs (provider, endpoint, status_code, response_time_ms) VALUES (?, ?, ?, ?)",
                    provider, endpoint, 200, (int) responseTimeMs);
        }
    }

    private Double getDouble(JsonNode node, String field) {
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? null : value.asDouble();
    }

    private Integer getInt(JsonNode node, String field) {
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? null : value.asInt();
    }

    private Double multiplyOrNull(Double value, double factor) {
        return value == null ? null : value * factor;
    }

    private static class SyncStats {
        int openMeteoBatchCalls;
        int owmVolatileCalls;
        int owmFallbackCalls;
        int aqiCalls;
        int staleNodesRetained;
    }
}
