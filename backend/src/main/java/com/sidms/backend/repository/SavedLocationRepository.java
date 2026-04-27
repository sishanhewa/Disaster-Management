package com.sidms.backend.repository;

import com.sidms.backend.entity.SavedLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SavedLocationRepository extends JpaRepository<SavedLocation, UUID> {
    List<SavedLocation> findByUserIdOrderBySortOrderAscCreatedAtAsc(UUID userId);

    long countByUserId(UUID userId);
}
