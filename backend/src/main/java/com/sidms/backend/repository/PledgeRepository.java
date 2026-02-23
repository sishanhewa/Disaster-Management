package com.sidms.backend.repository;

import com.sidms.backend.model.Pledge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface PledgeRepository extends JpaRepository<Pledge, UUID> {
    List<Pledge> findByNeed_Camp_Manager_Id(UUID managerId);
}
