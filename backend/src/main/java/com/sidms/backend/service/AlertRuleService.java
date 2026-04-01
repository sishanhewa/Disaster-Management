package com.sidms.backend.service;

import com.sidms.backend.dto.content.AlertRuleDto;
import com.sidms.backend.dto.content.CreateAlertRuleRequest;
import com.sidms.backend.entity.AlertRule;
import com.sidms.backend.entity.SpatialUnit;
import com.sidms.backend.exception.ForbiddenException;
import com.sidms.backend.exception.ResourceNotFoundException;
import com.sidms.backend.exception.ValidationException;
import com.sidms.backend.repository.AlertRuleRepository;
import com.sidms.backend.repository.SpatialUnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AlertRuleService {

    private final AlertRuleRepository alertRuleRepository;
    private final SpatialUnitRepository spatialUnitRepository;

    public AlertRuleService(AlertRuleRepository alertRuleRepository,
                            SpatialUnitRepository spatialUnitRepository) {
        this.alertRuleRepository = alertRuleRepository;
        this.spatialUnitRepository = spatialUnitRepository;
    }

    public List<AlertRuleDto> getMyAlertRules(UUID userId) {
        return alertRuleRepository.findByUserId(userId).stream()
                .map(this::toAlertRuleDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AlertRuleDto createAlertRule(CreateAlertRuleRequest req, UUID userId) {
        // Max 20 rules per user
        if (alertRuleRepository.countByUserId(userId) >= 20) {
            throw new ValidationException("Maximum 20 alert rules allowed per user");
        }

        // Validate spatial unit exists
        SpatialUnit spatialUnit = spatialUnitRepository.findById(req.getSpatialUnitId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Spatial unit not found: " + req.getSpatialUnitId()));

        // Default channels if not provided
        List<String> channels = req.getChannels();
        if (channels == null || channels.isEmpty()) {
            channels = List.of("IN_APP", "EMAIL");
        }

        AlertRule rule = AlertRule.builder()
                .userId(userId)
                .name(req.getName())
                .spatialUnitId(req.getSpatialUnitId())
                .parameter(req.getParameter())
                .operator(req.getOperator())
                .threshold(req.getThreshold())
                .timeWindowStart(req.getTimeWindowStart())
                .timeWindowEnd(req.getTimeWindowEnd())
                .cooldownHours(req.getCooldownHours() != null ? req.getCooldownHours() : 6)
                .forecastWindowHours(req.getForecastWindowHours() != null ? req.getForecastWindowHours() : 1)
                .aggregationType(req.getAggregationType() != null ? req.getAggregationType() : "CURRENT")
                .channels(channels)
                .severityThreshold(req.getSeverityThreshold() != null ? req.getSeverityThreshold() : "MODERATE")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();

        rule = alertRuleRepository.save(rule);
        return toAlertRuleDto(rule);
    }

    @Transactional
    public AlertRuleDto updateAlertRule(UUID ruleId, CreateAlertRuleRequest req, UUID userId) {
        AlertRule rule = alertRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert rule not found: " + ruleId));

        verifyOwnership(rule, userId);

        if (req.getSpatialUnitId() != null) {
            spatialUnitRepository.findById(req.getSpatialUnitId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Spatial unit not found: " + req.getSpatialUnitId()));
            rule.setSpatialUnitId(req.getSpatialUnitId());
        }

        if (req.getName() != null) rule.setName(req.getName());
        if (req.getParameter() != null) rule.setParameter(req.getParameter());
        if (req.getOperator() != null) rule.setOperator(req.getOperator());
        if (req.getThreshold() != null) rule.setThreshold(req.getThreshold());
        if (req.getTimeWindowStart() != null) rule.setTimeWindowStart(req.getTimeWindowStart());
        if (req.getTimeWindowEnd() != null) rule.setTimeWindowEnd(req.getTimeWindowEnd());
        if (req.getCooldownHours() != null) rule.setCooldownHours(req.getCooldownHours());
        if (req.getForecastWindowHours() != null) rule.setForecastWindowHours(req.getForecastWindowHours());
        if (req.getAggregationType() != null) rule.setAggregationType(req.getAggregationType());
        if (req.getChannels() != null) rule.setChannels(req.getChannels());
        if (req.getSeverityThreshold() != null) rule.setSeverityThreshold(req.getSeverityThreshold());

        rule = alertRuleRepository.save(rule);
        return toAlertRuleDto(rule);
    }

    @Transactional
    public void deleteAlertRule(UUID ruleId, UUID userId) {
        AlertRule rule = alertRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert rule not found: " + ruleId));

        verifyOwnership(rule, userId);
        alertRuleRepository.delete(rule);
    }

    @Transactional
    public AlertRuleDto toggleAlertRule(UUID ruleId, UUID userId) {
        AlertRule rule = alertRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert rule not found: " + ruleId));

        verifyOwnership(rule, userId);
        rule.setIsActive(!rule.getIsActive());
        rule = alertRuleRepository.save(rule);

        return toAlertRuleDto(rule);
    }

    // ── Helpers ─────────────────────────────────────────────

    private void verifyOwnership(AlertRule rule, UUID userId) {
        if (!rule.getUserId().equals(userId)) {
            throw new ForbiddenException("You do not own this alert rule");
        }
    }

    private AlertRuleDto toAlertRuleDto(AlertRule rule) {
        String spatialUnitName = spatialUnitRepository.findById(rule.getSpatialUnitId())
                .map(SpatialUnit::getName)
                .orElse("Unknown");

        return AlertRuleDto.builder()
                .id(rule.getId())
                .name(rule.getName())
                .spatialUnitName(spatialUnitName)
                .spatialUnitId(rule.getSpatialUnitId())
                .parameter(rule.getParameter())
                .operator(rule.getOperator())
                .threshold(rule.getThreshold())
                .timeWindowStart(rule.getTimeWindowStart())
                .timeWindowEnd(rule.getTimeWindowEnd())
                .cooldownHours(rule.getCooldownHours())
                .forecastWindowHours(rule.getForecastWindowHours())
                .aggregationType(rule.getAggregationType())
                .channels(rule.getChannels() != null ? rule.getChannels() : List.of("IN_APP", "EMAIL"))
                .severityThreshold(rule.getSeverityThreshold())
                .isActive(rule.getIsActive())
                .lastTriggeredAt(rule.getLastTriggeredAt())
                .build();
    }
}
