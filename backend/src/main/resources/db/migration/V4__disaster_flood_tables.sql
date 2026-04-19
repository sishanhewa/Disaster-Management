CREATE TABLE disaster_warnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category disaster_category NOT NULL,
  severity disaster_severity NOT NULL,
  status warning_status DEFAULT 'ACTIVE',
  headline VARCHAR(500) NOT NULL,
  bulletin_text TEXT NOT NULL,
  area_text TEXT,
  instructions TEXT,
  source VARCHAR(50) DEFAULT 'admin',
  proposed_by_report_id UUID,
  expires_at TIMESTAMP,
  resolved_at TIMESTAMP,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_dw_status_created ON disaster_warnings(status, created_at DESC);

CREATE TABLE warning_spatial_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warning_id UUID NOT NULL REFERENCES disaster_warnings(id) ON DELETE CASCADE,
  spatial_unit_id UUID NOT NULL REFERENCES spatial_units(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(warning_id, spatial_unit_id)
);
CREATE INDEX idx_wsu_warning ON warning_spatial_units(warning_id);
CREATE INDEX idx_wsu_spatial ON warning_spatial_units(spatial_unit_id);

CREATE TABLE warning_update_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  warning_id UUID NOT NULL REFERENCES disaster_warnings(id) ON DELETE CASCADE,
  previous_severity disaster_severity,
  new_severity disaster_severity NOT NULL,
  update_text TEXT,
  updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE district_severity_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spatial_unit_id UUID UNIQUE REFERENCES spatial_units(id) ON DELETE SET NULL,
  spatial_unit_pcode VARCHAR(50) UNIQUE NOT NULL,
  highest_severity VARCHAR(50),
  active_warning_count INTEGER DEFAULT 0,
  last_computed TIMESTAMP DEFAULT NOW()
);

CREATE TABLE community_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  spatial_unit_id UUID REFERENCES spatial_units(id) ON DELETE SET NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  severity_assessment VARCHAR(50) DEFAULT 'MODERATE',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  geohash VARCHAR(20),
  status report_status DEFAULT 'PENDING',
  rejection_reason TEXT,
  linked_warning_id UUID REFERENCES disaster_warnings(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_cr_status_created ON community_reports(status, created_at DESC);
CREATE INDEX idx_cr_spatial_status ON community_reports(spatial_unit_id, status);
CREATE INDEX idx_cr_geohash ON community_reports(geohash);

CREATE TABLE report_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES community_reports(id) ON DELETE CASCADE,
  cloudinary_url TEXT NOT NULL,
  thumbnail_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE report_confirmations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID NOT NULL REFERENCES community_reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_confirmation BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(report_id, user_id)
);

CREATE TABLE emergency_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spatial_unit_id UUID REFERENCES spatial_units(id) ON DELETE SET NULL,
  district VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(50) NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE mass_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  target_spatial_unit_ids JSONB,
  sent_at TIMESTAMP DEFAULT NOW(),
  recipient_count INTEGER DEFAULT 0
);

CREATE TABLE flood_gauge_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source VARCHAR(50) NOT NULL,
  station_name VARCHAR(255) NOT NULL,
  basin VARCHAR(255),
  water_level DOUBLE PRECISION,
  rainfall DOUBLE PRECISION,
  alert_threshold DOUBLE PRECISION,
  minor_threshold DOUBLE PRECISION,
  major_threshold DOUBLE PRECISION,
  alert_level alert_level DEFAULT 'NORMAL',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  recorded_at TIMESTAMP NOT NULL,
  fetched_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_fgr_source_station ON flood_gauge_readings(source, station_name);
CREATE INDEX idx_fgr_recorded ON flood_gauge_readings(recorded_at DESC);

CREATE TABLE rivernet_devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_key VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  basin VARCHAR(255),
  river VARCHAR(255),
  device_type VARCHAR(50),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  max_level DOUBLE PRECISION,
  offset_value DOUBLE PRECISION,
  alert_levels JSONB,
  is_online BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sos_incidents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  battery_level DOUBLE PRECISION,
  medical_notes TEXT,
  contact_phone VARCHAR(50),
  status sos_status DEFAULT 'PENDING',
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sos_timeline (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  incident_id UUID NOT NULL REFERENCES sos_incidents(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE volunteer_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  radius_km DOUBLE PRECISION DEFAULT 10,
  status task_status DEFAULT 'OPEN',
  priority VARCHAR(20) DEFAULT 'NORMAL',
  required_asset_type VARCHAR(100),
  sos_incident_id UUID REFERENCES sos_incidents(id) ON DELETE SET NULL,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_volunteer UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_responder UUID REFERENCES users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_vt_status ON volunteer_tasks(status);
CREATE INDEX idx_vt_volunteer ON volunteer_tasks(assigned_volunteer);
