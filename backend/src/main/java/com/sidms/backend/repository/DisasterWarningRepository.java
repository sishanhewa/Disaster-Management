package com.sidms.backend.repository;

import com.sidms.backend.entity.DisasterWarning;
import com.sidms.backend.entity.enums.WarningStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DisasterWarningRepository extends JpaRepository<DisasterWarning, UUID> {
    List<DisasterWarning> findByStatus(WarningStatus status);

    List<DisasterWarning> findByStatusOrderByCreatedAtDesc(WarningStatus status);

    org.springframework.data.domain.Page<DisasterWarning> findByStatusOrderByCreatedAtDesc(WarningStatus status,
            org.springframework.data.domain.Pageable pageable);

    java.util.Optional<DisasterWarning> findFirstBySource(String source);

    java.util.Optional<DisasterWarning> findFirstByProposedByReportId(UUID proposedByReportId);
}
