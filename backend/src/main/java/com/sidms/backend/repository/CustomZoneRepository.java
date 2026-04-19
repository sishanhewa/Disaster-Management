package com.sidms.backend.repository;

import com.sidms.backend.entity.CustomZone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomZoneRepository extends JpaRepository<CustomZone, UUID> {
    List<CustomZone> findByDeletedAtIsNullAndIsActiveTrue();
}
