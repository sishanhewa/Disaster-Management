package com.sidms.backend.scheduler;

import com.fasterxml.jackson.databind.JsonNode;
import com.sidms.backend.client.OpenMeteoClient;
import com.sidms.backend.entity.WeatherNode;
import com.sidms.backend.entity.WeatherNodeHourlyForecast;
import com.sidms.backend.repository.WeatherNodeHourlyForecastRepository;
import com.sidms.backend.repository.WeatherNodeLiveCacheRepository;
import com.sidms.backend.repository.WeatherNodeRepository;
import com.sidms.backend.service.AnalyticsService;
import com.sidms.backend.service.SyncStateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@Slf4j
@RequiredArgsConstructor
public class WeatherSyncScheduler {

    private static final String JOB_NAME_FORECAST = "openmeteo_forecast_sync";
    private static final Duration COOLDOWN_FORECAST = Duration.ofHours(6);

    private final SyncStateService syncStateService;
    private final WeatherNodeRepository weatherNodeRepository;
    private final WeatherNodeLiveCacheRepository liveCacheRepository;
    private final OpenMeteoClient openMeteoClient;
    private final JdbcTemplate jdbcTemplate;
    private final AnalyticsService analyticsService;
    private final WeatherNodeHourlyForecastRepository weatherNodeHourlyForecastRepository;
    private final com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @Value("${app.sync.weather.enabled:true}")
    private boolean weatherSyncEnabled;

    @Value("${app.sync.debug.verbose:false}")
    private boolean verboseSyncDebug;

    @Value("${app.sync.weather.forecast-max-units:-1}")
    private int forecastMaxUnits;

    // ──────────────────────────────────────────────
    // Open-Meteo Forecast & AQI Sync (runs 4 times a day)
    // ──────────────────────────────────────────────
    @Scheduled(cron = "0 15 0,6,12,18 * * *") // Every 6 hours
    public void scheduledSyncWeatherForecasts() {
        if (!syncStateService.shouldRun(JOB_NAME_FORECAST, COOLDOWN_FORECAST))
            return;
        try {
            if (!weatherSyncEnabled) {
                log.info("Skipping forecast sync because app.sync.weather.enabled=false");
                syncStateService.recordSuccess(JOB_NAME_FORECAST, COOLDOWN_FORECAST);
                return;
            }
            syncWeatherForecasts();
            reevaluateVolatileFlags();
            syncStateService.recordSuccess(JOB_NAME_FORECAST, COOLDOWN_FORECAST);
        } catch (Exception e) {
            log.error("[{}] Sync failed: {}", JOB_NAME_FORECAST, e.getMessage(), e);
            syncStateService.recordFailure(JOB_NAME_FORECAST, COOLDOWN_FORECAST, e.getMessage());
        }
    }

    public void syncWeatherForecasts() {
        String runId = UUID.randomUUID().toString().substring(0, 8);
        log.info("[WeatherSync] Scheduled forecast sync started runId={}", runId);

        List<WeatherNode> nodes = weatherNodeRepository.findByIsActiveTrue();
        List<WeatherNode> targetNodes = nodes;
        if (forecastMaxUnits > 0 && forecastMaxUnits < nodes.size()) {
            targetNodes = nodes.stream().limit(forecastMaxUnits).collect(Collectors.toList());
        }

        log.info("Forecast sync runId={} targetNodes={} totalNodes={} maxUnitsSetting={}",
                runId,
                targetNodes.size(),
                nodes.size(),
                forecastMaxUnits);

        for (int i = 0; i < targetNodes.size(); i += 50) {
            List<WeatherNode> batch = targetNodes.subList(i, Math.min(i + 50, targetNodes.size()));
            Instant batchStart = Instant.now();
            try {
                if (verboseSyncDebug) {
                    log.info("Forecast sync runId={} batchStart={} batchSize={} firstNode={}",
                            runId,
                            i,
                            batch.size(),
                            batch.isEmpty() ? "-" : batch.get(0).getCode());
                }

                String lats = batch.stream().map(n -> String.valueOf(n.getLat())).collect(Collectors.joining(","));
                String lngs = batch.stream().map(n -> String.valueOf(n.getLng())).collect(Collectors.joining(","));
                String params = "hourly=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,cape&forecast_days=14&timezone=auto";

                JsonNode root = openMeteoClient.getCurrentBatch(lats, lngs, params);
                if (root == null)
                    continue;

                if (root.isArray()) {
                    processBatchForecasts(batch, root);
                } else if (!batch.isEmpty()) {
                    processNodeForecast(batch.get(0), root);
                }

                log.info("Forecast sync runId={} batchDone={} elapsedMs={}",
                        runId,
                        i,
                        Duration.between(batchStart, Instant.now()).toMillis());

                // API Rate Limiting - Pause between batches
                try {
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }

            } catch (Exception e) {
                log.error("Forecast batch sync failed runId={} batchStart={} firstNode={} elapsedMs={} message={}",
                        runId,
                        i,
                        batch.isEmpty() ? "-" : batch.get(0).getCode(),
                        Duration.between(batchStart, Instant.now()).toMillis(),
                        e.getMessage());
            }
        }

        log.info("[WeatherSync] Scheduled forecast sync completed runId={}", runId);
    }

