CREATE TABLE IF NOT EXISTS spatial_forecast_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  spatial_unit_id UUID NOT NULL UNIQUE REFERENCES spatial_units(id) ON DELETE CASCADE,
  source_api VARCHAR(50),
  payload TEXT NOT NULL,
  generated_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sfs_updated_at ON spatial_forecast_snapshots(updated_at DESC);
