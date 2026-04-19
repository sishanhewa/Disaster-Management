-- Fix rivernet_devices alert_levels column type from JSONB to TEXT
-- JSONB requires proper JSON type casting from JDBC which isn't happening automatically
-- TEXT is simpler and stores the JSON string directly
ALTER TABLE rivernet_devices 
ALTER COLUMN alert_levels TYPE TEXT;
