-- SQL Script to add ORCID ID field to Author table
-- Adjust table name according to your Django app name

-- For PostgreSQL
ALTER TABLE your_app_author 
ADD COLUMN IF NOT EXISTS orcid_id VARCHAR(25);

-- For MySQL  
-- ALTER TABLE your_app_author 
-- ADD COLUMN orcid_id VARCHAR(25) DEFAULT NULL;

-- For SQLite
-- ALTER TABLE your_app_author 
-- ADD COLUMN orcid_id TEXT;

-- Add comment (PostgreSQL)
COMMENT ON COLUMN your_app_author.orcid_id IS 'ORCID ID (example: 0000-0002-1495-3967)';