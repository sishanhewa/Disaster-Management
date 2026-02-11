package com.sidms.backend.service;

import com.sidms.backend.dto.admin.SchedulerWorkerStatusDto;
import com.sidms.backend.repository.FloodGaugeReadingRepository;
import com.sidms.backend.repository.WeatherNodeHourlyForecastRepository;
import com.sidms.backend.repository.MetBulletinRepository;
import com.sidms.backend.repository.RivernetDeviceRepository;
import com.sidms.backend.repository.WeatherNodeLiveCacheRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class SchedulerAdminService {

    private final WeatherNodeLiveCacheRepository weatherNodeLiveCacheRepository;
    private final WeatherNodeHourlyForecastRepository weatherNodeHourlyForecastRepository;
    private final MetBulletinRepository metBulletinRepository;
    private final FloodGaugeReadingRepository floodGaugeReadingRepository;
    private final RivernetDeviceRepository rivernetDeviceRepository;

    @Value("${app.sync.weather.enabled:true}")
    private boolean weatherSyncEnabled;

    @Value("${app.sync.weather.current-enabled:true}")
    private boolean currentWeatherSyncEnabled;

    @Value("${app.sync.weather.interval:1800000}")
    private long weatherIntervalMs;

    @Value("${app.sync.flood.interval:900000}")
    private long floodIntervalMs;

    @Value("${app.sync.meteo.interval:900000}")
    private long meteoIntervalMs;

    @Value("${app.sync.alerts.interval:900000}")
    private long alertsIntervalMs;

    @Value("${app.sync.warming.interval:900000}")
    private long warmingIntervalMs;

    public SchedulerAdminService(WeatherNodeLiveCacheRepository weatherNodeLiveCacheRepository,
            WeatherNodeHourlyForecastRepository weatherNodeHourlyForecastRepository,
            MetBulletinRepository metBulletinRepository,
            FloodGaugeReadingRepository floodGaugeReadingRepository,
            RivernetDeviceRepository rivernetDeviceRepository) {
        this.weatherNodeLiveCacheRepository = weatherNodeLiveCacheRepository;
        this.weatherNodeHourlyForecastRepository = weatherNodeHourlyForecastRepository;
        this.metBulletinRepository = metBulletinRepository;
        this.floodGaugeReadingRepository = floodGaugeReadingRepository;
        this.rivernetDeviceRepository = rivernetDeviceRepository;
    }

    public List<SchedulerWorkerStatusDto> getWorkerStatuses() {
        List<SchedulerWorkerStatusDto> workers = new ArrayList<>();

        workers.add(buildStatus(
                "sync-weather",
                "Weather Node Sync",
                "fixedDelay=" + weatherIntervalMs + "ms",
                weatherSyncEnabled && currentWeatherSyncEnabled,
                weatherNodeLiveCacheRepository.findTopByOrderByFetchedAtDesc().map(v -> v.getFetchedAt()).orElse(null),
                "/api/v1/admin/setup/sync-weather",
                "Pulls latest live telemetry for weather nodes (requires weather.enabled and weather.current-enabled)."));

        workers.add(buildStatus(
                "sync-forecasts",
                "OpenMeteo Forecast Sync",
                "daily@00:15, 06:15, 12:15, 18:15",
                weatherSyncEnabled,
                weatherNodeHourlyForecastRepository.findTopByOrderByCreatedAtDesc().map(v -> v.getCreatedAt())
                        .orElse(null),
                "/api/v1/admin/sync/run/openmeteo_forecast_sync",
                "Pulls long-term hourly forecasts for Weather Nodes from OpenMeteo (requires weather.enabled)."));

        workers.add(buildStatus(
                "sync-meteo",
                "Meteo Content Sync",
                "fixedDelay=" + meteoIntervalMs + "ms",
                true,
                metBulletinRepository.findTopByOrderByScrapedAtDesc().map(v -> v.getScrapedAt()).orElse(null),
                "/api/v1/admin/setup/sync-meteo",
                "Scrapes and refreshes meteo content feeds."));

        workers.add(buildStatus(
                "sync-flood",
                "Flood Gauge Sync",
                "fixedDelay=" + floodIntervalMs + "ms",
                true,
                floodGaugeReadingRepository.findTopByOrderByFetchedAtDesc().map(v -> v.getFetchedAt()).orElse(null),
                "/api/v1/admin/setup/sync-flood",
                "Refreshes flood gauge readings and warning triggers."));

        workers.add(buildStatus(
                "sync-rivernet",
                "Rivernet Device Sync",
                "fixedDelay=" + floodIntervalMs + "ms",
                true,
                rivernetDeviceRepository.findTopByOrderByLastSyncedAtDesc().map(v -> v.getLastSyncedAt()).orElse(null),
                "/api/v1/admin/setup/sync-rivernet",
                "Updates Rivernet telemetry and device status."));

        workers.add(buildStatus(
                "warm-cache",
                "Cache Warmer",
                "fixedDelay=" + warmingIntervalMs + "ms",
                true,
                weatherNodeLiveCacheRepository.findTopByOrderByFetchedAtDesc().map(v -> v.getFetchedAt()).orElse(null),
                "/api/v1/admin/setup/warm-cache",
                "Pre-heats weather, warnings, flood and meteo caches."));

        workers.add(buildStatus(
                "evaluate-alerts",
                "Alert Rule Evaluator",
                "fixedDelay=" + alertsIntervalMs + "ms",
                true,
                weatherNodeLiveCacheRepository.findTopByOrderByFetchedAtDesc().map(v -> v.getFetchedAt()).orElse(null),
                "/api/v1/admin/setup/evaluate-alerts",
                "Evaluates user alert rules against latest weather signals."));

        return workers;
    }

    private SchedulerWorkerStatusDto buildStatus(String workerKey,
            String displayName,
            String intervalHint,
            boolean enabled,
            LocalDateTime lastDataAt,
            String triggerEndpoint,
            String notes) {
        return SchedulerWorkerStatusDto.builder()
                .workerKey(workerKey)
                .displayName(displayName)
                .intervalHint(intervalHint)
                .enabled(enabled)
                .lastDataAt(lastDataAt)
                .staleMinutes(lastDataAt == null ? null : Duration.between(lastDataAt, LocalDateTime.now(java.time.ZoneOffset.UTC)).toMinutes())
                .triggerEndpoint(triggerEndpoint)
                .notes(notes)
                .build();
    }
}
