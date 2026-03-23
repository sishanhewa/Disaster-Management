package com.sidms.backend.controller;

import com.sidms.backend.entity.User;
import com.sidms.backend.entity.VerificationCode;
import com.sidms.backend.security.CustomUserDetails;
import com.sidms.backend.service.VerificationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * REST API for OTP verification flows.
 * 
 * Endpoints:
 * - POST /api/verification/email/request - Request email verification OTP
 * - POST /api/verification/email/verify - Verify email OTP
 * - POST /api/verification/volunteer/request - Request volunteer verification (phone)
 * - POST /api/verification/volunteer/verify - Verify volunteer OTP
 * - GET /api/verification/status - Check verification status
 */
@RestController
@RequestMapping("/api/verification")
@RequiredArgsConstructor
@Slf4j
public class VerificationController {

    private final VerificationService verificationService;

    /**
     * Request email verification OTP.
     */
    @PostMapping("/email/request")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VerificationResponse> requestEmailVerification(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody EmailVerificationRequest request,
            HttpServletRequest httpRequest) {
        
        User user = principal.getUser();

        log.info("[VerificationController] Email verification requested by user: {}", user.getId());

        String ipAddress = getClientIpAddress(httpRequest);
        
        // For security, only allow verifying the user's own email
        String emailToVerify = request.email() != null ? request.email() : user.getEmail();
        
        String otp = verificationService.requestEmailVerification(user.getId(), emailToVerify, ipAddress);

        return ResponseEntity.ok(new VerificationResponse(
            true,
            "Verification code sent to your email",
            null,
            null
        ));
    }

    /**
     * Verify email OTP.
     */
    @PostMapping("/email/verify")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VerificationResponse> verifyEmail(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody OtpVerifyRequest request) {
        
        User user = principal.getUser();

        log.info("[VerificationController] Email verification attempt by user: {}", user.getId());

        boolean verified = verificationService.verifyCode(
            user.getId(), 
            VerificationCode.VerificationType.EMAIL_VERIFICATION, 
            request.otp()
        );

        if (verified) {
            return ResponseEntity.ok(new VerificationResponse(
                true,
                "Email verified successfully",
                true,
                user.getPhone() != null ? user.getPhoneVerified() : null
            ));
        } else {
            return ResponseEntity.badRequest().body(new VerificationResponse(
                false,
                "Invalid or expired verification code",
                user.getEmailVerified(),
                user.getPhoneVerified()
            ));
        }
    }

    /**
     * Request volunteer application verification (phone OTP).
     */
    @PostMapping("/volunteer/request")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VerificationResponse> requestVolunteerVerification(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody VolunteerApplicationRequest request,
            HttpServletRequest httpRequest) {
        
        User user = principal.getUser();

        log.info("[VerificationController] Volunteer application submitted by user: {}", user.getId());

        // Check if email is verified first
        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            return ResponseEntity.badRequest().body(new VerificationResponse(
                false,
                "Email must be verified before applying as a volunteer",
                false,
                null
            ));
        }

        String ipAddress = getClientIpAddress(httpRequest);
        
        String otp = verificationService.requestVolunteerVerification(user.getId(), request.phone(), ipAddress);

