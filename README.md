<div align="center">

![Tinnie House Records](client/public/logo.png)

# 🎵 Tinnie House Records

**A modern, responsive web application for showcasing electronic music catalog with seamless audio playback experience.**

[![React](https://img.shields.io/badge/React-18.3.1-61dafb.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-3178c6.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-06b6d4.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Ready-00c7b7.svg?style=flat-square&logo=netlify)](https://netlify.com/)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Development](#-development)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## Overview

Polished, single-page React application that showcases the Tinnie House Records catalog, artists, and audio previews. Built as a static Vite application optimized for performance and can be deployed directly to Netlify or any static hosting platform without requiring a custom backend or database.

## ✨ Features
- **🎨 Modern UI**: Responsive design with Tailwind CSS and shadcn/ui components
- **🎵 Audio Playback**: Built-in music player with smooth controls and streaming support
- **🌙 Dark Mode**: System-aware theme switching with local storage persistence
- **📱 Mobile Optimized**: Fully responsive design for all device sizes
- **⚡ Fast Loading**: Static site generation with Vite for optimal performance
- **📧 Contact Form**: Netlify Forms integration with client-side validation
- **🎯 SEO Ready**: Proper meta tags and semantic HTML structure
- **♿ Accessible**: WCAG compliant with keyboard navigation support

## 🛠️ Tech Stack

### Frontend Framework
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe development experience
- **Vite** - Lightning-fast build tool and development server

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components built on Radix UI
- **Radix UI** - Primitives for building accessible web applications
- **Lucide React** - Beautiful & consistent icons

### Routing & Navigation
- **Wouter** - Lightweight routing library for React

### Form Handling
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### Audio & Media
- **Custom Audio Manager** - Streamlined audio playback control
- **Local Audio Storage** - Audio files served from public directory

### Development Tools
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing with Autoprefixer
- **tailwindcss-animate** - Smooth animations

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **npm** or **yarn** package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd tinnie-house-revamp

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application running.

## 💻 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run typecheck    # Run TypeScript type checking
```

### Development Guidelines

#### Code Style
- Use TypeScript for all new components
- Follow the existing folder structure
- Use shadcn/ui components when possible
- Maintain consistent naming conventions

#### Component Structure
```typescript
// Example component structure
interface ComponentProps {
  // Define props with TypeScript
}

export function Component({ prop1, prop2 }: ComponentProps) {
  return (
    // JSX with Tailwind classes
  );
}
```

#### Adding New Features
1. Create components in `client/src/components/`
2. Add page components in `client/src/pages/`
3. Update routing in the main App component
4. Add types in `client/src/types/`

## 🚀 Deployment

### Netlify (Recommended)

1. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `client/dist`

2. **Environment Variables:**
   - Optional: `NETLIFY_DATABASE_URL` for Neon database integration

3. **Deploy:**
   - Connect your GitHub repository to Netlify
   - Automatic deployments on every push to main branch

### Other Platforms

The application builds to a static `client/dist` folder that can be deployed to:
- **Vercel** - Zero-config deployment
- **GitHub Pages** - Free hosting for public repos
- **Firebase Hosting** - Google's static hosting
- **AWS S3 + CloudFront** - Scalable hosting solution

### Production Build
```bash
npm run build
```

The optimized production files will be in the `client/dist` directory.

## 📁 Project Structure

```
tinnie-house-revamp/
├── 📁 client/                 # Frontend application
│   ├── 📁 public/            # Static assets
│   │   ├── 📁 audio/         # Music files & previews
│   │   ├── 📁 data/          # JSON data (artists, releases)
│   │   ├── 📁 images/        # Images & artwork
│   │   └── favicon.png       # Site favicon
│   └── 📁 src/
│       ├── 📁 components/    # Reusable UI components
│       │   ├── 📁 ui/        # shadcn/ui components
│       │   ├── music-player.tsx
│       │   ├── release-carousel.tsx
│       │   └── contact-form.tsx
│       ├── 📁 hooks/         # Custom React hooks
│       ├── 📁 lib/           # Utility functions
│       ├── 📁 pages/         # Page components
│       ├── 📁 types/         # TypeScript type definitions
│       └── App.tsx           # Main application component
├── 📄 package.json           # Dependencies & scripts
├── 📄 vite.config.ts         # Vite configuration
├── 📄 tailwind.config.ts     # Tailwind CSS configuration
├── 📄 tsconfig.json          # TypeScript configuration
└── 📄 README.md              # This file
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the client directory:

```bash
# Development port (default: 5173)
VITE_PORT=5173

# Database connection (for Neon database integration)
NETLIFY_DATABASE_URL=postgresql://...
```

### Database Setup (Optional)

The application can optionally use a Neon Postgres database instead of static JSON files for better performance and dynamic content management.

#### Prerequisites

- Neon account (sign up at https://neon.tech)
- Netlify project connected to your Neon database
- The `NETLIFY_DATABASE_URL` environment variable set in your Netlify project

#### Database Migration Steps

**Step 1: Create Database Schema**
1. Go to your Neon dashboard
2. Navigate to your database
3. Open the SQL Editor
4. Copy and paste the contents of `database/schema.sql`
5. Execute the SQL to create the tables

**Step 2: Migrate Static Data**
1. In the same SQL Editor, copy and paste the contents of `database/migration.sql`
2. Execute the SQL to populate the tables with your existing static data

**Step 3: Environment Setup**
Make sure your Netlify project has the `NETLIFY_DATABASE_URL` environment variable set. This should be automatically configured when you connect your Neon database to Netlify.

**Step 4: Test the Integration**
Your components are now updated to use the database instead of static data:

- **Home Page**: Uses `dbQueries.getArtists()` and `dbQueries.getReleases()`
- **Release Carousel**: Uses `dbQueries.getReleases()`

#### Database Functions Available

The `dbQueries` object provides these functions:

**Artists:**
- `getArtists()` - Get all artists
- `getArtistBySlug(slug)` - Get artist by slug

**Releases:**
- `getReleases()` - Get all releases
- `getReleaseBySlug(slug)` - Get release by slug
- `getFeaturedReleases()` - Get featured releases only
- `getUpcomingReleases()` - Get upcoming releases only
- `getLatestReleases()` - Get latest releases
- `getReleasesByArtist(artistSlug)` - Get releases by artist

#### Database Schema

**Artists Table:**
```sql
- id (SERIAL PRIMARY KEY)
- slug (VARCHAR(255) UNIQUE)
- name (VARCHAR(255))
- genre (VARCHAR(255))
- image_url (VARCHAR(500))
- bio (TEXT)
- social_links (JSONB)
- created_at, updated_at (TIMESTAMP)
```

**Releases Table:**
```sql
- id (SERIAL PRIMARY KEY)
- slug (VARCHAR(255) UNIQUE)
- title (VARCHAR(255))
- artist_id (INTEGER, FK to artists)
- artist_name (VARCHAR(255))
- artist_slug (VARCHAR(255))
- label (VARCHAR(255))
- bundle_type (VARCHAR(100))
- music_style (VARCHAR(255))
- digital_release_date (DATE)
- internal_reference (VARCHAR(50))
- track_count (INTEGER)
- cover_image_url (VARCHAR(500))
- img_url (VARCHAR(500))
- beatport_sale_url (VARCHAR(500))
- purchase_link (VARCHAR(500))
- share_link (VARCHAR(500))
- audio_file_path (VARCHAR(500))
- featured (BOOLEAN)
- upcoming (BOOLEAN)
- is_latest (BOOLEAN)
- description (TEXT)
- created_at, updated_at (TIMESTAMP)
```

#### Benefits of Database Migration

1. **Dynamic Content**: Update releases and artists without code deployments
2. **Better Performance**: Database queries vs loading entire JSON files
3. **Scalability**: Easy to add search, filtering, pagination
4. **Data Integrity**: Foreign key relationships prevent orphaned data
5. **Future Features**: Foundation for user accounts, analytics, admin panels

#### Database Troubleshooting

If you encounter issues:

1. **Database Connection**: Check that `NETLIFY_DATABASE_URL` is set correctly
2. **CORS Issues**: Ensure your Neon database allows connections from your Netlify domain
3. **Missing Data**: Verify the migration script ran successfully in the SQL editor
4. **Performance**: Check the database query performance and consider adding indexes

#### Next Steps for Database

Consider these enhancements:

1. **Admin Interface**: Create a simple admin panel for managing content
2. **Analytics**: Track release plays, downloads, user engagement
3. **Search**: Add search functionality using database queries
4. **User Features**: User accounts, favorites, playlists
5. **API Endpoints**: Create RESTful API endpoints for mobile apps or third-party integrations

### Audio Configuration

#### Local Audio Storage
Audio files are stored in `client/public/audio/` and served statically as part of the application bundle. The file paths are stored in the database's `audio_file_path` field and resolved to URLs like `/audio/artist/track.mp3`.

### Theme Customization

The application supports dark/light mode with system preference detection. Customize colors in `tailwind.config.ts`:

```typescript
export default {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
      }
    }
  }
}
```

## 🔧 Troubleshooting

### Common Issues

#### Development Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Audio Files Not Loading
- Check file paths in `client/public/audio/`
- Verify CORS settings if using external hosting
- Ensure audio files are in supported formats (MP3, WAV, OGG)

#### Build Failures
```bash
# Run type checking
npm run typecheck

# Clear Vite cache
rm -rf node_modules/.vite
```

#### Netlify Form Issues
- Ensure the site is deployed on Netlify
- Check form has `netlify` attribute
- Verify environment variables are set correctly

### Performance Optimization

#### Large Audio Files
- Compress audio files for web (320kbps MP3 recommended)
- Consider using external storage for better streaming
- Implement lazy loading for non-critical audio

#### Bundle Size
```bash
# Analyze bundle size
npm run build
npm install -g vite-bundle-analyzer
vite-bundle-analyzer client/dist
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper TypeScript types
4. **Test thoroughly** across different devices and browsers
5. **Commit with clear messages**: `git commit -m 'Add amazing feature'`
6. **Push to your branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request** with a detailed description

### Development Setup
```bash
# Fork and clone your fork
git clone <your-fork-url>
cd tinnie-house-revamp

# Add upstream remote
git remote add upstream <original-repo-url>

# Install dependencies
npm install
```

### Pull Request Guidelines
- **Clear title and description**
- **Link related issues**
- **Include screenshots** for UI changes
- **Ensure all tests pass**
- **Follow existing code style**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for the electronic music community**

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/tinnie-house-revamp)

</div>

### Highlights
- Static data sources for artists/releases with inline audio previews.
- Tailwind-based styling with shadcn/ui components and a custom theme toggle.
- Netlify-ready contact form (Netlify Forms) with client-side validation powered by React Hook Form + Zod.
- Audio files served locally from `/public/audio` directory with database-driven path resolution.

### Tech Stack
- **React 18 + TypeScript** bundled with **Vite**.
- **Tailwind CSS** with `tailwindcss-animate` and shadcn/ui primitives (Radix UI).
- **Wouter** for lightweight routing.
- **Zod** & **React Hook Form** for robust form handling.

### Getting Started
```bash
npm install
npm run dev
```

The dev server runs on Vite (defaults to port `5173`). Audio files live under `client/public/audio`.

Optional environment variables for database integration live in `client/.env`:
```bash
# Database connection for Neon PostgreSQL
NETLIFY_DATABASE_URL=postgresql://...
```

### Production Build
```bash
npm run build
```

The command outputs to `client/dist`. Point Netlify (or your host) at that directory with the build command `npm run build`.

### Project Structure
```
client/
  public/           # static assets (audio, images, data)
  src/
    components/     # shadcn/ui wrappers + feature components
    lib/            # utilities (audio manager, theme provider, etc.)
    pages/          # page-level React components
    static-content.ts
    types/          # shared TypeScript types
```

### Deployment Tips
- Set `NETLIFY_DATABASE_URL` environment variable in Netlify for database integration.
- Netlify Forms will capture submissions automatically once the site is deployed.
- Audio files are bundled with the application and served statically from `/audio/` URLs.
