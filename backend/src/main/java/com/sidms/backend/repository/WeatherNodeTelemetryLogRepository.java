package com.sidms.backend.repository;

import com.sidms.backend.entity.WeatherNodeTelemetryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeatherNodeTelemetryLogRepository extends JpaRepository<WeatherNodeTelemetryLog, Long> {
}
