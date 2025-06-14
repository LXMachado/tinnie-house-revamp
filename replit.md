# Tinnie House Records Website

## Project Overview
A modern electronic music label website built with React/Vite frontend and PostgreSQL database backend. The site features a complete homepage with hero section, release carousel, featured artists, about section, and contact form. Includes dark/light theme toggle and responsive design.

## Recent Changes
- **June 14, 2025**: Music player integration and content updates
  - Added audio_file_url column to database schema for music file storage
  - Integrated 5 authentic MP3 files (Rafa Kao, G.U.R.I tracks) with proper server routing
  - Created full-featured music player component with play/pause, volume, and progress controls
  - Implemented compact music player in release carousel hover overlay
  - Updated "Rafa Kao & Gabriel Samy - Ritual" with new audio file
  - Configured Express server to serve audio files from /assets/ endpoint
  - Updated About Us section to emphasize global reach and specific electronic genres (techno, melodic techno, progressive house)
- **June 14, 2025**: Implemented authentic releases section with CSV data
  - Added featured upcoming release "Rafa Kao - Stormdrifter" with May 2025 release date
  - Created carousel with authentic catalog releases using real cover art URLs
  - Integrated Beatport purchase links for available releases
  - Added catalog numbers (TH019, TH018, etc.) and track count information
  - Updated database schema to match CSV structure with all release metadata
  - Fixed theme toggle functionality for proper light/dark mode switching
- **December 14, 2024**: Complete design transformation to match original aesthetic
  - Updated logo and favicon with actual Tinnie House Records ram skull design
  - Implemented dark theme with deep blue gradient background (hsl(217, 91%, 60%))
  - Added blur card effects with backdrop-filter and glass morphism
  - Restored original clip-path polygon button shapes with modern gradients
  - Applied Orbitron font throughout for consistent futuristic aesthetic
  - Added floating animations and pulse glow effects
  - Redesigned hero section with large typography and proper spacing

## Architecture
- **Frontend**: React with Vite, TypeScript, Tailwind CSS
- **Backend**: Express.js with PostgreSQL database
- **Database**: Drizzle ORM with relations for users, artists, releases, and contact submissions
- **Styling**: Custom Tailwind config with clip-path polygon buttons, dark/light theme support
- **Components**: Reusable UI components, animated carousel, contact form with validation

## Key Features
- Responsive design with mobile navigation
- Theme toggle (light/dark mode)
- Release carousel with auto-advance
- Contact form with validation
- Database integration for dynamic content
- Custom button styling with clip-path effects
- SEO optimization with meta tags

## User Preferences
- Prefers complete, working solutions over partial implementations
- Values preserved styling from original design
- Wants authentic data sources, not mock/placeholder content