package com.sidms.backend.service;

import com.sidms.backend.dto.report.CreateReportRequest;
import com.sidms.backend.dto.report.ReportResponse;
import com.sidms.backend.entity.*;
import com.sidms.backend.entity.enums.ReportStatus;
import com.sidms.backend.entity.enums.SpatialType;
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
public class CommunityReportService {

    private final CommunityReportRepository communityReportRepository;
    private final ReportPhotoRepository reportPhotoRepository;
    private final ReportConfirmationRepository reportConfirmationRepository;
    private final SpatialUnitRepository spatialUnitRepository;
    private final DisasterWarningService disasterWarningService;

    // Base32 alphabet for geohash
    private static final String BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";

    public CommunityReportService(CommunityReportRepository communityReportRepository,
            ReportPhotoRepository reportPhotoRepository,
            ReportConfirmationRepository reportConfirmationRepository,
            SpatialUnitRepository spatialUnitRepository,
            DisasterWarningService disasterWarningService) {
        this.communityReportRepository = communityReportRepository;
        this.reportPhotoRepository = reportPhotoRepository;
        this.reportConfirmationRepository = reportConfirmationRepository;
        this.spatialUnitRepository = spatialUnitRepository;
        this.disasterWarningService = disasterWarningService;
    }

    @Transactional
    public ReportResponse createReport(CreateReportRequest req, UUID userId) {
        if (req == null) {
            throw new ValidationException("Request body is required");
        }
        if (req.getLat() == null || req.getLng() == null) {
            throw new ValidationException("Latitude and longitude are required");
        }
        if (req.getDescription() == null || req.getDescription().trim().length() < 10) {
            throw new ValidationException("Description must be at least 10 characters");
        }
        if (req.getCategory() == null || req.getCategory().isBlank()) {
            throw new ValidationException("Category is required");
        }
        if (req.getSeverityAssessment() == null || req.getSeverityAssessment().isBlank()) {
            throw new ValidationException("Severity assessment is required");
        }
        if (req.getPhotoUrls() == null || req.getPhotoUrls().isEmpty()) {
            throw new ValidationException("At least one photo is required");
        }
        if (req.getPhotoUrls() != null && req.getPhotoUrls().size() > 3) {
            throw new ValidationException("Maximum 3 photos allowed");
        }
        validateTargetSpatialUnits(req.getTargetSpatialUnitIds());

        SpatialUnit chosenSpatialUnit = resolveReportSpatialUnit(req.getExactMatchSpatialUnitId(), req.getLat(),
                req.getLng());

        // Compute geohash (7 chars)
        String geohash = computeGeohash(req.getLat(), req.getLng(), 7);

        // Save report
        CommunityReport report = CommunityReport.builder()
                .userId(userId)
                .spatialUnitId(chosenSpatialUnit != null ? chosenSpatialUnit.getId() : null)
                .category(req.getCategory().trim())
                .description(req.getDescription().trim())
                .severityAssessment(req.getSeverityAssessment().trim())
                .lat(req.getLat())
                .lng(req.getLng())
                .geohash(geohash)
                .status(ReportStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        report = communityReportRepository.save(report);

        // Save photos
        if (req.getPhotoUrls() != null) {
            for (String url : req.getPhotoUrls()) {
                reportPhotoRepository.save(ReportPhoto.builder()
                        .reportId(report.getId())
                        .cloudinaryUrl(url)
                        .uploadedAt(LocalDateTime.now())
                        .build());
            }
        }

        return toReportResponse(report, chosenSpatialUnit);
    }

    public Page<ReportResponse> getPublicReports(Pageable pageable) {
        return communityReportRepository.findByStatus(ReportStatus.VERIFIED, pageable)
                .map(report -> toReportResponse(report, loadSpatialUnit(report.getSpatialUnitId())));
    }

    public Page<ReportResponse> getMyReports(UUID userId, Pageable pageable) {
        return communityReportRepository.findByUserId(userId, pageable)
                .map(report -> toReportResponse(report, loadSpatialUnit(report.getSpatialUnitId())));
    }

    @Transactional
    public void confirmReport(UUID reportId, UUID userId, Boolean isConfirmation) {
        CommunityReport report = communityReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        if (report.getStatus() == ReportStatus.ARCHIVED) {
            throw new ValidationException("Archived reports cannot be confirmed or denied");
        }

        // Upsert vote so users can switch between confirm/deny while keeping it a
        // simple count model.
        Optional<ReportConfirmation> existing = reportConfirmationRepository.findByReportIdAndUserId(reportId, userId);
        if (existing.isPresent()) {
            ReportConfirmation confirmation = existing.get();
            confirmation.setIsConfirmation(isConfirmation);
            reportConfirmationRepository.save(confirmation);
        } else {
            reportConfirmationRepository.save(ReportConfirmation.builder()
                    .reportId(reportId)
                    .userId(userId)
                    .isConfirmation(isConfirmation)
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        // Auto-verify: confirm count >= 3 and deny < confirm
        long confirmCount = reportConfirmationRepository.countByReportIdAndIsConfirmationTrue(reportId);
        long denyCount = reportConfirmationRepository.countByReportIdAndIsConfirmationFalse(reportId);

        if (confirmCount >= 3 && denyCount < confirmCount) {
            if (report.getStatus() == ReportStatus.PENDING) {
                report.setStatus(ReportStatus.VERIFIED);
                report.setUpdatedAt(LocalDateTime.now());
                communityReportRepository.save(report);
                triggerProposedWarningIfCritical(report);
            }
        }
    }

    @Transactional
    public ReportResponse updateMyReport(UUID reportId, UUID userId, CreateReportRequest req) {
        CommunityReport report = communityReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        if (!report.getUserId().equals(userId)) {
            throw new ValidationException("You do not have permission to update this report");
        }

        if (report.getStatus() != ReportStatus.PENDING) {
            throw new ValidationException("Only pending reports can be updated");
        }

        if (req.getCategory() != null && !req.getCategory().isBlank()) {
            report.setCategory(req.getCategory().trim());
        }
        if (req.getDescription() != null) {
            String description = req.getDescription().trim();
            if (description.length() < 10) {
                throw new ValidationException("Description must be at least 10 characters");
            }
            report.setDescription(description);
        }
        if (req.getSeverityAssessment() != null) {
            String severity = req.getSeverityAssessment().trim();
            if (severity.isEmpty()) {
                throw new ValidationException("Severity assessment cannot be empty");
            }
            report.setSeverityAssessment(severity);
        }
        if (req.getExactMatchSpatialUnitId() != null) {
            SpatialUnit exactSpatialUnit = spatialUnitRepository.findById(req.getExactMatchSpatialUnitId())
                    .orElseThrow(() -> new ValidationException("Exact match spatial unit not found"));
            report.setSpatialUnitId(exactSpatialUnit.getId());
        }
        validateTargetSpatialUnits(req.getTargetSpatialUnitIds());
        if (req.getLat() != null && req.getLng() != null) {
            report.setLat(req.getLat());
            report.setLng(req.getLng());
            report.setGeohash(computeGeohash(req.getLat(), req.getLng(), 7));

            if (req.getExactMatchSpatialUnitId() == null) {
                SpatialUnit nearestGn = findNearestGn(req.getLat(), req.getLng());
                report.setSpatialUnitId(nearestGn != null ? nearestGn.getId() : null);
            }
        }

        report.setUpdatedAt(LocalDateTime.now());
        report = communityReportRepository.save(report);

        if (req.getPhotoUrls() != null) {
            if (req.getPhotoUrls().isEmpty()) {
                throw new ValidationException("At least one photo is required");
            }
            if (req.getPhotoUrls().size() > 3) {
                throw new ValidationException("Maximum 3 photos allowed");
            }
            List<ReportPhoto> oldPhotos = reportPhotoRepository.findByReportId(report.getId());
            reportPhotoRepository.deleteAll(oldPhotos);
            for (String url : req.getPhotoUrls()) {
                reportPhotoRepository.save(ReportPhoto.builder()
                        .reportId(report.getId())
                        .cloudinaryUrl(url)
                        .uploadedAt(LocalDateTime.now())
                        .build());
            }
        }

        return toReportResponse(report, loadSpatialUnit(report.getSpatialUnitId()));
    }

    @Transactional
    public void deleteMyReport(UUID reportId, UUID userId) {
        CommunityReport report = communityReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        if (!report.getUserId().equals(userId)) {
            throw new ValidationException("You do not have permission to delete this report");
        }

        if (report.getStatus() == ReportStatus.ARCHIVED) {
            throw new ValidationException("Archived reports cannot be deleted");
        }

        List<ReportPhoto> oldPhotos = reportPhotoRepository.findByReportId(reportId);
        reportPhotoRepository.deleteAll(oldPhotos);
        reportConfirmationRepository.deleteByReportId(reportId);

        communityReportRepository.delete(report);
    }

    public Page<ReportResponse> getAdminReports(Pageable pageable, String status, String category, String severity,
            UUID spatialUnitId, String query) {
        Specification<CommunityReport> spec = Specification.where(null);

        if (status != null && !status.isBlank()) {
            ReportStatus reportStatus;
            try {
                reportStatus = ReportStatus.valueOf(status.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ValidationException("Invalid report status: " + status);
            }
            spec = spec.and((root, q, cb) -> cb.equal(root.get("status"), reportStatus));
        }

        if (category != null && !category.isBlank()) {
            String categoryLower = category.trim().toLowerCase();
            spec = spec.and((root, q, cb) -> cb.like(cb.lower(root.get("category")), "%" + categoryLower + "%"));
        }

        if (severity != null && !severity.isBlank()) {
            String severityUpper = severity.trim().toUpperCase();
            spec = spec.and((root, q, cb) -> cb.equal(cb.upper(root.get("severityAssessment")), severityUpper));
        }

        if (spatialUnitId != null) {
            spec = spec.and((root, q, cb) -> cb.equal(root.get("spatialUnitId"), spatialUnitId));
        }

        if (query != null && !query.isBlank()) {
            String like = "%" + query.trim().toLowerCase() + "%";
            spec = spec.and((root, q, cb) -> cb.or(
                    cb.like(cb.lower(root.get("category")), like),
                    cb.like(cb.lower(root.get("description")), like),
                    cb.like(cb.lower(root.get("geohash")), like)));
        }

        return communityReportRepository.findAll(spec, pageable)
                .map(report -> toReportResponse(report, loadSpatialUnit(report.getSpatialUnitId())));
    }

    @Transactional
    public ReportResponse updateReportStatus(UUID reportId, String status, String rejectionReason) {
        CommunityReport report = communityReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        if (status == null || status.isBlank()) {
            throw new ValidationException("Status is required");
        }

        ReportStatus newStatus;
        try {
            newStatus = ReportStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid report status: " + status);
        }

        report.setStatus(newStatus);

        if (newStatus == ReportStatus.REJECTED) {
            if (rejectionReason == null || rejectionReason.trim().length() < 10) {
                throw new ValidationException("Rejection reason must be at least 10 characters for rejected reports");
            }
            report.setRejectionReason(rejectionReason.trim());
        } else {
            report.setRejectionReason(null);
        }

        report.setUpdatedAt(LocalDateTime.now());
        communityReportRepository.save(report);

        if (newStatus == ReportStatus.VERIFIED) {
            triggerProposedWarningIfCritical(report);
        }

        return toReportResponse(report, loadSpatialUnit(report.getSpatialUnitId()));
    }

    @Transactional
    public void deleteReportAsAdmin(UUID reportId) {
        CommunityReport report = communityReportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));

        List<ReportPhoto> oldPhotos = reportPhotoRepository.findByReportId(reportId);
        reportPhotoRepository.deleteAll(oldPhotos);
        reportConfirmationRepository.deleteByReportId(reportId);

        communityReportRepository.delete(report);
    }

    private void triggerProposedWarningIfCritical(CommunityReport report) {
        if (report.getLinkedWarningId() != null) {
            return;
        }
        if (report.getSeverityAssessment() != null) {
            String sev = report.getSeverityAssessment().toUpperCase();
            if ("HIGH".equals(sev) || "CRITICAL".equals(sev) || "EXTREME".equals(sev)) {
                try {
                    DisasterWarning proposed = disasterWarningService.createProposedWarningFromReport(report);
                    report.setLinkedWarningId(proposed.getId());
                    report.setUpdatedAt(LocalDateTime.now());
                    communityReportRepository.save(report);
                } catch (Exception e) {
                    // Log error and continue
                }
            }
        }
    }

    // ── Geohash computation ─────────────────────────────────

    private String computeGeohash(double lat, double lng, int precision) {
        double latMin = -90, latMax = 90;
        double lngMin = -180, lngMax = 180;
        boolean isLng = true;
        int bit = 0;
        int ch = 0;
        StringBuilder geohash = new StringBuilder();

        while (geohash.length() < precision) {
            if (isLng) {
                double mid = (lngMin + lngMax) / 2;
                if (lng >= mid) {
                    ch |= (1 << (4 - bit));
                    lngMin = mid;
                } else {
                    lngMax = mid;
                }
            } else {
                double mid = (latMin + latMax) / 2;
                if (lat >= mid) {
                    ch |= (1 << (4 - bit));
                    latMin = mid;
                } else {
                    latMax = mid;
                }
            }
            isLng = !isLng;
            bit++;
            if (bit == 5) {
                geohash.append(BASE32.charAt(ch));
                bit = 0;
                ch = 0;
            }
        }

        return geohash.toString();
    }

    // ── Helpers ──────────────────────────────────────────────

    private ReportResponse toReportResponse(CommunityReport report, SpatialUnit spatialUnit) {
        List<String> photoUrls = reportPhotoRepository.findByReportId(report.getId()).stream()
                .map(ReportPhoto::getCloudinaryUrl)
                .collect(Collectors.toList());

        long confirmCount = reportConfirmationRepository.countByReportIdAndIsConfirmationTrue(report.getId());
        long denyCount = reportConfirmationRepository.countByReportIdAndIsConfirmationFalse(report.getId());

        return ReportResponse.builder()
                .id(report.getId())
                .userId(report.getUserId())
                .category(report.getCategory())
                .description(report.getDescription())
                .severityAssessment(report.getSeverityAssessment())
                .lat(report.getLat())
                .lng(report.getLng())
                .geohash(report.getGeohash())
                .status(report.getStatus().name())
                .spatialUnitName(spatialUnit != null ? spatialUnit.getName() : null)
                .photoUrls(photoUrls)
                .confirmCount((int) confirmCount)
                .denyCount((int) denyCount)
                .createdAt(report.getCreatedAt())
                .build();
    }

    private SpatialUnit loadSpatialUnit(UUID spatialUnitId) {
        if (spatialUnitId == null)
            return null;
        return spatialUnitRepository.findById(spatialUnitId).orElse(null);
    }

    private SpatialUnit resolveReportSpatialUnit(UUID exactMatchSpatialUnitId, Double lat, Double lng) {
        if (exactMatchSpatialUnitId != null) {
            return spatialUnitRepository.findById(exactMatchSpatialUnitId)
                    .orElseThrow(() -> new ValidationException("Exact match spatial unit not found"));
        }
        return findNearestGn(lat, lng);
    }

    private SpatialUnit findNearestGn(Double lat, Double lng) {
        List<SpatialUnit> gnDivisions = spatialUnitRepository.findByType(SpatialType.GN_DIVISION);
        return gnDivisions.stream()
                .filter(su -> su.getLat() != null && su.getLng() != null)
                .min(Comparator.comparingDouble(su -> Math
                        .sqrt(Math.pow(su.getLat() - lat, 2) + Math.pow(su.getLng() - lng, 2))))
                .orElse(null);
    }

    private void validateTargetSpatialUnits(Set<UUID> targetSpatialUnitIds) {
        if (targetSpatialUnitIds == null || targetSpatialUnitIds.isEmpty()) {
            return;
        }
        for (UUID targetId : targetSpatialUnitIds) {
            if (targetId == null || !spatialUnitRepository.existsById(targetId)) {
                throw new ValidationException("Target spatial unit not found: " + targetId);
            }
        }
    }
}
