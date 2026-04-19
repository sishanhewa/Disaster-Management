package com.sidms.backend.repository;

import com.sidms.backend.entity.ReliefNeed;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReliefNeedRepository extends JpaRepository<ReliefNeed, UUID> {
    List<ReliefNeed> findByIsActiveTrue();
    List<ReliefNeed> findByCamp_Id(UUID campId);
    List<ReliefNeed> findByCamp_Manager_Id(UUID managerId);
}
