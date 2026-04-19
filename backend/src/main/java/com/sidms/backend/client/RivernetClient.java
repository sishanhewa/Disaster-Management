package com.sidms.backend.client;

import com.sidms.backend.util.ApiKeyManager;
import com.sidms.backend.util.CacheKeys;
import com.sidms.backend.util.ApiCircuitBreaker;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.net.URI;

/**
 * Client for Rivernet API (api.rivernet.lk).
 * Fetches region device configs, live status, and chart data.
 */
@Component
@Slf4j
public class RivernetClient {

    private static final String SERVICE = "RIVERNET";
    private static final String BASE_URL = "https://api.rivernet.lk/cache-api.php";

    private final RestTemplate restTemplate;
    private final ApiKeyManager apiKeyManager;
    private final ApiCircuitBreaker circuitBreaker;
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate redisTemplate;

    public RivernetClient(RestTemplate restTemplate, ApiKeyManager apiKeyManager,
                          ApiCircuitBreaker circuitBreaker, ObjectMapper objectMapper,
                          StringRedisTemplate redisTemplate) {
        this.restTemplate = restTemplate;
        this.apiKeyManager = apiKeyManager;
        this.circuitBreaker = circuitBreaker;
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
    }

    /**
     * Fetch all region devices (basin→device mappings).
     */
    public JsonNode getRegionDevices() {
        return cachedFetch(CacheKeys.rivernetRegionDevices(), CacheKeys.TTL_RIVERNET_CONFIG,
                "api/overview/region-devices");
    }

    /**
     * Fetch latest status for devices of a given type.
     */
    public JsonNode getLatestStatus(String deviceType, List<String> deviceKeys) {
        String keysStr = String.join(",", deviceKeys);
        String cacheKey = CacheKeys.rivernetLatestStatus(deviceType, keysStr);

        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) return objectMapper.readTree(cached);
        } catch (Exception ignored) {}

        String path = "api/overview/latest-status-paginated?deviceType=" + deviceType + "&deviceKeys=" + keysStr;
        JsonNode data = fetchRivernet(path);

        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(data), CacheKeys.TTL_RIVERNET_STATUS);
        } catch (Exception ignored) {}

        return data;
    }

    /**
     * Fetch chart data for a device within a time range.
     */
    public JsonNode getChartData(String deviceKey, long startTs, long endTs) {
        String cacheKey = CacheKeys.rivernetChart(deviceKey, startTs, endTs);

        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) return objectMapper.readTree(cached);
        } catch (Exception ignored) {}

        String path = "api/reports/river-level/chart/minute/" + startTs + "/" + endTs
                + "?keys=" + deviceKey + "&last24HoursData=1&isPublic=1";
        JsonNode data = fetchRivernet(path);

        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(data), CacheKeys.TTL_RIVERNET_STATUS);
        } catch (Exception ignored) {}

        return data;
    }

    /**
     * Fetch English localization strings.
     */
    public JsonNode getLocalization() {
        return cachedFetch(CacheKeys.rivernetRegionDevices() + ":lang", CacheKeys.TTL_RIVERNET_CONFIG,
                "api/lang/en");
    }

    // ── Calibration utilities (matching reference) ───────────

    /**
     * Calculate calibrated water level from raw sensor value.
     */
    public static double calculateLevel(double rawValue, Double subtractConstant, Double offset) {
        double value = rawValue;
        if (subtractConstant != null) {
            value = subtractConstant - value;
        }
        if (offset != null) {
            value += offset;
        }
        return Math.round(value * 100.0) / 100.0;
    }

    /**
     * Determine alert status based on current value and alert levels.
     */
    public static Map<String, Object> getAlertStatus(Double currentValue, JsonNode alertLevels) {
        if (alertLevels == null || !alertLevels.isArray() || currentValue == null) {
            return Map.of("type", "normal", "color", "#44518C");
        }

        // Sort by value descending
        List<JsonNode> sorted = new ArrayList<>();
        for (JsonNode level : alertLevels) sorted.add(level);
        sorted.sort((a, b) -> Double.compare(b.path("value").asDouble(), a.path("value").asDouble()));

        for (JsonNode level : sorted) {
            if (currentValue >= level.path("value").asDouble()) {
                return Map.of(
                        "type", level.path("name").asText("alert"),
                        "color", level.path("color").asText("#FF0000")
                );
            }
        }

        return Map.of("type", "normal", "color", "#44518C");
    }

    // ── Internal ─────────────────────────────────────────────

    private JsonNode fetchRivernet(String path) {
        return circuitBreaker.execute(SERVICE, () -> {
            String url = BASE_URL + "?path=" + urlEncode(path);
            String key = apiKeyManager.getNextKey(SERVICE);
            if (key != null) url += "&apikey=" + key;

            log.info("RIVERNET HttpRequest: GET {}", url);
            String response = restTemplate.getForObject(URI.create(url), String.class);
            log.info("RIVERNET HttpResponse length: {}, startsWith: {}", 
                     response == null ? 0 : response.length(),
                     response != null && response.length() > 50 ? response.substring(0, 50) : response);
            try {
                return objectMapper.readTree(response);
            } catch (Exception e) {
                log.error("Failed to parse Rivernet response: {}", response);
                throw new RuntimeException("Failed to parse Rivernet response", e);
            }
        });
    }

    private JsonNode cachedFetch(String cacheKey, java.time.Duration ttl, String path) {
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) return objectMapper.readTree(cached);
        } catch (Exception ignored) {}

        JsonNode data = fetchRivernet(path);

        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(data), ttl);
        } catch (Exception ignored) {}

        return data;
    }

    private String urlEncode(String s) {
        try { return java.net.URLEncoder.encode(s, "UTF-8"); }
        catch (Exception e) { return s; }
    }
}
