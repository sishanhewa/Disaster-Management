package com.sidms.backend.service;

import com.sidms.backend.client.ArcGISClient;
import com.sidms.backend.client.RivernetClient;
import com.sidms.backend.dto.flood.*;
import com.sidms.backend.entity.FloodGaugeReading;
import com.sidms.backend.entity.RivernetDevice;
import com.sidms.backend.entity.enums.AlertLevel;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.repository.FloodGaugeReadingRepository;
import com.sidms.backend.repository.RivernetDeviceRepository;
import com.sidms.backend.util.CacheKeys;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FloodService {

    private final FloodGaugeReadingRepository floodGaugeReadingRepository;
    private final RivernetDeviceRepository rivernetDeviceRepository;
    private final ArcGISClient arcGISClient;
    private final RivernetClient rivernetClient;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public FloodService(FloodGaugeReadingRepository floodGaugeReadingRepository,
                        RivernetDeviceRepository rivernetDeviceRepository,
                        ArcGISClient arcGISClient,
                        RivernetClient rivernetClient,
                        StringRedisTemplate redisTemplate,
                        ObjectMapper objectMapper) {
        this.floodGaugeReadingRepository = floodGaugeReadingRepository;
        this.rivernetDeviceRepository = rivernetDeviceRepository;
        this.arcGISClient = arcGISClient;
        this.rivernetClient = rivernetClient;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Combined flood dashboard: DB readings + ArcGIS summary + Rivernet device count.
     */
    public FloodDashboardResponse getDashboard() {
        // Check Redis cache
        String cacheKey = CacheKeys.floodDashboard();
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return objectMapper.readValue(cached, FloodDashboardResponse.class);
            }
        } catch (Exception ignored) {
        }

        // Load all readings and get latest per station+source
        List<FloodGaugeReading> allReadings = floodGaugeReadingRepository.findAll();

        Map<String, FloodGaugeReading> latestByStation = new LinkedHashMap<>();
        for (FloodGaugeReading reading : allReadings) {
            String key = reading.getStationName() + "|" + reading.getSource();
            FloodGaugeReading existing = latestByStation.get(key);
            if (existing == null || reading.getRecordedAt().isAfter(existing.getRecordedAt())) {
                latestByStation.put(key, reading);
            }
        }

        List<GaugeStationDto> gauges = latestByStation.values().stream()
                .map(r -> GaugeStationDto.builder()
                        .stationName(r.getStationName())
                        .source(r.getSource())
                        .basin(r.getBasin())
                        .waterLevel(r.getWaterLevel())
                        .alertThreshold(r.getAlertThreshold())
                        .minorThreshold(r.getMinorThreshold())
                        .majorThreshold(r.getMajorThreshold())
                        .alertLevel(r.getAlertLevel() != null ? r.getAlertLevel().name() : AlertLevel.NORMAL.name())
                        .lat(r.getLat())
                        .lng(r.getLng())
                        .recordedAt(r.getRecordedAt())
                        .build())
                .collect(Collectors.toList());

        // Load rivernet devices
        List<RivernetDevice> devices = rivernetDeviceRepository.findAll();
        List<RivernetDeviceDto> deviceDtos = devices.stream()
                .map(d -> RivernetDeviceDto.builder()
                        .deviceKey(d.getDeviceKey())
                        .name(d.getName())
                        .basin(d.getBasin())
                        .isOnline(d.getIsOnline())
                        .lastSyncedAt(d.getLastSyncedAt())
                        .build())
                .collect(Collectors.toList());

        // Compute counts
        int alertCount = (int) gauges.stream()
                .filter(g -> AlertLevel.ALERT.name().equals(g.getAlertLevel()))
                .count();
        int minorFloodCount = (int) gauges.stream()
                .filter(g -> AlertLevel.MINOR_FLOOD.name().equals(g.getAlertLevel()))
                .count();
        int majorFloodCount = (int) gauges.stream()
                .filter(g -> AlertLevel.MAJOR_FLOOD.name().equals(g.getAlertLevel()))
                .count();

        FloodDashboardResponse response = FloodDashboardResponse.builder()
                .gauges(gauges)
                .rivernetDevices(deviceDtos)
                .totalStations(gauges.size())
                .alertCount(alertCount)
                .minorFloodCount(minorFloodCount)
                .majorFloodCount(majorFloodCount)
                .build();

        // Cache 5 min
        try {
            redisTemplate.opsForValue().set(cacheKey,
                    objectMapper.writeValueAsString(response),
                    CacheKeys.TTL_FLOOD_DASHBOARD);
        } catch (Exception ignored) {
        }

        return response;
    }

    // ── Live ArcGIS queries (NEW) ────────────────────────────

    /**
     * Live GeoJSON from ArcGIS FeatureServer (paginated).
     * Replaces the old static-metadata-only method.
     */
    public JsonNode getArcGISGeoJSON(String layerName) {
        String serviceUrl = ArcGISClient.SERVICES.get(layerName);
        if (serviceUrl == null) {
            throw new ResourceNotFoundException("Unknown ArcGIS layer: " + layerName
                    + ". Supported: " + String.join(", ", ArcGISClient.SERVICES.keySet()));
        }
        return arcGISClient.fetchGeoJSON(serviceUrl, "1=1");
    }

    /**
     * ArcGIS hydrostations (gauging station metadata).
     */
    public List<Map<String, Object>> getArcGISStations() {
        return arcGISClient.fetchStations();
    }

    /**
     * ArcGIS alert summary: latest gauge readings with alert classification.
     */
    public Map<String, Object> getArcGISAlertSummary() {
        return arcGISClient.fetchAlertSummary();
    }

    /**
     * ArcGIS gauge history for a specific station.
     */
    public List<Map<String, Object>> getArcGISGaugeHistory(String gaugeName) {
        return arcGISClient.fetchGaugeHistory(gaugeName);
    }

    /**
     * ArcGIS top rainfall gauges.
     */
    public List<Map<String, Object>> getArcGISRainfallTop(int limit) {
        return arcGISClient.fetchRainfallTop(limit);
    }

    // ── Live Rivernet queries (NEW) ──────────────────────────

    /**
     * Rivernet region device configuration.
     */
    public JsonNode getRivernetDeviceConfig() {
        return rivernetClient.getRegionDevices();
    }

    /**
     * Rivernet live device status (paginated).
     */
    public JsonNode getRivernetLiveStatus(String deviceType, List<String> deviceKeys) {
        return rivernetClient.getLatestStatus(deviceType, deviceKeys);
    }

    /**
     * Rivernet chart data for a specific device.
     */
    public JsonNode getRivernetChartData(String deviceKey, long startTs, long endTs) {
        return rivernetClient.getChartData(deviceKey, startTs, endTs);
    }

    // ── DB-backed rivernet status ────────────────────────────

    public List<RivernetDeviceDto> getRivernetStatus() {
        return rivernetDeviceRepository.findAll().stream()
                .map(d -> RivernetDeviceDto.builder()
                        .deviceKey(d.getDeviceKey())
                        .name(d.getName())
                        .basin(d.getBasin())
                        .isOnline(d.getIsOnline())
                        .lastSyncedAt(d.getLastSyncedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional
    public void syncRivernetDevices() {
        JsonNode config = rivernetClient.getRegionDevices();
        if (config == null || !config.has("devices")) return;
        
        for (JsonNode node : config.get("devices")) {
            String deviceKey = node.path("device_key").asText();
            RivernetDevice device = rivernetDeviceRepository.findByDeviceKey(deviceKey)
                    .orElse(RivernetDevice.builder().deviceKey(deviceKey).build());
            
            device.setName(node.path("name").asText(deviceKey));
            device.setBasin(node.path("basin").asText("Unknown"));
            device.setIsOnline(node.path("status").asText("online").equalsIgnoreCase("online"));
            device.setLastSyncedAt(java.time.LocalDateTime.now());
            
            rivernetDeviceRepository.save(device);
        }
    }
}
