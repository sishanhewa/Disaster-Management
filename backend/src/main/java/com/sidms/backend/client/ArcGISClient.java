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
 * Client for ArcGIS Sri Lanka flood services.
 * Correct org: J7ZFXmR8rSmQ3FGf (fixed from reference).
 */
@Component
@Slf4j
public class ArcGISClient {

    private static final String SERVICE = "ARCGIS";
    private static final String BASE = "https://services3.arcgis.com/J7ZFXmR8rSmQ3FGf/arcgis/rest/services";

    // ── All 14 service URLs from reference ───────────────────
    public static final Map<String, String> SERVICES = Map.ofEntries(
            Map.entry("hydrostations", BASE + "/hydrostations/FeatureServer/0"),
            Map.entry("gauges",        BASE + "/gauges_2_view/FeatureServer/0"),
            Map.entry("rivers",        BASE + "/rivers/FeatureServer/0"),
            Map.entry("srilankaRiver", BASE + "/Srilanka_River/FeatureServer/0"),
            Map.entry("riverBasins",   BASE + "/river_basins/FeatureServer/0"),
            Map.entry("floodMap",      BASE + "/Flood_Map/FeatureServer"),
            Map.entry("floodNov2025",  BASE + "/Flood__Nov2025/FeatureServer/0"),
            Map.entry("districts",     BASE + "/SL_District/FeatureServer/0"),
            Map.entry("bufferZones",   BASE + "/Buffer_of_hydrostations/FeatureServer/0"),
            Map.entry("reservoirs",    BASE + "/Reservoir_Data_2024/FeatureServer/0"),
            Map.entry("reservoirSchemes", BASE + "/Reservoir_Data_2024/FeatureServer/5"),
            Map.entry("reservoirTanks",  BASE + "/Reservoir_Data_2024/FeatureServer/4"),
            Map.entry("canalSystem",   BASE + "/Canal_System/FeatureServer/0"),
            Map.entry("rainfall24h",   BASE + "/24hr_rainfall/FeatureServer/0")
    );

    private static final String GAUGE_EXCLUDE = "(gauge <> 'Calidonia')";
    private static final String STATION_EXCLUDE = "(station <> 'Calidonia')";
    private static final String BASIN_EXCLUDE = "(basin <> 'Kala Oya')";

    private final RestTemplate restTemplate;
    private final ApiKeyManager apiKeyManager;
    private final ApiCircuitBreaker circuitBreaker;
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate redisTemplate;

    public ArcGISClient(RestTemplate restTemplate, ApiKeyManager apiKeyManager,
                        ApiCircuitBreaker circuitBreaker, ObjectMapper objectMapper,
                        StringRedisTemplate redisTemplate) {
        this.restTemplate = restTemplate;
        this.apiKeyManager = apiKeyManager;
        this.circuitBreaker = circuitBreaker;
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
    }

    // ── Core query methods ───────────────────────────────────

    public List<Map<String, Object>> queryFeatures(String serviceUrl, String where, String outFields) {
        return circuitBreaker.execute(SERVICE, () -> {
            String url = serviceUrl + "/query?f=json&where=" + urlEncode(where)
                    + "&outFields=" + urlEncode(outFields)
                    + "&returnGeometry=true&outSR=4326";

            String key = apiKeyManager.getNextKey(SERVICE);
            if (key != null) url += "&token=" + key;

            String response = restTemplate.getForObject(URI.create(url), String.class);
            JsonNode root;
            try {
                root = objectMapper.readTree(response);
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse ArcGIS response", e);
            }

            if (root.has("error")) {
                throw new RuntimeException("ArcGIS error: " + root.path("error").path("message").asText());
            }

            JsonNode features = root.path("features");
            List<Map<String, Object>> results = new ArrayList<>();
            for (JsonNode f : features) {
                Map<String, Object> item = new LinkedHashMap<>();
                JsonNode attrs = f.path("attributes");
                attrs.fields().forEachRemaining(e -> item.put(e.getKey(), nodeToValue(e.getValue())));
                JsonNode geom = f.path("geometry");
                if (!geom.isMissingNode()) {
                    if (geom.has("x")) item.put("x", geom.get("x").asDouble());
                    if (geom.has("y")) item.put("y", geom.get("y").asDouble());
                }
                results.add(item);
            }
            return results;
        });
    }

