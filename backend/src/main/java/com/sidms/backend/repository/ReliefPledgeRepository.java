package com.sidms.backend.repository;

import com.sidms.backend.entity.ReliefPledge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReliefPledgeRepository extends JpaRepository<ReliefPledge, UUID> {
    List<ReliefPledge> findByNeed_Camp_Manager_Id(UUID managerId);
    List<ReliefPledge> findByDonor_Id(UUID donorId);
    List<ReliefPledge> findByNeed_Id(UUID needId);
}
