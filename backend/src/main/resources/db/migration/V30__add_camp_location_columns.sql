-- Add latitude and longitude columns to relief_camps table
ALTER TABLE relief_camps ADD COLUMN latitude DOUBLE PRECISION;
ALTER TABLE relief_camps ADD COLUMN longitude DOUBLE PRECISION;
