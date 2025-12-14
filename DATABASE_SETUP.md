# Database Migration Setup Guide

This guide will help you set up your Neon Postgres database and migrate your static data to the database.

## Prerequisites

- Neon account (sign up at https://neon.tech)
- Netlify project connected to your Neon database
- The `NETLIFY_DATABASE_URL` environment variable set in your Netlify project

## Step 1: Create Database Schema

1. Go to your Neon dashboard
2. Navigate to your database
3. Open the SQL Editor
4. Copy and paste the contents of `database/schema.sql`
5. Execute the SQL to create the tables

## Step 2: Migrate Static Data

1. In the same SQL Editor, copy and paste the contents of `database/migration.sql`
2. Execute the SQL to populate the tables with your existing static data

## Step 3: Environment Setup

Make sure your Netlify project has the `NETLIFY_DATABASE_URL` environment variable set. This should be automatically configured when you connect your Neon database to Netlify.

## Step 4: Test the Integration

Your components are now updated to use the database instead of static data:

- **Home Page**: Uses `dbQueries.getArtists()` and `dbQueries.getReleases()`
- **Release Carousel**: Uses `dbQueries.getReleases()`

## Database Functions Available

The `dbQueries` object provides these functions:

### Artists
- `getArtists()` - Get all artists
- `getArtistBySlug(slug)` - Get artist by slug

### Releases
- `getReleases()` - Get all releases
- `getReleaseBySlug(slug)` - Get release by slug
- `getFeaturedReleases()` - Get featured releases only
- `getUpcomingReleases()` - Get upcoming releases only
- `getLatestReleases()` - Get latest releases
- `getReleasesByArtist(artistSlug)` - Get releases by artist

## Data Structure

### Artists Table
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

### Releases Table
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

## Benefits of Database Migration

1. **Dynamic Content**: Update releases and artists without code deployments
2. **Better Performance**: Database queries vs loading entire JSON files
3. **Scalability**: Easy to add search, filtering, pagination
4. **Data Integrity**: Foreign key relationships prevent orphaned data
5. **Future Features**: Foundation for user accounts, analytics, admin panels

## Troubleshooting

If you encounter issues:

1. **Database Connection**: Check that `NETLIFY_DATABASE_URL` is set correctly
2. **CORS Issues**: Ensure your Neon database allows connections from your Netlify domain
3. **Missing Data**: Verify the migration script ran successfully in the SQL editor
4. **Performance**: Check the database query performance and consider adding indexes

## Next Steps

Consider these enhancements:

1. **Admin Interface**: Create a simple admin panel for managing content
2. **Analytics**: Track release plays, downloads, user engagement
3. **Search**: Add search functionality using database queries
4. **User Features**: User accounts, favorites, playlists
5. **API Endpoints**: Create RESTful API endpoints for mobile apps or third-party integrations