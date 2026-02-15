package com.sidms.backend.controller;

import com.sidms.backend.dto.content.NotificationDto;
import com.sidms.backend.security.CustomUserDetails;
import com.sidms.backend.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<Page<NotificationDto>> getMyNotifications(
            @AuthenticationPrincipal CustomUserDetails principal,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(notificationService.getMyNotifications(
                principal.getUser().getId(), pageable));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal CustomUserDetails principal) {
        long count = notificationService.getUnreadCount(principal.getUser().getId());
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable UUID id,
                                                       @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(notificationService.markAsRead(id, principal.getUser().getId()));
    }

    @PutMapping("/mark-all-read")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal CustomUserDetails principal) {
        notificationService.markAllAsRead(principal.getUser().getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/admin/broadcast")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> broadcastAlert(@RequestBody com.sidms.backend.dto.admin.BroadcastRequest request) {
        notificationService.broadcastAlert(request);
        return ResponseEntity.ok(Map.of("message", "Broadcast sent successfully"));
    }
}
