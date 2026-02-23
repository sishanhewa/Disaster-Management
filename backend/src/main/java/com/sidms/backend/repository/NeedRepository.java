package com.sidms.backend.repository;

import com.sidms.backend.model.Need;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NeedRepository extends JpaRepository<Need, UUID> {
    List<Need> findByIsActiveTrue();

    List<Need> findByCampId(UUID campId);

    List<Need> findByCamp_Manager_Id(UUID managerId);
}
