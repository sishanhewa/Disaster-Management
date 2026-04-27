package com.sidms.backend.repository;

import com.sidms.backend.entity.NotificationDelivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationDeliveryRepository extends JpaRepository<NotificationDelivery, UUID> {

    /**
     * Find all deliveries for a notification.
     */
    List<NotificationDelivery> findByNotificationId(UUID notificationId);

    /**
     * Find pending deliveries that need to be processed.
     */
    @Query("SELECT d FROM NotificationDelivery d WHERE d.status = 'PENDING' AND (d.nextRetryAt IS NULL OR d.nextRetryAt <= :now) ORDER BY d.createdAt ASC")
    List<NotificationDelivery> findPendingDeliveries(@Param("now") LocalDateTime now);

    /**
     * Find failed deliveries that should be retried.
     */
    @Query("SELECT d FROM NotificationDelivery d WHERE d.status = 'FAILED' AND d.attemptCount < :maxAttempts AND (d.nextRetryAt IS NULL OR d.nextRetryAt <= :now) ORDER BY d.createdAt ASC")
    List<NotificationDelivery> findRetryableDeliveries(@Param("maxAttempts") int maxAttempts, @Param("now") LocalDateTime now);

    /**
     * Find deliveries for a specific user and channel.
     */
    List<NotificationDelivery> findByUserIdAndChannelOrderByCreatedAtDesc(UUID userId, NotificationDelivery.Channel channel);

    /**
     * Count pending deliveries for statistics.
     */
    long countByStatus(NotificationDelivery.Status status);

    /**
     * Find delivery by notification + channel (to prevent duplicates).
     */
    Optional<NotificationDelivery> findByNotificationIdAndChannel(UUID notificationId, NotificationDelivery.Channel channel);

    /**
     * Check if a notification was delivered on a specific channel.
     */
    @Query("SELECT COUNT(d) > 0 FROM NotificationDelivery d WHERE d.notificationId = :notificationId AND d.channel = :channel AND d.status = 'DELIVERED'")
    boolean isDelivered(@Param("notificationId") UUID notificationId, @Param("channel") NotificationDelivery.Channel channel);

    /**
     * Find stuck deliveries (pending for too long).
     */
    @Query("SELECT d FROM NotificationDelivery d WHERE d.status = 'PENDING' AND d.createdAt < :before ORDER BY d.createdAt ASC")
    List<NotificationDelivery> findStuckDeliveries(@Param("before") LocalDateTime before);

    /**
     * Delete old delivery records (cleanup).
     */
    @Modifying
    @Query("DELETE FROM NotificationDelivery d WHERE d.createdAt < :before AND d.status IN ('DELIVERED', 'FAILED')")
    int deleteOldDeliveries(@Param("before") LocalDateTime before);
}
