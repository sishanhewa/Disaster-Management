package com.sidms.backend.repository;

import com.sidms.backend.model.DisasterIncident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DisasterIncidentRepository extends JpaRepository<DisasterIncident, UUID> {
    List<DisasterIncident> findAllByOrderByIncidentDateDesc();

    List<DisasterIncident> findByResponseStatusNotOrderByIncidentDateDesc(String status);

    List<DisasterIncident> findByDistrictOrderByIncidentDateDesc(String district);

    List<DisasterIncident> findByHazardTypeOrderByIncidentDateDesc(String hazardType);
}
