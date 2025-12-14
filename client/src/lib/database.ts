import { neon } from '@netlify/neon';
import type { Artist, Release } from '@/types/content';

// Initialize Neon database connection
const sql = neon();

// Database query functions
export const dbQueries = {
  // Get all artists
  async getArtists(): Promise<Artist[]> {
    try {
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
      return artists as Artist[];
    } catch (error) {
      console.error('Error fetching artists:', error);
      return [];
    }
  },

  // Get artist by slug
  async getArtistBySlug(slug: string): Promise<Artist | null> {
    try {
      const [artist] = await sql`
        SELECT 
          id,
          slug,
          name,
          genre,
          image_url as "imageUrl",
          bio,
          social_links as "socialLinks"
        FROM artists 
        WHERE slug = ${slug}
        LIMIT 1
      `;
      return artist as Artist || null;
    } catch (error) {
      console.error('Error fetching artist by slug:', error);
      return null;
    }
  },

  // Get all releases
  async getReleases(): Promise<Release[]> {
    try {
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
      return releases as Release[];
    } catch (error) {
      console.error('Error fetching releases:', error);
      return [];
    }
  },

  // Get release by slug
  async getReleaseBySlug(slug: string): Promise<Release | null> {
    try {
      const [release] = await sql`
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
        WHERE slug = ${slug}
        LIMIT 1
      `;
      return release as Release || null;
    } catch (error) {
      console.error('Error fetching release by slug:', error);
      return null;
    }
  },

  // Get featured releases
  async getFeaturedReleases(): Promise<Release[]> {
    try {
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
        WHERE featured = true
        ORDER BY digital_release_date DESC NULLS LAST
      `;
      return releases as Release[];
    } catch (error) {
      console.error('Error fetching featured releases:', error);
      return [];
    }
  },

  // Get upcoming releases
  async getUpcomingReleases(): Promise<Release[]> {
    try {
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
        WHERE upcoming = true
        ORDER BY digital_release_date ASC
      `;
      return releases as Release[];
    } catch (error) {
      console.error('Error fetching upcoming releases:', error);
      return [];
    }
  },

  // Get latest releases (is_latest flag)
  async getLatestReleases(): Promise<Release[]> {
    try {
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
        WHERE is_latest = true
        ORDER BY digital_release_date DESC NULLS LAST
      `;
      return releases as Release[];
    } catch (error) {
      console.error('Error fetching latest releases:', error);
      return [];
    }
  },

  // Get releases by artist
  async getReleasesByArtist(artistSlug: string): Promise<Release[]> {
    try {
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
        WHERE artist_slug = ${artistSlug}
        ORDER BY digital_release_date DESC NULLS LAST
      `;
      return releases as Release[];
    } catch (error) {
      console.error('Error fetching releases by artist:', error);
      return [];
    }
  }
};