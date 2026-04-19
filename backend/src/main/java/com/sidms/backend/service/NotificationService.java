package com.sidms.backend.service;

import com.sidms.backend.dto.content.NotificationDto;
import com.sidms.backend.entity.Notification;
import com.sidms.backend.exception.ForbiddenException;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

import com.sidms.backend.entity.User;
import com.sidms.backend.repository.UserRepository;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public Page<NotificationDto> getMyNotifications(UUID userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toNotificationDto);
    }

    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public NotificationDto markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));

        if (!notification.getUserId().equals(userId)) {
            throw new ForbiddenException("You do not own this notification");
        }

        notification.setIsRead(true);
        notificationRepository.save(notification);
        return toNotificationDto(notification);
    }

    @Transactional
    public void markAllAsRead(UUID userId) {
        notificationRepository.findByUserIdAndIsReadFalse(userId)
                .forEach(n -> {
                    n.setIsRead(true);
                    notificationRepository.save(n);
                });
    }

    @Transactional
    public Notification createNotification(UUID userId, String type, String title, String body,
                                           UUID spatialUnitId, UUID warningId) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .title(title)
                .body(body)
                .spatialUnitId(spatialUnitId)
                .warningId(warningId)
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        return notificationRepository.save(notification);
    }

    @Transactional
    public void broadcastAlert(com.sidms.backend.dto.admin.BroadcastRequest request) {
        java.util.List<UUID> targetIds = request.getTargetUserIds();
        
        if (targetIds == null || targetIds.isEmpty()) {
            // Broadcast to all active users
            targetIds = userRepository.findAll().stream()
                    .filter(User::getIsActive)
                    .map(User::getId)
                    .collect(java.util.stream.Collectors.toList());
        }

        List<Notification> notifications = targetIds.stream()
                .map(userId -> Notification.builder()
                        .userId(userId)
                        .type(request.getType() != null ? request.getType() : "SYSTEM_ALERT")
                        .title(request.getTitle())
                        .body(request.getBody())
                        .isRead(false)
                        .createdAt(LocalDateTime.now())
                        .build())
                .collect(java.util.stream.Collectors.toList());

        notificationRepository.saveAll(notifications);
    }

    // ── Helpers ─────────────────────────────────────────────

    private NotificationDto toNotificationDto(Notification notification) {
        return NotificationDto.builder()
                .id(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .body(notification.getBody())
                .isRead(notification.getIsRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
