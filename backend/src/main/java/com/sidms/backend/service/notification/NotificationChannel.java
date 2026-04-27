package com.sidms.backend.service.notification;

import com.sidms.backend.entity.Notification;
import com.sidms.backend.entity.NotificationDelivery;
import com.sidms.backend.entity.User;

/**
 * Interface for notification channels (Email, SMS, In-App, Push).
 * 
 * Each channel implementation handles delivery for one specific channel type.
 * The EventDrivenNotificationService orchestrates these channels.
 */
public interface NotificationChannel {

    /**
     * Get the channel type this handler supports.
     */
    NotificationDelivery.Channel getChannelType();

    /**
     * Check if this channel is enabled for a user.
     */
    boolean isEnabledForUser(User user);

    /**
     * Send a notification through this channel.
     * 
     * @param notification The notification to send
     * @param user The recipient user
     * @param delivery The delivery record to update
     * @return true if sent successfully, false otherwise
     */
    boolean send(Notification notification, User user, NotificationDelivery delivery);

    /**
     * Get the maximum retry attempts for this channel.
     */
    default int getMaxRetries() {
        return 3;
    }

    /**
     * Calculate retry delay based on attempt count.
     * Exponential backoff: 1min, 5min, 15min
     */
    default int getRetryDelayMinutes(int attemptCount) {
        return switch (attemptCount) {
            case 0 -> 1;
            case 1 -> 5;
            default -> 15;
        };
    }
}
