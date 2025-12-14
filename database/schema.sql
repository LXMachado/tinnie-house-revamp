-- Tinnie House Records Database Schema
-- Neon Postgres Database Setup

-- Artists table
CREATE TABLE artists (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  genre VARCHAR(255),
  image_url VARCHAR(500),
  bio TEXT,
  social_links JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Releases table  
CREATE TABLE releases (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  artist_id INTEGER REFERENCES artists(id),
  artist_name VARCHAR(255) NOT NULL,
  artist_slug VARCHAR(255),
  label VARCHAR(255) DEFAULT 'Tinnie House Records',
  bundle_type VARCHAR(100),
  music_style VARCHAR(255),
  digital_release_date DATE,
  internal_reference VARCHAR(50),
  track_count INTEGER DEFAULT 1,
  cover_image_url VARCHAR(500),
  img_url VARCHAR(500),
  beatport_sale_url VARCHAR(500),
  purchase_link VARCHAR(500),
  share_link VARCHAR(500),
  audio_file_path VARCHAR(500),
  featured BOOLEAN DEFAULT FALSE,
  upcoming BOOLEAN DEFAULT FALSE,
  is_latest BOOLEAN DEFAULT FALSE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_releases_artist_id ON releases(artist_id);
CREATE INDEX idx_releases_slug ON releases(slug);
CREATE INDEX idx_releases_featured ON releases(featured);
CREATE INDEX idx_releases_upcoming ON releases(upcoming);
CREATE INDEX idx_releases_digital_release_date ON releases(digital_release_date DESC);