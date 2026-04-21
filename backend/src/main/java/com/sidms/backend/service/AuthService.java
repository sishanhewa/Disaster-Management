package com.sidms.backend.service;

import com.sidms.backend.dto.auth.*;
import com.sidms.backend.entity.*;
import com.sidms.backend.exception.UnauthorizedException;
import com.sidms.backend.exception.ValidationException;
import com.sidms.backend.repository.*;
import com.sidms.backend.security.JwtProperties;
import com.sidms.backend.security.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserSessionRepository userSessionRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final LoginAttemptRepository loginAttemptRepository;
    private final VerificationService verificationService;
    private final JwtTokenProvider jwtTokenProvider;
    private final JwtProperties jwtProperties;
    private final PasswordEncoder passwordEncoder;
    private final BCryptPasswordEncoder refreshTokenEncoder;

    private static final Pattern PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[A-Z])(?=.*\\d).{8,}$");

    public AuthService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       UserSessionRepository userSessionRepository,
                       UserPreferencesRepository userPreferencesRepository,
                       LoginAttemptRepository loginAttemptRepository,
                       VerificationService verificationService,
                       JwtTokenProvider jwtTokenProvider,
                       JwtProperties jwtProperties,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userSessionRepository = userSessionRepository;
        this.userPreferencesRepository = userPreferencesRepository;
        this.loginAttemptRepository = loginAttemptRepository;
        this.verificationService = verificationService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.jwtProperties = jwtProperties;
        this.passwordEncoder = passwordEncoder;
        this.refreshTokenEncoder = new BCryptPasswordEncoder(10);
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (req.getEmail() == null || req.getEmail().isBlank()) {
            throw new ValidationException("Email is required");
        }
        if (req.getPassword() == null || req.getPassword().isBlank()) {
            throw new ValidationException("Password is required");
        }
        if (req.getDisplayName() == null || req.getDisplayName().isBlank()) {
            throw new ValidationException("Display name is required");
        }

        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ValidationException("Email is already registered");
        }

        if (!PASSWORD_PATTERN.matcher(req.getPassword()).matches()) {
            throw new ValidationException("Password must be at least 8 characters with 1 uppercase letter and 1 number");
        }

        User user = User.builder()
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .displayName(req.getDisplayName())
                .phone(req.getPhone())
                .isActive(true)
                .emailVerified(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Assign 'user' role
        Role userRole = roleRepository.findAll().stream()
                .filter(r -> "user".equals(r.getName()))
                .findFirst()
                .orElseThrow(() -> new ValidationException("Default role 'user' not found"));

        user.setRoles(Set.of(userRole));
        user = userRepository.save(user);

        // Create default preferences
        UserPreferences preferences = UserPreferences.builder()
                .userId(user.getId())
                .unitTemp("C")
                .unitWind("km/h")
                .unitPrecip("mm")
                .language("en")
                .userType("General Public")
                .theme("system")
                .notifEmail(true)
                .notifPush(true)
                .notifInapp(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        userPreferencesRepository.save(preferences);

        // Send email verification OTP (async - don't block registration if email fails)
        boolean verificationSent = false;
        try {
            verificationService.requestEmailVerification(user.getId(), user.getEmail(), "registration");
            verificationSent = true;
        } catch (Exception e) {
            // Log but don't fail registration - user can request verification again later
            System.err.println("[Auth] Failed to send verification email to " + user.getEmail() + ": " + e.getMessage());
        }

        // Generate access token
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), roleNames
        );

        return AuthResponse.builder()
                .accessToken(accessToken)
                .user(toUserDto(user))
                .emailVerificationSent(verificationSent)
                .message(verificationSent 
                    ? "Registration successful! Please check your email to verify your account." 
                    : "Registration successful! Please verify your email in settings.")
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest req, HttpServletRequest request, HttpServletResponse response) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!user.getIsActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }

        // Enforce email verification
        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            // Send a new verification code automatically
            try {
                verificationService.requestEmailVerification(user.getId(), user.getEmail(), getClientIp(request));
            } catch (Exception e) {
                System.err.println("[Auth] Failed to resend verification email: " + e.getMessage());
            }
            throw new UnauthorizedException("Email not verified. Please check your email for a verification code, or request a new one.");
        }

        // Check for too many failed attempts (5 in last 15 min)
        long failedAttempts = loginAttemptRepository
                .countByUserIdAndSuccessFalseAndCreatedAtAfter(
                        user.getId(), LocalDateTime.now().minusMinutes(15)
                );
        if (failedAttempts >= 5) {
            throw new UnauthorizedException("Account temporarily locked. Try again in 15 minutes");
        }

        // Verify password
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            // Log failed attempt
            loginAttemptRepository.save(LoginAttempt.builder()
                    .userId(user.getId())
                    .ipAddress(getClientIp(request))
                    .success(false)
                    .createdAt(LocalDateTime.now())
                    .build());
            throw new UnauthorizedException("Invalid email or password");
        }

        // Log successful attempt
        loginAttemptRepository.save(LoginAttempt.builder()
                .userId(user.getId())
                .ipAddress(getClientIp(request))
                .success(true)
                .createdAt(LocalDateTime.now())
                .build());

        // Generate tokens
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), roleNames
        );
        String refreshToken = jwtTokenProvider.generateRefreshToken();

        // Save session
        UserSession session = UserSession.builder()
                .userId(user.getId())
                .refreshTokenHash(refreshTokenEncoder.encode(refreshToken))
                .deviceInfo(request.getHeader("User-Agent"))
                .ipAddress(getClientIp(request))
                .lastActive(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(30))
                .revoked(false)
                .createdAt(LocalDateTime.now())
                .build();
        userSessionRepository.save(session);

        // Set HttpOnly cookie
        setRefreshTokenCookie(response, refreshToken, 30 * 24 * 60 * 60);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .user(toUserDto(user))
                .build();
    }

    @Transactional
    public AuthResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenCookie(request);
        if (refreshToken == null) {
            throw new UnauthorizedException("Refresh token not found");
        }

        // Find matching session
        List<UserSession> activeSessions = userSessionRepository.findAll().stream()
                .filter(s -> !s.getRevoked() && s.getExpiresAt().isAfter(LocalDateTime.now()))
                .toList();

        UserSession matchedSession = activeSessions.stream()
                .filter(s -> refreshTokenEncoder.matches(refreshToken, s.getRefreshTokenHash()))
                .findFirst()
                .orElseThrow(() -> new UnauthorizedException("Invalid refresh token"));

        User user = userRepository.findById(matchedSession.getUserId())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (!user.getIsActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }

        // Rotate: revoke old session
        matchedSession.setRevoked(true);
        userSessionRepository.save(matchedSession);

        // Generate new tokens
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String accessToken = jwtTokenProvider.generateAccessToken(
                user.getId(), user.getEmail(), roleNames
        );
        String newRefreshToken = jwtTokenProvider.generateRefreshToken();

        // Save new session
        UserSession newSession = UserSession.builder()
                .userId(user.getId())
                .refreshTokenHash(refreshTokenEncoder.encode(newRefreshToken))
                .deviceInfo(request.getHeader("User-Agent"))
                .ipAddress(getClientIp(request))
                .lastActive(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(30))
                .revoked(false)
                .createdAt(LocalDateTime.now())
                .build();
        userSessionRepository.save(newSession);

        // Set new cookie
        setRefreshTokenCookie(response, newRefreshToken, 30 * 24 * 60 * 60);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .user(toUserDto(user))
                .build();
    }

    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = extractRefreshTokenCookie(request);
        if (refreshToken != null) {
            userSessionRepository.findAll().stream()
                    .filter(s -> !s.getRevoked())
                    .filter(s -> refreshTokenEncoder.matches(refreshToken, s.getRefreshTokenHash()))
                    .findFirst()
                    .ifPresent(session -> {
                        session.setRevoked(true);
                        userSessionRepository.save(session);
                    });
        }

        // Clear cookie
        setRefreshTokenCookie(response, "", 0);
    }

    // ── Helpers ──────────────────────────────────────────────

    private UserDto toUserDto(User user) {
        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .phone(user.getPhone())
                .emailVerified(user.getEmailVerified())
                .phoneVerified(user.getPhoneVerified())
                .roles(roles)
                .build();
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String token, int maxAge) {
        Cookie cookie = new Cookie("refreshToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        cookie.setAttribute("SameSite", "Strict");
        response.addCookie(cookie);
    }

    private String extractRefreshTokenCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        return Arrays.stream(request.getCookies())
                .filter(c -> "refreshToken".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isEmpty()) {
            return xff.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
