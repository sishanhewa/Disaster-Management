CREATE EXTENSION IF NOT EXISTS postgis;

ALTER TABLE spatial_units ADD COLUMN IF NOT EXISTS geom geometry(Point, 4326);
UPDATE spatial_units SET geom = ST_SetSRID(ST_MakePoint(lng, lat), 4326) WHERE geom IS NULL;
CREATE INDEX IF NOT EXISTS idx_su_geom ON spatial_units USING GIST (geom);
