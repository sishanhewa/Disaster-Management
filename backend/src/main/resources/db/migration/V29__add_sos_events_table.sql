-- Create sos_events table for event-driven SOS notification system
CREATE TABLE IF NOT EXISTS sos_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL,
    user_id UUID NOT NULL,
    user_name VARCHAR(200),
    user_phone VARCHAR(50),
    contact_phone VARCHAR(50),
    status VARCHAR(20) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    medical_notes TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    spatial_unit_id UUID,
    spatial_unit_name VARCHAR(200),
    battery_level DOUBLE PRECISION,
    severity VARCHAR(20) NOT NULL DEFAULT 'CRITICAL',
    weather_context TEXT,
    weather_severity VARCHAR(20),
    assigned_responder_id UUID,
    assigned_responder_name VARCHAR(200),
    assigned_at TIMESTAMP,
    resolved_at TIMESTAMP,
    is_processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for sos_events
CREATE INDEX idx_sos_event_status ON sos_events(status);
CREATE INDEX idx_sos_event_incident ON sos_events(incident_id);
CREATE INDEX idx_sos_event_user ON sos_events(user_id);
CREATE INDEX idx_sos_event_created ON sos_events(created_at);
CREATE INDEX idx_sos_event_location ON sos_events(latitude, longitude);
