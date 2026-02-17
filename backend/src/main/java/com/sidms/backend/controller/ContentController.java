package com.sidms.backend.controller;

import com.sidms.backend.dto.content.FaqEntryDto;
import com.sidms.backend.dto.content.GuideArticleDto;
import com.sidms.backend.security.CustomUserDetails;
import com.sidms.backend.service.ContentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
public class ContentController {

    private final ContentService contentService;

    public ContentController(ContentService contentService) {
        this.contentService = contentService;
    }

    // ── Public endpoints ────────────────────────────────────

    @GetMapping("/api/v1/guides")
    public ResponseEntity<List<GuideArticleDto>> getGuides(
            @RequestParam(defaultValue = "en") String language) {
        return ResponseEntity.ok(contentService.getGuides(language));
    }

    @GetMapping("/api/v1/guides/{slug}")
    public ResponseEntity<GuideArticleDto> getGuideBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(contentService.getGuideBySlug(slug));
    }

    @GetMapping("/api/v1/faq")
    public ResponseEntity<List<FaqEntryDto>> getFaqs(
            @RequestParam(defaultValue = "en") String language) {
        return ResponseEntity.ok(contentService.getFaqs(language));
    }

    // ── Admin endpoints ─────────────────────────────────────

    @PostMapping("/api/v1/admin/guides")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GuideArticleDto> createGuide(@RequestBody GuideArticleDto request,
                                                        @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(contentService.createGuide(request, principal.getUser().getId()));
    }

    @PutMapping("/api/v1/admin/guides/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GuideArticleDto> updateGuide(@PathVariable UUID id,
                                                        @RequestBody GuideArticleDto request) {
        return ResponseEntity.ok(contentService.updateGuide(id, request));
    }

    @PostMapping("/api/v1/admin/faq")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FaqEntryDto> createFaq(@RequestBody FaqEntryDto request,
                                                  @AuthenticationPrincipal CustomUserDetails principal) {
        return ResponseEntity.ok(contentService.createFaq(request, principal.getUser().getId()));
    }

    @PutMapping("/api/v1/admin/faq/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FaqEntryDto> updateFaq(@PathVariable UUID id,
                                                  @RequestBody FaqEntryDto request) {
        return ResponseEntity.ok(contentService.updateFaq(id, request));
    }
}
