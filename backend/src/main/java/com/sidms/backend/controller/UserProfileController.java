package com.sidms.backend.controller;

import com.sidms.backend.dto.auth.UserDto;
import com.sidms.backend.dto.user.*;
import com.sidms.backend.entity.SavedLocation;
import com.sidms.backend.security.CustomUserDetails;
import com.sidms.backend.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getProfile(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(userProfileService.getProfile(principal.getUser().getId()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(@AuthenticationPrincipal CustomUserDetails principal,
                                                  @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userProfileService.updateProfile(principal.getUser().getId(), request));
    }

    @PutMapping("/me/preferences")
    public ResponseEntity<Map<String, String>> updatePreferences(@AuthenticationPrincipal CustomUserDetails principal,
                                                                  @RequestBody UpdatePreferencesRequest request) {
        userProfileService.updatePreferences(principal.getUser().getId(), request);
        return ResponseEntity.ok(Map.of("message", "Preferences updated successfully"));
    }

    @PostMapping("/me/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@AuthenticationPrincipal CustomUserDetails principal,
                                                               @RequestBody ChangePasswordRequest request) {
        userProfileService.changePassword(principal.getUser().getId(), request);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    @GetMapping("/me/saved-locations")
    public ResponseEntity<List<SavedLocation>> getSavedLocations(@AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(userProfileService.getSavedLocations(principal.getUser().getId()));
    }

    @PostMapping("/me/saved-locations")
    public ResponseEntity<SavedLocation> addSavedLocation(@AuthenticationPrincipal CustomUserDetails principal,
                                                           @RequestBody SavedLocationRequest request) {
        return ResponseEntity.ok(userProfileService.addSavedLocation(principal.getUser().getId(), request));
    }

    @DeleteMapping("/me/saved-locations/{locationId}")
    public ResponseEntity<Map<String, String>> deleteSavedLocation(@AuthenticationPrincipal CustomUserDetails principal,
                                                                    @PathVariable UUID locationId) {
        userProfileService.deleteSavedLocation(principal.getUser().getId(), locationId);
        return ResponseEntity.ok(Map.of("message", "Saved location deleted successfully"));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Map<String, String>> deleteMyAccount(@AuthenticationPrincipal CustomUserDetails principal) {
        userProfileService.deleteMyAccount(principal.getUser().getId());
        return ResponseEntity.ok(Map.of("message", "Account deletion request completed"));
    }
}
