-- Add delivered_at column to notification_deliveries for tracking delivery success timestamp
ALTER TABLE notification_deliveries
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP NULL;
