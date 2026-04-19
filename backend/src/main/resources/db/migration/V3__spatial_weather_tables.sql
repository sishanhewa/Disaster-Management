CREATE TABLE spatial_units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  name_sinhala VARCHAR(255),
  name_tamil VARCHAR(255),
  pcode VARCHAR(50) UNIQUE NOT NULL,
  type spatial_type NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  parent_id UUID REFERENCES spatial_units(id),
  population INTEGER,
  is_tracked BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_su_type_active ON spatial_units(type, is_active);
CREATE INDEX idx_su_parent ON spatial_units(parent_id);
CREATE INDEX idx_su_latlng ON spatial_units(lat, lng);
CREATE INDEX idx_su_pcode ON spatial_units(pcode);

CREATE TABLE weather_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  grid_key VARCHAR(50) UNIQUE NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  elevation_m INTEGER DEFAULT 0,
  zone_density weather_node_density DEFAULT 'STANDARD',
  is_coastal BOOLEAN DEFAULT false,
  is_mountain BOOLEAN DEFAULT false,
  distance_to_coast_km DOUBLE PRECISION,
  is_active BOOLEAN DEFAULT true,
  is_volatile BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_wn_active ON weather_nodes(is_active);
CREATE INDEX idx_wn_volatile ON weather_nodes(is_volatile) WHERE is_volatile = true;

CREATE TABLE spatial_unit_weather_node_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spatial_unit_id UUID NOT NULL REFERENCES spatial_units(id) ON DELETE CASCADE,
  weather_node_id UUID NOT NULL REFERENCES weather_nodes(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  distance_km DOUBLE PRECISION NOT NULL,
  idw_weight DOUBLE PRECISION NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(spatial_unit_id, weather_node_id)
);
CREATE INDEX idx_suwn_su_rank ON spatial_unit_weather_node_mappings(spatial_unit_id, rank);
CREATE INDEX idx_suwn_wn ON spatial_unit_weather_node_mappings(weather_node_id);

CREATE TABLE weather_node_live_cache (
  weather_node_id UUID PRIMARY KEY REFERENCES weather_nodes(id) ON DELETE CASCADE,
  source_api VARCHAR(50),
  fetched_at TIMESTAMP NOT NULL,
  temp_c DOUBLE PRECISION,
  apparent_temp_c DOUBLE PRECISION,
  humidity_pct DOUBLE PRECISION,
  pressure_hpa DOUBLE PRECISION,
  precipitation_mm DOUBLE PRECISION,
  precip_probability DOUBLE PRECISION,
  rain_mm DOUBLE PRECISION,
  wind_speed_kmh DOUBLE PRECISION,
  wind_gust_kmh DOUBLE PRECISION,
  wind_direction_deg DOUBLE PRECISION,
  cloud_cover_pct DOUBLE PRECISION,
  visibility_m DOUBLE PRECISION,
  uv_index DOUBLE PRECISION,
  cape_jkg DOUBLE PRECISION,
  weather_code INTEGER,
  raw_payload JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE weather_node_telemetry_log (
  id BIGSERIAL PRIMARY KEY,
  weather_node_id UUID NOT NULL REFERENCES weather_nodes(id) ON DELETE CASCADE,
  logged_at TIMESTAMP DEFAULT NOW(),
  source_api VARCHAR(50),
  temp_c DOUBLE PRECISION,
  precipitation_mm DOUBLE PRECISION,
  precip_probability DOUBLE PRECISION,
  rain_mm DOUBLE PRECISION,
  humidity_pct DOUBLE PRECISION,
  wind_speed_kmh DOUBLE PRECISION,
  cloud_cover_pct DOUBLE PRECISION,
  cape_jkg DOUBLE PRECISION,
  uv_index DOUBLE PRECISION
);
CREATE INDEX idx_tel_wn_time ON weather_node_telemetry_log(weather_node_id, logged_at DESC);

CREATE TABLE weather_node_historical_daily (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weather_node_id UUID NOT NULL REFERENCES weather_nodes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  source_name VARCHAR(50) NOT NULL,
  source_priority INTEGER DEFAULT 2,
  temp_max_c DOUBLE PRECISION,
  temp_min_c DOUBLE PRECISION,
  temp_mean_c DOUBLE PRECISION,
  precip_sum_mm DOUBLE PRECISION,
  precip_hours DOUBLE PRECISION,
  humidity_mean_pct DOUBLE PRECISION,
  wind_max_kmh DOUBLE PRECISION,
  cloud_mean_pct DOUBLE PRECISION,
  cape_max DOUBLE PRECISION,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(weather_node_id, date, source_name)
);
CREATE INDEX idx_wnh_wn_date ON weather_node_historical_daily(weather_node_id, date);

CREATE TABLE weather_node_hourly_forecast (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  weather_node_id UUID NOT NULL REFERENCES weather_nodes(id) ON DELETE CASCADE,
  forecast_time TIMESTAMP NOT NULL,
  source_name VARCHAR(50) NOT NULL,
  temp_c DOUBLE PRECISION,
  precipitation_mm DOUBLE PRECISION,
  precip_probability DOUBLE PRECISION,
  wind_speed_kmh DOUBLE PRECISION,
  cape_jkg DOUBLE PRECISION,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(weather_node_id, forecast_time, source_name)
);
CREATE INDEX idx_wnhf_wn_time ON weather_node_hourly_forecast(weather_node_id, forecast_time);

ALTER TABLE saved_locations
  ADD CONSTRAINT fk_saved_loc_spatial FOREIGN KEY (spatial_unit_id) REFERENCES spatial_units(id);
