-- Drop unused geom column from V6 migration (PostGIS not used by application)
-- Application uses lat/lng Double fields with Haversine formula instead

DROP INDEX IF EXISTS idx_su_geom;
ALTER TABLE spatial_units DROP COLUMN IF EXISTS geom;
