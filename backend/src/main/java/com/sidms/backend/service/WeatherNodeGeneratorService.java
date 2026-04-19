package com.sidms.backend.service;

import com.sidms.backend.entity.WeatherNode;
import com.sidms.backend.entity.enums.WeatherNodeDensity;
import com.sidms.backend.repository.WeatherNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class WeatherNodeGeneratorService {

    private final WeatherNodeRepository weatherNodeRepository;

    // Sri Lanka bounding box
    private static final double LAT_MIN = 5.92;
    private static final double LAT_MAX = 9.83;
    private static final double LNG_MIN = 79.65;
    private static final double LNG_MAX = 81.87;
    private static final double GRID_STEP = 0.09;

    // Approximate Sri Lanka coastline polygon (lat, lng pairs)
    private static final double[][] SL_POLYGON = {
            {5.92, 80.0},  {6.0, 79.8},   {6.5, 79.7},
            {7.0, 79.65},  {7.5, 79.7},   {8.0, 79.75},
            {8.5, 79.8},   {9.0, 80.0},   {9.5, 80.3},
            {9.83, 80.5},  {9.7, 81.0},   {9.5, 81.5},
            {9.0, 81.87},  {8.5, 81.7},   {8.0, 81.5},
            {7.5, 81.3},   {7.0, 81.0},   {6.5, 80.8},
            {6.0, 80.5},   {5.92, 80.0}
    };

    // ──────────────────────────────────────────────
    // Public API
    // ──────────────────────────────────────────────

    @Transactional(readOnly = true)
    public boolean isAlreadyGenerated() {
        return weatherNodeRepository.count() > 0;
    }

    @Transactional
    public int generateNodes() {
        if (isAlreadyGenerated()) {
            log.info("Weather nodes already generated – skipping.");
            return 0;
        }

        log.info("Generating weather nodes");
        long startTime = System.currentTimeMillis();

        List<WeatherNode> nodes = new ArrayList<>();
        int latIndex = 0;

        for (double lat = LAT_MIN; lat <= LAT_MAX; lat += GRID_STEP) {
            int lngIndex = 0;
            for (double lng = LNG_MIN; lng <= LNG_MAX; lng += GRID_STEP) {
                if (isInsideSriLanka(lat, lng)) {
                    boolean isCoastal = lng < 79.9 || lng > 81.5 || lat < 6.1 || lat > 9.7;
                    boolean isMountain = lat >= 6.5 && lat <= 7.5 && lng >= 80.5 && lng <= 81.0;
                    WeatherNodeDensity density = isMountain ? WeatherNodeDensity.DENSE : WeatherNodeDensity.STANDARD;

                    WeatherNode node = WeatherNode.builder()
                            .code("WN-" + latIndex + "-" + lngIndex)
                            .gridKey(String.format("%.2f_%.2f", lat, lng))
                            .lat(Math.round(lat * 100.0) / 100.0)
                            .lng(Math.round(lng * 100.0) / 100.0)
                            .elevationM(0)
                            .zoneDensity(density)
                            .isCoastal(isCoastal)
                            .isMountain(isMountain)
                            .isActive(true)
                            .isVolatile(false)
                            .createdAt(LocalDateTime.now())
                            .updatedAt(LocalDateTime.now())
                            .build();

                    nodes.add(node);
                }
                lngIndex++;
            }
            latIndex++;
        }

        weatherNodeRepository.saveAll(nodes);
        long elapsed = System.currentTimeMillis() - startTime;

        log.info("✅ Generated {} weather nodes in {} ms", nodes.size(), elapsed);
        log.info("  Coastal: {}", nodes.stream().filter(WeatherNode::getIsCoastal).count());
        log.info("  Mountain (DENSE): {}", nodes.stream().filter(WeatherNode::getIsMountain).count());

        return nodes.size();
    }

    // ──────────────────────────────────────────────
    // Ray-casting point-in-polygon
    // ──────────────────────────────────────────────

    private boolean isInsideSriLanka(double lat, double lng) {
        int n = SL_POLYGON.length;
        boolean inside = false;

        for (int i = 0, j = n - 1; i < n; j = i++) {
            double yi = SL_POLYGON[i][0], xi = SL_POLYGON[i][1];
            double yj = SL_POLYGON[j][0], xj = SL_POLYGON[j][1];

            boolean intersect = ((yi > lat) != (yj > lat))
                    && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);

            if (intersect) {
                inside = !inside;
            }
        }

        return inside;
    }
}
