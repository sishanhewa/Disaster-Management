package com.sidms.backend.client;

import com.sidms.backend.util.CacheKeys;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.net.URI;

/**
 * Client for MeteoSL (meteo.gov.lk).
 * Parses content.json for forecasts, advisories, graphics, PDFs, and 3-hourly data.
 */
@Component
@Slf4j
public class MeteoSLClient {

    private static final String BASE_URL = "https://meteo.gov.lk";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate redisTemplate;

    public MeteoSLClient(RestTemplate restTemplate, ObjectMapper objectMapper,
                         StringRedisTemplate redisTemplate) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
    }

    // ── Core: fetch content.json ─────────────────────────────

    public JsonNode fetchContentJson() {
        return cachedFetch(CacheKeys.meteoContent(), CacheKeys.TTL_METEO_CONTENT, () -> {
            String url = BASE_URL + "/content.json?t=" + System.currentTimeMillis();
            String response = restTemplate.getForObject(URI.create(url), String.class);
            try {
                return objectMapper.readTree(response);
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse MeteoSL content.json", e);
            }
        });
    }

    // ── Public weather forecast (trilingual) ─────────────────

    public Map<String, Object> getPublicForecast() {
        return cachedMap(CacheKeys.meteoForecast(), CacheKeys.TTL_METEO_CONTENT, () -> {
            JsonNode content = fetchContentJson();
            String raw = content.path("public_weather_forecast").asText("");
            Map<String, String> trilingual = splitTrilingualText(raw);

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("raw", raw);
            result.putAll(trilingual);
            result.put("fetchedAt", new Date().toInstant().toString());
            return result;
        });
    }

    // ── Marine forecast ──────────────────────────────────────

    public Map<String, Object> getMarineForecast() {
        return cachedMap(CacheKeys.meteoMarine(), CacheKeys.TTL_METEO_CONTENT, () -> {
            JsonNode content = fetchContentJson();
            String raw = content.path("sea_weather_forecast").asText("");
            Map<String, String> trilingual = splitTrilingualText(raw);

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("raw", raw);
            result.putAll(trilingual);
            result.put("fetchedAt", new Date().toInstant().toString());
            return result;
        });
    }

    // ── Fleet/shipping forecast ──────────────────────────────

    public Map<String, Object> getFleetForecast() {
        return cachedMap(CacheKeys.meteoFleet(), CacheKeys.TTL_METEO_CONTENT, () -> {
            JsonNode content = fetchContentJson();
            String raw = content.path("fleet_shipping_forecast").asText("");

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("raw", raw);
            result.put("fetchedAt", new Date().toInstant().toString());
            return result;
        });
    }

    // ── Severe weather advisories ────────────────────────────

    public Map<String, Object> getAdvisories() {
        return cachedMap(CacheKeys.meteoAdvisories(), CacheKeys.TTL_METEO_CONTENT, () -> {
            JsonNode content = fetchContentJson();
            JsonNode adv = content.path("severe_weather_advisory");

            Map<String, String[]> typeMap = new LinkedHashMap<>();
            typeMap.put("tsunami_pdf", new String[]{"tsunami", "Tsunami Advisory", "critical"});
            typeMap.put("land_pdf", new String[]{"land", "Land Advisory", "high"});
            typeMap.put("lighting_pdf", new String[]{"lightning", "Lightning Advisory", "medium"});
            typeMap.put("sea_pdf", new String[]{"sea", "Sea Advisory", "medium"});
            typeMap.put("heat_pdf", new String[]{"heat", "Heat Advisory", "medium"});

            List<Map<String, Object>> advisories = new ArrayList<>();
            int activeCount = 0;

            for (Map.Entry<String, String[]> entry : typeMap.entrySet()) {
                String pdfPath = adv.path(entry.getKey()).asText(null);
                boolean active = pdfPath != null && !pdfPath.isBlank();
                if (active) activeCount++;

                Map<String, Object> advisory = new LinkedHashMap<>();
                advisory.put("type", entry.getValue()[0]);
                advisory.put("label", entry.getValue()[1]);
                advisory.put("severity", entry.getValue()[2]);
                advisory.put("active", active);
                advisory.put("pdfUrl", active ? BASE_URL + "/" + pdfPath : null);
                advisories.add(advisory);
            }

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("advisories", advisories);
            result.put("activeCount", activeCount);
            result.put("fetchedAt", new Date().toInstant().toString());
            return result;
        });
    }

    // ── Weather graphics (GIF animations) ────────────────────

    public Map<String, Object> getWeatherGraphics() {
        return cachedMap(CacheKeys.meteoGraphics(), CacheKeys.TTL_METEO_CONTENT, () -> {
            JsonNode content = fetchContentJson();
            JsonNode gfx = content.path("weather_graphics");

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("analysis", resolveGifs(gfx.path("analysis")));
            result.put("forecast", resolveGifs(gfx.path("forecast")));
            result.put("marine", resolveGifs(gfx.path("marine")));
            result.put("aviation", resolveGifs(gfx.path("aviation")));
            result.put("fetchedAt", new Date().toInstant().toString());
            return result;
        });
    }

    // ── PDF directory ────────────────────────────────────────

    public Map<String, Object> getPdfDirectory() {
        JsonNode content = fetchContentJson();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("cityForecast", resolvePdf(content, "city_weather_forecast", "pdf"));
        result.put("nineDayForecast", resolvePdf(content, "nine_day_forecast_link", "pdf"));
        result.put("multidayBoats", resolvePdf(content, "multiday_boats", "pdf"));
        result.put("fishermanBulletin", resolvePdf(content, "fisherman_bulletin", "fisherman"));

        // Weather data PDFs
        JsonNode wd = content.path("weather_data");
        Map<String, Object> weatherData = new LinkedHashMap<>();
        weatherData.put("newsletter", resolveUrl(wd.path("newsLetter_pdf").asText(null)));
        weatherData.put("agromet", resolveUrl(wd.path("agromet_pdf").asText(null)));
        weatherData.put("drought", resolveUrl(wd.path("drought_pdf").asText(null)));
        weatherData.put("weekly", resolveUrl(wd.path("weekly_pdf").asText(null)));
        weatherData.put("national", resolveUrl(wd.path("national_pdf").asText(null)));
        weatherData.put("twentyfourHour", resolveUrl(wd.path("twentyfour_pdf").asText(null)));
        result.put("weatherData", weatherData);

        // Seasonal forecasts
        JsonNode sf = content.path("seasonal_forecast");
        Map<String, Object> seasonal = new LinkedHashMap<>();
        seasonal.put("currentCondition", resolveUrl(sf.path("currentCondition_pdf").asText(null)));
        seasonal.put("consensus", resolveUrl(sf.path("consensus_pdf").asText(null)));
        seasonal.put("anomaly", resolveUrl(sf.path("anomaly_pdf").asText(null)));
        seasonal.put("rainfall", resolveUrl(sf.path("rainfall_pdf").asText(null)));
        seasonal.put("temperature", resolveUrl(sf.path("temperature_pdf").asText(null)));
        result.put("seasonal", seasonal);

        // Voice forecasts
        Map<String, Object> voice = new LinkedHashMap<>();
        voice.put("english", resolveUrl(content.path("voice_forecast_en").asText(null)));
        voice.put("sinhala", resolveUrl(content.path("voice_forecast_si").asText(null)));
        voice.put("tamil", resolveUrl(content.path("voice_forecast_ta").asText(null)));
        result.put("voiceForecasts", voice);

        result.put("fetchedAt", new Date().toInstant().toString());
        return result;
    }

    // ── 3-hourly observation data ────────────────────────────
    // Note: Apache POI would be needed for full xlsx parsing.
    // For now, return metadata pointing to the download URL.

    public Map<String, Object> getThreeHourlyData() {
        return cachedMap(CacheKeys.meteoThreeHourly(), CacheKeys.TTL_METEO_EXCEL, () -> {
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("downloadUrl", BASE_URL + "/excels/3hourly.xlsx");
            result.put("description", "3-hourly observation data from MeteoSL stations");
            result.put("fetchedAt", new Date().toInstant().toString());
            return result;
        });
    }

    // ── Trilingual text splitting ────────────────────────────

    public static Map<String, String> splitTrilingualText(String raw) {
        String text = raw.replace("\\r\\n", "\n").replace("\r\n", "\n");

        String english = text.trim();
        String sinhala = "";
        String tamil = "";

        // Try to detect English section by "WEATHER FORECAST"
        Pattern enPattern = Pattern.compile("(WEATHER FORECAST[\\s\\S]*?)(?=\\n\\n\\d{4}\\s|$)", Pattern.CASE_INSENSITIVE);
        Matcher enMatch = enPattern.matcher(text);

        if (enMatch.find()) {
            int enStart = text.indexOf(enMatch.group(1));
            sinhala = text.substring(0, enStart).trim();
            english = enMatch.group(1).trim();

            // Tamil detection (Tamil Unicode block)
            Pattern taPattern = Pattern.compile("([\\u0B80-\\u0BFF][\\s\\S]*)$");
            Matcher taMatch = taPattern.matcher(text);
            if (taMatch.find()) {
                int taStart = text.indexOf(taMatch.group(1));
                english = text.substring(enStart, taStart).trim();
                tamil = taMatch.group(1).trim();
            }
        }

        Map<String, String> segments = new LinkedHashMap<>();
        segments.put("sinhala", sinhala);
        segments.put("english", english);
        segments.put("tamil", tamil);
        return segments;
    }

    // ── Helpers ──────────────────────────────────────────────

    private List<Map<String, Object>> resolveGifs(JsonNode section) {
        List<Map<String, Object>> gifs = new ArrayList<>();
        if (section == null || section.isMissingNode()) return gifs;

        section.fields().forEachRemaining(e -> {
            JsonNode g = e.getValue();
            if (g.has("url")) {
                Map<String, Object> gif = new LinkedHashMap<>();
                gif.put("title", g.path("title").asText(""));
                gif.put("url", BASE_URL + "/" + g.path("url").asText());
                gif.put("description", g.path("description").asText("")
                        .replace("\\r\\n", "\n").trim());
                gifs.add(gif);
            }
        });
        return gifs;
    }

    private String resolvePdf(JsonNode content, String section, String field) {
        String path = content.path(section).path(field).asText(null);
        return resolveUrl(path);
    }

    private String resolveUrl(String path) {
        if (path == null || path.isBlank()) return null;
        return BASE_URL + "/" + path;
    }

    private JsonNode cachedFetch(String cacheKey, java.time.Duration ttl,
                                 java.util.function.Supplier<JsonNode> fetcher) {
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) return objectMapper.readTree(cached);
        } catch (Exception ignored) {}

        JsonNode data = fetcher.get();

        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(data), ttl);
        } catch (Exception ignored) {}

        return data;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> cachedMap(String cacheKey, java.time.Duration ttl,
                                           java.util.function.Supplier<Map<String, Object>> fetcher) {
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) return objectMapper.readValue(cached, Map.class);
        } catch (Exception ignored) {}

        Map<String, Object> data = fetcher.get();

        try {
            redisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(data), ttl);
        } catch (Exception ignored) {}

        return data;
    }
}
