-- V22__add_alert_rules_auditing_columns.sql
-- Fixes SchemaManagementException: missing column [updated_at] in table [alert_rules]

ALTER TABLE alert_rules
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITHOUT TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITHOUT TIME ZONE,
ADD COLUMN IF NOT EXISTS last_triggered_at TIMESTAMP WITHOUT TIME ZONE;

-- Initialize existing records
UPDATE alert_rules SET created_at = NOW() WHERE created_at IS NULL;
UPDATE alert_rules SET updated_at = NOW() WHERE updated_at IS NULL;
