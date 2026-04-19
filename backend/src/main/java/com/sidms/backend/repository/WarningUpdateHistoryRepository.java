package com.sidms.backend.repository;

import com.sidms.backend.entity.WarningUpdateHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WarningUpdateHistoryRepository extends JpaRepository<WarningUpdateHistory, UUID> {
    List<WarningUpdateHistory> findByWarningIdOrderByUpdatedAtDesc(UUID warningId);
}
