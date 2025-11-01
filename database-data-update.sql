-- Update releases table to add missing fields that frontend expects
ALTER TABLE releases 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS artist_slug TEXT,
ADD COLUMN IF NOT EXISTS is_latest BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS audio_file_path TEXT;

-- Update existing releases with proper data structure
UPDATE releases SET 
  slug = 'stormdrifter',
  artist_slug = 'rafa-kao',
  is_latest = true,
  audio_file_path = 'rafa-kao/stormdrifter.mp3',
  digital_release_date = '2025-06-30',
  internal_reference = 'TH019'
WHERE bundle_id = '10341902';

UPDATE releases SET 
  slug = 'ritual',
  artist_slug = 'rafa-kao-gabriel-samy',
  is_latest = false,
  audio_file_path = 'rafa-kao-gabriel-samy/ritual.mp3',
  digital_release_date = '2024-11-15',
  internal_reference = 'TH018'
WHERE title = 'Ritual' AND artist = 'Guri';

UPDATE releases SET 
  slug = 'aurora-ep',
  artist_slug = 'guri',
  is_latest = false,
  audio_file_path = 'guri/aurora.mp3',
  digital_release_date = '2024-08-09',
  internal_reference = 'TH017'
WHERE title = 'Aurora';

UPDATE releases SET 
  slug = 'magnetosphere',
  artist_slug = 'guri',
  is_latest = false,
  audio_file_path = 'guri/magnetosphere.mp3',
  digital_release_date = '2024-05-06',
  internal_reference = 'TH016'
WHERE title = 'Magnetosphere';

UPDATE releases SET 
  slug = 'morphing',
  artist_slug = 'guri',
  is_latest = false,
  audio_file_path = 'guri/morphing.mp3',
  digital_release_date = '2024-01-15',
  internal_reference = 'TH015'
WHERE title = 'Morphing';