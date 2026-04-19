package com.sidms.backend.repository;

import com.sidms.backend.entity.AlertRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AlertRuleRepository extends JpaRepository<AlertRule, UUID> {
    List<AlertRule> findByUserIdAndIsActiveTrue(UUID userId);
    List<AlertRule> findByIsActiveTrue();
    List<AlertRule> findByUserId(UUID userId);
    long countByUserId(UUID userId);
}
