package com.sidms.backend.repository;

import com.sidms.backend.entity.SosIncident;
import com.sidms.backend.entity.enums.SosStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SosIncidentRepository extends JpaRepository<SosIncident, UUID> {
    List<SosIncident> findByStatusNot(SosStatus status);
    List<SosIncident> findByAssignedTo(UUID userId);
    List<SosIncident> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
