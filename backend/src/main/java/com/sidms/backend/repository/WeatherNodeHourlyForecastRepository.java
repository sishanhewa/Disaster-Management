package com.sidms.backend.repository;

import com.sidms.backend.entity.WeatherNodeHourlyForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WeatherNodeHourlyForecastRepository extends JpaRepository<WeatherNodeHourlyForecast, UUID> {
    java.util.Optional<WeatherNodeHourlyForecast> findByWeatherNodeIdAndForecastTimeAndSourceName(UUID weatherNodeId, java.time.LocalDateTime forecastTime, String sourceName);

    java.util.Optional<WeatherNodeHourlyForecast> findTopByOrderByCreatedAtDesc();
    
    java.util.List<WeatherNodeHourlyForecast> findByWeatherNodeIdOrderByForecastTimeAsc(UUID weatherNodeId);

    java.util.List<WeatherNodeHourlyForecast> findByWeatherNodeIdInOrderByForecastTimeAsc(java.util.List<UUID> weatherNodeIds);

    java.util.List<WeatherNodeHourlyForecast> findByWeatherNodeIdInAndSourceName(java.util.List<UUID> weatherNodeIds, String sourceName);
}