    @Transactional
    public void processNodeForecast(WeatherNode node, JsonNode data) {
        processBatchForecasts(List.of(node), data);
    }

    @Transactional
    public void processBatchForecasts(List<WeatherNode> nodes, JsonNode root) {
        if (root == null) return;
        
        List<UUID> nodeIds = nodes.stream().map(WeatherNode::getId).collect(Collectors.toList());
        List<WeatherNodeHourlyForecast> existingForecasts = weatherNodeHourlyForecastRepository
                .findByWeatherNodeIdInAndSourceName(nodeIds, "OPENMETEO");

        // Map existing by nodeId + time
        java.util.Map<String, WeatherNodeHourlyForecast> existingMap = new java.util.HashMap<>();
        for (WeatherNodeHourlyForecast f : existingForecasts) {
            existingMap.put(f.getWeatherNodeId() + "_" + f.getForecastTime(), f);
        }

        List<WeatherNodeHourlyForecast> toSave = new java.util.ArrayList<>();
        LocalDateTime nowUtc = LocalDateTime.now(ZoneOffset.UTC);

        for (int j = 0; j < nodes.size() && j < (root.isArray() ? root.size() : 1); j++) {
            WeatherNode node = nodes.get(j);
            JsonNode data = root.isArray() ? root.get(j) : root;
            
            if (data == null || !data.has("hourly")) continue;

            JsonNode hourly = data.get("hourly");
            JsonNode times = hourly.get("time");
            if (times == null || !times.isArray()) continue;

            for (int i = 48; i < times.size(); i++) {
                try {
                    LocalDateTime forecastTime = LocalDateTime.parse(times.get(i).asText());
                    String key = node.getId() + "_" + forecastTime;
                    
                    WeatherNodeHourlyForecast forecast = existingMap.get(key);
                    if (forecast == null) {
                        forecast = WeatherNodeHourlyForecast.builder()
                                .weatherNodeId(node.getId())
                                .forecastTime(forecastTime)
                                .sourceName("OPENMETEO")
                                .createdAt(nowUtc)
                                .build();
                    }

                    forecast.setTempC(getDoubleAt(hourly, "temperature_2m", i));
                    forecast.setPrecipitationMm(getDoubleAt(hourly, "precipitation", i));
                    forecast.setPrecipProbability(getDoubleAt(hourly, "precipitation_probability", i));
                    forecast.setWindSpeedKmh(getDoubleAt(hourly, "wind_speed_10m", i));
                    forecast.setCapeJkg(getDoubleAt(hourly, "cape", i));
                    forecast.setRelativeHumidityPct(getDoubleAt(hourly, "relative_humidity_2m", i));
                    forecast.setDewPointC(getDoubleAt(hourly, "dew_point_2m", i));
                    forecast.setApparentTempC(getDoubleAt(hourly, "apparent_temperature", i));
                    JsonNode wc = hourly.path("weather_code").get(i);
                    forecast.setWeatherCode(wc != null && !wc.isNull() ? wc.asInt() : null);
                    forecast.setPressureHpa(getDoubleAt(hourly, "surface_pressure", i));
                    forecast.setCloudCoverPct(getDoubleAt(hourly, "cloud_cover", i));
                    forecast.setVisibilityM(getDoubleAt(hourly, "visibility", i));
                    forecast.setWindDirectionDeg(getDoubleAt(hourly, "wind_direction_10m", i));
                    forecast.setWindGustsKmh(getDoubleAt(hourly, "wind_gusts_10m", i));
                    forecast.setUvIndex(getDoubleAt(hourly, "uv_index", i));

                    toSave.add(forecast);
                } catch (Exception e) {
                    // skip malformed time
                }
            }
        }

        if (!toSave.isEmpty()) {
            weatherNodeHourlyForecastRepository.saveAll(toSave);
        }
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
                        "AND wlc.precipitation_mm > 20");

        log.info("Volatile flag re-evaluation complete");
    }

    public void evictWeatherCaches() {
        log.info("Evicting weather caches (placeholder)");
        // In a real scenario, this would clear Redis keys for weather responses
        jdbcTemplate.update("DELETE FROM sync_state WHERE job_name = ?", JOB_NAME_FORECAST);
    }

    // ──────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────

    private Double getDouble(JsonNode node, String field) {
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? null : value.asDouble();
    }

    private Double getDoubleAt(JsonNode hourly, String field, int index) {
        JsonNode arr = hourly.path(field);
        if (arr.isMissingNode() || !arr.isArray() || index >= arr.size())
            return null;
        JsonNode val = arr.get(index);
        return (val == null || val.isNull()) ? null : val.asDouble();
    }
}
