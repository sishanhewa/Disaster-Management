CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  phone VARCHAR(20),
  email_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT NOW(),
  assigned_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

CREATE TABLE user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255) NOT NULL,
  device_info TEXT,
  ip_address VARCHAR(45),
  last_active TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  unit_temp VARCHAR(10) DEFAULT 'C',
  unit_wind VARCHAR(10) DEFAULT 'km/h',
  unit_precip VARCHAR(10) DEFAULT 'mm',
  language VARCHAR(10) DEFAULT 'en',
  user_type VARCHAR(50) DEFAULT 'General Public',
  theme VARCHAR(20) DEFAULT 'system',
  dnd_start VARCHAR(10),
  dnd_end VARCHAR(10),
  notif_email BOOLEAN DEFAULT true,
  notif_push BOOLEAN DEFAULT true,
  notif_inapp BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE password_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address VARCHAR(45) NOT NULL,
  success BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_login_attempts_user_time ON login_attempts(user_id, created_at DESC);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(255),
  metadata JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id, created_at DESC);

CREATE TABLE saved_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  spatial_unit_id UUID NOT NULL,
  nickname VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO roles (name, description) VALUES
  ('guest','Unauthenticated visitor'),
  ('user','Registered user'),
  ('analyst','Data analyst with read access'),
  ('admin','System administrator'),
  ('volunteer','Field volunteer'),
  ('responder','Emergency responder');
