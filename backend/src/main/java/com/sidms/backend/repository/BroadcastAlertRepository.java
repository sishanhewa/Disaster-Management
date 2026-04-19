package com.sidms.backend.repository;

import com.sidms.backend.entity.BroadcastAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BroadcastAlertRepository extends JpaRepository<BroadcastAlert, UUID> {
    List<BroadcastAlert> findByIsActiveTrueOrderByCreatedAtDesc();
}
