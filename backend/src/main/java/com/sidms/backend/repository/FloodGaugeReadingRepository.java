package com.sidms.backend.repository;

import com.sidms.backend.entity.FloodGaugeReading;
import com.sidms.backend.entity.enums.AlertLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FloodGaugeReadingRepository extends JpaRepository<FloodGaugeReading, UUID> {
    List<FloodGaugeReading> findTop1ByStationNameAndSourceOrderByRecordedAtDesc(String station, String source);

    List<FloodGaugeReading> findByAlertLevelNot(AlertLevel level);

    java.util.Optional<FloodGaugeReading> findTopByOrderByFetchedAtDesc();
}
