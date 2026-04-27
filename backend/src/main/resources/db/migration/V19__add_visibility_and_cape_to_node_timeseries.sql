-- Migration to add visibility and cape to node_timeseries
-- This ensures node_timeseries has all the fields present in weather_node_live_cache

ALTER TABLE node_timeseries
    ADD COLUMN visibility_m DECIMAL(8, 2),
    ADD COLUMN cape_jkg DECIMAL(8, 2);
