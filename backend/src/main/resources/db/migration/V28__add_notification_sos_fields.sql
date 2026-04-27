-- Add SOS notification fields to notifications table
ALTER TABLE notifications
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS priority INTEGER,
    ADD COLUMN IF NOT EXISTS source_entity_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS source_entity_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS action_url VARCHAR(500);
