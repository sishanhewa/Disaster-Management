package com.sidms.backend.repository;

import com.sidms.backend.entity.SosEvent;
import com.sidms.backend.entity.enums.SosStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SosEventRepository extends JpaRepository<SosEvent, UUID> {

    /**
     * Find unprocessed SOS events for notification processing.
     */
    List<SosEvent> findByIsProcessedFalseOrderByCreatedAtAsc();

    /**
     * Find SOS events by incident ID.
     */
    Optional<SosEvent> findByIncidentId(UUID incidentId);

    /**
     * Find active (non-resolved) SOS events.
     */
    @Query("SELECT e FROM SosEvent e WHERE e.status NOT IN ('RESOLVED') AND e.isProcessed = true")
    List<SosEvent> findActiveEvents();

    /**
     * Find SOS events by user.
     */
    List<SosEvent> findByUserIdOrderByCreatedAtDesc(UUID userId);

    /**
     * Find SOS events by status.
     */
    List<SosEvent> findByStatusOrderByCreatedAtDesc(SosStatus status);

    /**
     * Find SOS events assigned to a responder.
     */
    List<SosEvent> findByAssignedResponderIdOrderByCreatedAtDesc(UUID responderId);
}
