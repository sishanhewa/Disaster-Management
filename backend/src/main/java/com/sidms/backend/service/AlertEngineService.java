package com.sidms.backend.service;

import com.sidms.backend.dto.weather.WeatherResponse;
import com.sidms.backend.entity.AlertRule;
import com.sidms.backend.repository.AlertRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AlertEngineService {

    private final AlertRuleRepository alertRuleRepository;
    private final WeatherService weatherService;
    private final NotificationService notificationService;

    @Scheduled(fixedDelay = 300000) // Every 5 minutes
    @Transactional
    public void processAlertRules() {
        log.info("⏳ Processing active alert rules");
        List<AlertRule> activeRules = alertRuleRepository.findByIsActiveTrue();
        
        for (AlertRule rule : activeRules) {
            try {
                if (Boolean.FALSE.equals(rule.getIsActive())) continue;
                if (isInCooldown(rule)) continue;

                WeatherResponse weather = weatherService.getWeatherForSpatialUnit(rule.getSpatialUnitId());
                if (weather == null) continue;

                Double currentValue = extractParameterValue(weather, rule.getParameter());
                if (currentValue == null) continue;

                if (shouldTrigger(rule, currentValue)) {
                    triggerAlert(rule, currentValue);
                }
            } catch (Exception e) {
                log.error("Failed to process alert rule {}: {}", rule.getId(), e.getMessage());
            }
        }
    }

    private boolean isInCooldown(AlertRule rule) {
        if (rule.getLastTriggeredAt() == null) return false;
        int cooldownHours = rule.getCooldownHours() != null ? rule.getCooldownHours() : 6;
        return rule.getLastTriggeredAt().plusHours(cooldownHours).isAfter(LocalDateTime.now());
    }

    private Double extractParameterValue(WeatherResponse weather, String parameter) {
        return switch (parameter.toLowerCase()) {
            case "temperature", "temp" -> weather.getTempC();
            case "humidity" -> weather.getHumidityPct();
            case "precipitation", "precip" -> weather.getPrecipitationMm();
            case "wind_speed" -> weather.getWindSpeedKmh();
            case "uv_index" -> weather.getUvIndex();
            case "pressure" -> weather.getPressureHpa();
            default -> null;
        };
    }

    private boolean shouldTrigger(AlertRule rule, Double currentValue) {
        String op = rule.getOperator();
        Double threshold = rule.getThreshold();
        if (op == null || threshold == null) return false;

        return switch (op) {
            case ">" -> currentValue > threshold;
            case "<" -> currentValue < threshold;
            case ">=" -> currentValue >= threshold;
            case "<=" -> currentValue <= threshold;
            case "==" -> Math.abs(currentValue - threshold) < 0.001;
            default -> false;
        };
    }

    private void triggerAlert(AlertRule rule, Double currentValue) {
        String title = "Alert Triggered: " + rule.getName();
        String body = String.format("A threshold was met for %s in your selected location. Current value: %.1f %s %.1f", 
                rule.getParameter(), currentValue, rule.getOperator(), rule.getThreshold());

        notificationService.createNotification(
                rule.getUserId(),
                "RULE_ALERT",
                title,
                body,
                rule.getSpatialUnitId(),
                null
        );

        rule.setLastTriggeredAt(LocalDateTime.now());
        alertRuleRepository.save(rule);
        log.info("🚀 Alert triggered for user {}: {}", rule.getUserId(), title);
    }
}
