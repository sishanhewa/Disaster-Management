package com.sidms.backend.repository;

import com.sidms.backend.entity.EmergencyResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EmergencyResourceRepository extends JpaRepository<EmergencyResource, UUID> {
    List<EmergencyResource> findAllByOrderByCreatedAtDesc();
}
