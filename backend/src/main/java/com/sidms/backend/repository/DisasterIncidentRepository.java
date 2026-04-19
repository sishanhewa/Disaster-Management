package com.sidms.backend.repository;

import com.sidms.backend.entity.DisasterIncident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DisasterIncidentRepository extends JpaRepository<DisasterIncident, UUID> {
    List<DisasterIncident> findAllByOrderByIncidentDateDesc();
    List<DisasterIncident> findByResponseStatusNotOrderByIncidentDateDesc(String status);
    List<DisasterIncident> findByDistrictOrderByIncidentDateDesc(String district);
    List<DisasterIncident> findByHazardTypeOrderByIncidentDateDesc(String hazardType);
    /** Used by ArcGIS sync to avoid duplicate ingestion by external object ID. */
    Optional<DisasterIncident> findByArcgisObjectId(Long arcgisObjectId);
}
