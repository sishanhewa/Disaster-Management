-- Migration: Create verification system tables and add columns to users
-- Tables: verification_codes
-- User columns: phone_verified, volunteer_status

-- =============================================
-- Table: verification_codes
-- Stores OTP (One-Time Password) codes for user verification
-- =============================================
CREATE TABLE IF NOT EXISTS verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact VARCHAR(255) NOT NULL,
    verification_type VARCHAR(30) NOT NULL,
    code_hash VARCHAR(64) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    attempt_count INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for verification_codes
CREATE INDEX idx_verification_user ON verification_codes(user_id);
CREATE INDEX idx_verification_contact ON verification_codes(contact);
CREATE INDEX idx_verification_expires ON verification_codes(expires_at);
CREATE INDEX idx_verification_status ON verification_codes(is_used, expires_at);

-- =============================================
-- Add new columns to users table
-- =============================================

-- Add phone_verified column (tracks phone verification status)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;

-- Update existing users to have default values
UPDATE users SET phone_verified = FALSE WHERE phone_verified IS NULL;

-- =============================================
-- Add comment/documentation
-- =============================================
COMMENT ON TABLE verification_codes IS 'Stores OTP codes for email/phone verification and volunteer applications';
COMMENT ON COLUMN verification_codes.code_hash IS 'SHA-256 hash of the OTP - never store plain text codes';
COMMENT ON COLUMN verification_codes.verification_type IS 'Type: EMAIL_VERIFICATION, PHONE_VERIFICATION, VOLUNTEER_APPLICATION, PASSWORD_RESET';
COMMENT ON COLUMN users.phone_verified IS 'Whether user phone number has been verified via OTP';
