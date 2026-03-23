-- Enable PostGIS extension for geolocation (Collection Points)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Profiles Table (Extends Supabase Auth users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'donor', -- 'donor', 'camp_manager', 'admin'
    phone_number VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. Relief Camps Table
CREATE TABLE camps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    manager_id UUID REFERENCES profiles(id),
    camp_name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'verified'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 3. Needs Registry Table
CREATE TABLE needs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'Food', 'Medicine', 'Clothing', 'Shelter'
    quantity_required INTEGER NOT NULL,
    quantity_pledged INTEGER DEFAULT 0,
    quantity_received INTEGER DEFAULT 0,
    urgency VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Collection Points Table
CREATE TABLE collection_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    operating_hours TEXT,
    location GEOGRAPHY(POINT) NOT NULL, -- PostGIS
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 5. Physical Item Pledges Table
CREATE TABLE pledges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    need_id UUID REFERENCES needs(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'collected', 'delivered'
    qr_code_uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    collection_point_id UUID REFERENCES collection_points(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 6. Monetary Donations Table
CREATE TABLE monetary_donations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    amount_lkr DECIMAL(12, 2) NOT NULL,
    gateway_reference VARCHAR(255) UNIQUE NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'successful', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 7. Proof of Distribution Photos (Transparency Wall)
CREATE TABLE proof_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES profiles(id),
    image_url TEXT NOT NULL,
    caption TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);



-- Enable RLS (Row Level Security) - Basic Examples
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE needs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pledges ENABLE ROW LEVEL SECURITY;

-- Everyone can read active needs
CREATE POLICY "Anyone can view needs" ON needs FOR SELECT USING (true);

-- Only managers can insert needs for their camp
CREATE POLICY "Managers can insert needs" ON needs FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM camps WHERE camps.id = needs.camp_id AND camps.manager_id = auth.uid())
);

-- Donors can only view/update their own pledges
CREATE POLICY "Donors manage own pledges" ON pledges FOR ALL USING (auth.uid() = donor_id);



-- 1. DROP EXISTING CONFLICTING TABLES
DROP TABLE IF EXISTS pledges CASCADE;
DROP TABLE IF EXISTS needs CASCADE;
DROP TABLE IF EXISTS camps CASCADE;
DROP TABLE IF EXISTS collection_points CASCADE;
DROP TABLE IF EXISTS app_profiles CASCADE;

-- 2. CREATE SCHEMA TABLES
CREATE TABLE app_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'donor',
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE camps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    manager_id UUID REFERENCES app_profiles(id) ON DELETE SET NULL,
    camp_name VARCHAR(255) NOT NULL,
    district VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE needs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    camp_id UUID REFERENCES camps(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity_required INTEGER NOT NULL,
    quantity_pledged INTEGER DEFAULT 0,
    quantity_received INTEGER DEFAULT 0,
    urgency VARCHAR(50) NOT NULL, 
    image_base64 TEXT, -- New Column for Images
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
);

CREATE TABLE collection_points (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    operating_hours TEXT,
    location TEXT NULL, -- Constraint Removed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pledges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    donor_id UUID REFERENCES app_profiles(id) ON DELETE SET NULL,
    need_id UUID REFERENCES needs(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    qr_code_uuid UUID DEFAULT gen_random_uuid() UNIQUE,
    collection_point_id UUID REFERENCES collection_points(id) ON DELETE SET NULL,
    donor_name VARCHAR(255),  -- New Donor Name
    donor_email VARCHAR(255), -- New Donor Email
    donor_phone VARCHAR(50),  -- New Donor Phone
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 3. INSERT MOCK DATA

-- Demo Profiles (Admin, Managers and Donor)
INSERT INTO app_profiles (id, created_at, email, full_name, password_hash, role) 
VALUES 
  ('00000000-0000-0000-0000-000000000000', NOW(), 'admin@test.com', 'Admin System', 'password', 'admin'),
  ('11111111-1111-1111-1111-111111111111', NOW(), 'manager_colombo@test.com', 'Sarah Manager (Colombo)', 'password', 'camp_manager'),
  ('12121212-1212-1212-1212-121212121212', NOW(), 'manager_galle@test.com', 'David Manager (Galle)', 'password', 'camp_manager'),
  ('22222222-2222-2222-2222-222222222222', NOW(), 'donor_demo@test.com', 'John Donor', 'password', 'donor')
ON CONFLICT (id) DO NOTHING;

-- Create Relief Camps
INSERT INTO camps (id, created_at, camp_name, district, address, manager_id) 
VALUES 
  ('33333333-3333-3333-3333-333333333333', NOW(), 'Colombo Central Relief Camp', 'Colombo', '123 Main Street, Colombo 07', '11111111-1111-1111-1111-111111111111'),
  ('44444444-4444-4444-4444-444444444444', NOW(), 'Galle Coastal Shelter', 'Galle', 'Galle Fort Area', '12121212-1212-1212-1212-121212121212')
ON CONFLICT (id) DO NOTHING;

-- Broadcast Urgent Needs for these Camps
INSERT INTO needs (id, is_active, item_name, category, quantity_required, quantity_pledged, quantity_received, urgency, camp_id, image_base64) 
VALUES 
  ('55555555-5555-5555-5555-555555555555', true, 'Bottled Water (5L)', 'Food', 500, 450, 100, 'High', '33333333-3333-3333-3333-333333333333', NULL),
  ('66666666-6666-6666-6666-666666666666', true, 'Panadol/Paracetamol', 'Medicine', 200, 0, 0, 'Critical', '33333333-3333-3333-3333-333333333333', NULL),
  ('77777777-7777-7777-7777-777777777777', true, 'Dry Rations Family Pack', 'Food', 100, 100, 100, 'Medium', '44444444-4444-4444-4444-444444444444', NULL)
ON CONFLICT (id) DO NOTHING;

-- Create Collection Points
INSERT INTO collection_points (id, name, address, operating_hours) 
VALUES 
  (gen_random_uuid(), 'Red Cross Colombo', 'Town Hall, Colombo', '8AM - 6PM'),
  (gen_random_uuid(), 'Galle Face Donation Tent', 'Galle Face Green', '24 Hours')
ON CONFLICT DO NOTHING;

-- Create Pledges from the Donor
INSERT INTO pledges (id, created_at, quantity, status, need_id, donor_id, qr_code_uuid, donor_name, donor_email, donor_phone) 
VALUES 
  (gen_random_uuid(), NOW(), 50, 'COLLECTED', '55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', gen_random_uuid(), 'John Donor', 'donor_demo@test.com', '0771234567'),
  (gen_random_uuid(), NOW(), 100, 'COLLECTED', '77777777-7777-7777-7777-777777777777', '22222222-2222-2222-2222-222222222222', gen_random_uuid(), 'John Donor', 'donor_demo@test.com', '0771234567')
ON CONFLICT DO NOTHING;





-- Create Custom Alerts Table
CREATE TABLE custom_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'info', -- 'info', 'warning', 'critical'
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Example Insert Queries (To test the UI)
INSERT INTO custom_alerts (title, message, severity) VALUES 
('Heavy Rain Warning', 'Expecting 150mm rainfall in Colombo district over the next 24 hours. Avoid low-lying areas.', 'critical'),
('Relief Pack Distribution', 'Distribution of dry rations at Kolonnawa camp starting at 2 PM today.', 'info');

-- Enable RLS (Optional depending on your security setup)
ALTER TABLE custom_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active alerts" ON custom_alerts FOR SELECT USING (active = true);
-- (Admins would need INSERT/UPDATE policies if directly querying from frontend)