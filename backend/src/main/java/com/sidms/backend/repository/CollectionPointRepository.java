package com.sidms.backend.repository;

import com.sidms.backend.entity.CollectionPoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CollectionPointRepository extends JpaRepository<CollectionPoint, UUID> {
    List<CollectionPoint> findByIsActiveTrue();
}
