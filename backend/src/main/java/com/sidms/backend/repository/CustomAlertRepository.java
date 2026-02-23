package com.sidms.backend.repository;

import com.sidms.backend.model.CustomAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CustomAlertRepository extends JpaRepository<CustomAlert, UUID> {
    List<CustomAlert> findByActiveTrueOrderByCreatedAtDesc();
}
