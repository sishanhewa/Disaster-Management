-- V23__expand_hourly_forecast_columns.sql
-- Add expanded columns to weather_node_hourly_forecast to capture full OpenMeteo dataset

ALTER TABLE weather_node_hourly_forecast
ADD COLUMN IF NOT EXISTS relative_humidity_pct DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS dew_point_c DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS apparent_temp_c DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS weather_code INTEGER,
ADD COLUMN IF NOT EXISTS pressure_hpa DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS cloud_cover_pct DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS visibility_m DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS wind_direction_deg DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS wind_gusts_kmh DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS uv_index DOUBLE PRECISION;
