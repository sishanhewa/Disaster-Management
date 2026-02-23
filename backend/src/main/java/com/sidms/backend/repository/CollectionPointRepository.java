package com.sidms.backend.repository;

import com.sidms.backend.model.CollectionPoint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CollectionPointRepository extends JpaRepository<CollectionPoint, UUID> {
}
