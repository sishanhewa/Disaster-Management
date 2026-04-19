package com.sidms.backend.repository;

import com.sidms.backend.entity.SpatialUnit;
import com.sidms.backend.entity.enums.SpatialType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface SpatialUnitRepository extends JpaRepository<SpatialUnit, UUID>, JpaSpecificationExecutor<SpatialUnit> {
    Optional<SpatialUnit> findByPcode(String pcode);

    List<SpatialUnit> findByType(SpatialType type);

    List<SpatialUnit> findByParentId(UUID parentId);

    Page<SpatialUnit> findByParentId(UUID parentId, Pageable pageable);

    List<SpatialUnit> findByNameContainingIgnoreCaseOrNameSinhalaContainingIgnoreCaseOrNameTamilContainingIgnoreCase(
            String a, String b, String c);

    List<SpatialUnit> findByNameIgnoreCase(String name);

    long countByType(SpatialType type);
}
