package com.sidms.backend.service;

import com.sidms.backend.entity.User;
import com.sidms.backend.entity.VerificationCode;
import com.sidms.backend.entity.VerificationCode.VerificationType;
import com.sidms.backend.repository.RoleRepository;
import com.sidms.backend.repository.UserRepository;
import com.sidms.backend.repository.VerificationCodeRepository;
import com.sidms.backend.service.notification.MailService;
import com.sidms.backend.service.notification.EmailType;
import com.sidms.backend.service.notification.SmsGatewayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;

/**
 * Service for handling OTP (One-Time Password) verification flows.
 * 
 * Supports:
 * - Email verification during/after registration
 * - Phone verification for volunteer applications
 * - Rate limiting and security controls
 * 
 * Integrates with existing notification channels (Email, SMS).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class VerificationService {

    private final VerificationCodeRepository verificationCodeRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MailService mailService;
    private final SmsGatewayService smsGatewayService;
    private final NotificationService notificationService;

    @Value("${app.verification.otp.expiry-minutes:10}")
    private int otpExpiryMinutes;

    @Value("${app.verification.otp.max-attempts:3}")
    private int maxAttempts;

    @Value("${app.verification.otp.rate-limit-seconds:60}")
    private int rateLimitSeconds;

    @Value("${app.verification.sms.enabled:false}")
    private boolean smsEnabled;

    @Value("${app.verification.email.enabled:true}")
    private boolean emailEnabled;

    // Role name for volunteers
    private static final String VOLUNTEER_ROLE = "volunteer";

    /**
     * Request an OTP for email verification.
     * 
     * @param userId    The user requesting verification
     * @param email     Email address to verify
     * @param ipAddress IP address for rate limiting
     * @return The plain OTP code (to be sent to user)
     */
    @Transactional
    public String requestEmailVerification(UUID userId, String email, String ipAddress) {
        log.info("[Verification] Email verification requested for user: {}, email: {}", userId, email);

        // Rate limit check
        checkRateLimit(email, VerificationType.EMAIL_VERIFICATION);

        // Generate OTP
        String otp = generateOtp();
        String otpHash = hashOtp(otp);

        // Create verification code record
        VerificationCode code = VerificationCode.builder()
                .userId(userId)
                .contact(email.toLowerCase().trim())
                .verificationType(VerificationType.EMAIL_VERIFICATION)
                .codeHash(otpHash)
                .expiresAt(LocalDateTime.now(ZoneOffset.UTC).plusMinutes(otpExpiryMinutes))
                .maxAttempts(maxAttempts)
                .attemptCount(0)
                .isUsed(false)
                .ipAddress(ipAddress)
                .build();

        verificationCodeRepository.save(code);

        // Send via email
        sendEmailOtp(email, otp, "Verify Your Email - SIDMS");

        log.info("[Verification] Email OTP sent to: {}", email);
        return otp; // Return for testing/debugging; in production, don't log this
    }

    /**
     * Request an OTP for phone verification (used for volunteer applications).
     * 
     * @param userId    The user requesting verification
     * @param phone     Phone number to verify
     * @param ipAddress IP address for rate limiting
     * @return The plain OTP code
     */
    @Transactional
    public String requestPhoneVerification(UUID userId, String phone, String ipAddress) {
        log.info("[Verification] Phone verification requested for user: {}, phone: {}", userId, maskPhone(phone));

        // Rate limit check
        checkRateLimit(phone, VerificationType.PHONE_VERIFICATION);

        // Generate OTP
        String otp = generateOtp();
        String otpHash = hashOtp(otp);

        // Create verification code record
        VerificationCode code = VerificationCode.builder()
                .userId(userId)
                .contact(phone.trim())
                .verificationType(VerificationType.PHONE_VERIFICATION)
                .codeHash(otpHash)
                .expiresAt(LocalDateTime.now(ZoneOffset.UTC).plusMinutes(otpExpiryMinutes))
                .maxAttempts(maxAttempts)
                .attemptCount(0)
                .isUsed(false)
                .ipAddress(ipAddress)
                .build();

        verificationCodeRepository.save(code);

        // Send via SMS if enabled
        if (smsEnabled) {
            sendSmsOtp(phone, otp);
            log.info("[Verification] SMS OTP sent to: {}", maskPhone(phone));
        } else {
            log.warn("[Verification] SMS not enabled. OTP for {}: {} (would be sent via SMS)", maskPhone(phone), otp);
        }

        return otp;
    }

    /**
     * Request verification for a phone number change.
     * This invalidates the old phone verification and requires re-verification.
     * 
     * @param userId    The user changing phone number
     * @param newPhone  New phone number to verify
     * @param ipAddress IP address for rate limiting
     * @return The plain OTP code
     * @throws IllegalStateException if new phone equals current verified phone
     */
    @Transactional
    public String requestPhoneNumberChange(UUID userId, String newPhone, String ipAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String currentPhone = user.getPhone();
        String normalizedNewPhone = newPhone.trim();

        // Check if phone is actually changing
        if (normalizedNewPhone.equals(currentPhone)) {
            throw new IllegalStateException("New phone number is the same as current phone number");
        }

        // Check if new phone is already verified by another user
        Optional<User> existingUserWithPhone = userRepository.findByPhone(normalizedNewPhone);
        if (existingUserWithPhone.isPresent() && !existingUserWithPhone.get().getId().equals(userId)) {
            throw new IllegalStateException("Phone number already registered to another account");
        }

        log.info("[Verification] Phone number change requested for user: {} from {} to {}", 
                userId, maskPhone(currentPhone), maskPhone(normalizedNewPhone));

        // Invalidate any existing phone verification codes
        invalidateExistingCodes(userId, VerificationType.PHONE_VERIFICATION);

        // Mark phone as unverified until new number is confirmed
        user.setPhoneVerified(false);
        // Don't save the new phone yet - only save after verification
        userRepository.save(user);

        // Request verification for the new number
        return requestPhoneVerification(userId, normalizedNewPhone, ipAddress);
    }

    /**
     * Invalidate all existing verification codes for a user and type.
     */
    private void invalidateExistingCodes(UUID userId, VerificationType type) {
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        List<VerificationCode> activeCodes = verificationCodeRepository
                .findAllActiveByUserAndType(userId, type, now);
        
        for (VerificationCode code : activeCodes) {
            code.setIsUsed(true); // Mark as used to invalidate
            verificationCodeRepository.save(code);
        }
        
        if (!activeCodes.isEmpty()) {
            log.debug("[Verification] Invalidated {} existing {} codes for user: {}", 
                    activeCodes.size(), type, userId);
        }
    }

    /**
     * Request OTP for volunteer application.
     * This verifies both email and phone, then upgrades the user to volunteer role.
     * 
     * @param userId    The user applying to be a volunteer
     * @param phone     Phone number for verification (required)
     * @param ipAddress IP address for rate limiting
     * @return The plain OTP code
     */
    @Transactional
    public String requestVolunteerVerification(UUID userId, String phone, String ipAddress) {
        log.info("[Verification] Volunteer verification requested for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Validate user has email verified first
        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new IllegalStateException("Email must be verified before applying as volunteer");
        }

        // Update user phone
        user.setPhone(phone);
        userRepository.save(user);

        // Generate OTP for volunteer application (not regular phone verification)
        String otp = generateOtp();
        String otpHash = hashOtp(otp);

        // Create verification code record with VOLUNTEER_APPLICATION type
        VerificationCode code = VerificationCode.builder()
                .userId(userId)
                .contact(phone.trim())
                .verificationType(VerificationType.VOLUNTEER_APPLICATION)
                .codeHash(otpHash)
                .expiresAt(LocalDateTime.now(ZoneOffset.UTC).plusMinutes(otpExpiryMinutes))
                .maxAttempts(maxAttempts)
                .attemptCount(0)
                .isUsed(false)
                .ipAddress(ipAddress)
                .build();

        verificationCodeRepository.save(code);

        // Send via SMS if enabled
        if (smsEnabled) {
            sendSmsOtp(phone, otp);
            log.info("[Verification] SMS OTP sent to: {}", maskPhone(phone));
        } else {
            log.warn("[Verification] SMS not enabled. OTP for {}: {} (would be sent via SMS)", maskPhone(phone), otp);
        }

        return otp;
    }

    /**
     * Verify an OTP code.
     * 
     * @param userId    The user verifying
     * @param type      Type of verification
     * @param rawOtp    The OTP entered by user
     * @return true if verification successful
     */
    @Transactional
    public boolean verifyCode(UUID userId, VerificationType type, String rawOtp) {
        log.info("[Verification] OTP verification attempt for user: {}, type: {}", userId, type);

        // Hash the provided OTP
        String providedHash = hashOtp(rawOtp.trim());

        // Find the latest active code
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        Optional<VerificationCode> optionalCode = 
            verificationCodeRepository.findLatestActiveByUserAndType(userId, type, now);

        if (optionalCode.isEmpty()) {
            log.warn("[Verification] No active verification code found for user: {}, type: {}", userId, type);
            return false;
        }

        VerificationCode code = optionalCode.get();

        // Check expiry
        if (code.isExpired()) {
            log.warn("[Verification] Code expired for user: {}", userId);
            return false;
        }

        // Check max attempts
        if (code.isMaxAttemptsReached()) {
            log.warn("[Verification] Max attempts reached for user: {}", userId);
            return false;
        }

        // Verify hash
        code.incrementAttempts();

        if (!providedHash.equals(code.getCodeHash())) {
            verificationCodeRepository.save(code);
            log.warn("[Verification] Invalid OTP attempt {}/{} for user: {}", 
                code.getAttemptCount(), code.getMaxAttempts(), userId);
            return false;
        }

        // Success - mark as used
        code.markAsUsed();
        verificationCodeRepository.save(code);

        // Update user based on verification type (pass the code to get phone/email)
        updateUserAfterVerification(userId, type, code);

        log.info("[Verification] OTP verified successfully for user: {}, type: {}", userId, type);
        return true;
    }

    /**
     * Update user record after successful verification.
     * Also saves the verified phone/email to the user profile.
     */
    private void updateUserAfterVerification(UUID userId, VerificationType type, VerificationCode code) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String contact = code.getContact();

        switch (type) {
            case EMAIL_VERIFICATION:
                user.setEmailVerified(true);
                // Update email if different
                if (contact != null && !contact.equals(user.getEmail())) {
                    user.setEmail(contact);
                    log.info("[Verification] Updated user email to: {}", contact);
                }
                break;
            case PHONE_VERIFICATION:
                user.setPhoneVerified(true);
                // Save the verified phone number
                if (contact != null) {
                    user.setPhone(contact);
                    log.info("[Verification] Saved verified phone: {} for user: {}", maskPhone(contact), userId);
                }
                break;
            case VOLUNTEER_APPLICATION:
                user.setPhoneVerified(true);
                // Save the verified phone number (volunteer flow already saves it, but ensure consistency)
                if (contact != null) {
                    user.setPhone(contact);
                }
                // Add volunteer role
                addVolunteerRole(user);
                // Send in-app notification
                sendVolunteerApprovalNotification(user);
                break;
            default:
                break;
        }

        userRepository.save(user);
    }

    /**
     * Add volunteer role to user.
     */
    private void addVolunteerRole(User user) {
        roleRepository.findByName(VOLUNTEER_ROLE).ifPresent(volunteerRole -> {
            if (user.getRoles() == null) {
                user.setRoles(new HashSet<>());
            }
            user.getRoles().add(volunteerRole);
            log.info("[Verification] Added volunteer role to user: {}", user.getId());
        });
    }

    /**
     * Toggle volunteer role on/off for a user.
     * Allows verified volunteers to opt in/out of volunteer tasks.
     * 
     * @param userId The user ID
     * @return true if user now has volunteer role, false if removed
     */
    @Transactional
    public boolean toggleVolunteerRole(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean hasVolunteerRole = user.getRoles() != null && 
            user.getRoles().stream().anyMatch(r -> VOLUNTEER_ROLE.equalsIgnoreCase(r.getName()));

        if (hasVolunteerRole) {
            // Remove volunteer role (opt out)
            user.getRoles().removeIf(r -> VOLUNTEER_ROLE.equalsIgnoreCase(r.getName()));
            userRepository.save(user);
            log.info("[Verification] User {} opted out of volunteer role", userId);
            return false;
        } else {
            // Add volunteer role (opt in)
            addVolunteerRole(user);
            userRepository.save(user);
            log.info("[Verification] User {} opted in to volunteer role", userId);
            return true;
        }
    }

    /**
     * Send notification when volunteer application is approved.
     */
    private void sendVolunteerApprovalNotification(User user) {
        try {
            notificationService.createNotification(
                    user.getId(),
                    "VOLUNTEER_APPROVED",
                    "Volunteer Application Approved",
                    "Congratulations! Your volunteer application has been approved. You can now accept volunteer tasks.",
                    null,
                    null
            );
        } catch (Exception e) {
            log.warn("[Verification] Failed to send volunteer approval notification: {}", e.getMessage());
        }
    }

    /**
     * Check rate limiting for OTP requests.
     * Throws exception if rate limit exceeded.
     */
    private void checkRateLimit(String contact, VerificationType type) {
        LocalDateTime since = LocalDateTime.now(ZoneOffset.UTC).minusSeconds(rateLimitSeconds);
        long recentCount = verificationCodeRepository.countRecentByContact(contact, since);

        if (recentCount > 0) {
            throw new IllegalStateException(
                "Please wait " + (rateLimitSeconds / 60) + " minute(s) before requesting another code");
        }
    }

    /**
     * Generate a 6-digit numeric OTP.
     */
    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit number
        return String.valueOf(otp);
    }

    /**
     * Hash OTP using SHA-256.
     */
    private String hashOtp(String otp) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(otp.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    /**
     * Send OTP via email using existing MailService.
     * NOTE: This method does NOT throw exceptions to prevent transaction rollback.
     * Email failures are logged but don't block the verification flow.
     */
    private void sendEmailOtp(String email, String otp, String subject) {
        if (!emailEnabled) {
            log.warn("[Verification] Email verification disabled. OTP for {}: {}", email, otp);
            return;
        }

        try {
            Map<String, Object> model = new HashMap<>();
            model.put("otpCode", otp);
            model.put("expiryMinutes", otpExpiryMinutes);
            model.put("supportEmail", "support@sidms.lk");

            mailService.sendEmail(email, EmailType.EMAIL_VERIFICATION, model);
            log.info("[Verification] Email OTP sent to: {}", email);
        } catch (Exception e) {
            log.error("[Verification] Failed to send email OTP: {}", e.getMessage());
            // DON'T throw - we don't want to rollback the transaction
            // The user can request a new code later
        }
    }

    /**
     * Send OTP via SMS using existing SmsGatewayService.
     */
    private void sendSmsOtp(String phone, String otp) {
        if (!smsEnabled) {
            log.warn("[Verification] SMS verification disabled");
            return;
        }

        try {
            String message = String.format(
                "Your SIDMS verification code is: %s. Valid for %d minutes. Do not share this code with anyone.",
                otp, otpExpiryMinutes);
            
            smsGatewayService.sendSms(phone, message);
            log.info("[Verification] SMS OTP sent to: {}", maskPhone(phone));
        } catch (Exception e) {
            log.error("[Verification] Failed to send SMS OTP: {}", e.getMessage());
            throw new RuntimeException("Failed to send verification SMS", e);
        }
    }

    /**
     * Mask phone number for logging (show only last 4 digits).
     */
    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 4) {
            return "****";
        }
        return "****" + phone.substring(phone.length() - 4);
    }

    /**
     * Check if user has pending verification of given type.
     */
    @Transactional(readOnly = true)
    public boolean hasPendingVerification(UUID userId, VerificationType type) {
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        return verificationCodeRepository.countActiveByUserAndType(userId, type, now) > 0;
    }

    /**
     * Cleanup old/expired verification codes.
     * Should be called periodically (e.g., daily via scheduler).
     */
    @Transactional
    public void cleanupOldCodes() {
        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);
        
        // Delete expired unused codes
        List<VerificationCode> expired = verificationCodeRepository.findExpiredCodes(now);
        verificationCodeRepository.deleteAll(expired);
        log.info("[Verification] Cleaned up {} expired verification codes", expired.size());

        // Delete old used codes (older than 7 days)
        LocalDateTime oldUsed = now.minusDays(7);
        List<VerificationCode> old = verificationCodeRepository.findOldUsedCodes(oldUsed);
        verificationCodeRepository.deleteAll(old);
        log.info("[Verification] Cleaned up {} old used verification codes", old.size());
    }
}
