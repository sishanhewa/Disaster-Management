package com.sidms.backend.repository;

import com.sidms.backend.entity.WeatherEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WeatherEventRepository extends JpaRepository<WeatherEvent, UUID> {

    /**
     * Find unprocessed events that need to be converted to notifications.
     */
    List<WeatherEvent> findByIsProcessedFalseOrderByCreatedAtAsc();

    /**
     * Find events for a specific spatial unit.
     */
    List<WeatherEvent> findBySpatialUnitIdOrderByCreatedAtDesc(UUID spatialUnitId);

    /**
     * Find events by type.
     */
    List<WeatherEvent> findByEventTypeOrderByCreatedAtDesc(String eventType);

    /**
     * Find events within a time range.
     */
    @Query("SELECT e FROM WeatherEvent e WHERE e.startTime >= :start AND e.endTime <= :end ORDER BY e.createdAt DESC")
    List<WeatherEvent> findByTimeRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    /**
     * Find active events (not yet ended) for a spatial unit.
     */
    @Query("SELECT e FROM WeatherEvent e WHERE e.spatialUnitId = :spatialUnitId AND e.endTime > :now ORDER BY e.severity DESC, e.createdAt DESC")
    List<WeatherEvent> findActiveBySpatialUnit(@Param("spatialUnitId") UUID spatialUnitId, @Param("now") LocalDateTime now);

    /**
     * Check if an event was generated from a specific rule.
     */
    Optional<WeatherEvent> findBySourceRuleIdAndCreatedAtAfter(UUID sourceRuleId, LocalDateTime after);

    /**
     * Paginated list of all events.
     */
    Page<WeatherEvent> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /**
     * Count unprocessed events.
     */
    long countByIsProcessedFalse();

    /**
     * Find events linked to a warning.
     */
    Optional<WeatherEvent> findByWarningId(UUID warningId);
}
