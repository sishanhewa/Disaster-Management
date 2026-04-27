-- Migration to drop unused and legacy tables
-- Removes tables associated with the discarded spatial/ensemble forecasting complexity

DROP TABLE IF EXISTS district_severity_cache CASCADE;
DROP TABLE IF EXISTS mass_alerts CASCADE;
DROP TABLE IF EXISTS anomaly_scores CASCADE;
DROP TABLE IF EXISTS dmc_raw_warnings CASCADE;
DROP TABLE IF EXISTS api_usage_logs CASCADE;
DROP TABLE IF EXISTS spatial_forecast_snapshots CASCADE;
DROP TABLE IF EXISTS forecast_comparisons CASCADE;
DROP TABLE IF EXISTS forecast_projections CASCADE;
DROP TABLE IF EXISTS openmeteo_forecast_ensembles CASCADE;
