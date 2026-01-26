-- Data Migration Script
-- Migrate existing static data to Neon Postgres database

-- First, clear existing data (if any)
TRUNCATE TABLE releases, artists RESTART IDENTITY CASCADE;

-- Insert artists data
INSERT INTO artists (slug, name, genre, image_url, bio, social_links) VALUES
('guri', 'G.U.R.I', 'Progressive-House, Melodic-Techno', '/images/artists/guri/guri.png', 'G.U.R.I delivers deep hypnotic grooves anchored by ethereal pads and dark atmospheres.', '{"instagram": "https://gate.sc/?url=https%3A%2F%2Fwww.instagram.com%2Fgur_music%2F&token=a0bb9c-1-1761971723711", "soundcloud": "https://soundcloud.com/guri"}'),
('rafa-kao', 'Rafa Kao', 'Melodic Techno', '/images/artists/rafa-kao/rafa-kao.png', 'Rafa Kao crafts cinematic melodic techno that balances dancefloor power with emotive storytelling and intricate soundscapes.', '{"instagram": "https://instagram.com/rafakao", "soundcloud": "https://soundcloud.com/rafakao"}'),
('gabriel-samy', 'Gabriel Samy', 'Melodic Techno', '/images/artists/gabriel-samy/gabriel-samy.png', 'A fixture of the Brazilian underground scene, Gabriel Samy integrates organic instrumentation with modern club sonics.', '{"instagram": "https://instagram.com/gabrielsamy", "spotify": "https://open.spotify.com/artist/0Jjg998wVzQv"}');

-- Insert releases data (linking to artists by slug)
INSERT INTO releases (
  slug, title, artist_id, artist_name, artist_slug, label, bundle_type, music_style,
  digital_release_date, internal_reference, track_count, cover_image_url, img_url,
  beatport_sale_url, purchase_link, share_link, audio_file_path, featured, upcoming, is_latest, description
) VALUES
(
  'polynomic-void', 'Polynomic Void', 
  (SELECT id FROM artists WHERE slug = 'guri'), 
  'G.U.R.I', 'guri', 
  'Tinnie House Records', 'Single', 'Progressive House',
  '2025-12-26', 'TH020', 1, 
  '/images/artwork/polynomic-void.webp', '/images/artwork/polynomic-void.webp',
  'https://www.beatport.com/release/polynomic-void/5657786', 'https://www.beatport.com/release/polynomic-void/5657786', 'https://www.beatport.com/release/polynomic-void/5657786', 'guri/polynomic-void.mp3', 
  true, false, true,
  'The collapse isn''t chaotic; it feels inevitable, as if all complexity is being drawn toward a singular point where meaning is stripped away and only pure abstraction remains. It''s the moment before a polynomial becomes undefined, before the graph disappears into a vertical asymptote, before logic itself breaks.'
),
(
  'ritual', 'Ritual',
  NULL, -- Collaboration between two artists
  'Rafa Kao & Gabriel Samy', 'rafa-kao-gabriel-samy',
  'Tinnie House Records', 'Single', 'Progressive House',
  '2024-11-15', 'TH018', 1,
  '/images/artwork/ritual.webp', '/images/artwork/ritual.webp',
  'https://www.beatport.com/release/ritual/4977154', 
  'https://www.beatport.com/release/ritual/4977154',
  'https://www.beatport.com/release/ritual/4977154', 'rafa-kao-gabriel-samy/ritual.mp3',
  true, false, false,
  'Hypnotic arps and evolving pads collide with a driving bassline in this collaboration between Rafa Kao and Gabriel Samy.'
),
(
  'aurora-ep', 'Aurora EP',
  (SELECT id FROM artists WHERE slug = 'guri'),
  'G.U.R.I', 'guri',
  'Tinnie House Records', 'EP', 'Progressive House',
  '2024-08-09', 'TH017', 3,
  '/images/artwork/aurora.webp', '/images/artwork/aurora.webp',
  'https://www.beatport.com/release/aurora/3899067',
  'https://www.beatport.com/release/aurora/3899067',
  'https://www.beatport.com/release/aurora/3899067', 'guri/aurora.mp3',
  false, false, false,
  'The Aurora EP explores cinematic textures across three deep-tech cuts designed for late-night floors and sunrise sets alike.'
),
(
  'magnetosphere', 'Magnetosphere',
  (SELECT id FROM artists WHERE slug = 'guri'),
  'G.U.R.I', 'guri',
  'Tinnie House Records', 'Single', 'Techno',
  '2024-05-06', 'TH016', 1,
  '/images/artwork/magnetosphere.webp', '/images/artwork/magnetosphere.webp',
  'https://www.beatport.com/release/magnetosphere/3901406',
  'https://www.beatport.com/release/magnetosphere/3901406',
  'https://www.beatport.com/release/magnetosphere/3901406', 'guri/magnetosphere.mp3',
  false, false, false,
  'Peak-time techno with shimmering textures that nod to the label''s melodic roots.'
),
(
  'morphing', 'Morphing',
  (SELECT id FROM artists WHERE slug = 'guri'),
  'G.U.R.I', 'guri',
  'Tinnie House Records', 'Single', 'Progressive House',
  '2024-01-15', 'TH015', 1,
  '/images/artwork/morphing.webp', '/images/artwork/morphing.webp',
  'https://www.beatport.com/release/morphing/4163783',
  'https://www.beatport.com/release/morphing/4163783',
  'https://www.beatport.com/release/morphing/4163783', 'guri/morphing.mp3',
  false, false, false,
  'An evolving soundscape that transforms seamlessly through different rhythmic and melodic territories.'
),
(
  'stormdrifter', 'Stormdrifter',
  (SELECT id FROM artists WHERE slug = 'rafa-kao'),
  'Rafa Kao', 'rafa-kao',
  'Tinnie House Records', 'Maxi Single', 'Melodic House & Techno',
  '2025-06-30', 'TH019', 3,
  '/images/artwork/stormdrifter.webp', '/images/artwork/stormdrifter.webp',
  'https://www.beatport.com/release/stormdrifter/5123504',
  'https://www.beatport.com/release/stormdrifter/5123504',
  'https://www.beatport.com/release/stormdrifter/5123504', 'rafa-kao/stormdrifter.mp3',
  false, false, false,
  'Rafa Kao blends atmospheric synth layers with rolling percussion for an uplifting melodic techno journey that sets the tone for the label''s future output.'
);