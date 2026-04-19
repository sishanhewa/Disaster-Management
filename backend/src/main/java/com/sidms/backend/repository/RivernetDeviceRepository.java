package com.sidms.backend.repository;

import com.sidms.backend.entity.RivernetDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RivernetDeviceRepository extends JpaRepository<RivernetDevice, UUID> {
    Optional<RivernetDevice> findByDeviceKey(String deviceKey);

    Optional<RivernetDevice> findTopByOrderByLastSyncedAtDesc();
}
