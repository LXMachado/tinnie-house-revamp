-- Database Setup for Tinnie House Records
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS releases CASCADE;
DROP TABLE IF EXISTS artists CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create artists table
CREATE TABLE artists (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT,
    genre TEXT,
    image_url TEXT,
    social_links TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create releases table
CREATE TABLE releases (
    id SERIAL PRIMARY KEY,
    bundle_id TEXT UNIQUE,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    artist_id INTEGER REFERENCES artists(id),
    label_id TEXT,
    label TEXT DEFAULT 'Tinnie House Records',
    ean TEXT,
    bundle_type TEXT DEFAULT 'Maxi Single',
    music_style TEXT DEFAULT 'Melodic House & Techno',
    digital_release_date TEXT,
    published TEXT DEFAULT 'Y',
    cover_file_name TEXT,
    cover_image_url TEXT,
    img_url TEXT,
    internal_reference TEXT,
    cover_file_hash TEXT,
    track_count INTEGER DEFAULT 1,
    beatport_sale_url TEXT,
    purchase_link TEXT,
    share_link TEXT,
    audio_file_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    upcoming BOOLEAN DEFAULT FALSE,
    description TEXT,
    release_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    update_date TIMESTAMP WITH TIME ZONE
);

-- Create contact_submissions table
CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create public read policies for artists and releases
CREATE POLICY "Public read access for artists" ON artists
    FOR SELECT USING (true);

CREATE POLICY "Public read access for releases" ON releases
    FOR SELECT USING (true);

-- Create policies for contact submissions
CREATE POLICY "Public insert for contact submissions" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read for contact submissions" ON contact_submissions
    FOR SELECT USING (true);

-- Create policies for users (admin access - adjust as needed)
CREATE POLICY "Admin read/write users" ON users
    FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_releases_featured ON releases(featured);
CREATE INDEX idx_releases_upcoming ON releases(upcoming);
CREATE INDEX idx_releases_artist_id ON releases(artist_id);
CREATE INDEX idx_releases_bundle_id ON releases(bundle_id);
CREATE INDEX idx_artists_created_at ON artists(created_at);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);

-- Insert sample data for testing
INSERT INTO artists (name, bio, genre, image_url) VALUES 
('Gabriel Samy', 'Talented electronic music producer specializing in melodic house and techno.', 'Melodic House & Techno', '/images/artists/gabriel-samy/gabriel-samy.png'),
('Guri', 'Innovative sound designer with a unique approach to electronic music composition.', 'Melodic House & Techno', '/images/artists/guri/guri.png'),
('Rafa Kao', 'Versatile artist blending traditional and modern electronic music elements.', 'Melodic House & Techno', '/images/artists/rafa-kao/rafa-kao.png');

-- Insert sample releases (using bundle ID 10341902 for the featured latest release)
INSERT INTO releases (
    bundle_id, title, artist, label, featured, upcoming, 
    cover_image_url, audio_file_url, purchase_link, share_link, 
    beatport_sale_url, description, track_count
) VALUES 
(
    '10341902', 'Stormdrifter', 'Gabriel Samy', 'Tinnie House Records', 
    true, false, '/images/artwork/stormdrifter.webp', '/audio/stormdrifter.mp3',
    'https://beatport.com/track/stormdrifter', 'https://open.spotify.com/track/stormdrifter',
    'https://beatport.com/artist/gabriel-samy/10341902',
    'A mesmerizing journey through atmospheric soundscapes and driving rhythms.',
    1
),
(
    NULL, 'Aurora', 'Guri', 'Tinnie House Records', 
    false, false, '/images/artwork/aurora.webp', NULL,
    NULL, NULL, NULL,
    'An ethereal exploration of light and shadow through sound.',
    3
),
(
    NULL, 'Magnetosphere', 'Rafa Kao', 'Tinnie House Records', 
    false, false, '/images/artwork/magnetosphere.webp', NULL,
    NULL, NULL, NULL,
    'Cosmic-inspired melodies with deep, resonant bass lines.',
    2
),
(
    NULL, 'Morphing', 'Gabriel Samy', 'Tinnie House Records', 
    false, false, '/images/artwork/morphing.webp', NULL,
    NULL, NULL, NULL,
    'Transformative electronic compositions that evolve with each listen.',
    1
),
(
    NULL, 'Ritual', 'Guri', 'Tinnie House Records', 
    false, false, '/images/artwork/ritual.webp', NULL,
    NULL, NULL, NULL,
    'Ancient rhythms reimagined for the modern electronic music landscape.',
    2
);

-- Update sequence values
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('artists_id_seq', (SELECT MAX(id) FROM artists));
SELECT setval('releases_id_seq', (SELECT MAX(id) FROM releases));
SELECT setval('contact_submissions_id_seq', (SELECT MAX(id) FROM contact_submissions));

-- Verify tables were created
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
ORDER BY table_name, ordinal_position;