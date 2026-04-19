package com.sidms.backend.repository;

import com.sidms.backend.entity.WeatherNodeHourlyForecast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WeatherNodeHourlyForecastRepository extends JpaRepository<WeatherNodeHourlyForecast, UUID> {
}
