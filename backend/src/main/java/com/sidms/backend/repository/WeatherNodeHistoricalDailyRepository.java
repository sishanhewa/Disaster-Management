package com.sidms.backend.repository;

import com.sidms.backend.entity.WeatherNodeHistoricalDaily;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WeatherNodeHistoricalDailyRepository extends JpaRepository<WeatherNodeHistoricalDaily, UUID> {
    List<WeatherNodeHistoricalDaily> findByWeatherNodeIdAndDateBetween(UUID nodeId, LocalDate from, LocalDate to);
    Optional<WeatherNodeHistoricalDaily> findByWeatherNodeIdAndDateAndSourceName(UUID nodeId, LocalDate date, String source);
}
