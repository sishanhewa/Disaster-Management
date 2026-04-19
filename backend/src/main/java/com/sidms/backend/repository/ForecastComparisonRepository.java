package com.sidms.backend.repository;

import com.sidms.backend.entity.ForecastComparison;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ForecastComparisonRepository extends JpaRepository<ForecastComparison, UUID> {
    List<ForecastComparison> findBySpatialUnitIdAndMetricOrderByTargetDateDesc(UUID id, String metric);

    Optional<ForecastComparison> findFirstBySpatialUnitIdAndMetricAndTargetDateAndActualValueIsNullOrderByForecastGeneratedAtDesc(
            UUID spatialUnitId, String metric, java.time.LocalDate targetDate);

    List<ForecastComparison> findBySpatialUnitIdAndActualRecordedAtAfterOrderByTargetDateDesc(
            UUID spatialUnitId, java.time.LocalDateTime cutoff);

    List<ForecastComparison> findBySpatialUnitIdAndMetricAndActualRecordedAtAfterOrderByTargetDateDesc(
            UUID spatialUnitId, String metric, java.time.LocalDateTime cutoff);
}
