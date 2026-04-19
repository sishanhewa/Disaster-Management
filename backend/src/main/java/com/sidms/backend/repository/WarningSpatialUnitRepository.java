package com.sidms.backend.repository;

import com.sidms.backend.entity.WarningSpatialUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WarningSpatialUnitRepository extends JpaRepository<WarningSpatialUnit, UUID> {
    List<WarningSpatialUnit> findByWarningId(UUID warningId);
    List<WarningSpatialUnit> findBySpatialUnitIdIn(List<UUID> spatialUnitIds);
    void deleteByWarningId(UUID warningId);
}
