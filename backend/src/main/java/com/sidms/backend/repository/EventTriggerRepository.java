package com.sidms.backend.repository;

import com.sidms.backend.entity.EventTrigger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EventTriggerRepository extends JpaRepository<EventTrigger, UUID> {

    /**
     * Find trigger by its unique hash.
     * This is the core deduplication lookup.
     */
    Optional<EventTrigger> findByEventHash(String eventHash);

    /**
     * Check if a trigger exists and is still active (not expired).
     */
    @Query("SELECT COUNT(t) > 0 FROM EventTrigger t WHERE t.eventHash = :hash AND t.expiresAt > :now")
    boolean isTriggerActive(@Param("hash") String hash, @Param("now") LocalDateTime now);

    /**
     * Find all active triggers for a rule.
     */
    @Query("SELECT t FROM EventTrigger t WHERE t.ruleId = :ruleId AND t.expiresAt > :now ORDER BY t.createdAt DESC")
    List<EventTrigger> findActiveByRule(@Param("ruleId") UUID ruleId, @Param("now") LocalDateTime now);

    /**
     * Find expired triggers that can be cleaned up.
     */
    List<EventTrigger> findByExpiresAtBefore(LocalDateTime before);

    /**
     * Find triggers for a specific spatial unit.
     */
    @Query("SELECT t FROM EventTrigger t WHERE t.spatialUnitId = :spatialUnitId AND t.expiresAt > :now")
    List<EventTrigger> findActiveBySpatialUnit(@Param("spatialUnitId") UUID spatialUnitId, @Param("now") LocalDateTime now);

    /**
     * Count active triggers for statistics.
     */
    @Query("SELECT COUNT(t) FROM EventTrigger t WHERE t.expiresAt > :now")
    long countActive(@Param("now") LocalDateTime now);

    /**
     * Find trigger by event ID.
     */
    Optional<EventTrigger> findByEventId(UUID eventId);

    @Query(value = """
        INSERT INTO event_triggers
        (id, event_hash, rule_id, event_id, spatial_unit_id, event_type,
         triggered_at, expires_at, trigger_value, trigger_threshold, created_at)
        VALUES (uuid_generate_v4(), :hash, :ruleId, :eventId, :spatialUnitId, :eventType,
                :triggeredAt, :expiresAt, :triggerValue, :triggerThreshold, :createdAt)
        ON CONFLICT (event_hash) DO UPDATE
        SET triggered_at = excluded.triggered_at,
            expires_at = excluded.expires_at,
            event_id = excluded.event_id,
            trigger_value = excluded.trigger_value,
            trigger_threshold = excluded.trigger_threshold
        WHERE event_triggers.expires_at <= excluded.triggered_at
        RETURNING id
        """, nativeQuery = true)
    Optional<UUID> insertOrUpdateIfExpired(@Param("hash") String hash,
                                @Param("ruleId") UUID ruleId,
                                @Param("eventId") UUID eventId,
                                @Param("spatialUnitId") UUID spatialUnitId,
                                @Param("eventType") String eventType,
                                @Param("triggeredAt") LocalDateTime triggeredAt,
                                @Param("expiresAt") LocalDateTime expiresAt,
                                @Param("triggerValue") Double triggerValue,
                                @Param("triggerThreshold") Double triggerThreshold,
                                @Param("createdAt") LocalDateTime createdAt);
}
