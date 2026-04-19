package com.sidms.backend.controller;

import com.sidms.backend.dto.admin.AdminDashboardStatsDto;
import com.sidms.backend.dto.admin.AdminUserDto;
import com.sidms.backend.dto.admin.UpdateUserRolesRequest;
import com.sidms.backend.service.AdminUserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminUserService adminUserService;

    public AdminController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserDto>> getAllUsers(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false, name = "q") String query,
            @RequestParam(required = false, name = "search") String search) {
        String effectiveQuery = (query != null && !query.isBlank()) ? query : search;
        return ResponseEntity.ok(adminUserService.getAllUsers(pageable, effectiveQuery));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserDto> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(adminUserService.getUserById(id));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<AdminUserDto> updateUser(@PathVariable UUID id,
            @RequestBody com.sidms.backend.dto.admin.UpdateUserRequest request) {
        return ResponseEntity.ok(adminUserService.updateUser(id, request));
    }

    @PutMapping("/users/{id}/roles")
    public ResponseEntity<AdminUserDto> updateUserRoles(@PathVariable UUID id,
            @RequestBody UpdateUserRolesRequest request) {
        return ResponseEntity.ok(adminUserService.updateUserRoles(id, request));
    }

    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<AdminUserDto> deactivateUser(@PathVariable UUID id) {
        return ResponseEntity.ok(adminUserService.deactivateUser(id));
    }

    @PutMapping("/users/{id}/reactivate")
    public ResponseEntity<AdminUserDto> reactivateUser(@PathVariable UUID id) {
        return ResponseEntity.ok(adminUserService.reactivateUser(id));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminDashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminUserService.getDashboardStats());
    }
}