        return ResponseEntity.ok(new VerificationResponse(
            true,
            "Volunteer application submitted. Verification code sent to your phone.",
            true,
            false
        ));
    }
    
    /**
     * Verify volunteer OTP and complete application.
     */
    @PostMapping("/volunteer/verify")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VerificationResponse> verifyVolunteer(
            @AuthenticationPrincipal CustomUserDetails principal,
            @Valid @RequestBody OtpVerifyRequest request) {
        
        User user = principal.getUser();

        log.info("[VerificationController] Volunteer verification attempt by user: {}", user.getId());

        boolean verified = verificationService.verifyCode(
            user.getId(), 
            VerificationCode.VerificationType.VOLUNTEER_APPLICATION, 
            request.otp()
        );

        if (verified) {
            return ResponseEntity.ok(new VerificationResponse(
                true,
                "Volunteer application approved! You can now accept volunteer tasks.",
                true,
                true,
                true
            ));
        } else {
            return ResponseEntity.badRequest().body(new VerificationResponse(
                false,
                "Invalid or expired verification code",
                user.getEmailVerified(),
                user.getPhoneVerified(),
                hasVolunteerRole(user)
            ));
        }
    }

    /**
     * Toggle volunteer role (opt in/out).
     * Allows verified volunteers to enable/disable their volunteer status.
     */
    @PostMapping("/volunteer/toggle")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VolunteerToggleResponse> toggleVolunteerStatus(
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        User user = principal.getUser();

        // Must have phone verified to toggle volunteer status
        if (!Boolean.TRUE.equals(user.getPhoneVerified())) {
            return ResponseEntity.badRequest().body(new VolunteerToggleResponse(
                false,
                "Phone number must be verified to become a volunteer",
                hasVolunteerRole(user)
            ));
        }

        boolean isNowVolunteer = verificationService.toggleVolunteerRole(user.getId());
        
        String message = isNowVolunteer 
            ? "You are now active as a volunteer. You can accept volunteer tasks."
            : "You have opted out of volunteer tasks. You can re-enable this anytime.";

        return ResponseEntity.ok(new VolunteerToggleResponse(
            true,
            message,
            isNowVolunteer
        ));
    }

    /**
     * Get current verification status.
     */
    @GetMapping("/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<VerificationStatusResponse> getVerificationStatus(
            @AuthenticationPrincipal CustomUserDetails principal) {
        
        User user = principal.getUser();
        
        boolean hasPendingEmail = verificationService.hasPendingVerification(
            user.getId(), VerificationCode.VerificationType.EMAIL_VERIFICATION);
        boolean hasPendingPhone = verificationService.hasPendingVerification(
            user.getId(), VerificationCode.VerificationType.PHONE_VERIFICATION);

        return ResponseEntity.ok(new VerificationStatusResponse(
            user.getEmail() != null,
            Boolean.TRUE.equals(user.getEmailVerified()),
            user.getPhone(),
            Boolean.TRUE.equals(user.getPhoneVerified()),
            hasPendingEmail,
            hasPendingPhone,
            hasVolunteerRole(user)
        ));
    }

    /**
     * Get client IP address from request.
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * Check if user has the volunteer role.
     */
    private boolean hasVolunteerRole(User user) {
        if (user.getRoles() == null) {
            return false;
        }
        return user.getRoles().stream()
                .anyMatch(role -> "volunteer".equalsIgnoreCase(role.getName()));
    }

    // Request/Response DTOs
    
    public record EmailVerificationRequest(
        @Pattern(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$", message = "Invalid email format")
        String email  // Optional - defaults to user's current email
    ) {}

    public record VolunteerApplicationRequest(
        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^(0|\\+94)?[0-9]{9,10}$", message = "Invalid phone number format")
        String phone
    ) {}

    public record OtpVerifyRequest(
        @NotBlank(message = "OTP is required")
        @Size(min = 6, max = 6, message = "OTP must be 6 digits")
        @Pattern(regexp = "^[0-9]{6}$", message = "OTP must be 6 digits")
        String otp
    ) {}

    public record VerificationResponse(
        boolean success,
        String message,
        Boolean emailVerified,
        Boolean phoneVerified,
        Boolean isVolunteer
    ) {
        public VerificationResponse(boolean success, String message, Boolean emailVerified, Boolean phoneVerified) {
            this(success, message, emailVerified, phoneVerified, null);
        }
    }

    public record VerificationStatusResponse(
        boolean hasEmail,
        boolean emailVerified,
        String phone,
        boolean phoneVerified,
        boolean hasPendingEmailVerification,
        boolean hasPendingPhoneVerification,
        boolean isVolunteer
    ) {}

    public record VolunteerToggleResponse(
        boolean success,
        String message,
        boolean isVolunteer
    ) {}
}
