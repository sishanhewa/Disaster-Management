package com.sidms.backend.scheduler;

import com.sidms.backend.dto.weather.advanced.AdvancedForecastResponse;
import com.sidms.backend.dto.weather.advanced.ForecastShortInterval;
import com.sidms.backend.entity.AlertRule;
import com.sidms.backend.entity.SpatialUnit;
import com.sidms.backend.entity.WeatherEvent;
import com.sidms.backend.entity.enums.DisasterSeverity;
import com.sidms.backend.repository.AlertRuleRepository;
import com.sidms.backend.repository.SpatialUnitRepository;
import com.sidms.backend.repository.WeatherEventRepository;
import com.sidms.backend.service.SyncStateService;
import com.sidms.backend.service.WeatherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class AlertRuleEvaluator {

    private static final String   JOB_NAME = "alert_evaluation";
    private static final Duration COOLDOWN  = Duration.ofMinutes(15);

    private final SyncStateService    syncStateService;
    private final AlertRuleRepository alertRuleRepository;
    private final WeatherEventRepository weatherEventRepository;
    private final SpatialUnitRepository spatialUnitRepository;
    private final WeatherService weatherService;

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    // ──────────────────────────────────────────────
    // Evaluate alert rules: every 15 minutes
    // ──────────────────────────────────────────────
    @Scheduled(fixedDelayString = "${app.sync.alerts.interval}", initialDelayString = "${app.sync.alerts.initial-delay}")
    @Transactional
    public void scheduledEvaluateAlertRules() {
        if (!syncStateService.shouldRun(JOB_NAME, COOLDOWN)) return;
        try {
            evaluateAlertRules();
            syncStateService.recordSuccess(JOB_NAME, COOLDOWN);
        } catch (Exception e) {
            log.error("[AlertRuleEval] Sync failed: {}", e.getMessage(), e);
            syncStateService.recordFailure(JOB_NAME, COOLDOWN, e.getMessage());
        }
    }

    /** Public entry point — also called by AdminSyncController for manual triggers. */
    @Transactional
    public void evaluateAlertRules() {
        log.info("⏳ Alert rule evaluation started (forecast aggregation enabled)");
        List<AlertRule> activeRules = alertRuleRepository.findByIsActiveTrue();

        if (activeRules.isEmpty()) {
            log.debug("No active alert rules to evaluate");
            return;
        }

        int triggered = 0;
        int skipped = 0;

        for (AlertRule rule : activeRules) {
            try {
                // 1. Check time window
                if (!isWithinTimeWindow(rule)) {
                    skipped++;
                    continue;
                }

                // 2. Check cooldown
                if (isInCooldown(rule)) {
                    skipped++;
                    continue;
                }

                // 3. Get spatial unit
                SpatialUnit spatialUnit = spatialUnitRepository.findById(rule.getSpatialUnitId()).orElse(null);
                if (spatialUnit == null) {
                    log.warn("Spatial unit not found for rule '{}': {}", rule.getName(), rule.getSpatialUnitId());
                    skipped++;
                    continue;
                }

                // 4. Get IDW-weighted forecast data from WeatherService
                AdvancedForecastResponse forecast = getForecastForSpatialUnit(rule.getSpatialUnitId());
                if (forecast == null) {
                    log.debug("No forecast data available for spatial unit {} (rule: '{}')",
                            rule.getSpatialUnitId(), rule.getName());
                    skipped++;
                    continue;
                }

                // 5. Apply temporal aggregation across forecast window
                AggregationResult aggResult = applyTemporalAggregation(
                        forecast,
                        rule.getParameter(),
                        rule.getForecastWindowHours(),
                        rule.getAggregationType()
                );

                if (aggResult == null || aggResult.value == null) {
                    log.debug("Could not extract parameter '{}' from forecast for rule '{}'",
                            rule.getParameter(), rule.getName());
                    continue;
                }

                Double aggregatedValue = aggResult.value;

                // 6. Evaluate operator against aggregated value
                boolean thresholdCrossed = evaluateCondition(aggregatedValue, rule.getOperator(), rule.getThreshold());

                // 7. If threshold crossed → create WeatherEvent
                if (thresholdCrossed) {
                    DisasterSeverity severity = determineSeverity(
                            aggregatedValue, rule.getThreshold(), rule.getOperator());

                    // Check severity threshold (don't create events below minimum severity)
                    if (!meetsSeverityThreshold(severity, rule.getSeverityThreshold())) {
                        log.debug("Rule '{}' triggered but severity {} below threshold {}",
                                rule.getName(), severity, rule.getSeverityThreshold());
                        continue;
                    }

                    String spatialUnitName = spatialUnit.getName();
                    String spatialUnitType = spatialUnit.getType().name();

                    // Build description with aggregation details
                    String description = buildEventDescription(rule, aggregatedValue, aggResult, spatialUnitName);

                    WeatherEvent event = WeatherEvent.builder()
                            .eventType(mapParameterToEventType(rule.getParameter()))
                            .title(String.format("%s: %s", rule.getName(),
                                    formatAlertMessage(rule, aggregatedValue, rule.getAggregationType())))
                            .description(description)
                            .severity(severity)
                            .spatialUnitId(rule.getSpatialUnitId())
                            .spatialUnitName(spatialUnitName)
                            .spatialUnitType(spatialUnitType)
                            .latitude(spatialUnit.getLat())
                            .longitude(spatialUnit.getLng())
                            .triggerParameter(rule.getParameter())
                            .triggerValue(aggregatedValue)
                            .triggerThreshold(rule.getThreshold())
                            .startTime(LocalDateTime.now(ZoneOffset.UTC))
                            .endTime(LocalDateTime.now(ZoneOffset.UTC).plusHours(rule.getForecastWindowHours() != null ? rule.getForecastWindowHours() : 6))
                            .sourceRuleId(rule.getId())
                            .isProcessed(false)
                            .build();

                    weatherEventRepository.save(event);

                    // Update rule's last triggered timestamp
                    rule.setLastTriggeredAt(LocalDateTime.now(ZoneOffset.UTC));
                    alertRuleRepository.save(rule);
                    triggered++;

                    log.info("Alert triggered: '{}' for user {} – {} = {} ({} over {}h) (event: {})",
                            rule.getName(), rule.getUserId(), rule.getParameter(),
                            String.format("%.1f", aggregatedValue),
                            rule.getAggregationType(),
                            rule.getForecastWindowHours(),
                            event.getId());
                }
            } catch (Exception e) {
                log.error("Error evaluating alert rule '{}': {}", rule.getName(), e.getMessage(), e);
            }
        }

        log.info("✅ Alert rule evaluation completed – {} triggered, {} skipped out of {} rules",
                triggered, skipped, activeRules.size());
    }

    // ──────────────────────────────────────────────
    // Time window check
    // ──────────────────────────────────────────────
    private boolean isWithinTimeWindow(AlertRule rule) {
        if (rule.getTimeWindowStart() == null || rule.getTimeWindowEnd() == null) {
            return true; // No time window restriction
        }

        try {
            LocalTime now = LocalTime.now();
            LocalTime start = LocalTime.parse(rule.getTimeWindowStart(), TIME_FORMAT);
            LocalTime end = LocalTime.parse(rule.getTimeWindowEnd(), TIME_FORMAT);

            if (start.isBefore(end)) {
                return !now.isBefore(start) && !now.isAfter(end);
            } else {
                // Crosses midnight (e.g., 22:00 – 06:00)
                return !now.isBefore(start) || !now.isAfter(end);
            }
        } catch (Exception e) {
            log.warn("Invalid time window format for rule '{}': {} - {}",
                    rule.getName(), rule.getTimeWindowStart(), rule.getTimeWindowEnd());
            return true; // If parsing fails, don't restrict
        }
    }

    // ──────────────────────────────────────────────
    // Cooldown check
    // ──────────────────────────────────────────────
    private boolean isInCooldown(AlertRule rule) {
        if (rule.getLastTriggeredAt() == null || rule.getCooldownHours() == null) {
            return false;
        }
        return rule.getLastTriggeredAt()
                .plusHours(rule.getCooldownHours())
                .isAfter(LocalDateTime.now(ZoneOffset.UTC));
    }

    // ──────────────────────────────────────────────
    // Get forecast from WeatherService (IDW-weighted spatial aggregation)
    // ──────────────────────────────────────────────
    private AdvancedForecastResponse getForecastForSpatialUnit(UUID spatialUnitId) {
        try {
            return weatherService.getWeatherForSpatialUnit(spatialUnitId);
        } catch (Exception e) {
            log.warn("Failed to get forecast for spatial unit {}: {}", spatialUnitId, e.getMessage());
            return null;
        }
    }

    // ──────────────────────────────────────────────
    // Aggregation result holder
    // ──────────────────────────────────────────────
    private record AggregationResult(Double value, int hoursEvaluated, String aggregationType) {}

    // ──────────────────────────────────────────────
    // Apply temporal aggregation across forecast window
    // WeatherService already provides IDW-weighted spatial aggregation
    // ──────────────────────────────────────────────
    private AggregationResult applyTemporalAggregation(AdvancedForecastResponse forecast,
                                                        String parameter,
                                                        Integer windowHours,
                                                        String aggregationType) {
        if (windowHours == null) windowHours = 1;
        if (aggregationType == null) aggregationType = "CURRENT";

        List<ForecastShortInterval> intervals = forecast.getShortIntervals();
        if (intervals == null || intervals.isEmpty()) {
            // Fallback: use current values if no forecast intervals
            Double currentValue = extractCurrentValue(forecast, parameter);
            return currentValue != null ? new AggregationResult(currentValue, 1, "CURRENT") : null;
        }

        // Take only the first N intervals based on windowHours (each interval is typically 1 hour)
        int count = Math.min(windowHours, intervals.size());
        List<ForecastShortInterval> windowIntervals = intervals.subList(0, count);

        // Extract parameter values from each interval
        List<Double> values = windowIntervals.stream()
                .map(i -> extractIntervalValue(i, parameter))
                .filter(v -> v != null)
                .toList();

        if (values.isEmpty()) {
            return null;
        }

        // Apply temporal aggregation
        Double result = switch (aggregationType.toUpperCase()) {
            case "CURRENT" -> values.isEmpty() ? null : values.get(0);
            case "MAX" -> values.stream().max(Double::compare).orElse(null);
            case "MIN" -> values.stream().min(Double::compare).orElse(null);
            case "AVG" -> values.stream().mapToDouble(Double::doubleValue).average().orElse(0);
            case "SUM" -> values.stream().mapToDouble(Double::doubleValue).sum();
            default -> values.isEmpty() ? null : values.get(0);
        };

        return new AggregationResult(result, values.size(), aggregationType);
    }

    // ──────────────────────────────────────────────
    // Extract parameter value from current snapshot
    // ──────────────────────────────────────────────
    private Double extractCurrentValue(AdvancedForecastResponse forecast, String parameter) {
        if (parameter == null || forecast == null) return null;

        return switch (parameter.toLowerCase()) {
            case "precipitation_mm", "precip" -> forecast.getPrecipitationMm();
            case "temp_c", "temperature" -> forecast.getTempC();
            case "wind_speed_kmh", "wind_speed" -> forecast.getWindSpeedKmh();
            case "humidity_pct", "humidity" -> forecast.getHumidityPct();
            case "uv_index", "uv_index_clear_sky" -> forecast.getUvIndex();
            case "pressure_hpa", "pressure" -> forecast.getPressureHpa();
            case "cloud_cover_pct", "cloud_cover" -> forecast.getCloudCoverPct();
            case "dew_point_c", "dew_point" -> forecast.getDewPointC();
            default -> {
                log.warn("Unknown alert parameter for current value: {}", parameter);
                yield null;
            }
        };
    }

    // ──────────────────────────────────────────────
    // Extract parameter value from forecast interval
    // ──────────────────────────────────────────────
    private Double extractIntervalValue(ForecastShortInterval interval, String parameter) {
        if (parameter == null || interval == null) return null;

        return switch (parameter.toLowerCase()) {
            case "precipitation_mm", "precip" -> getMapValue(interval.getPrecipitation(), "value");
            case "temp_c", "temperature" -> getMapValue(interval.getTemperature(), "value");
            case "wind_speed_kmh", "wind_speed" -> getMapValue(interval.getWind(), "speed");
            case "humidity_pct", "humidity" -> getMapValue(interval.getHumidity(), "value");
            case "uv_index", "uv_index_clear_sky" -> getMapValue(interval.getUvIndex(), "value");
            case "pressure_hpa", "pressure" -> getMapValue(interval.getPressure(), "value");
            case "cloud_cover_pct", "cloud_cover" -> getMapValue(interval.getCloudCover(), "value");
            case "dew_point_c", "dew_point" -> getMapValue(interval.getDewPoint(), "value");
            default -> {
                log.warn("Unknown alert parameter for interval: {}", parameter);
                yield null;
            }
        };
    }

    private Double getMapValue(java.util.Map<String, Double> map, String key) {
        return map != null ? map.get(key) : null;
    }

    // ──────────────────────────────────────────────
    // Check if severity meets threshold
    // ──────────────────────────────────────────────
    private boolean meetsSeverityThreshold(DisasterSeverity actual, String minimum) {
        if (minimum == null) return true;

        int actualLevel = switch (actual) {
            case LOW -> 1;
            case MODERATE -> 2;
            case HIGH -> 3;
            case CRITICAL -> 4;
            case EXTREME -> 5;
        };

        int minLevel = switch (minimum.toUpperCase()) {
            case "LOW" -> 1;
            case "MODERATE" -> 2;
            case "HIGH" -> 3;
            case "CRITICAL" -> 4;
            case "EXTREME" -> 5;
            default -> 2; // Default to MODERATE
        };

        return actualLevel >= minLevel;
    }

    // ──────────────────────────────────────────────
    // Build detailed event description
    // ──────────────────────────────────────────────
    private String buildEventDescription(AlertRule rule, Double value, AggregationResult agg, String spatialUnitName) {
        StringBuilder desc = new StringBuilder();

        // Opening sentence - clean and direct
        desc.append(String.format(
                "Your alert rule '%s' was triggered. %s\n\n",
                rule.getName(),
                formatAggregationDescription(rule.getAggregationType(), value, rule.getOperator(), rule.getThreshold())));

        // Technical details
        desc.append(String.format(
                "Forecast window: Next %d hours\n" +
                "Aggregation: %s (%d data points)\n" +
                "Severity: %s\n\n",
                rule.getForecastWindowHours() != null ? rule.getForecastWindowHours() : 6,
                formatAggregationName(rule.getAggregationType()),
                agg.hoursEvaluated(),
                rule.getSeverityThreshold()));

        // Location and delivery channels
        desc.append(String.format(
                "Location: %s\n" +
                "Delivery: %s",
                spatialUnitName != null ? spatialUnitName : rule.getSpatialUnitId(),
                formatChannels(rule.getChannels())));

        return desc.toString();
    }

    private String formatAggregationDescription(String aggType, Double value, String operator, Double threshold) {
        String opDesc = describeOperator(operator);
        return switch (aggType.toUpperCase()) {
            case "CURRENT" -> String.format("The value is currently %.1f, which %s your threshold of %.1f.", value, opDesc, threshold);
            case "MAX" -> String.format("The forecast shows a maximum of %.1f, which %s your threshold of %.1f.", value, opDesc, threshold);
            case "MIN" -> String.format("The forecast shows a minimum of %.1f, which %s your threshold of %.1f.", value, opDesc, threshold);
            case "AVG" -> String.format("The average over the forecast window is %.1f, which %s your threshold of %.1f.", value, opDesc, threshold);
            case "SUM" -> String.format("The total accumulation is %.1f, which %s your threshold of %.1f.", value, opDesc, threshold);
            default -> String.format("The value is %.1f, which %s your threshold of %.1f.", value, opDesc, threshold);
        };
    }

    private String formatAggregationName(String aggType) {
        return switch (aggType.toUpperCase()) {
            case "CURRENT" -> "Current value";
            case "MAX" -> "Maximum";
            case "MIN" -> "Minimum";
            case "AVG" -> "Average";
            case "SUM" -> "Total Sum";
            default -> aggType;
        };
    }

    private String formatChannels(java.util.List<String> channels) {
        if (channels == null || channels.isEmpty()) {
            return "In-App";
        }
        return channels.stream()
                .map(c -> switch (c.toUpperCase()) {
                    case "IN_APP" -> "In-App";
                    case "EMAIL" -> "Email";
                    case "SMS" -> "SMS";
                    default -> c;
                })
                .collect(java.util.stream.Collectors.joining(", "));
    }

    // ──────────────────────────────────────────────
    // Operator evaluation
    // ──────────────────────────────────────────────
    private boolean evaluateCondition(double value, String operator, double threshold) {
        return switch (operator.toUpperCase()) {
            case ">", "GT" -> value > threshold;
            case "<", "LT" -> value < threshold;
            case ">=", "GTE" -> value >= threshold;
            case "<=", "LTE" -> value <= threshold;
            case "=", "EQ" -> Math.abs(value - threshold) < 0.01;
            default -> {
                log.warn("Unknown operator: {}", operator);
                yield false;
            }
        };
    }

    // ──────────────────────────────────────────────
    // Formatting helpers
    // ──────────────────────────────────────────────
    private String formatParameterName(String parameter) {
        return switch (parameter.toLowerCase()) {
            case "precipitation_mm" -> "Precipitation";
            case "temp_c" -> "Temperature";
            case "wind_speed_kmh" -> "Wind Speed";
            case "cape_jkg" -> "CAPE";
            case "humidity_pct" -> "Humidity";
            case "uv_index" -> "UV Index";
            case "apparent_temp_c" -> "Apparent Temperature";
            case "pressure_hpa" -> "Pressure";
            case "wind_gust_kmh" -> "Wind Gust";
            case "cloud_cover_pct" -> "Cloud Cover";
            default -> parameter;
        };
    }

    private String describeOperator(String operator) {
        return switch (operator.toUpperCase()) {
            case "GT" -> "exceeds";
            case "LT" -> "is below";
            case "GTE" -> "meets or exceeds";
            case "LTE" -> "meets or is below";
            case "EQ" -> "equals";
            default -> "triggered against";
        };
    }

    // ──────────────────────────────────────────────
    // Event generation helpers
    // ──────────────────────────────────────────────

    private String mapParameterToEventType(String parameter) {
        if (parameter == null) return "WEATHER_ALERT";
        return switch (parameter.toLowerCase()) {
            case "precipitation_mm", "precip" -> "HEAVY_RAIN";
            case "temp_c", "temperature" -> "TEMPERATURE_ALERT";
            case "wind_speed_kmh", "wind_speed" -> "HIGH_WIND";
            case "cape_jkg" -> "STORM_RISK";
            case "humidity_pct", "humidity" -> "HUMIDITY_ALERT";
            case "uv_index" -> "UV_ALERT";
            case "apparent_temp_c" -> "HEAT_INDEX";
            case "pressure_hpa", "pressure" -> "PRESSURE_ALERT";
            case "wind_gust_kmh" -> "WIND_GUST";
            case "cloud_cover_pct" -> "CLOUD_COVER";
            default -> "WEATHER_ALERT";
        };
    }

    private String formatAlertMessage(AlertRule rule, double value, String aggregationType) {
        String param = formatParameterName(rule.getParameter());
        String aggPrefix = switch (aggregationType.toUpperCase()) {
            case "MAX" -> "Max ";
            case "MIN" -> "Min ";
            case "AVG" -> "Avg ";
            case "SUM" -> "Total ";
            default -> "";
        };
        String op = switch (rule.getOperator().toUpperCase()) {
            case "GT", ">" -> ">";
            case "LT", "<" -> "<";
            case "GTE", ">=" -> "≥";
            case "LTE", "<=" -> "≤";
            case "EQ", "=" -> "=";
            default -> "triggered";
        };
        return String.format("%s%s %s %.1f (forecast: %.1f)", aggPrefix, param, op, rule.getThreshold(), value);
    }

    private DisasterSeverity determineSeverity(double value, double threshold, String operator) {
        double gap = Math.abs(value - threshold);
        double pctOver = gap / threshold;

        // Determine severity based on how much the threshold was exceeded
        if (pctOver > 0.5 || gap > 20) {
            return DisasterSeverity.EXTREME;
        } else if (pctOver > 0.3 || gap > 10) {
            return DisasterSeverity.CRITICAL;
        } else if (pctOver > 0.15 || gap > 5) {
            return DisasterSeverity.HIGH;
        } else if (pctOver > 0.05 || gap > 2) {
            return DisasterSeverity.MODERATE;
        } else {
            return DisasterSeverity.LOW;
        }
    }
}
