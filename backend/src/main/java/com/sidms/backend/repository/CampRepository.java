package com.sidms.backend.repository;

import com.sidms.backend.entity.Camp;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CampRepository extends JpaRepository<Camp, UUID> {
    List<Camp> findByDistrictIgnoreCase(String district);
    List<Camp> findByManager_Id(UUID managerId);
    List<Camp> findByIsActiveTrueOrderByCampNameAsc();
    boolean existsByCampName(String campName);
}
