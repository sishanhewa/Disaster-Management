package com.sidms.backend.repository;

import com.sidms.backend.entity.JaxaRainGrid;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface JaxaRainGridRepository extends JpaRepository<JaxaRainGrid, Long> {

    Optional<JaxaRainGrid> findTopByGridLatBetweenAndGridLonBetweenAndTimestampUtcAfterOrderByTimestampUtcDesc(
            double latLow, double latHigh,
            double lonLow, double lonHigh,
            LocalDateTime since);

    // Find all JAXA grid points within bounds and after timestamp (for analytics aggregation)
    List<JaxaRainGrid> findByGridLatBetweenAndGridLonBetweenAndTimestampUtcAfter(
            BigDecimal latLow, BigDecimal latHigh,
            BigDecimal lonLow, BigDecimal lonHigh,
            LocalDateTime since);
}
