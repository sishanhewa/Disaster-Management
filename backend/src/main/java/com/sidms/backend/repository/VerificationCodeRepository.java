package com.sidms.backend.repository;

import com.sidms.backend.entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository for managing VerificationCode entities.
 * 
 * Supports OTP verification flows with methods for finding
 * active codes, checking rate limits, and cleanup of expired codes.
 */
@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, UUID> {

    /**
     * Find the most recent active verification code for a user and type.
     * Active means: not used, not expired, attempts < max.
     */
    @Query("SELECT v FROM VerificationCode v " +
           "WHERE v.userId = :userId " +
           "AND v.verificationType = :type " +
           "AND v.isUsed = false " +
           "AND v.expiresAt > :now " +
           "AND v.attemptCount < v.maxAttempts " +
           "ORDER BY v.createdAt DESC")
    Optional<VerificationCode> findLatestActiveByUserAndType(
            @Param("userId") UUID userId,
            @Param("type") VerificationCode.VerificationType type,
            @Param("now") LocalDateTime now);

    /**
     * Find the most recent verification code for a contact (email/phone).
     * Used to check rate limiting.
     */
    @Query("SELECT v FROM VerificationCode v " +
           "WHERE v.contact = :contact " +
           "AND v.verificationType = :type " +
           "ORDER BY v.createdAt DESC")
    List<VerificationCode> findRecentByContactAndType(
            @Param("contact") String contact,
            @Param("type") VerificationCode.VerificationType type);

    /**
     * Count how many codes were created for a contact in the last N minutes.
     * Used for rate limiting.
     */
    @Query("SELECT COUNT(v) FROM VerificationCode v " +
           "WHERE v.contact = :contact " +
           "AND v.createdAt > :since")
    long countRecentByContact(
            @Param("contact") String contact,
            @Param("since") LocalDateTime since);

    /**
     * Find all expired and unused codes (for cleanup).
     */
    @Query("SELECT v FROM VerificationCode v " +
           "WHERE v.expiresAt < :now " +
           "AND v.isUsed = false")
    List<VerificationCode> findExpiredCodes(@Param("now") LocalDateTime now);

    /**
     * Find all used codes older than a certain date (for cleanup).
     */
    @Query("SELECT v FROM VerificationCode v " +
           "WHERE v.isUsed = true " +
           "AND v.usedAt < :before")
    List<VerificationCode> findOldUsedCodes(@Param("before") LocalDateTime before);

    /**
     * Delete all codes for a user of a specific type.
     * Used when successfully verifying to clean up old codes.
     */
    void deleteByUserIdAndVerificationType(UUID userId, VerificationCode.VerificationType type);

    /**
     * Count active codes for a user and type.
     */
    @Query("SELECT COUNT(v) FROM VerificationCode v " +
           "WHERE v.userId = :userId " +
           "AND v.verificationType = :type " +
           "AND v.isUsed = false " +
           "AND v.expiresAt > :now")
    long countActiveByUserAndType(
            @Param("userId") UUID userId,
            @Param("type") VerificationCode.VerificationType type,
            @Param("now") LocalDateTime now);

    /**
     * Find all active verification codes for a user and type.
     * Used to invalidate old codes when requesting new ones.
     */
    @Query("SELECT v FROM VerificationCode v " +
           "WHERE v.userId = :userId " +
           "AND v.verificationType = :type " +
           "AND v.isUsed = false " +
           "AND v.expiresAt > :now")
    List<VerificationCode> findAllActiveByUserAndType(
            @Param("userId") UUID userId,
            @Param("type") VerificationCode.VerificationType type,
            @Param("now") LocalDateTime now);
}
