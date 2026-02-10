package com.sidms.backend.service;

import com.sidms.backend.entity.SpatialUnit;
import com.sidms.backend.entity.enums.SpatialType;
import com.sidms.backend.repository.SpatialUnitRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class SpatialImportService {

    private final SpatialUnitRepository spatialUnitRepository;
    private final ObjectMapper objectMapper;
    private final StringRedisTemplate redisTemplate;

    private static final int BATCH_SIZE = 500;

    // ──────────────────────────────────────────────
    // Public API
    // ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public boolean isAlreadyImported() {
        return spatialUnitRepository.count() > 0;
    }

    @Transactional(readOnly = true)
    public Map<String, Long> getImportStatus() {
        Map<String, Long> status = new HashMap<>();
        for (SpatialType type : SpatialType.values()) {
            status.put(type.name(), spatialUnitRepository.countByType(type));
        }
        status.put("TOTAL", spatialUnitRepository.count());
        return status;
    }

    @Transactional
    public void importAll() {
        if (isAlreadyImported()) {
            log.info("Spatial units already imported – skipping.");
            return;
        }

        log.info("Starting spatial unit import");
        long startTime = System.currentTimeMillis();

        // Import in order: parents before children
        importLevel(SpatialType.COUNTRY,      "geodata/lka_admin0.geojson",
                "adm0_pcode", "adm0_name", "adm0_name1", "adm0_name2", null);
        importLevel(SpatialType.PROVINCE,     "geodata/lka_admin1.geojson",
                "adm1_pcode", "adm1_name", "adm1_name1", "adm1_name2", "adm0_pcode");
        importLevel(SpatialType.DISTRICT,     "geodata/lka_admin2.geojson",
                "adm2_pcode", "adm2_name", "adm2_name1", "adm2_name2", "adm1_pcode");
        importLevel(SpatialType.DS_DIVISION,  "geodata/lka_admin3.geojson",
                "adm3_pcode", "adm3_name", "adm3_name1", "adm3_name2", "adm2_pcode");
        importLevel(SpatialType.GN_DIVISION,  "geodata/lka_admin4.geojson",
                "adm4_pcode", "adm4_name", "adm4_name1", "adm4_name2", "adm3_pcode");

        long elapsed = System.currentTimeMillis() - startTime;
        log.info("Spatial unit import completed in {} ms", elapsed);

        // Evict search caches
        try {
            java.util.Set<String> keys = redisTemplate.keys("search:locations:*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
            }
        } catch (Exception ignored) {}

        // Log totals per type
        Map<String, Long> status = getImportStatus();
        status.forEach((type, count) -> log.info("  {} → {}", type, count));
    }

    // ──────────────────────────────────────────────
    // Level importer
    // ──────────────────────────────────────────────

    private void importLevel(SpatialType type, String classpathFile,
                             String pcodeField, String nameField,
                             String nameSiField, String nameTaField,
                             String parentPcodeField) {
        try {
            log.info("Importing {} from {}", type, classpathFile);
            ClassPathResource resource = new ClassPathResource(classpathFile);

            try (InputStream is = resource.getInputStream()) {
                JsonNode root = objectMapper.readTree(is);
                JsonNode features = root.path("features");

                if (!features.isArray()) {
                    log.warn("GeoJSON {} has no features array – skipping", classpathFile);
                    return;
                }

                List<SpatialUnit> batch = new ArrayList<>(BATCH_SIZE);
                int count = 0;

                for (JsonNode feature : features) {
                    JsonNode props = feature.path("properties");
                    if (props.isMissingNode()) continue;

                    String pcode = getStr(props, pcodeField);
                    if (pcode == null || pcode.isBlank()) continue;

                    String name = getStr(props, nameField);
                    String nameSi = getStr(props, nameSiField);
                    String nameTa = getStr(props, nameTaField);
                    Double lat = getDbl(props, "center_lat");
                    Double lng = getDbl(props, "center_lon");

                    // Resolve parent from the GeoJSON parent pcode property
                    UUID parentId = null;
                    if (parentPcodeField != null) {
                        String parentPcode = getStr(props, parentPcodeField);
                        if (parentPcode != null && !parentPcode.isBlank()) {
                            parentId = spatialUnitRepository.findByPcode(parentPcode)
                                    .map(SpatialUnit::getId)
                                    .orElse(null);
                            if (parentId == null) {
                                log.warn("Parent pcode {} not found for {} {}", parentPcode, type, pcode);
                            }
                        }
                    }

                    SpatialUnit unit = SpatialUnit.builder()
                            .pcode(pcode)
                            .name(name != null ? name : pcode)
                            .nameSinhala(nameSi)
                            .nameTamil(nameTa)
                            .type(type)
                            .lat(lat != null ? lat : 0.0)
                            .lng(lng != null ? lng : 0.0)
                            .parentId(parentId)
                            .isActive(true)
                            .isTracked(true)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();

                    batch.add(unit);
                    count++;

                    if (batch.size() >= BATCH_SIZE) {
                        spatialUnitRepository.saveAll(batch);
                        spatialUnitRepository.flush();
                        batch.clear();
                    }

                    if (count % 1000 == 0) {
                        log.info("  {} → {} records imported...", type, count);
                    }
                }

                if (!batch.isEmpty()) {
                    spatialUnitRepository.saveAll(batch);
                    spatialUnitRepository.flush();
                }

                log.info("Completed {} – {} records", type, count);
            }
        } catch (Exception e) {
            log.error("Failed to import {} from {}: {}", type, classpathFile, e.getMessage());
            throw new RuntimeException("Spatial import failed for " + type, e);
        }
    }

    // ──────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────

    private String getStr(JsonNode props, String field) {
        JsonNode node = props.path(field);
        return (node.isMissingNode() || node.isNull()) ? null : node.asText();
    }

    private Double getDbl(JsonNode props, String field) {
        JsonNode node = props.path(field);
        return (node.isMissingNode() || node.isNull()) ? null : node.asDouble();
    }
}
