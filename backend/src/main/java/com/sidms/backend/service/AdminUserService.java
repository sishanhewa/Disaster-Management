package com.sidms.backend.service;

import com.sidms.backend.dto.admin.AdminDashboardStatsDto;
import com.sidms.backend.dto.admin.AdminUserDto;
import com.sidms.backend.dto.admin.UpdateUserRolesRequest;
import com.sidms.backend.entity.LoginAttempt;
import com.sidms.backend.entity.Role;
import com.sidms.backend.entity.User;
import com.sidms.backend.entity.enums.ReportStatus;
import com.sidms.backend.entity.enums.WarningStatus;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.exception.ValidationException;
import com.sidms.backend.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserSessionRepository userSessionRepository;
    private final LoginAttemptRepository loginAttemptRepository;
    private final CommunityReportRepository communityReportRepository;
    private final DisasterWarningRepository disasterWarningRepository;
    private final SosIncidentRepository sosIncidentRepository;

    public AdminUserService(UserRepository userRepository,
            RoleRepository roleRepository,
            UserSessionRepository userSessionRepository,
            LoginAttemptRepository loginAttemptRepository,
            CommunityReportRepository communityReportRepository,
            DisasterWarningRepository disasterWarningRepository,
            SosIncidentRepository sosIncidentRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userSessionRepository = userSessionRepository;
        this.loginAttemptRepository = loginAttemptRepository;
        this.communityReportRepository = communityReportRepository;
        this.disasterWarningRepository = disasterWarningRepository;
        this.sosIncidentRepository = sosIncidentRepository;
    }

    public Page<AdminUserDto> getAllUsers(Pageable pageable, String query) {
        String q = query == null ? null : query.trim();
        if (q == null || q.isEmpty()) {
            return userRepository.findAll(pageable).map(this::toAdminUserDto);
        }

        String like = "%" + q.toLowerCase() + "%";
        Specification<User> spec = (root, cq, cb) -> cb.or(
                cb.like(cb.lower(root.get("displayName")), like),
                cb.like(cb.lower(root.get("email")), like),
                cb.like(cb.lower(cb.coalesce(root.get("phone"), "")), like));

        return userRepository.findAll(spec, pageable).map(this::toAdminUserDto);
    }

    public AdminUserDto getUserById(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return toAdminUserDto(user);
    }

    @Transactional
    public AdminUserDto updateUser(UUID userId, com.sidms.backend.dto.admin.UpdateUserRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (req.getDisplayName() != null)
            user.setDisplayName(req.getDisplayName());
        if (req.getPhone() != null)
            user.setPhone(req.getPhone());
        if (req.getIsActive() != null)
            user.setIsActive(req.getIsActive());

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return toAdminUserDto(user);
    }

    @Transactional
    public AdminUserDto updateUserRoles(UUID userId, UpdateUserRolesRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (req.getRoles() == null || req.getRoles().isEmpty()) {
            throw new ValidationException("At least one role is required");
        }

        Set<Role> newRoles = new HashSet<>();
        for (String roleName : req.getRoles()) {
            Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new ValidationException("Role not found: " + roleName));
            newRoles.add(role);
        }

        user.setRoles(newRoles);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return toAdminUserDto(user);
    }

    @Transactional
    public AdminUserDto deactivateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        // Revoke all sessions
        userSessionRepository.findByUserIdAndRevokedFalse(userId)
                .forEach(session -> {
                    session.setRevoked(true);
                    userSessionRepository.save(session);
                });

        return toAdminUserDto(user);
    }

    @Transactional
    public AdminUserDto reactivateUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        user.setIsActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return toAdminUserDto(user);
    }

    public AdminDashboardStatsDto getDashboardStats() {
        long totalUsers = userRepository.count();
        long activeUsers = userRepository.countByIsActiveTrue();
        long totalReports = communityReportRepository.count();
        long pendingReports = communityReportRepository.findByStatus(ReportStatus.PENDING,
                Pageable.unpaged()).getTotalElements();
        long activeWarnings = disasterWarningRepository.findByStatus(WarningStatus.ACTIVE).size();
        long totalSosIncidents = sosIncidentRepository.count();

        return AdminDashboardStatsDto.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalReports(totalReports)
                .pendingReports(pendingReports)
                .activeWarnings(activeWarnings)
                .totalSosIncidents(totalSosIncidents)
                .build();
    }

    // ── Helpers ──────────────────────────────────────────────

    private AdminUserDto toAdminUserDto(User user) {
        List<String> roles = user.getRoles() == null ? Collections.emptyList()
                : user.getRoles().stream()
                        .map(Role::getName)
                        .collect(Collectors.toList());

        // Get last successful login
        LocalDateTime lastLoginAt = loginAttemptRepository
                .findTop1ByUserIdAndSuccessTrueOrderByCreatedAtDesc(user.getId())
                .map(LoginAttempt::getCreatedAt)
                .orElse(null);

        return AdminUserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .roles(roles)
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .lastLoginAt(lastLoginAt)
                .build();
    }
}
