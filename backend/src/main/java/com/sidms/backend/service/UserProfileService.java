package com.sidms.backend.service;

import com.sidms.backend.dto.auth.UserDto;
import com.sidms.backend.dto.user.*;
import com.sidms.backend.entity.*;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.exception.ValidationException;
import com.sidms.backend.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final PasswordHistoryRepository passwordHistoryRepository;
    private final SavedLocationRepository savedLocationRepository;
    private final SpatialUnitRepository spatialUnitRepository;
    private final UserSessionRepository userSessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditLogRepository auditLogRepository;

    public UserProfileService(UserRepository userRepository,
            UserPreferencesRepository userPreferencesRepository,
            PasswordHistoryRepository passwordHistoryRepository,
            SavedLocationRepository savedLocationRepository,
            SpatialUnitRepository spatialUnitRepository,
            UserSessionRepository userSessionRepository,
            PasswordEncoder passwordEncoder,
            AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.userPreferencesRepository = userPreferencesRepository;
        this.passwordHistoryRepository = passwordHistoryRepository;
        this.savedLocationRepository = savedLocationRepository;
        this.spatialUnitRepository = spatialUnitRepository;
        this.userSessionRepository = userSessionRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditLogRepository = auditLogRepository;
    }

    public UserDto getProfile(UUID userId) {
        User user = findUserOrThrow(userId);
        return toUserDto(user);
    }

    @Transactional
    public UserDto updateProfile(UUID userId, UpdateProfileRequest req) {
        User user = findUserOrThrow(userId);

        if (req.getDisplayName() != null && !req.getDisplayName().isBlank()) {
            user.setDisplayName(req.getDisplayName());
        }
        if (req.getPhone() != null) {
            user.setPhone(req.getPhone());
        }
        if (req.getAvatarUrl() != null) {
            user.setAvatarUrl(req.getAvatarUrl());
        }

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return toUserDto(user);
    }

    @Transactional
    public void updatePreferences(UUID userId, UpdatePreferencesRequest req) {
        UserPreferences prefs = userPreferencesRepository.findById(userId)
                .orElse(UserPreferences.builder()
                        .userId(userId)
                        .createdAt(LocalDateTime.now())
                        .build());

        if (req.getUnitTemp() != null)
            prefs.setUnitTemp(req.getUnitTemp());
        if (req.getUnitWind() != null)
            prefs.setUnitWind(req.getUnitWind());
        if (req.getUnitPrecip() != null)
            prefs.setUnitPrecip(req.getUnitPrecip());
        if (req.getLanguage() != null)
            prefs.setLanguage(req.getLanguage());
        if (req.getUserType() != null)
            prefs.setUserType(req.getUserType());
        if (req.getTheme() != null)
            prefs.setTheme(req.getTheme());
        if (req.getDndStart() != null)
            prefs.setDndStart(req.getDndStart());
        if (req.getDndEnd() != null)
            prefs.setDndEnd(req.getDndEnd());
        if (req.getNotifEmail() != null)
            prefs.setNotifEmail(req.getNotifEmail());
        if (req.getNotifPush() != null)
            prefs.setNotifPush(req.getNotifPush());
        if (req.getNotifInapp() != null)
            prefs.setNotifInapp(req.getNotifInapp());

        prefs.setUpdatedAt(LocalDateTime.now());
        userPreferencesRepository.save(prefs);
    }

    @Transactional
    public void changePassword(UUID userId, ChangePasswordRequest req) {
        User user = findUserOrThrow(userId);

        if (req.getCurrentPassword() == null || req.getNewPassword() == null) {
            throw new ValidationException("Current and new passwords are required");
        }

        // Verify current password
        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPasswordHash())) {
            throw new ValidationException("Current password is incorrect");
        }

        // Check new password not in last 5 hashes
        List<PasswordHistory> recentPasswords = passwordHistoryRepository
                .findTop5ByUserIdOrderByCreatedAtDesc(userId);
        for (PasswordHistory ph : recentPasswords) {
            if (passwordEncoder.matches(req.getNewPassword(), ph.getPasswordHash())) {
                throw new ValidationException("New password cannot be the same as any of your last 5 passwords");
            }
        }

        // Update password
        String newHash = passwordEncoder.encode(req.getNewPassword());
        user.setPasswordHash(newHash);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Save to password history
        passwordHistoryRepository.save(PasswordHistory.builder()
                .userId(userId)
                .passwordHash(newHash)
                .createdAt(LocalDateTime.now())
                .build());

        // Revoke all other sessions
        userSessionRepository.findByUserIdAndRevokedFalse(userId)
                .forEach(session -> {
                    session.setRevoked(true);
                    userSessionRepository.save(session);
                });
    }

    public List<SavedLocationDto> getSavedLocations(UUID userId) {
        return savedLocationRepository.findByUserIdOrderBySortOrderAscCreatedAtAsc(userId).stream()
                .map(savedLocation -> {
                    SpatialUnit spatialUnit = spatialUnitRepository.findById(savedLocation.getSpatialUnitId())
                            .orElse(null);
                    return SavedLocationDto.builder()
                            .id(savedLocation.getId())
                            .spatialUnitId(savedLocation.getSpatialUnitId())
                            .nickname(savedLocation.getNickname())
                            .sortOrder(savedLocation.getSortOrder())
                            .createdAt(savedLocation.getCreatedAt())
                            .spatialUnitName(spatialUnit != null ? spatialUnit.getName() : null)
                            .spatialUnitType(
                                    spatialUnit != null && spatialUnit.getType() != null ? spatialUnit.getType().name()
                                            : null)
                            .lat(spatialUnit != null ? spatialUnit.getLat() : null)
                            .lng(spatialUnit != null ? spatialUnit.getLng() : null)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public SavedLocation addSavedLocation(UUID userId, SavedLocationRequest req) {
        long count = savedLocationRepository.countByUserId(userId);
        if (count >= 10) {
            throw new ValidationException("Maximum of 10 saved locations allowed");
        }

        SavedLocation location = SavedLocation.builder()
                .userId(userId)
                .spatialUnitId(req.getSpatialUnitId())
                .nickname(req.getNickname())
                .sortOrder(req.getSortOrder())
                .createdAt(LocalDateTime.now())
                .build();

        return savedLocationRepository.save(location);
    }

    @Transactional
    public void deleteSavedLocation(UUID userId, UUID locationId) {
        SavedLocation location = savedLocationRepository.findById(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Saved location not found"));

        if (!userId.equals(location.getUserId())) {
            throw new ValidationException("Cannot delete another user's saved location");
        }

        savedLocationRepository.delete(location);
    }

    @Transactional
    public void deleteMyAccount(UUID userId) {
        User user = findUserOrThrow(userId);

        user.setDeletedAt(LocalDateTime.now());
        user.setIsActive(false);
        userRepository.save(user);

        userSessionRepository.findByUserIdAndRevokedFalse(userId)
                .forEach(session -> {
                    session.setRevoked(true);
                    userSessionRepository.save(session);
                });

        auditLogRepository.save(AuditLog.builder()
                .actorId(userId)
                .action("SELF_DELETE_ACCOUNT")
                .entityType("User")
                .entityId(userId.toString())
                .metadata("{\"source\": \"self-service\"}")
                .createdAt(LocalDateTime.now())
                .build());
    }

    // ── Helpers ──────────────────────────────────────────────

    private User findUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserDto toUserDto(User user) {
        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .avatarUrl(user.getAvatarUrl())
                .roles(roles)
                .build();
    }
}
