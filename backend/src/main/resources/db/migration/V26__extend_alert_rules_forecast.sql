-- V26__extend_alert_rules_forecast.sql
-- Extend alert_rules table to support forecast window evaluation with aggregation

-- Add forecast window hours (how far ahead to look: 1, 3, 6, 12, 24, 48, 72, 168)
ALTER TABLE alert_rules
ADD COLUMN IF NOT EXISTS forecast_window_hours INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS aggregation_type VARCHAR(20) DEFAULT 'CURRENT',
ADD COLUMN IF NOT EXISTS channels JSONB DEFAULT '["IN_APP"]'::jsonb,
ADD COLUMN IF NOT EXISTS severity_threshold VARCHAR(20) DEFAULT 'MODERATE';

-- Create index for fast lookup of active rules by spatial unit
CREATE INDEX IF NOT EXISTS idx_alert_rules_spatial_unit_active
    ON alert_rules (spatial_unit_id, is_active);

-- Comment explaining the aggregation types
COMMENT ON COLUMN alert_rules.aggregation_type IS 'How to evaluate forecast window: CURRENT (single value), MAX (maximum), MIN (minimum), AVG (average), SUM (accumulated like rainfall)';
COMMENT ON COLUMN alert_rules.forecast_window_hours IS 'Number of hours to look ahead in forecast (1=current only, 6=next 6 hours, 24=next day, etc.)';
COMMENT ON COLUMN alert_rules.channels IS 'JSON array of notification channels: EMAIL, SMS, IN_APP, PUSH';
COMMENT ON COLUMN alert_rules.severity_threshold IS 'Minimum disaster severity to trigger: LOW, MODERATE, HIGH, CRITICAL, EXTREME';
