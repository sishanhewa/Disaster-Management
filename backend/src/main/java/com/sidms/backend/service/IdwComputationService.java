package com.sidms.backend.service;

import com.sidms.backend.entity.SpatialUnit;
import com.sidms.backend.entity.SpatialUnitWeatherNodeMapping;
import com.sidms.backend.entity.WeatherNode;
import com.sidms.backend.repository.SpatialUnitRepository;
import com.sidms.backend.repository.SpatialUnitWeatherNodeMappingRepository;
import com.sidms.backend.repository.WeatherNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@Slf4j
@RequiredArgsConstructor
public class IdwComputationService {

    private final SpatialUnitRepository spatialUnitRepository;
    private final WeatherNodeRepository weatherNodeRepository;
    private final SpatialUnitWeatherNodeMappingRepository mappingRepository;

    private static final int TOP_N = 4;
    private static final int BATCH_SIZE = 500;
    private static final double EARTH_RADIUS_KM = 6371.0;

    private final AtomicInteger progress = new AtomicInteger(0);
    private final AtomicInteger total = new AtomicInteger(0);
    private final AtomicBoolean running = new AtomicBoolean(false);
    private volatile String currentStatus = "IDLE";

    // ──────────────────────────────────────────────
    // Public API
    // ──────────────────────────────────────────────

    @Async
    public CompletableFuture<Void> computeAll() {
        if (running.get()) {
            log.warn("IDW computation already running – skipping duplicate call");
            return CompletableFuture.completedFuture(null);
        }

        running.set(true);
        currentStatus = "COMPUTING";
        progress.set(0);

        try {
            log.info("Starting IDW computation");
            long startTime = System.currentTimeMillis();

            List<SpatialUnit> spatialUnits = spatialUnitRepository.findAll();
            List<WeatherNode> weatherNodes = weatherNodeRepository.findByIsActiveTrue();

            total.set(spatialUnits.size());
            log.info("Computing IDW for {} spatial units against {} weather nodes",
                    spatialUnits.size(), weatherNodes.size());

            List<SpatialUnitWeatherNodeMapping> batch = new ArrayList<>(BATCH_SIZE * TOP_N);

            for (SpatialUnit su : spatialUnits) {
                List<SpatialUnitWeatherNodeMapping> mappings = computeMappingsForUnit(su, weatherNodes);
                batch.addAll(mappings);

                if (batch.size() >= BATCH_SIZE * TOP_N) {
                    saveBatch(batch);
                }

                int current = progress.incrementAndGet();
                if (current % 500 == 0) {
                    log.info("  IDW progress: {}/{} ({}%)", current, total.get(),
                            (current * 100) / total.get());
                }
            }

            // Save remaining
            if (!batch.isEmpty()) {
                saveBatch(batch);
            }

            long elapsed = System.currentTimeMillis() - startTime;
            currentStatus = "COMPLETE";
            log.info("✅ IDW computation completed in {} ms – {} units processed, {} mappings created",
                    elapsed, total.get(), total.get() * TOP_N);

        } catch (Exception e) {
            currentStatus = "FAILED: " + e.getMessage();
            log.error("IDW computation failed: {}", e.getMessage(), e);
        } finally {
            running.set(false);
        }

        return CompletableFuture.completedFuture(null);
    }

    public Map<String, Object> getStatus() {
        int t = total.get();
        int p = progress.get();
        int pct = t > 0 ? (p * 100) / t : 0;

        Map<String, Object> status = new LinkedHashMap<>();
        status.put("status", currentStatus);
        status.put("progress", p);
        status.put("total", t);
        status.put("percentComplete", pct);
        return status;
    }

    // ──────────────────────────────────────────────
    // IDW computation per spatial unit
    // ──────────────────────────────────────────────

    private List<SpatialUnitWeatherNodeMapping> computeMappingsForUnit(
            SpatialUnit su, List<WeatherNode> weatherNodes) {

        // Compute distances to all weather nodes
        List<NodeDistance> distances = new ArrayList<>(weatherNodes.size());
        for (WeatherNode node : weatherNodes) {
            double dist = haversine(su.getLat(), su.getLng(), node.getLat(), node.getLng());
            distances.add(new NodeDistance(node.getId(), dist));
        }

        // Sort by distance and take top N
        distances.sort(Comparator.comparingDouble(nd -> nd.distance));
        List<NodeDistance> topN = distances.subList(0, Math.min(TOP_N, distances.size()));

        // Compute IDW weights: w_i = 1 / dist_i^2
        double sumWeights = 0.0;
        double[] rawWeights = new double[topN.size()];
        for (int i = 0; i < topN.size(); i++) {
            double dist = topN.get(i).distance;
            // Guard against zero distance (node exactly at spatial unit center)
            if (dist < 0.001) dist = 0.001;
            rawWeights[i] = 1.0 / (dist * dist);
            sumWeights += rawWeights[i];
        }

        // Normalize and create mappings
        List<SpatialUnitWeatherNodeMapping> mappings = new ArrayList<>(TOP_N);
        LocalDateTime now = LocalDateTime.now();

        for (int i = 0; i < topN.size(); i++) {
            double normalizedWeight = rawWeights[i] / sumWeights;
            int rank = i + 1;

            mappings.add(SpatialUnitWeatherNodeMapping.builder()
                    .spatialUnitId(su.getId())
                    .weatherNodeId(topN.get(i).nodeId)
                    .rank(rank)
                    .distanceKm(topN.get(i).distance)
                    .idwWeight(normalizedWeight)
                    .isPrimary(rank == 1)
                    .createdAt(now)
                    .build());
        }

        return mappings;
    }

    @Transactional
    protected void saveBatch(List<SpatialUnitWeatherNodeMapping> batch) {
        // Delete existing mappings for all spatial units in the batch
        Set<UUID> spatialUnitIds = new HashSet<>();
        for (SpatialUnitWeatherNodeMapping m : batch) {
            spatialUnitIds.add(m.getSpatialUnitId());
        }
        for (UUID suId : spatialUnitIds) {
            mappingRepository.deleteBySpatialUnitId(suId);
        }

        mappingRepository.saveAll(batch);
        mappingRepository.flush();
        batch.clear();
    }

    // ──────────────────────────────────────────────
    // Haversine distance formula
    // ──────────────────────────────────────────────

    private double haversine(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    // ──────────────────────────────────────────────
    // Helper record
    // ──────────────────────────────────────────────

    private static class NodeDistance {
        final UUID nodeId;
        final double distance;

        NodeDistance(UUID nodeId, double distance) {
            this.nodeId = nodeId;
            this.distance = distance;
        }
    }
}
