package com.sidms.backend.repository;

import com.sidms.backend.entity.SpatialForecastSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SpatialForecastSnapshotRepository extends JpaRepository<SpatialForecastSnapshot, UUID> {
    Optional<SpatialForecastSnapshot> findBySpatialUnitId(UUID spatialUnitId);
}
