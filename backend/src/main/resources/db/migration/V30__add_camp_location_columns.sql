-- Add latitude and longitude columns to relief_camps table
ALTER TABLE relief_camps ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION;
ALTER TABLE relief_camps ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
