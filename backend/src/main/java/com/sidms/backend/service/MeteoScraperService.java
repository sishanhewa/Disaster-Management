package com.sidms.backend.service;

import com.sidms.backend.client.MeteoSLClient;
import com.sidms.backend.dto.meteo.MetBulletinDto;
import com.sidms.backend.entity.MetBulletin;
import com.sidms.backend.entity.SpatialUnit;
import com.sidms.backend.repository.MetBulletinRepository;
import com.sidms.backend.repository.SpatialUnitRepository;
import com.sidms.backend.util.CacheKeys;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class MeteoScraperService {

    private static final Logger logger = LoggerFactory.getLogger(MeteoScraperService.class);
    private static final String METEO_URL = "https://meteo.gov.lk/content.json";
    private static final String CACHE_KEY = "meteo:content";

    private final MetBulletinRepository metBulletinRepository;
    private final SpatialUnitRepository spatialUnitRepository;
    private final MeteoSLClient meteoSLClient;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final RedisTemplate<String, Object> redisTemplate;

    public MeteoScraperService(MetBulletinRepository metBulletinRepository,
                               SpatialUnitRepository spatialUnitRepository,
                               MeteoSLClient meteoSLClient,
                               RestTemplate restTemplate,
                               ObjectMapper objectMapper,
                               RedisTemplate<String, Object> redisTemplate) {
        this.metBulletinRepository = metBulletinRepository;
        this.spatialUnitRepository = spatialUnitRepository;
        this.meteoSLClient = meteoSLClient;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.redisTemplate = redisTemplate;
    }

    @Transactional
    public List<MetBulletinDto> scrapeMeteoContent() {
        List<MetBulletinDto> dtos = new ArrayList<>();
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(METEO_URL, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNodes = objectMapper.readTree(response.getBody());
                if (rootNodes.isArray()) {
                    for (JsonNode node : rootNodes) {
                        String district = node.has("district") ? node.get("district").asText() : "";
                        String text = node.has("text") ? node.get("text").asText() : "";
                        String dateStr = node.has("date") ? node.get("date").asText() : "";

                        LocalDate date = null;
                        try {
                            if (!dateStr.isEmpty()) {
                                date = LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE);
                            }
                        } catch (DateTimeParseException e) {
                            logger.warn("Failed to parse date: {}", dateStr);
                        }

                        UUID spatialUnitId = null;
                        if (!district.isEmpty()) {
                            Optional<SpatialUnit> spatialUnitOpts = spatialUnitRepository.findByNameIgnoreCase(district).stream().findFirst();
                            if (spatialUnitOpts.isPresent()) {
                                spatialUnitId = spatialUnitOpts.get().getId();
                            }
                        }

                        MetBulletin bulletin = MetBulletin.builder()
                                .spatialUnitId(spatialUnitId)
                                .bulletinText(text)
                                .bulletinDate(date)
                                .scrapedAt(LocalDateTime.now())
                                .build();

                        bulletin = metBulletinRepository.save(bulletin);
                        dtos.add(toDto(bulletin));
                    }
                }
            }
            redisTemplate.opsForValue().set(CACHE_KEY, dtos, 15, TimeUnit.MINUTES);
            return dtos;
        } catch (Exception e) {
            logger.error("Error scraping meteo content", e);
            throw new RuntimeException("Failed to scrape meteo content", e);
        }
    }

    @SuppressWarnings("unchecked")
    public List<MetBulletinDto> getLatestBulletins() {
        Object cachedObj = redisTemplate.opsForValue().get(CACHE_KEY);
        if (cachedObj instanceof List) {
            return (List<MetBulletinDto>) cachedObj;
        }

        return metBulletinRepository.findAllByOrderByScrapedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ── Delegated to MeteoSLClient (NEW) ─────────────────────

    public Map<String, Object> getPublicForecast() {
        return meteoSLClient.getPublicForecast();
    }

    public Map<String, Object> getMarineForecast() {
        return meteoSLClient.getMarineForecast();
    }

    public Map<String, Object> getFleetForecast() {
        return meteoSLClient.getFleetForecast();
    }

    public Map<String, Object> getAdvisories() {
        return meteoSLClient.getAdvisories();
    }

    public Map<String, Object> getWeatherGraphics() {
        return meteoSLClient.getWeatherGraphics();
    }

    public Map<String, Object> getPdfDirectory() {
        return meteoSLClient.getPdfDirectory();
    }

    public Map<String, Object> getThreeHourlyData() {
        return meteoSLClient.getThreeHourlyData();
    }

    // ── Private helpers ──────────────────────────────────────

    private MetBulletinDto toDto(MetBulletin bulletin) {
        String spatialUnitName = "Unknown";
        if (bulletin.getSpatialUnitId() != null) {
            spatialUnitName = spatialUnitRepository.findById(bulletin.getSpatialUnitId())
                    .map(SpatialUnit::getName)
                    .orElse("Unknown");
        }

        return MetBulletinDto.builder()
                .id(bulletin.getId())
                .spatialUnitName(spatialUnitName)
                .bulletinText(bulletin.getBulletinText())
                .bulletinDate(bulletin.getBulletinDate())
                .scrapedAt(bulletin.getScrapedAt())
                .build();
    }
}
