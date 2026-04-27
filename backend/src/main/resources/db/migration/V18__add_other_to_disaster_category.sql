-- Migration to add 'OTHER' category to disaster_category enum
-- This is necessary to match the Java enum DisasterCategory.java

ALTER TYPE disaster_category ADD VALUE IF NOT EXISTS 'OTHER';
