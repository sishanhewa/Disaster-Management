package com.sidms.backend.repository;

import com.sidms.backend.entity.ForecastProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ForecastProjectionRepository extends JpaRepository<ForecastProjection, UUID> {
    List<ForecastProjection> findBySpatialUnitIdAndForecastDateBetween(UUID spatialUnitId, LocalDate from,
            LocalDate to);

    List<ForecastProjection> findBySpatialUnitIdAndMetricAndForecastDateBetween(UUID spatialUnitId, String metric,
            LocalDate from, LocalDate to);

    java.util.Optional<ForecastProjection> findTopByOrderByGeneratedAtDesc();
}
