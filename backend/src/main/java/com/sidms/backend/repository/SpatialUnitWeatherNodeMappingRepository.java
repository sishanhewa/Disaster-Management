package com.sidms.backend.repository;

import com.sidms.backend.entity.SpatialUnitWeatherNodeMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SpatialUnitWeatherNodeMappingRepository extends JpaRepository<SpatialUnitWeatherNodeMapping, UUID> {
    List<SpatialUnitWeatherNodeMapping> findBySpatialUnitIdOrderByRankAsc(UUID spatialUnitId);
    void deleteBySpatialUnitId(UUID spatialUnitId);
}
