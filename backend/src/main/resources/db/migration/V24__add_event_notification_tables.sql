-- Migration: Create tables for event-driven notification system
-- Tables: weather_events, event_triggers, notification_deliveries

-- =============================================
-- Table: weather_events
-- Stores real-world weather occurrences detected by the alert engine
-- =============================================
CREATE TABLE IF NOT EXISTS weather_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    spatial_unit_id UUID NOT NULL,
    spatial_unit_name VARCHAR(200),
    spatial_unit_type VARCHAR(50),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    trigger_parameter VARCHAR(50),
    trigger_value DOUBLE PRECISION,
    trigger_threshold DOUBLE PRECISION,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    source_rule_id UUID,
    warning_id UUID,
    forecast_snapshot TEXT,
    is_processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for weather_events
CREATE INDEX idx_weather_event_type ON weather_events(event_type);
CREATE INDEX idx_weather_event_spatial ON weather_events(spatial_unit_id);
CREATE INDEX idx_weather_event_timerange ON weather_events(start_time, end_time);
CREATE INDEX idx_weather_event_created ON weather_events(created_at);
CREATE INDEX idx_weather_event_processed ON weather_events(is_processed);

-- =============================================
-- Table: event_triggers
-- Deduplication layer - prevents spam by tracking triggered events
-- =============================================
CREATE TABLE IF NOT EXISTS event_triggers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_hash VARCHAR(64) NOT NULL UNIQUE,
    rule_id UUID NOT NULL,
    event_id UUID,
    spatial_unit_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    triggered_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    trigger_value DOUBLE PRECISION,
    trigger_threshold DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for event_triggers
CREATE INDEX idx_trigger_hash ON event_triggers(event_hash);
CREATE INDEX idx_trigger_rule ON event_triggers(rule_id);
CREATE INDEX idx_trigger_expires ON event_triggers(expires_at);
CREATE INDEX idx_trigger_created ON event_triggers(created_at);

-- =============================================
-- Table: notification_deliveries
-- Tracks delivery status across different channels (EMAIL, SMS, IN_APP, PUSH)
-- =============================================
CREATE TABLE IF NOT EXISTS notification_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notification_id UUID NOT NULL,
    user_id UUID NOT NULL,
    channel VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    attempt_count INTEGER DEFAULT 0,
    last_attempt_at TIMESTAMP,
    next_retry_at TIMESTAMP,
    error_message VARCHAR(500),
    provider_message_id VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for notification_deliveries
CREATE INDEX idx_delivery_notification ON notification_deliveries(notification_id);
CREATE INDEX idx_delivery_channel_status ON notification_deliveries(channel, status);
CREATE INDEX idx_delivery_user ON notification_deliveries(user_id);
CREATE INDEX idx_delivery_created ON notification_deliveries(created_at);
CREATE INDEX idx_delivery_next_retry ON notification_deliveries(next_retry_at);

-- =============================================
-- Add notif_sms column to user_preferences
-- =============================================
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS notif_sms BOOLEAN DEFAULT FALSE;

-- Update existing rows to have a default value
UPDATE user_preferences SET notif_sms = FALSE WHERE notif_sms IS NULL;
