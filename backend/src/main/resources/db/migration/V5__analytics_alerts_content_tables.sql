CREATE TABLE historical_weather (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spatial_unit_id UUID NOT NULL REFERENCES spatial_units(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  temp_max DOUBLE PRECISION, temp_min DOUBLE PRECISION, temp_mean DOUBLE PRECISION,
  precip_mm DOUBLE PRECISION, rain_hours DOUBLE PRECISION,
  humidity_mean DOUBLE PRECISION, wind_speed_mean DOUBLE PRECISION,
  wind_direction_dominant DOUBLE PRECISION, uv_index_max DOUBLE PRECISION,
  source VARCHAR(50), created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(spatial_unit_id, date)
);

CREATE TABLE anomaly_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spatial_unit_id UUID NOT NULL REFERENCES spatial_units(id) ON DELETE CASCADE,
  metric VARCHAR(50) NOT NULL, month INTEGER NOT NULL,
  z_score DOUBLE PRECISION NOT NULL, deviation_percent DOUBLE PRECISION,
  classification VARCHAR(50) NOT NULL, computed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE forecast_projections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spatial_unit_id UUID NOT NULL REFERENCES spatial_units(id) ON DELETE CASCADE,
  model_version VARCHAR(50), horizon_days INTEGER,
  forecast_date DATE NOT NULL, metric VARCHAR(50) NOT NULL,
  point_estimate DOUBLE PRECISION NOT NULL,
  lower_bound DOUBLE PRECISION, upper_bound DOUBLE PRECISION,
  quality_score DOUBLE PRECISION DEFAULT 0,
  generated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE forecast_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  forecast_projection_id UUID REFERENCES forecast_projections(id) ON DELETE SET NULL,
  spatial_unit_id UUID NOT NULL REFERENCES spatial_units(id) ON DELETE CASCADE,
  metric VARCHAR(50) NOT NULL, target_date DATE NOT NULL,
  forecast_generated_at TIMESTAMP NOT NULL,
  predicted_value DOUBLE PRECISION NOT NULL,
  confidence_lower DOUBLE PRECISION, confidence_upper DOUBLE PRECISION,
  actual_value DOUBLE PRECISION, actual_recorded_at TIMESTAMP,
  absolute_error DOUBLE PRECISION, percent_error DOUBLE PRECISION,
  confidence_hit BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_fc_su_date ON forecast_comparisons(spatial_unit_id, target_date);

CREATE TABLE alert_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  spatial_unit_id UUID NOT NULL REFERENCES spatial_units(id) ON DELETE CASCADE,
  parameter VARCHAR(50) NOT NULL,
  operator VARCHAR(20) NOT NULL,
  threshold DOUBLE PRECISION NOT NULL,
  time_window_start VARCHAR(10),
  time_window_end VARCHAR(10),
  cooldown_hours INTEGER DEFAULT 12,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL, title VARCHAR(500) NOT NULL, body TEXT NOT NULL,
  spatial_unit_id UUID REFERENCES spatial_units(id) ON DELETE SET NULL,
  warning_id UUID REFERENCES disaster_warnings(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT false, created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_notif_user_read ON notifications(user_id, is_read, created_at DESC);

CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  channel VARCHAR(50) NOT NULL, status VARCHAR(50) NOT NULL,
  error_message TEXT, dispatched_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL, p256dh_key TEXT NOT NULL, auth_key TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(), last_used_at TIMESTAMP
);

CREATE TABLE guide_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL, slug VARCHAR(500) UNIQUE NOT NULL,
  summary TEXT NOT NULL, content TEXT NOT NULL,
  cover_image_url TEXT, read_time_min INTEGER DEFAULT 3,
  category VARCHAR(100) DEFAULT 'general', language VARCHAR(10) DEFAULT 'en',
  is_published BOOLEAN DEFAULT true, version INTEGER DEFAULT 1,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE faq_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL, answer TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'general', language VARCHAR(10) DEFAULT 'en',
  sort_order INTEGER DEFAULT 0, is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(), updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE map_bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL, lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL, zoom INTEGER DEFAULT 10,
  active_layers JSONB DEFAULT '[]', created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE custom_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL, zone_type VARCHAR(100) NOT NULL,
  geojson_polygon TEXT NOT NULL, color_hex VARCHAR(10) DEFAULT '#FF0000',
  opacity DOUBLE PRECISION DEFAULT 0.4, is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(), deleted_at TIMESTAMP
);

CREATE TABLE system_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(255) UNIQUE NOT NULL, value TEXT NOT NULL,
  description TEXT, updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level VARCHAR(20) NOT NULL, module VARCHAR(100) NOT NULL,
  message TEXT NOT NULL, stack_trace TEXT,
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE api_usage_logs (
  id BIGSERIAL PRIMARY KEY,
  provider VARCHAR(100) NOT NULL, endpoint TEXT NOT NULL,
  status_code INTEGER, response_time_ms INTEGER,
  error_message TEXT, called_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_aul_provider_time ON api_usage_logs(provider, called_at DESC);

CREATE TABLE met_bulletins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spatial_unit_id UUID REFERENCES spatial_units(id) ON DELETE SET NULL,
  bulletin_text TEXT NOT NULL, bulletin_date DATE,
  scraped_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dmc_raw_warnings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spatial_unit_id UUID REFERENCES spatial_units(id) ON DELETE SET NULL,
  category VARCHAR(100), severity VARCHAR(50),
  bulletin_text TEXT NOT NULL, source_url TEXT,
  scraped_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reservoir_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reservoir_name VARCHAR(255) NOT NULL, district VARCHAR(255),
  water_level DOUBLE PRECISION, capacity_pct DOUBLE PRECISION,
  recorded_at TIMESTAMP NOT NULL, scraped_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE marine_advisories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisory_text TEXT NOT NULL, coastal_districts JSONB,
  valid_from TIMESTAMP, valid_until TIMESTAMP,
  scraped_at TIMESTAMP DEFAULT NOW()
);
