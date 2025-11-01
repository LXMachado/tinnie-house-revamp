# Supabase Setup Guide

This guide walks you through setting up Supabase for your Cloudflare Workers migration.

## Why Supabase?

- **HTTP-based API**: Perfect for Cloudflare Workers (no persistent connections needed)
- **Free tier**: 50,000 rows/month, 2GB storage, 100MB database
- **PostgreSQL**: Full-featured database with real-time capabilities
- **REST API**: Built-in HTTP API that works seamlessly with Workers
- **Row Level Security**: Built-in security features

## Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" 
3. Sign up with GitHub (recommended) or email
4. Verify your email if needed

## Step 2: Create New Project

1. Click "New project"
2. Choose your organization (or create one)
3. Fill in project details:
   - **Name**: `tinnie-house-records` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose the region closest to your users
4. Click "Create new project"

**⚠️ Important**: Save your database password - you'll need it!

## Step 3: Wait for Project Setup

- Project creation takes 1-2 minutes
- You'll see a progress indicator
- Once ready, you'll be redirected to the project dashboard

## Step 4: Get Your Credentials

In your project dashboard, go to **Settings > API**:

### Copy these values:
- **Project URL**: `https://your-project-id.supabase.co`
- **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

### For database connection:
- **Host**: `db.your-project-id.supabase.co`
- **Database**: `postgres`
- **Username**: `postgres`
- **Password**: [The password you created in Step 2]

## Step 5: Set Up Database Tables

### Option A: Using SQL Editor (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New Query"
3. Copy and paste this SQL to create your tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Create users table (if needed for admin features)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for artists" ON artists
    FOR SELECT USING (true);

CREATE POLICY "Public read access for releases" ON releases
    FOR SELECT USING (true);

-- Create policies for contact submissions (public insert, admin read)
CREATE POLICY "Public insert for contact submissions" ON contact_submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read for contact submissions" ON contact_submissions
    FOR SELECT USING (true);

-- Create policies for users (admin only - adjust as needed)
CREATE POLICY "Admin read/write users" ON users
    FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_releases_featured ON releases(featured);
CREATE INDEX idx_releases_upcoming ON releases(upcoming);
CREATE INDEX idx_releases_artist_id ON releases(artist_id);
CREATE INDEX idx_artists_created_at ON artists(created_at);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);
```

4. Click "Run" to execute the SQL

### Option B: Using Table Editor

1. Go to **Table Editor**
2. Create tables one by one using the GUI
3. Set up relationships between tables
4. Configure RLS policies

## Step 6: Test Database Connection

In the SQL Editor, run this test query:

```sql
SELECT COUNT(*) as table_count FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see the count of your newly created tables.

## Step 7: Configure Environment Variables

Now you have all the information needed for your `.env` file:

```bash
# Your Supabase credentials
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_DB_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres

# Workers Configuration
NODE_ENV=production
API_VERSION=1.0.0
```

## Step 8: Test with Sample Data

Insert some test data:

```sql
-- Insert a sample artist
INSERT INTO artists (name, bio, genre) 
VALUES ('Sample Artist', 'A test artist for the music label', 'Melodic House & Techno');

-- Insert a sample release
INSERT INTO releases (title, artist, label, featured, upcoming) 
VALUES ('Test Release', 'Sample Artist', 'Tinnie House Records', true, false);
```

## Step 9: Verify API Access

Test your Supabase REST API:

1. Go to your project's **API** settings
2. Copy your **anon key**
3. Test this URL in your browser:
   `https://your-project-id.supabase.co/rest/v1/artists`

You should see your test data in JSON format.

## Step 10: Configure for Cloudflare Workers

Now set your environment variables for Cloudflare Workers:

```bash
# Set these as secrets in Cloudflare Workers
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY  
wrangler secret put SUPABASE_DB_URL
```

## Security Notes

1. **Never expose your `service_role` key** in client-side code
2. **Use `anon` key** for public read access
3. **RLS policies** protect your data at the database level
4. **API keys** should be stored as secrets in Cloudflare Workers

## Troubleshooting

### Connection Issues
- Verify your project URL format: `https://project-id.supabase.co`
- Check that your database password is correct
- Ensure your IP isn't blocked

### RLS Issues
- Make sure RLS policies are created
- Test with different user contexts
- Check policy conditions

### API Issues
- Verify your anon key is correct
- Check request headers include `apikey`
- Test with Postman or curl first

## Next Steps

1. ✅ Database setup complete
2. Test the Workers locally with your Supabase instance
3. Deploy to Cloudflare Workers
4. Monitor usage and optimize as needed

Your Supabase setup is now ready for Cloudflare Workers! 🎉