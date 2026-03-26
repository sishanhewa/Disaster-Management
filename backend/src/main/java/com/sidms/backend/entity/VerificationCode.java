package com.sidms.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * VerificationCode stores OTP (One-Time Password) codes for user verification.
 * 
 * Used for:
 * - Email verification during registration
 * - Phone verification for volunteer applications
 * - Password reset (future)
 * 
 * Security features:
 * - Code is stored as SHA-256 hash (never plain text)
 * - Expires after 10 minutes
 * - Max 3 attempts
 * - Rate limited (1 request per 60 seconds per contact)
 */
@Entity
@Table(name = "verification_codes", indexes = {
    @Index(name = "idx_verification_user", columnList = "userId"),
    @Index(name = "idx_verification_contact", columnList = "contact"),
    @Index(name = "idx_verification_expires", columnList = "expiresAt"),
    @Index(name = "idx_verification_status", columnList = "isUsed,expiresAt")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificationCode {

    public enum VerificationType {
        EMAIL_VERIFICATION,     // Verify email during registration
        PHONE_VERIFICATION,     // Verify phone number
        VOLUNTEER_APPLICATION,  // Verify for volunteer role application
        PASSWORD_RESET          // Future: password reset
    }

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(columnDefinition = "uuid DEFAULT uuid_generate_v4()")
    private UUID id;

    /**
     * User this verification code belongs to.
     */
    @Column(name = "user_id", nullable = false)
    private UUID userId;

    /**
     * Contact being verified (email or phone number).
     */
    @Column(name = "contact", length = 255, nullable = false)
    private String contact;

    /**
     * Type of verification this code is for.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "verification_type", length = 30, nullable = false)
    private VerificationType verificationType;

    /**
     * SHA-256 hash of the OTP code (never store plain text).
     * Format: hash of 6-digit numeric code.
     */
    @Column(name = "code_hash", length = 64, nullable = false)
    private String codeHash;

    /**
     * When this code expires (default: 10 minutes from creation).
     */
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    /**
     * Number of verification attempts made.
     */
    @Column(name = "attempt_count")
    @Builder.Default
    private Integer attemptCount = 0;

    /**
     * Maximum allowed attempts before code is invalidated.
     */
    @Column(name = "max_attempts")
    @Builder.Default
    private Integer maxAttempts = 3;

    /**
     * Whether this code has been successfully used.
     */
    @Column(name = "is_used")
    @Builder.Default
    private Boolean isUsed = false;

    /**
     * When the code was used (if applicable).
     */
    @Column(name = "used_at")
    private LocalDateTime usedAt;

    /**
     * IP address that requested this code (for rate limiting/security).
     */
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now(java.time.ZoneOffset.UTC);
        updatedAt = createdAt;
        if (attemptCount == null) {
            attemptCount = 0;
        }
        if (maxAttempts == null) {
            maxAttempts = 3;
        }
        if (isUsed == null) {
            isUsed = false;
        }
        // Default expiry: 10 minutes if not set
        if (expiresAt == null) {
            expiresAt = createdAt.plusMinutes(10);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now(java.time.ZoneOffset.UTC);
    }

    /**
     * Check if this verification code has expired.
     */
    public boolean isExpired() {
        return LocalDateTime.now(java.time.ZoneOffset.UTC).isAfter(expiresAt);
    }

    /**
     * Check if max attempts have been exceeded.
     */
    public boolean isMaxAttemptsReached() {
        return attemptCount >= maxAttempts;
    }

    /**
     * Check if this code is still valid for verification.
     */
    public boolean isValid() {
        return !isUsed && !isExpired() && !isMaxAttemptsReached();
    }

    /**
     * Increment attempt count.
     */
    public void incrementAttempts() {
        attemptCount = attemptCount + 1;
    }

    /**
     * Mark as used successfully.
     */
    public void markAsUsed() {
        this.isUsed = true;
        this.usedAt = LocalDateTime.now(java.time.ZoneOffset.UTC);
    }
}
