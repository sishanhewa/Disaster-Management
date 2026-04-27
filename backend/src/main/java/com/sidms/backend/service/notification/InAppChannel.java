package com.sidms.backend.service.notification;

import com.sidms.backend.entity.Notification;
import com.sidms.backend.entity.NotificationDelivery;
import com.sidms.backend.entity.User;
import com.sidms.backend.repository.NotificationDeliveryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * In-App notification channel.
 * 
 * This is the simplest channel - it just marks the delivery as complete
 * since the notification is already stored in the database and will be
 * shown to the user via the notification bell/API.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class InAppChannel implements NotificationChannel {

    private final NotificationDeliveryRepository deliveryRepository;

    @Override
    public NotificationDelivery.Channel getChannelType() {
        return NotificationDelivery.Channel.IN_APP;
    }

    @Override
    public boolean isEnabledForUser(User user) {
        // In-app is always enabled - it's the default channel
        return true;
    }

    @Override
    @Transactional
    public boolean send(Notification notification, User user, NotificationDelivery delivery) {
        try {
            // In-app notifications are already stored in the database
            // Just mark the delivery as complete
            delivery.setStatus(NotificationDelivery.Status.DELIVERED);
            delivery.setDeliveredAt(LocalDateTime.now(java.time.ZoneOffset.UTC));
            delivery.setAttemptCount(delivery.getAttemptCount() + 1);
            delivery.setLastAttemptAt(LocalDateTime.now(java.time.ZoneOffset.UTC));
            deliveryRepository.save(delivery);

            log.debug("[InAppChannel] Delivered notification {} to user {}",
                    notification.getId(), user.getId());
            return true;

        } catch (Exception e) {
            log.error("[InAppChannel] Failed to deliver notification {}: {}",
                    notification.getId(), e.getMessage());
            return false;
        }
    }
}
