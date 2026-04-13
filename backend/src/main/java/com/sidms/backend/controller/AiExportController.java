package com.sidms.backend.controller;

import com.sidms.backend.entity.SpatialUnit;
import com.sidms.backend.entity.SpatialUnitWeatherNodeMapping;
import com.sidms.backend.entity.WeatherNode;
import com.sidms.backend.entity.WeatherNodeHistoricalDaily;
import com.sidms.backend.repository.SpatialUnitRepository;
import com.sidms.backend.repository.SpatialUnitWeatherNodeMappingRepository;
import com.sidms.backend.repository.WeatherNodeHistoricalDailyRepository;
import com.sidms.backend.repository.WeatherNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/ai-export")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class AiExportController {

    private final SpatialUnitRepository spatialUnitRepository;
    private final SpatialUnitWeatherNodeMappingRepository mappingRepository;
    private final WeatherNodeRepository weatherNodeRepository;
    private final WeatherNodeHistoricalDailyRepository historicalDailyRepository;

    @GetMapping("/training-data")
    public ResponseEntity<?> getTrainingData(
            @RequestParam UUID spatialUnitId,
            @RequestParam(defaultValue = "365") int days) {

        // 1. Load spatial unit
        Optional<SpatialUnit> suOpt = spatialUnitRepository.findById(spatialUnitId);
        if (suOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        SpatialUnit su = suOpt.get();

        // 2. Load IDW mappings for this spatial unit
        List<SpatialUnitWeatherNodeMapping> mappings =
                mappingRepository.findBySpatialUnitIdOrderByRankAsc(spatialUnitId);

        if (mappings.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "error", "No weather node mappings found for this spatial unit. Run IDW computation first."
            ));
        }

        // 3. Get primary (nearest) weather node metadata
        UUID primaryNodeId = mappings.get(0).getWeatherNodeId();
        WeatherNode primaryNode = weatherNodeRepository.findById(primaryNodeId).orElse(null);

        // 4. Collect all mapped node IDs
        List<UUID> nodeIds = mappings.stream()
                .map(SpatialUnitWeatherNodeMapping::getWeatherNodeId)
                .collect(Collectors.toList());

        // 5. Load historical data for all mapped nodes
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(days);

        // Aggregate historical records per date using IDW weights
        Map<UUID, Double> weightMap = new HashMap<>();
        for (SpatialUnitWeatherNodeMapping m : mappings) {
            weightMap.put(m.getWeatherNodeId(), m.getIdwWeight());
        }

        // Load all historical records for mapped nodes in date range
        Map<LocalDate, List<WeightedRecord>> dateRecords = new TreeMap<>();

        for (SpatialUnitWeatherNodeMapping m : mappings) {
            List<WeatherNodeHistoricalDaily> records =
                    historicalDailyRepository.findByWeatherNodeIdAndDateBetween(
                            m.getWeatherNodeId(), startDate, endDate);

            double weight = m.getIdwWeight();

            for (WeatherNodeHistoricalDaily r : records) {
                dateRecords.computeIfAbsent(r.getDate(), k -> new ArrayList<>())
                        .add(new WeightedRecord(r, weight));
            }
        }

        // 6. Compute IDW-weighted aggregates per date
        List<Map<String, Object>> trainingRecords = new ArrayList<>();

        for (Map.Entry<LocalDate, List<WeightedRecord>> entry : dateRecords.entrySet()) {
            LocalDate date = entry.getKey();
            List<WeightedRecord> weightedRecords = entry.getValue();

            double totalWeight = weightedRecords.stream().mapToDouble(wr -> wr.weight).sum();
            if (totalWeight == 0) continue;

            double tempMax = 0, tempMin = 0, tempMean = 0;
            double precipMm = 0, humidityMean = 0, windSpeedMean = 0, capeMax = 0;
            double maxCape = 0;

            for (WeightedRecord wr : weightedRecords) {
                double w = wr.weight / totalWeight;
                WeatherNodeHistoricalDaily r = wr.record;

                tempMax += safeVal(r.getTempMaxC()) * w;
                tempMin += safeVal(r.getTempMinC()) * w;
                tempMean += safeVal(r.getTempMeanC()) * w;
                precipMm += safeVal(r.getPrecipSumMm()) * w;
                humidityMean += safeVal(r.getHumidityMeanPct()) * w;
                windSpeedMean += safeVal(r.getWindMaxKmh()) * w;

                if (r.getCapeMax() != null && r.getCapeMax() > maxCape) {
                    maxCape = r.getCapeMax();
                }
            }

            Map<String, Object> record = new LinkedHashMap<>();
            record.put("date", date.toString());
            record.put("tempMax", round2(tempMax));
            record.put("tempMin", round2(tempMin));
            record.put("tempMean", round2(tempMean));
            record.put("precipMm", round2(precipMm));
            record.put("humidityMean", round2(humidityMean));
            record.put("windSpeedMean", round2(windSpeedMean));
            record.put("capeMax", round2(maxCape));
            record.put("dayOfYear", date.getDayOfYear());
            record.put("month", date.getMonthValue());
            record.put("dayOfWeek", date.getDayOfWeek().getValue());

            trainingRecords.add(record);
        }

        // 7. Build response
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("spatialUnitId", su.getId().toString());
        response.put("spatialUnitName", su.getName());
        response.put("pcode", su.getPcode());
        response.put("type", su.getType().name());
        response.put("elevationM", primaryNode != null ? primaryNode.getElevationM() : 0);
        response.put("isCoastal", primaryNode != null ? primaryNode.getIsCoastal() : false);
        response.put("isMountain", primaryNode != null ? primaryNode.getIsMountain() : false);
        response.put("distanceToCoastKm", primaryNode != null ? primaryNode.getDistanceToCoastKm() : 0);
        response.put("mappedNodes", mappings.size());
        response.put("dateRange", Map.of("from", startDate.toString(), "to", endDate.toString()));
        response.put("recordCount", trainingRecords.size());
        response.put("records", trainingRecords);

        return ResponseEntity.ok(response);
    }

    // ──────────────────────────────────────────────
    // Helpers
    // ──────────────────────────────────────────────

    private double safeVal(Double val) {
        return val != null ? val : 0.0;
    }

    private double round2(double val) {
        return Math.round(val * 100.0) / 100.0;
    }

    private static class WeightedRecord {
        final WeatherNodeHistoricalDaily record;
        final double weight;

        WeightedRecord(WeatherNodeHistoricalDaily record, double weight) {
            this.record = record;
            this.weight = weight;
        }
    }
}