    public JsonNode fetchGeoJSON(String serviceUrl, String where) {
        String cacheKey = CacheKeys.arcgisGeojson(serviceUrl);
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) return objectMapper.readTree(cached);
        } catch (Exception ignored) {}

        return circuitBreaker.execute(SERVICE, () -> {
            List<JsonNode> allFeatures = new ArrayList<>();
            int offset = 0;
            int pageSize = 2000;
            boolean hasMore = true;

            while (hasMore) {
                String url = serviceUrl + "/query?f=geojson&where=" + urlEncode(where)
                        + "&outFields=*&returnGeometry=true&outSR=4326"
                        + "&resultOffset=" + offset + "&resultRecordCount=" + pageSize;

                String key = apiKeyManager.getNextKey(SERVICE);
                if (key != null) url += "&token=" + key;

                String response = restTemplate.getForObject(URI.create(url), String.class);
                JsonNode data;
                try {
                    data = objectMapper.readTree(response);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to parse ArcGIS GeoJSON response", e);
                }

                if (data.has("error")) break;

                JsonNode features = data.path("features");
                if (!features.isArray() || features.size() == 0) {
                    hasMore = false;
                } else {
                    for (JsonNode f : features) allFeatures.add(f);
                    offset += features.size();
                    if (features.size() < pageSize) hasMore = false;
                }
            }

            if (allFeatures.isEmpty()) return null;

            // Build GeoJSON FeatureCollection
            Map<String, Object> fc = new LinkedHashMap<>();
            fc.put("type", "FeatureCollection");
            fc.put("features", allFeatures);
            JsonNode result = objectMapper.valueToTree(fc);

            try {
                redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(result),
                        CacheKeys.TTL_ARCGIS_GEOJSON);
            } catch (Exception ignored) {}

            return result;
        });
    }

    // ── Convenience methods matching reference ───────────────

    public List<Map<String, Object>> fetchStations() {
        return cachedQuery(CacheKeys.arcgisStations(), CacheKeys.TTL_ARCGIS_STATIONS,
                () -> queryFeatures(SERVICES.get("hydrostations"),
                        STATION_EXCLUDE + " AND " + BASIN_EXCLUDE, "*"));
    }

    public List<Map<String, Object>> fetchLatestGauges() {
        return cachedQuery(CacheKeys.arcgisLatestGauges(), CacheKeys.TTL_ARCGIS_GAUGES, () -> {
            String where = "(CreationDate BETWEEN CURRENT_TIMESTAMP - 4 AND CURRENT_TIMESTAMP) AND " + GAUGE_EXCLUDE;
            List<Map<String, Object>> raw = queryFeatures(SERVICES.get("gauges"), where, "*");

            // Deduplicate: keep latest per gauge name
            Map<String, Map<String, Object>> latest = new LinkedHashMap<>();
            for (Map<String, Object> r : raw) {
                String gaugeName = String.valueOf(r.getOrDefault("gauge", "")).trim();
                if (gaugeName.isEmpty()) continue;
                Map<String, Object> existing = latest.get(gaugeName);
                if (existing == null || compareDates(r, existing) > 0) {
                    // Add alert classification
                    r.put("alertLevel", classifyAlert(
                            toDouble(r.get("water_level")),
                            toDouble(r.get("alertpull")),
                            toDouble(r.get("minorpull")),
                            toDouble(r.get("majorpull"))));
                    latest.put(gaugeName, r);
                }
            }
            return new ArrayList<>(latest.values());
        });
    }

    public List<Map<String, Object>> fetchGaugeHistory(String gaugeName) {
        return cachedQuery(CacheKeys.arcgisGaugeHistory(gaugeName), CacheKeys.TTL_ARCGIS_GAUGES, () -> {
            String where = "(CreationDate BETWEEN CURRENT_TIMESTAMP - 4 AND CURRENT_TIMESTAMP) AND "
                    + GAUGE_EXCLUDE + " AND (gauge='" + gaugeName + "')";
            return queryFeatures(SERVICES.get("gauges"), where, "*");
        });
    }

    public List<Map<String, Object>> fetchRainfallTop(int limit) {
        return cachedQuery(CacheKeys.arcgisRainfallTop(limit), CacheKeys.TTL_ARCGIS_GAUGES, () -> {
            String url = SERVICES.get("gauges") + "/query?f=json"
                    + "&where=" + urlEncode("(CreationDate BETWEEN CURRENT_TIMESTAMP - 4 AND CURRENT_TIMESTAMP) AND " + GAUGE_EXCLUDE)
                    + "&groupByFieldsForStatistics=gauge"
                    + "&outStatistics=" + urlEncode("[{\"onStatisticField\":\"rain_fall\",\"outStatisticFieldName\":\"SUM_RAIN_FALL\",\"statisticType\":\"sum\"}]")
                    + "&orderByFields=" + urlEncode("SUM_RAIN_FALL DESC")
                    + "&resultRecordCount=" + limit
                    + "&returnGeometry=false";

            String response = restTemplate.getForObject(URI.create(url), String.class);
            JsonNode root;
            try {
                root = objectMapper.readTree(response);
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse ArcGIS rainfall response", e);
            }
            List<Map<String, Object>> results = new ArrayList<>();
            for (JsonNode f : root.path("features")) {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("gauge", f.path("attributes").path("gauge").asText());
                item.put("totalRainfall", f.path("attributes").path("SUM_RAIN_FALL").asDouble(0));
                results.add(item);
            }
            return results;
        });
    }

    public Map<String, Object> fetchAlertSummary() {
        String cacheKey = CacheKeys.arcgisAlertSummary();
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) return objectMapper.readValue(cached, Map.class);
        } catch (Exception ignored) {}

        List<Map<String, Object>> gauges = fetchLatestGauges();

        int normal = 0, alert = 0, minor = 0, major = 0;
        double totalRainfall = 0;
        double highestWaterLevel = 0;
        String highestStation = "";

        for (Map<String, Object> g : gauges) {
            String level = String.valueOf(g.getOrDefault("alertLevel", "normal"));
            switch (level) {
                case "alert" -> alert++;
                case "minor" -> minor++;
                case "major" -> major++;
                default -> normal++;
            }
            Double rf = toDouble(g.get("rain_fall"));
            if (rf != null) totalRainfall += rf;
            Double wl = toDouble(g.get("water_level"));
            if (wl != null && wl > highestWaterLevel) {
                highestWaterLevel = wl;
                highestStation = String.valueOf(g.getOrDefault("gauge", ""));
            }
        }

        Map<String, Object> counts = Map.of("normal", normal, "alert", alert, "minor", minor, "major", major, "total", gauges.size());
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("gauges", gauges);
        result.put("counts", counts);
        result.put("totalRainfall", totalRainfall);
        result.put("highestWaterLevel", highestWaterLevel);
        result.put("highestStation", highestStation);

        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(result), CacheKeys.TTL_ARCGIS_GAUGES);
        } catch (Exception ignored) {}

        return result;
    }

    // ── Alert classification (matching reference) ────────────

    public static String classifyAlert(Double wl, Double alertThreshold, Double minorThreshold, Double majorThreshold) {
        if (wl == null || alertThreshold == null) return "normal";
        if (majorThreshold != null && wl >= majorThreshold) return "major";
        if (minorThreshold != null && wl >= minorThreshold) return "minor";
        if (wl >= alertThreshold) return "alert";
        return "normal";
    }

    // ── Helpers ──────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> cachedQuery(String cacheKey, java.time.Duration ttl,
                                                   java.util.function.Supplier<List<Map<String, Object>>> fetcher) {
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) return objectMapper.readValue(cached, List.class);
        } catch (Exception ignored) {}

        List<Map<String, Object>> result = fetcher.get();

        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(result), ttl);
        } catch (Exception ignored) {}

        return result;
    }

    private int compareDates(Map<String, Object> a, Map<String, Object> b) {
        Object dateA = a.get("CreationDate");
        Object dateB = b.get("CreationDate");
        if (dateA instanceof Number && dateB instanceof Number) {
            return Long.compare(((Number) dateA).longValue(), ((Number) dateB).longValue());
        }
        return 0;
    }

    private Double toDouble(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Number) return ((Number) obj).doubleValue();
        try { return Double.parseDouble(obj.toString()); } catch (Exception e) { return null; }
    }

    private Object nodeToValue(JsonNode node) {
        if (node.isNull()) return null;
        if (node.isNumber()) return node.isFloatingPointNumber() ? node.asDouble() : node.asLong();
        if (node.isBoolean()) return node.asBoolean();
        return node.asText();
    }

    private String urlEncode(String s) {
        try { 
            return java.net.URLEncoder.encode(s, "UTF-8").replace("+", "%20"); 
        } catch (Exception e) { return s; }
    }
}
