package com.sidms.backend.service;

import com.sidms.backend.dto.weather.SpatialUnitSearchResult;
import com.sidms.backend.dto.weather.WeatherResponse;
import com.sidms.backend.entity.SpatialForecastSnapshot;
import com.sidms.backend.entity.SpatialUnit;
import com.sidms.backend.entity.SpatialUnitWeatherNodeMapping;
import com.sidms.backend.entity.WeatherNodeLiveCache;
import com.sidms.backend.entity.enums.SpatialType;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.repository.SpatialForecastSnapshotRepository;
import com.sidms.backend.repository.SpatialUnitRepository;
import com.sidms.backend.repository.SpatialUnitWeatherNodeMappingRepository;
import com.sidms.backend.repository.WeatherNodeLiveCacheRepository;
import com.sidms.backend.util.CacheKeys;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class WeatherService {

    private final SpatialUnitRepository spatialUnitRepository;
    private final SpatialUnitWeatherNodeMappingRepository mappingRepository;
    private final WeatherNodeLiveCacheRepository liveCacheRepository;
    private final SpatialForecastSnapshotRepository spatialForecastSnapshotRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public WeatherService(SpatialUnitRepository spatialUnitRepository,
            SpatialUnitWeatherNodeMappingRepository mappingRepository,
            WeatherNodeLiveCacheRepository liveCacheRepository,
            SpatialForecastSnapshotRepository spatialForecastSnapshotRepository,
            StringRedisTemplate redisTemplate,
            ObjectMapper objectMapper) {
        this.spatialUnitRepository = spatialUnitRepository;
        this.mappingRepository = mappingRepository;
        this.liveCacheRepository = liveCacheRepository;
        this.spatialForecastSnapshotRepository = spatialForecastSnapshotRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    public WeatherResponse getWeatherForSpatialUnit(UUID spatialUnitId) {
        // 1. Check Redis cache
        String cacheKey = "weather:spatial:" + spatialUnitId;
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return objectMapper.readValue(cached, WeatherResponse.class);
            }
        } catch (Exception ignored) {
            // Redis down or parse error — continue with DB
        }

        // 2. Load spatial unit
        SpatialUnit spatialUnit = spatialUnitRepository.findById(spatialUnitId)
                .orElseThrow(() -> new ResourceNotFoundException("Spatial unit not found: " + spatialUnitId));

        // 3. Load IDW mappings
        List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                .findBySpatialUnitIdOrderByRankAsc(spatialUnitId);

        if (mappings.isEmpty()) {
            throw new ResourceNotFoundException("No IDW mappings found. Run setup first.");
        }

        // 4. Load live cache for each weather node
        List<UUID> nodeIds = mappings.stream()
                .map(SpatialUnitWeatherNodeMapping::getWeatherNodeId)
                .collect(Collectors.toList());

        Map<UUID, WeatherNodeLiveCache> cacheMap = liveCacheRepository.findAllById(nodeIds).stream()
                .collect(Collectors.toMap(WeatherNodeLiveCache::getWeatherNodeId, c -> c));

        // 5. Compute IDW weighted averages
        double totalWeight = 0;
        double wTempC = 0, wApparentTempC = 0, wHumidity = 0, wPressure = 0;
        double wPrecip = 0, wPrecipProb = 0, wWindSpeed = 0, wWindGust = 0;
        double wWindDir = 0, wCloudCover = 0, wUvIndex = 0, wCape = 0;
        double wAqi = 0, wPm10 = 0, wPm25 = 0, wVisibility = 0;
        int nodeCount = 0;
        Integer dominantWeatherCode = null;
        Integer dominantIsDay = null;
        LocalDateTime latestFetch = null;

        // Track per-field weight sums for fields that may be null
        double swTempC = 0, swApparentTempC = 0, swHumidity = 0, swPressure = 0;
        double swPrecip = 0, swPrecipProb = 0, swWindSpeed = 0, swWindGust = 0;
        double swWindDir = 0, swCloudCover = 0, swUvIndex = 0, swCape = 0;
        double swAqi = 0, swPm10 = 0, swPm25 = 0, swVisibility = 0;

        for (SpatialUnitWeatherNodeMapping mapping : mappings) {
            WeatherNodeLiveCache cache = cacheMap.get(mapping.getWeatherNodeId());
            if (cache == null)
                continue;

            double w = mapping.getIdwWeight();
            nodeCount++;

            if (cache.getTempC() != null) {
                wTempC += cache.getTempC() * w;
                swTempC += w;
            }
            if (cache.getApparentTempC() != null) {
                wApparentTempC += cache.getApparentTempC() * w;
                swApparentTempC += w;
            }
            if (cache.getHumidityPct() != null) {
                wHumidity += cache.getHumidityPct() * w;
                swHumidity += w;
            }
            if (cache.getPressureHpa() != null) {
                wPressure += cache.getPressureHpa() * w;
                swPressure += w;
            }
            if (cache.getPrecipitationMm() != null) {
                wPrecip += cache.getPrecipitationMm() * w;
                swPrecip += w;
            }
            if (cache.getPrecipProbability() != null) {
                wPrecipProb += cache.getPrecipProbability() * w;
                swPrecipProb += w;
            }
            if (cache.getWindSpeedKmh() != null) {
                wWindSpeed += cache.getWindSpeedKmh() * w;
                swWindSpeed += w;
            }
            if (cache.getWindGustKmh() != null) {
                wWindGust += cache.getWindGustKmh() * w;
                swWindGust += w;
            }
            if (cache.getWindDirectionDeg() != null) {
                wWindDir += cache.getWindDirectionDeg() * w;
                swWindDir += w;
            }
            if (cache.getCloudCoverPct() != null) {
                wCloudCover += cache.getCloudCoverPct() * w;
                swCloudCover += w;
            }
            if (cache.getUvIndex() != null) {
                wUvIndex += cache.getUvIndex() * w;
                swUvIndex += w;
            }
            if (cache.getCapeJkg() != null) {
                wCape += cache.getCapeJkg() * w;
                swCape += w;
            }
            if (cache.getUsAqi() != null) {
                wAqi += cache.getUsAqi() * w;
                swAqi += w;
            }
            if (cache.getPm10() != null) {
                wPm10 += cache.getPm10() * w;
                swPm10 += w;
            }
            if (cache.getPm25() != null) {
                wPm25 += cache.getPm25() * w;
                swPm25 += w;
            }
            if (cache.getVisibilityM() != null) {
                wVisibility += cache.getVisibilityM() * w;
                swVisibility += w;
            }

            // Use weather code and isDay from primary (rank 1) node
            if (mapping.getRank() == 1 && cache.getWeatherCode() != null) {
                dominantWeatherCode = cache.getWeatherCode();
            }

            if (cache.getFetchedAt() != null) {
                if (latestFetch == null || cache.getFetchedAt().isAfter(latestFetch)) {
                    latestFetch = cache.getFetchedAt();
                }
            }
        }

        // Determine data quality
        String dataQuality;
        if (nodeCount == mappings.size()) {
            dataQuality = "LIVE";
        } else if (nodeCount > 0) {
            dataQuality = "ESTIMATED";
        } else {
            dataQuality = "CACHED";
        }

        // 6. Compute dew point via Magnus formula (if temp + humidity available)
        Double dewPoint = null;
        Double finalTemp = safeDivide(wTempC, swTempC);
        Double finalHumidity = safeDivide(wHumidity, swHumidity);
        if (finalTemp != null && finalHumidity != null && finalHumidity > 0) {
            double alpha = ((17.625 * finalTemp) / (243.04 + finalTemp)) + Math.log(finalHumidity / 100.0);
            dewPoint = Math.round((243.04 * alpha) / (17.625 - alpha) * 100.0) / 100.0;
        }

        // 7. Extract sunrise/sunset/is_day from rank 1 open-meteo node's raw payload
        String sunrise = null;
        String sunset = null;
        try {
            if (!mappings.isEmpty()) {
                UUID rank1NodeId = mappings.get(0).getWeatherNodeId();
                WeatherNodeLiveCache rank1Cache = cacheMap.get(rank1NodeId);
                if (rank1Cache != null && rank1Cache.getRawPayload() != null
                        && "open-meteo".equals(rank1Cache.getSourceApi())) {
                    JsonNode payload = objectMapper.readTree(rank1Cache.getRawPayload());
                    JsonNode daily = payload.get("daily");
                    JsonNode current = payload.get("current");
                    if (daily != null) {
                        JsonNode sunriseArr = daily.get("sunrise");
                        JsonNode sunsetArr = daily.get("sunset");
                        if (sunriseArr != null && sunriseArr.isArray() && sunriseArr.size() > 0) {
                            sunrise = sunriseArr.get(0).asText();
                        }
                        if (sunsetArr != null && sunsetArr.isArray() && sunsetArr.size() > 0) {
                            sunset = sunsetArr.get(0).asText();
                        }
                    }
                    if (current != null && dominantIsDay == null) {
                        JsonNode isDayNode = current.get("is_day");
                        if (isDayNode != null)
                            dominantIsDay = isDayNode.asInt();
                    }
                }
            }
        } catch (Exception e) {
            // Non-critical — continue without solar data
        }

        // 8. Build response
        WeatherResponse response = WeatherResponse.builder()
                .spatialUnitId(spatialUnit.getId().toString())
                .spatialUnitName(spatialUnit.getName())
                .spatialUnitType(spatialUnit.getType().name())
                .tempC(finalTemp)
                .apparentTempC(safeDivide(wApparentTempC, swApparentTempC))
                .dewPointC(dewPoint)
                .humidityPct(finalHumidity)
                .pressureHpa(safeDivide(wPressure, swPressure))
                .visibilityM(safeDivide(wVisibility, swVisibility))
                .precipitationMm(safeDivide(wPrecip, swPrecip))
                .precipProbability(safeDivide(wPrecipProb, swPrecipProb))
                .windSpeedKmh(safeDivide(wWindSpeed, swWindSpeed))
                .windGustKmh(safeDivide(wWindGust, swWindGust))
                .windDirectionDeg(safeDivide(wWindDir, swWindDir))
                .cloudCoverPct(safeDivide(wCloudCover, swCloudCover))
                .uvIndex(safeDivide(wUvIndex, swUvIndex))
                .capeJkg(safeDivide(wCape, swCape))
                .weatherCode(dominantWeatherCode)
                .isDay(dominantIsDay)
                .usAqi(safeDivide(wAqi, swAqi))
                .pm10(safeDivide(wPm10, swPm10))
                .pm25(safeDivide(wPm25, swPm25))
                .sunrise(sunrise)
                .sunset(sunset)
                .fetchedAt(latestFetch)
                .dataQuality(dataQuality)
                .build();

        // 9. Cache in Redis for 10 minutes
        try {
            redisTemplate.opsForValue().set(cacheKey,
                    objectMapper.writeValueAsString(response),
                    Duration.ofMinutes(10));
        } catch (Exception ignored) {
            // Redis down — still return response
        }

        return response;
    }

    public List<SpatialUnitSearchResult> searchSpatialUnits(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        String q = query.trim();

        // Check Redis cache
        String cacheKey = "search:locations:" + q.toLowerCase();
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return objectMapper.readValue(cached,
                        objectMapper.getTypeFactory().constructCollectionType(List.class,
                                SpatialUnitSearchResult.class));
            }
        } catch (Exception ignored) {
        }

        // Query DB
        List<SpatialUnit> units = spatialUnitRepository
                .findByNameContainingIgnoreCaseOrNameSinhalaContainingIgnoreCaseOrNameTamilContainingIgnoreCase(q, q,
                        q);

        List<SpatialUnitSearchResult> results = units.stream()
                .limit(20)
                .map(su -> {
                    String parentName = null;
                    if (su.getParentId() != null) {
                        parentName = spatialUnitRepository.findById(su.getParentId())
                                .map(SpatialUnit::getName)
                                .orElse(null);
                    }
                    return SpatialUnitSearchResult.builder()
                            .id(su.getId())
                            .pcode(su.getPcode())
                            .name(su.getName())
                            .type(su.getType().name())
                            .parentName(parentName)
                            .lat(su.getLat())
                            .lng(su.getLng())
                            .build();
                })
                .collect(Collectors.toList());

        // Cache for 60 minutes if not empty
        if (!results.isEmpty()) {
            try {
                redisTemplate.opsForValue().set(cacheKey,
                        objectMapper.writeValueAsString(results),
                        Duration.ofMinutes(60));
            } catch (Exception ignored) {
            }
        }

        return results;
    }

    public WeatherResponse getNearestSpatialUnit(Double lat, Double lng) {
        // Find nearest GN_DIVISION
        List<SpatialUnit> gnDivisions = spatialUnitRepository.findByType(SpatialType.GN_DIVISION);

        SpatialUnit nearest = gnDivisions.stream()
                .filter(su -> su.getLat() != null && su.getLng() != null)
                .min(Comparator.comparingDouble(
                        su -> Math.sqrt(Math.pow(su.getLat() - lat, 2) + Math.pow(su.getLng() - lng, 2))))
                .orElseThrow(() -> new ResourceNotFoundException("No GN divisions found in the system"));

        return getWeatherForSpatialUnit(nearest.getId());
    }

    public List<WeatherResponse> getAllTrackedWeather() {
        List<UUID> spatialUnitIds = mappingRepository.findAll().stream()
                .map(SpatialUnitWeatherNodeMapping::getSpatialUnitId)
                .distinct()
                .collect(Collectors.toList());

        return spatialUnitIds.stream()
                .map(id -> {
                    try {
                        return getWeatherForSpatialUnit(id);
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getForecastWeather(Double lat, Double lng) {
        // Find nearest city for the context
        List<SpatialUnit> gnDivisions = spatialUnitRepository.findByType(SpatialType.GN_DIVISION);
        SpatialUnit nearest = gnDivisions.stream()
                .filter(su -> su.getLat() != null && su.getLng() != null)
                .min(Comparator.comparingDouble(
                        su -> Math.sqrt(Math.pow(su.getLat() - lat, 2) + Math.pow(su.getLng() - lng, 2))))
                .orElse(null);

        Map<String, Object> result = new HashMap<>();
        if (nearest != null) {
            result.put("spatialUnitId", nearest.getId().toString());
            result.put("spatialUnitName", nearest.getName());
            result.put("lat", nearest.getLat());
            result.put("lng", nearest.getLng());
        } else {
            result.put("lat", lat);
            result.put("lng", lng);
        }

        JsonNode data = null;
        if (nearest != null) {
            String forecastCacheKey = CacheKeys.weatherForecastSpatial(nearest.getId().toString());
            try {
                String cachedForecast = redisTemplate.opsForValue().get(forecastCacheKey);
                if (cachedForecast != null && !cachedForecast.isBlank()) {
                    data = objectMapper.readTree(cachedForecast);
                }
            } catch (Exception ignored) {
            }

            List<SpatialUnitWeatherNodeMapping> mappings = mappingRepository
                    .findBySpatialUnitIdOrderByRankAsc(nearest.getId());
            if (data == null && !mappings.isEmpty()) {
                UUID rank1NodeId = mappings.get(0).getWeatherNodeId();
                WeatherNodeLiveCache cache = liveCacheRepository.findById(rank1NodeId).orElse(null);
                if (cache != null && cache.getRawPayload() != null && "open-meteo".equals(cache.getSourceApi())) {
                    try {
                        data = objectMapper.readTree(cache.getRawPayload());
                    } catch (Exception ignored) {
                    }
                }
            }

            if (data == null) {
                try {
                    SpatialForecastSnapshot snapshot = spatialForecastSnapshotRepository
                            .findBySpatialUnitId(nearest.getId())
                            .orElse(null);
                    if (snapshot != null && snapshot.getPayload() != null && !snapshot.getPayload().isBlank()) {
                        data = objectMapper.readTree(snapshot.getPayload());
                        redisTemplate.opsForValue().set(
                                forecastCacheKey,
                                snapshot.getPayload(),
                                CacheKeys.TTL_FORECAST_SHORT);
                    }
                } catch (Exception ignored) {
                }
            }
        }

        if (data != null) {
            result.put("daily", data.get("daily"));
            result.put("hourly", data.get("hourly"));
            result.put("current", data.get("current"));
        } else {
            result.put("daily", null);
            result.put("hourly", null);
            result.put("current", null);
        }

        return result;
    }

    // ── Helpers ──────────────────────────────────────────────

    private Double safeDivide(double numerator, double denominator) {
        if (denominator == 0)
            return null;
        return Math.round(numerator / denominator * 100.0) / 100.0;
    }
}
