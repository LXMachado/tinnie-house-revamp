import { STATIC_ARTISTS, STATIC_RELEASES } from '@/static-content';
import type { Artist, Release } from '@/types/content';

// Simple fallback system that uses static data by default
// Only attempts database connection if explicitly configured
export const dbFallback = {
  // Check if we should use database (when NETLIFY_DATABASE_URL is available)
  shouldUseDatabase(): boolean {
    if (typeof process === 'undefined' || !process.env) {
      return false;
    }
    return Boolean(process.env.NETLIFY_DATABASE_URL);
  },

  // Get all artists with automatic fallback
  async getArtists(): Promise<Artist[]> {
    // For local development, always use static data
    if (!this.shouldUseDatabase()) {
      console.log('Using static data for artists (database not configured)');
      return STATIC_ARTISTS;
    }

    try {
      const { neon } = await import('@netlify/neon');
      const sql = neon();
      const artists = await sql`
        SELECT 
          id,
          slug,
          name,
          genre,
          image_url as "imageUrl",
          bio,
          social_links as "socialLinks"
        FROM artists 
        ORDER BY name ASC
      `;
      console.log('Using database data for artists');
      return artists as Artist[];
    } catch (error) {
      console.warn('Database connection failed, using fallback static data for artists:', error);
      return STATIC_ARTISTS;
    }
  },

  // Get all releases with automatic fallback
  async getReleases(): Promise<Release[]> {
    // For local development, always use static data
    if (!this.shouldUseDatabase()) {
      console.log('Using static data for releases (database not configured)');
      return STATIC_RELEASES;
    }

    try {
      const { neon } = await import('@netlify/neon');
      const sql = neon();
      const releases = await sql`
        SELECT 
          id,
          slug,
          title,
          artist_name as "artist",
          artist_slug as "artistSlug",
          bundle_id as "bundleId",
          label,
          bundle_type as "bundleType",
          music_style as "musicStyle",
          digital_release_date as "digitalReleaseDate",
          internal_reference as "internalReference",
          track_count as "trackCount",
          cover_image_url as "coverImageUrl",
          img_url as "imgUrl",
          beatport_sale_url as "beatportSaleUrl",
          purchase_link as "purchaseLink",
          share_link as "shareLink",
          audio_file_path as "audioFilePath",
          featured,
          upcoming,
          is_latest as "isLatest",
          description
        FROM releases 
        ORDER BY digital_release_date DESC NULLS LAST
      `;
      console.log('Using database data for releases');
      return releases as Release[];
    } catch (error) {
      console.warn('Database connection failed, using fallback static data for releases:', error);
      return STATIC_RELEASES;
    }
  },

  // Get featured releases with fallback
  async getFeaturedReleases(): Promise<Release[]> {
    const allReleases = await this.getReleases();
    return allReleases.filter(release => release.featured);
  },

  // Get upcoming releases with fallback
  async getUpcomingReleases(): Promise<Release[]> {
    const allReleases = await this.getReleases();
    return allReleases.filter(release => release.upcoming);
  },

  // Get latest releases with fallback
  async getLatestReleases(): Promise<Release[]> {
    const allReleases = await this.getReleases();
    return allReleases.filter(release => release.isLatest);
  },

  // Get releases by artist with fallback
  async getReleasesByArtist(artistSlug: string): Promise<Release[]> {
    const allReleases = await this.getReleases();
    return allReleases.filter(release => release.artistSlug === artistSlug);
  },

  // Get artist by slug with fallback
  async getArtistBySlug(slug: string): Promise<Artist | null> {
    const allArtists = await this.getArtists();
    return allArtists.find(artist => artist.slug === slug) || null;
  },

  // Get release by slug with fallback
  async getReleaseBySlug(slug: string): Promise<Release | null> {
    const allReleases = await this.getReleases();
    return allReleases.find(release => release.slug === slug) || null;
  }
};

// Convenience function for components to get data synchronously for initial render
export function getStaticDataFallback() {
  return {
    artists: STATIC_ARTISTS,
    releases: STATIC_RELEASES
  };
}