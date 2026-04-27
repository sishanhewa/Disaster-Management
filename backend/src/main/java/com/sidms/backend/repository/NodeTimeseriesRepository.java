package com.sidms.backend.repository;

import com.sidms.backend.entity.NodeTimeseries;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface NodeTimeseriesRepository extends JpaRepository<NodeTimeseries, Long> {

    Optional<NodeTimeseries> findTopByNodeIdAndForecastHourOrderByValidFromUtcDesc(UUID nodeId, int forecastHour);

    List<NodeTimeseries> findByNodeIdOrderByForecastHourAsc(UUID nodeId);

    List<NodeTimeseries> findByNodeIdInOrderByForecastHourAsc(List<UUID> nodeIds);

    // Find most recent forecasts for multiple nodes
    List<NodeTimeseries> findTopByNodeIdInOrderByForecastHourAsc(List<UUID> nodeIds);

    @Transactional
    @Modifying
    void deleteByNodeId(UUID nodeId);

    /**
     * Find forecast data for a node within a forecast hour range.
     * Used by AlertRuleEvaluator to aggregate forecast windows.
     */
    List<NodeTimeseries> findByNodeIdAndForecastHourBetweenOrderByForecastHourAsc(UUID nodeId, int startHour, int endHour);
}
