package com.sidms.backend.repository;

import com.sidms.backend.entity.CommunityReport;
import com.sidms.backend.entity.enums.ReportStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CommunityReportRepository
        extends JpaRepository<CommunityReport, UUID>, JpaSpecificationExecutor<CommunityReport> {
    Page<CommunityReport> findByStatus(ReportStatus status, Pageable pageable);

    Page<CommunityReport> findByUserId(UUID userId, Pageable pageable);

    long countBySpatialUnitIdAndStatus(UUID spatialUnitId, ReportStatus status);
}
