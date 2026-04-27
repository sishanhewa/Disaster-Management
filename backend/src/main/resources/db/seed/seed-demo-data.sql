-- ═══════════════════════════════════════════════════
-- ClimaSphere Demo Seed Data
-- Run manually after Flyway migrations: NOT auto-run
-- ═══════════════════════════════════════════════════

-- ──────────────────────────────────────────────
-- Admin user (password: Admin@1234)
-- ──────────────────────────────────────────────
INSERT INTO users (id, email, password_hash, display_name, email_verified, is_active)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@climasphere.lk',
  '$2a$10$pR2qiKnSt6.ReW.Qh09Ctuw.buLzfigphKXjBJhvYOF16exUpe7W6',
  'ClimaSphere Admin',
  true,
  true
) ON CONFLICT (email) DO NOTHING;

-- Assign admin role
INSERT INTO user_roles (user_id, role_id)
SELECT '00000000-0000-0000-0000-000000000001', id FROM roles WHERE name = 'admin'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Admin preferences
INSERT INTO user_preferences (user_id, language, theme) VALUES
  ('00000000-0000-0000-0000-000000000001', 'en', 'dark')
ON CONFLICT (user_id) DO NOTHING;

-- ──────────────────────────────────────────────
-- System configs
-- ──────────────────────────────────────────────
INSERT INTO system_configs (key, value, description) VALUES
  ('maintenance_mode', 'false', 'Set to true to enable maintenance mode'),
  ('max_alert_rules_per_user', '20', 'Maximum number of custom alert rules per user'),
  ('weather_sync_enabled', 'true', 'Enable/disable weather sync scheduler'),
  ('idw_nodes_per_unit', '4', 'Number of weather nodes used in IDW calculation')
ON CONFLICT (key) DO NOTHING;

-- ──────────────────────────────────────────────
-- Emergency resources (sample)
-- ──────────────────────────────────────────────
INSERT INTO emergency_resources (district, resource_type, name, phone, lat, lng) VALUES
  ('Colombo', 'HOSPITAL', 'National Hospital Colombo', '0112691111', 6.9271, 79.8612),
  ('Colombo', 'POLICE', 'Colombo Fort Police', '0112433333', 6.9344, 79.8428),
  ('Colombo', 'FIRE', 'Colombo Fire Station', '0112422222', 6.9147, 79.8527),
  ('Gampaha', 'HOSPITAL', 'Gampaha General Hospital', '0332222261', 7.0873, 80.0144),
  ('Kandy', 'HOSPITAL', 'Kandy National Hospital', '0812222261', 7.2906, 80.6337);

-- ──────────────────────────────────────────────
-- FAQ entries
-- ──────────────────────────────────────────────
INSERT INTO faq_entries (question, answer, category, sort_order, is_published) VALUES
  ('What is ClimaSphere?',
   'ClimaSphere is Sri Lanka''s disaster management and weather intelligence platform, providing real-time weather data, disaster warnings, and emergency response coordination.',
   'general', 1, true),
  ('How accurate is the weather data?',
   'Weather data is interpolated from 668 monitoring nodes across Sri Lanka using Inverse Distance Weighting (IDW) for high accuracy.',
   'weather', 2, true),
  ('How do I report a disaster?',
   'Use the Report Disaster button on the main page. Submit your location, category, and description. Reports are verified by the community and admins.',
   'reports', 3, true),
  ('What do the warning colours mean?',
   'GREEN=Normal, YELLOW=Low risk, ORANGE=Moderate risk, RED=High/Critical risk, PURPLE=Extreme risk.',
   'warnings', 4, true);

-- ──────────────────────────────────────────────────────────────
-- SIDMS Demo Users (ported from Disaster-Management-master)
-- Replaces the insecure plaintext DataSeeder.java
-- donor@test.com    / password  → role: user     (demo donor)
-- colombo@sidms.com / secure123 → role: responder (Colombo camp manager)
-- galle@sidms.com   / secure123 → role: responder (Galle camp manager)
-- Hashes generated at BCrypt strength 12.
-- ──────────────────────────────────────────────────────────────

