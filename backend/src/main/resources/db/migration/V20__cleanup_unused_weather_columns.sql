-- V20__cleanup_unused_weather_columns.sql
-- Removes columns that are permanently null for Sri Lanka due to MET Norway API limitations.
-- Drops the high-churn, unused weather_node_telemetry_log table to reduce write I/O.

-- 1. node_timeseries cleanup
ALTER TABLE node_timeseries
DROP COLUMN IF EXISTS weather_code,
DROP COLUMN IF EXISTS wind_gust_ms,
DROP COLUMN IF EXISTS temp_percentile_10,
DROP COLUMN IF EXISTS temp_percentile_90,
DROP COLUMN IF EXISTS wind_percentile_10,
DROP COLUMN IF EXISTS wind_percentile_90,
DROP COLUMN IF EXISTS precip_prob_pct,
DROP COLUMN IF EXISTS precip_min_mm,
DROP COLUMN IF EXISTS precip_max_mm,
DROP COLUMN IF EXISTS visibility_m,
DROP COLUMN IF EXISTS cape_jkg;

-- 2. weather_node_live_cache cleanup
ALTER TABLE weather_node_live_cache
DROP COLUMN IF EXISTS precip_probability,
DROP COLUMN IF EXISTS rain_mm,
DROP COLUMN IF EXISTS wind_gust_kmh,
DROP COLUMN IF EXISTS visibility_m,
DROP COLUMN IF EXISTS cape_jkg,
DROP COLUMN IF EXISTS weather_code,
DROP COLUMN IF EXISTS us_aqi,
DROP COLUMN IF EXISTS pm10,
DROP COLUMN IF EXISTS pm2_5;

-- 3. Drop unused telemetry log table
DROP TABLE IF EXISTS weather_node_telemetry_log;