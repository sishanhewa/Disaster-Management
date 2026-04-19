-- ============================================================
-- V12: Relief camp management + ArcGIS incident intelligence
-- Ported from Disaster-Management-master (SIDMS)
-- All FKs to users table use CS UUID primary keys.
-- ============================================================

-- 1. Relief camps (camp manager FK → CS users table)
CREATE TABLE relief_camps (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  manager_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  camp_name        VARCHAR(255) NOT NULL,
  district         VARCHAR(100) NOT NULL,
  address          TEXT NOT NULL,
  capacity         INTEGER,
  is_active        BOOLEAN DEFAULT true,
  created_at       TIMESTAMP DEFAULT NOW(),
  updated_at       TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_relief_camps_district ON relief_camps(district);
CREATE INDEX idx_relief_camps_manager  ON relief_camps(manager_id);

-- 2. Collection points for donor drop-offs
CREATE TABLE collection_points (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             VARCHAR(255) NOT NULL,
  address          TEXT NOT NULL,
  operating_hours  VARCHAR(100),
  is_active        BOOLEAN DEFAULT true,
  created_at       TIMESTAMP DEFAULT NOW()
);

-- 3. Aid item needs per camp
CREATE TABLE relief_needs (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  camp_id             UUID NOT NULL REFERENCES relief_camps(id) ON DELETE CASCADE,
  item_name           VARCHAR(255) NOT NULL,
  category            VARCHAR(100) NOT NULL,       -- Food, Medicine, Clothing, Shelter
  quantity_required   INTEGER NOT NULL,
  quantity_pledged    INTEGER DEFAULT 0,
  quantity_received   INTEGER DEFAULT 0,
  urgency             VARCHAR(20) NOT NULL,         -- low, medium, high, critical
  image_url           TEXT,                         -- Cloudinary URL (replaces DM imageBase64)
  is_active           BOOLEAN DEFAULT true,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_relief_needs_camp ON relief_needs(camp_id, is_active);

-- 4. Donor pledges against needs
CREATE TABLE relief_pledges (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id              UUID REFERENCES users(id) ON DELETE SET NULL,  -- nullable for anonymous
  donor_name            VARCHAR(255),
  donor_email           VARCHAR(255),
  donor_phone           VARCHAR(50),
  need_id               UUID NOT NULL REFERENCES relief_needs(id) ON DELETE CASCADE,
  quantity              INTEGER NOT NULL,
  status                VARCHAR(20) DEFAULT 'pending',   -- pending, collected, delivered
  qr_code_uuid          UUID UNIQUE DEFAULT uuid_generate_v4(),
  collection_point_id   UUID REFERENCES collection_points(id) ON DELETE SET NULL,
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_relief_pledges_need  ON relief_pledges(need_id);
CREATE INDEX idx_relief_pledges_donor ON relief_pledges(donor_id);

-- 5. ArcGIS-sourced field disaster incidents
--    Distinct from disaster_warnings (official bulletins).
--    arcgis_object_id is the deduplication key from the ArcGIS feed.
CREATE TABLE disaster_incidents (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                VARCHAR(500) NOT NULL,
  district             VARCHAR(100) NOT NULL,
  hazard_type          VARCHAR(100) NOT NULL,       -- Flood, Landslide, Cyclone, Drought, Tsunami
  severity             VARCHAR(20) DEFAULT 'moderate',  -- low, moderate, high, critical
  affected_people      INTEGER DEFAULT 0,
  casualties           INTEGER DEFAULT 0,
  damage_estimate_lkr  DOUBLE PRECISION DEFAULT 0,
  response_status      VARCHAR(50) DEFAULT 'reported',  -- reported, responding, contained, resolved
  description          TEXT,
  latitude             DOUBLE PRECISION,
  longitude            DOUBLE PRECISION,
  reported_by          VARCHAR(255),
  arcgis_object_id     BIGINT UNIQUE,               -- deduplication key from ArcGIS REST feed
  incident_date        TIMESTAMP NOT NULL,
  created_at           TIMESTAMP DEFAULT NOW(),
  updated_at           TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_disaster_incidents_district ON disaster_incidents(district, incident_date DESC);
CREATE INDEX idx_disaster_incidents_severity ON disaster_incidents(severity, created_at DESC);
CREATE INDEX idx_disaster_incidents_arcgis   ON disaster_incidents(arcgis_object_id);

-- 6. ArcGIS sensor readings (water level / rainfall telemetry)
--    Analogous to flood_gauge_readings but from the ArcGIS source.
CREATE TABLE arcgis_sensor_readings (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  location_name    VARCHAR(255) NOT NULL,
  hazard_type      VARCHAR(100) NOT NULL,   -- Water Level, Rainfall
  measured_value   DOUBLE PRECISION NOT NULL,
  unit             VARCHAR(20) NOT NULL,    -- m, mm
  danger_level     VARCHAR(50) NOT NULL,   -- Normal, Alert, Minor Flood, Major Flood
  observation_time TIMESTAMP NOT NULL,
  fetched_at       TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_arcgis_readings_location_time
    ON arcgis_sensor_readings(location_name, observation_time DESC);

-- 7. Admin broadcast alerts (distinct from alert_rules)
--    alert_rules = user-owned threshold triggers.
--    broadcast_alerts = admin-issued public messages.
CREATE TABLE broadcast_alerts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       VARCHAR(500) NOT NULL,
  message     TEXT NOT NULL,
  severity    VARCHAR(20) DEFAULT 'info',   -- info, warning, critical
  is_active   BOOLEAN DEFAULT true,
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_broadcast_alerts_active ON broadcast_alerts(is_active, created_at DESC);