INSERT INTO users (id, email, password_hash, display_name, email_verified, is_active)
VALUES
  ('00000000-0000-0000-0001-000000000001',
   'donor@test.com',
   '$2a$12$KLesbOOQPCrSlIWxlqGxY.7/73Z/hDXDrntYbZr2i92H7Y86k2sDC',
   'Demo Donor', true, true),
  ('00000000-0000-0000-0001-000000000002',
   'colombo@sidms.com',
   '$2a$12$zR2C2bEaIWIJscJBvz/zuOuYr9XhjQn0cpvXNjXqud//EEP3AJN/C',
   'Colombo Camp Manager', true, true),
  ('00000000-0000-0000-0001-000000000003',
   'galle@sidms.com',
   '$2a$12$zR2C2bEaIWIJscJBvz/zuOuYr9XhjQn0cpvXNjXqud//EEP3AJN/C',
   'Galle Camp Manager', true, true)
ON CONFLICT (email) DO NOTHING;

-- donor → user role
INSERT INTO user_roles (user_id, role_id)
SELECT '00000000-0000-0000-0001-000000000001', id FROM roles WHERE name = 'user'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- camp managers → responder role
INSERT INTO user_roles (user_id, role_id)
SELECT '00000000-0000-0000-0001-000000000002', id FROM roles WHERE name = 'responder'
ON CONFLICT (user_id, role_id) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
SELECT '00000000-0000-0000-0001-000000000003', id FROM roles WHERE name = 'responder'
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Default preferences
INSERT INTO user_preferences (user_id) VALUES
  ('00000000-0000-0000-0001-000000000001'),
  ('00000000-0000-0000-0001-000000000002'),
  ('00000000-0000-0000-0001-000000000003')
ON CONFLICT (user_id) DO NOTHING;

-- Seed demo relief camps linked to their managers (with lat/long from V30 migration)
INSERT INTO relief_camps (id, manager_id, camp_name, district, address, capacity, is_active, latitude, longitude)
VALUES
  ('00000000-0000-0000-0002-000000000001',
   '00000000-0000-0000-0001-000000000002',
   'Colombo Central Relief Camp', 'Colombo', '123 Main St, Colombo 01', 500, true, 6.9271, 79.8612),
  ('00000000-0000-0000-0002-000000000002',
   '00000000-0000-0000-0001-000000000003',
   'Galle Coastal Safezone', 'Galle', '45 Beach Rd, Galle', 300, true, 6.0329, 80.2168)
ON CONFLICT DO NOTHING;

-- Seed demo relief needs for camps
INSERT INTO relief_needs (id, camp_id, item_name, category, quantity_required, quantity_pledged, urgency, is_active)
VALUES
  ('00000000-0000-0000-0003-000000000001',
   '00000000-0000-0000-0002-000000000001',
   'Rice (10kg bags)', 'Food', 100, 25, 'high', true),
  ('00000000-0000-0000-0003-000000000002',
   '00000000-0000-0000-0002-000000000001',
   'Drinking Water (5L bottles)', 'Food', 200, 50, 'critical', true),
  ('00000000-0000-0000-0003-000000000003',
   '00000000-0000-0000-0002-000000000001',
   'Blankets', 'Shelter', 150, 10, 'medium', true),
  ('00000000-0000-0000-0003-000000000004',
   '00000000-0000-0000-0002-000000000002',
   'First Aid Kits', 'Medicine', 50, 5, 'high', true),
  ('00000000-0000-0000-0003-000000000005',
   '00000000-0000-0000-0002-000000000002',
   'Tarpaulin Sheets', 'Shelter', 100, 0, 'critical', true)
ON CONFLICT DO NOTHING;

-- Seed demo broadcast alerts
INSERT INTO broadcast_alerts (id, title, message, severity, is_active, created_by)
VALUES
  ('00000000-0000-0000-0004-000000000001',
   'Flood Warning: Western Province',
   'Heavy rainfall expected in Colombo, Gampaha, and Kalutara districts. Residents in low-lying areas should prepare for evacuation.',
   'critical', true, '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0004-000000000002',
   'Relief Camp Status Update',
   'Colombo Central and Galle Coastal camps are now accepting donations. Priority needs: food, water, and medical supplies.',
   'info', true, '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0004-000000000003',
   'Landslide Risk: Hill Country',
   'Elevated landslide risk in Kandy, Nuwara Eliya, and Badulla due to continuous rainfall. Avoid hillside areas.',
   'warning', true, '00000000-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;
