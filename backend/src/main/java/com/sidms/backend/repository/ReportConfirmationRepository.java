package com.sidms.backend.repository;

import com.sidms.backend.entity.ReportConfirmation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReportConfirmationRepository extends JpaRepository<ReportConfirmation, UUID> {
    List<ReportConfirmation> findByReportId(UUID reportId);

    Optional<ReportConfirmation> findByReportIdAndUserId(UUID reportId, UUID userId);

    boolean existsByReportIdAndUserId(UUID reportId, UUID userId);

    void deleteByReportId(UUID reportId);

    long countByReportIdAndIsConfirmationTrue(UUID reportId);

    long countByReportIdAndIsConfirmationFalse(UUID reportId);
}
