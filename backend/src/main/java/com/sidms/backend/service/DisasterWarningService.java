package com.sidms.backend.service;

import com.sidms.backend.dto.disaster.*;
import com.sidms.backend.entity.*;
import com.sidms.backend.entity.enums.DisasterCategory;
import com.sidms.backend.entity.enums.DisasterSeverity;
import com.sidms.backend.entity.enums.WarningStatus;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.exception.ValidationException;
import com.sidms.backend.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DisasterWarningService {

    private final DisasterWarningRepository disasterWarningRepository;
    private final WarningSpatialUnitRepository warningSpatialUnitRepository;
    private final SpatialUnitRepository spatialUnitRepository;
    private final WarningUpdateHistoryRepository warningUpdateHistoryRepository;
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    // Severity ordering for sorting (EXTREME first)
    private static final List<DisasterSeverity> SEVERITY_ORDER = List.of(
            DisasterSeverity.EXTREME, DisasterSeverity.CRITICAL,
            DisasterSeverity.HIGH, DisasterSeverity.MODERATE, DisasterSeverity.LOW);

    public DisasterWarningService(DisasterWarningRepository disasterWarningRepository,
            WarningSpatialUnitRepository warningSpatialUnitRepository,
            SpatialUnitRepository spatialUnitRepository,
            WarningUpdateHistoryRepository warningUpdateHistoryRepository,
            StringRedisTemplate redisTemplate,
            ObjectMapper objectMapper) {
        this.disasterWarningRepository = disasterWarningRepository;
        this.warningSpatialUnitRepository = warningSpatialUnitRepository;
        this.spatialUnitRepository = spatialUnitRepository;
        this.warningUpdateHistoryRepository = warningUpdateHistoryRepository;
        this.redisTemplate = redisTemplate;
        this.objectMapper = objectMapper;
    }

    // ── Ancestor chain ──────────────────────────────────────

    public List<UUID> getAncestorChain(UUID spatialUnitId) {
        List<UUID> chain = new ArrayList<>();
        UUID currentId = spatialUnitId;

        while (currentId != null) {
            chain.add(currentId);
            UUID parentId = spatialUnitRepository.findById(currentId)
                    .map(SpatialUnit::getParentId)
                    .orElse(null);
            currentId = parentId;
        }

        return chain;
    }

    // ── Public queries ──────────────────────────────────────

    public List<WarningResponse> getActiveWarningsForSpatialUnit(UUID spatialUnitId) {
        // Check Redis cache
        String cacheKey = "warnings:unit:" + spatialUnitId;
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return objectMapper.readValue(cached,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, WarningResponse.class));
            }
        } catch (Exception ignored) {
        }

        // Build ancestor chain
        List<UUID> ancestorChain = getAncestorChain(spatialUnitId);

        // Find all warning-spatial-unit links for the chain
        List<WarningSpatialUnit> links = warningSpatialUnitRepository.findBySpatialUnitIdIn(ancestorChain);

        List<UUID> warningIds = links.stream()
                .map(WarningSpatialUnit::getWarningId)
                .distinct()
                .collect(Collectors.toList());

        if (warningIds.isEmpty()) {
            cacheResult(cacheKey, List.of(), 5);
            return List.of();
        }

        // Load ACTIVE warnings
        List<DisasterWarning> activeWarnings = disasterWarningRepository.findByStatus(WarningStatus.ACTIVE).stream()
                .filter(w -> warningIds.contains(w.getId()))
                .collect(Collectors.toList());

        List<WarningResponse> results = activeWarnings.stream()
                .map(this::toWarningResponse)
                .sorted(Comparator.comparingInt(w -> {
                    int idx = SEVERITY_ORDER.indexOf(DisasterSeverity.valueOf(w.getSeverity()));
                    return idx >= 0 ? idx : Integer.MAX_VALUE;
                }))
                .collect(Collectors.toList());

        cacheResult(cacheKey, results, 5);
        return results;
    }

    public List<WarningResponse> getAllActiveWarnings() {
        String cacheKey = "warnings:active";
        try {
            String cached = redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return objectMapper.readValue(cached,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, WarningResponse.class));
            }
        } catch (Exception ignored) {
        }

        List<WarningResponse> results = disasterWarningRepository
                .findByStatusOrderByCreatedAtDesc(WarningStatus.ACTIVE).stream()
                .map(this::toWarningResponse)
                .collect(Collectors.toList());

        cacheResult(cacheKey, results, 5);
        return results;
    }

    public WarningResponse getWarningById(UUID warningId) {
        DisasterWarning warning = disasterWarningRepository.findById(warningId)
                .orElseThrow(() -> new ResourceNotFoundException("Warning not found: " + warningId));
        return toWarningResponse(warning);
    }

    public Page<DisasterWarning> getAllWarnings(Pageable pageable) {
        return disasterWarningRepository.findAll(pageable);
    }

    // ── Admin mutations ─────────────────────────────────────

    @Transactional
    public WarningResponse createWarning(CreateWarningRequest req, UUID createdBy) {
        if (req == null) {
            throw new ValidationException("Request body is required");
        }
        if (req.getTargetSpatialUnitIds() == null || req.getTargetSpatialUnitIds().isEmpty()) {
            throw new ValidationException("At least one target spatial unit is required");
        }
        if (req.getHeadline() == null || req.getHeadline().trim().length() < 8
                || req.getHeadline().trim().length() > 180) {
            throw new ValidationException("Headline must be between 8 and 180 characters");
        }
        if (req.getBulletinText() == null || req.getBulletinText().trim().length() < 15
                || req.getBulletinText().trim().length() > 2000) {
            throw new ValidationException("Bulletin text must be between 15 and 2000 characters");
        }
        if (req.getExpiresAt() == null || !req.getExpiresAt().isAfter(LocalDateTime.now())) {
            throw new ValidationException("Expiration must be in the future");
        }

        DisasterCategory category = parseCategory(req.getCategory());
        DisasterSeverity severity = parseSeverity(req.getSeverity());
        List<UUID> targetUnitIds = req.getTargetSpatialUnitIds().stream().filter(Objects::nonNull).distinct()
                .collect(Collectors.toList());
        if (targetUnitIds.isEmpty()) {
            throw new ValidationException("At least one valid target spatial unit is required");
        }

        // Verify all spatial unit IDs exist
        for (UUID suId : targetUnitIds) {
            if (!spatialUnitRepository.existsById(suId)) {
                throw new ValidationException("Spatial unit not found: " + suId);
            }
        }

        // Save warning
        DisasterWarning warning = DisasterWarning.builder()
                .category(category)
                .severity(severity)
                .status(WarningStatus.ACTIVE)
                .headline(req.getHeadline().trim())
                .bulletinText(req.getBulletinText().trim())
                .areaText(req.getAreaText() != null ? req.getAreaText().trim() : null)
                .instructions(req.getInstructions() != null ? req.getInstructions().trim() : null)
                .source("admin")
                .expiresAt(req.getExpiresAt())
                .createdBy(createdBy)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        warning = disasterWarningRepository.save(warning);

        // Save join table records
        for (UUID suId : targetUnitIds) {
            warningSpatialUnitRepository.save(WarningSpatialUnit.builder()
                    .warningId(warning.getId())
                    .spatialUnitId(suId)
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        // Evict caches
        evictWarningCaches(targetUnitIds);

        return toWarningResponse(warning);
    }

    @Transactional
    public WarningResponse updateWarning(UUID warningId, UpdateWarningRequest req, UUID updatedBy) {
        DisasterWarning warning = disasterWarningRepository.findById(warningId)
                .orElseThrow(() -> new ResourceNotFoundException("Warning not found: " + warningId));

        if (req == null) {
            throw new ValidationException("Request body is required");
        }

        DisasterSeverity previousSeverity = warning.getSeverity();

        if (req.getSeverity() != null) {
            warning.setSeverity(parseSeverity(req.getSeverity()));
        }
        if (req.getHeadline() != null) {
            String headline = req.getHeadline().trim();
            if (headline.length() < 8 || headline.length() > 180) {
                throw new ValidationException("Headline must be between 8 and 180 characters");
            }
            warning.setHeadline(headline);
        }
        if (req.getBulletinText() != null) {
            String bulletin = req.getBulletinText().trim();
            if (bulletin.length() < 15 || bulletin.length() > 2000) {
                throw new ValidationException("Bulletin text must be between 15 and 2000 characters");
            }
            warning.setBulletinText(bulletin);
        }
        if (req.getStatus() != null) {
            WarningStatus newStatus = parseWarningStatus(req.getStatus());
            warning.setStatus(newStatus);
            if (newStatus == WarningStatus.RESOLVED) {
                warning.setResolvedAt(LocalDateTime.now());
            }
        }

        warning.setUpdatedAt(LocalDateTime.now());
        disasterWarningRepository.save(warning);

        // Save update history
        warningUpdateHistoryRepository.save(WarningUpdateHistory.builder()
                .warningId(warningId)
                .previousSeverity(previousSeverity)
                .newSeverity(warning.getSeverity())
                .updateText(req.getUpdateText())
                .updatedBy(updatedBy)
                .updatedAt(LocalDateTime.now())
                .build());

        // Evict caches for affected spatial units
        List<UUID> affectedUnitIds = warningSpatialUnitRepository.findByWarningId(warningId).stream()
                .map(WarningSpatialUnit::getSpatialUnitId)
                .collect(Collectors.toList());
        evictWarningCaches(affectedUnitIds);

        return toWarningResponse(warning);
    }

    @Transactional
    public void resolveWarning(UUID warningId, UUID updatedBy) {
        DisasterWarning warning = disasterWarningRepository.findById(warningId)
                .orElseThrow(() -> new ResourceNotFoundException("Warning not found: " + warningId));

        DisasterSeverity previousSeverity = warning.getSeverity();

        warning.setStatus(WarningStatus.RESOLVED);
        warning.setResolvedAt(LocalDateTime.now());
        warning.setUpdatedAt(LocalDateTime.now());
        disasterWarningRepository.save(warning);

        // Save update history
        warningUpdateHistoryRepository.save(WarningUpdateHistory.builder()
                .warningId(warningId)
                .previousSeverity(previousSeverity)
                .newSeverity(previousSeverity)
                .updateText("Warning resolved")
                .updatedBy(updatedBy)
                .updatedAt(LocalDateTime.now())
                .build());

        // Evict caches
        List<UUID> affectedUnitIds = warningSpatialUnitRepository.findByWarningId(warningId).stream()
                .map(WarningSpatialUnit::getSpatialUnitId)
                .collect(Collectors.toList());
        evictWarningCaches(affectedUnitIds);
    }

    // ── Proposed Warnings Flow ────────────────────────────────

    public Page<DisasterWarning> getProposedWarnings(Pageable pageable) {
        return disasterWarningRepository.findByStatusOrderByCreatedAtDesc(WarningStatus.PROPOSED, pageable);
    }

    @Transactional
    public DisasterWarning createAutomatedWarning(DisasterCategory category, DisasterSeverity severity,
            String headline, String bulletinText, UUID spatialUnitId) {
        DisasterWarning warning = DisasterWarning.builder()
                .category(category)
                .severity(severity)
                .status(WarningStatus.ACTIVE)
                .headline(headline)
                .bulletinText(bulletinText)
                .areaText("Automated system detection")
                .instructions("Please monitor local news and follow official guidance.")
                .source("system_auto")
                .expiresAt(LocalDateTime.now().plusHours(12))
                .createdBy(null) // System created
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        warning = disasterWarningRepository.save(warning);

        if (spatialUnitId != null) {
            warningSpatialUnitRepository.save(WarningSpatialUnit.builder()
                    .warningId(warning.getId())
                    .spatialUnitId(spatialUnitId)
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        // Evict caches
        evictWarningCaches(List.of(spatialUnitId));

        return warning;
    }

    @Transactional
    public DisasterWarning createProposedWarningFromReport(CommunityReport report) {
        String sourceMarker = "cr:" + report.getId();
        Optional<DisasterWarning> existing = disasterWarningRepository.findFirstByProposedByReportId(report.getId());
        if (existing.isEmpty()) {
            existing = disasterWarningRepository.findFirstBySource(sourceMarker);
        }
        if (existing.isPresent()) {
            return existing.get();
        }

        DisasterCategory cat = DisasterCategory.OTHER;
        try {
            cat = DisasterCategory.valueOf(report.getCategory().toUpperCase());
        } catch (Exception ignored) {
        }

        DisasterSeverity sev = DisasterSeverity.MODERATE;
        try {
            sev = DisasterSeverity.valueOf(report.getSeverityAssessment().toUpperCase());
        } catch (Exception ignored) {
        }

        DisasterWarning warning = DisasterWarning.builder()
                .category(cat)
                .severity(sev)
                .status(WarningStatus.PROPOSED)
                .headline("Proposed Warning: " + cat.name())
                .bulletinText(report.getDescription())
                .areaText("Community reported incident")
                .instructions("Pending official review.")
                .source(sourceMarker)
                .proposedByReportId(report.getId())
                .expiresAt(LocalDateTime.now().plusHours(24))
                .createdBy(report.getUserId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        warning = disasterWarningRepository.save(warning);

        if (report.getSpatialUnitId() != null) {
            warningSpatialUnitRepository.save(WarningSpatialUnit.builder()
                    .warningId(warning.getId())
                    .spatialUnitId(report.getSpatialUnitId())
                    .createdAt(LocalDateTime.now())
                    .build());
        }
        return warning;
    }

    @Transactional
    public WarningResponse approveProposedWarning(UUID warningId, UUID updatedBy) {
        DisasterWarning warning = disasterWarningRepository.findById(warningId)
                .orElseThrow(() -> new ResourceNotFoundException("Warning not found"));
        if (warning.getStatus() != WarningStatus.PROPOSED) {
            throw new ValidationException("Only proposed warnings can be approved");
        }
        warning.setStatus(WarningStatus.ACTIVE);
        warning.setUpdatedAt(LocalDateTime.now());
        disasterWarningRepository.save(warning);

        List<UUID> affectedUnitIds = warningSpatialUnitRepository.findByWarningId(warningId).stream()
                .map(WarningSpatialUnit::getSpatialUnitId)
                .collect(Collectors.toList());
        evictWarningCaches(affectedUnitIds);

        return toWarningResponse(warning);
    }

    @Transactional
    public void rejectProposedWarning(UUID warningId, UUID updatedBy, String reason) {
        DisasterWarning warning = disasterWarningRepository.findById(warningId)
                .orElseThrow(() -> new ResourceNotFoundException("Warning not found"));
        if (warning.getStatus() != WarningStatus.PROPOSED) {
            throw new ValidationException("Only proposed warnings can be rejected");
        }
        if (reason == null || reason.trim().length() < 5) {
            throw new ValidationException("Rejection reason must be at least 5 characters");
        }
        DisasterSeverity previousSeverity = warning.getSeverity();
        warning.setStatus(WarningStatus.REJECTED);
        warning.setUpdatedAt(LocalDateTime.now());
        disasterWarningRepository.save(warning);

        warningUpdateHistoryRepository.save(WarningUpdateHistory.builder()
                .warningId(warningId)
                .previousSeverity(previousSeverity)
                .newSeverity(previousSeverity)
                .updateText("Proposed warning rejected: " + reason.trim())
                .updatedBy(updatedBy)
                .updatedAt(LocalDateTime.now())
                .build());
    }

    @Transactional
    public void deleteWarning(UUID warningId) {
        DisasterWarning warning = disasterWarningRepository.findById(warningId)
                .orElseThrow(() -> new ResourceNotFoundException("Warning not found"));

        List<UUID> affectedUnitIds = warningSpatialUnitRepository.findByWarningId(warningId).stream()
                .map(WarningSpatialUnit::getSpatialUnitId)
                .collect(Collectors.toList());

        warningSpatialUnitRepository.deleteByWarningId(warningId);
        disasterWarningRepository.delete(warning);
        evictWarningCaches(affectedUnitIds);
    }

    // ── Helpers ──────────────────────────────────────────────

    private WarningResponse toWarningResponse(DisasterWarning warning) {
        List<WarningSpatialUnit> links = warningSpatialUnitRepository.findByWarningId(warning.getId());

        List<SpatialUnitRef> targetedUnits = links.stream()
                .map(link -> spatialUnitRepository.findById(link.getSpatialUnitId())
                        .map(su -> SpatialUnitRef.builder()
                                .id(su.getId())
                                .pcode(su.getPcode())
                                .name(su.getName())
                                .type(su.getType().name())
                                .build())
                        .orElse(null))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return WarningResponse.builder()
                .id(warning.getId())
                .category(warning.getCategory().name())
                .severity(warning.getSeverity().name())
                .status(warning.getStatus().name())
                .headline(warning.getHeadline())
                .bulletinText(warning.getBulletinText())
                .areaText(warning.getAreaText())
                .instructions(warning.getInstructions())
                .targetedUnits(targetedUnits)
                .expiresAt(warning.getExpiresAt())
                .createdAt(warning.getCreatedAt())
                .build();
    }

    private void evictWarningCaches(List<UUID> spatialUnitIds) {
        try {
            redisTemplate.delete("warnings:active");

            for (UUID suId : spatialUnitIds) {
                redisTemplate.delete("warnings:unit:" + suId);

                // Also evict descendant caches
                List<SpatialUnit> children = spatialUnitRepository.findByParentId(suId);
                for (SpatialUnit child : children) {
                    redisTemplate.delete("warnings:unit:" + child.getId());
                    // One more level: grandchildren
                    spatialUnitRepository.findByParentId(child.getId())
                            .forEach(gc -> redisTemplate.delete("warnings:unit:" + gc.getId()));
                }
            }
        } catch (Exception ignored) {
            // Redis down — caches will expire naturally
        }
    }

    private void cacheResult(String key, Object value, int minutes) {
        try {
            redisTemplate.opsForValue().set(key,
                    objectMapper.writeValueAsString(value),
                    Duration.ofMinutes(minutes));
        } catch (Exception ignored) {
        }
    }

    private DisasterCategory parseCategory(String value) {
        if (value == null || value.isBlank()) {
            throw new ValidationException("Category is required");
        }
        try {
            return DisasterCategory.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ValidationException("Invalid warning category: " + value);
        }
    }

    private DisasterSeverity parseSeverity(String value) {
        if (value == null || value.isBlank()) {
            throw new ValidationException("Severity is required");
        }
        try {
            return DisasterSeverity.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ValidationException("Invalid warning severity: " + value);
        }
    }

    private WarningStatus parseWarningStatus(String value) {
        if (value == null || value.isBlank()) {
            throw new ValidationException("Status is required");
        }
        try {
            return WarningStatus.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ValidationException("Invalid warning status: " + value);
        }
    }
}
