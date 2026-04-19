package com.sidms.backend.repository;

import com.sidms.backend.entity.SosTimeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SosTimelineRepository extends JpaRepository<SosTimeline, UUID> {
    List<SosTimeline> findByIncidentIdOrderByCreatedAtAsc(UUID incidentId);
}
