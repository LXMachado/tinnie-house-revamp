// Shared data mapping utilities to transform between Supabase snake_case and frontend camelCase

// Frontend types
export interface Artist {
  id: number;
  slug: string;
  name: string;
  genre?: string;
  imageUrl?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
}

export interface Release {
  id: number;
  slug: string;
  title: string;
  artist: string;
  artistSlug?: string;
  bundleId?: string;
  label?: string;
  bundleType?: string;
  musicStyle?: string;
  digitalReleaseDate?: string;
  internalReference?: string;
  trackCount?: number;
  coverImageUrl?: string;
  imgUrl?: string;
  beatportSaleUrl?: string;
  purchaseLink?: string;
  shareLink?: string;
  audioFilePath?: string;
  featured?: boolean;
  upcoming?: boolean;
  isLatest?: boolean;
  description?: string;
}

// Supabase snake_case interfaces
interface SupabaseArtist {
  id: number;
  name: string;
  bio?: string;
  genre?: string;
  image_url?: string;
  social_links?: string;
  created_at: string;
}

interface SupabaseRelease {
  id: number;
  bundle_id?: string;
  title: string;
  artist: string;
  artist_id?: number;
  label_id?: string;
  label: string;
  ean?: string;
  bundle_type: string;
  music_style: string;
  digital_release_date?: string;
  published: string;
  cover_file_name?: string;
  cover_image_url?: string;
  img_url?: string;
  internal_reference?: string;
  cover_file_hash?: string;
  track_count: number;
  beatport_sale_url?: string;
  purchase_link?: string;
  share_link?: string;
  audio_file_url?: string;
  featured: boolean;
  upcoming: boolean;
  description?: string;
  release_date?: string;
  created_at: string;
  update_date?: string;
}

// Parse social links from JSON string
function parseSocialLinks(socialLinksStr?: string): Record<string, string> | undefined {
  if (!socialLinksStr) return undefined;
  try {
    return JSON.parse(socialLinksStr);
  } catch {
    return undefined;
  }
}

// Generate audio file path from audio URL
function generateAudioFilePath(audioFileUrl?: string, artist?: string, title?: string): string | undefined {
  if (!audioFileUrl) return undefined;
  
  // Extract filename from URL
  const urlParts = audioFileUrl.split('/');
  const filename = urlParts[urlParts.length - 1];
  
  if (filename && filename.includes('.mp3')) {
    // Remove .mp3 extension and use as path
    const baseName = filename.replace('.mp3', '');
    
    if (artist && title) {
      // Convert artist name to slug format
      const artistSlug = generateSlug(artist);
      
      return `${artistSlug}/${baseName}.mp3`;
    }
    
    return `${baseName}.mp3`;
  }
  
  return undefined;
}

// Helper function to safely generate slug from string
function generateSlug(text?: string): string {
  if (!text) return 'untitled';
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
}

// Map Supabase artist to frontend format
export function mapSupabaseArtist(supabaseArtist: SupabaseArtist): Artist {
  return {
    id: supabaseArtist.id,
    slug: generateSlug(supabaseArtist.name),
    name: supabaseArtist.name || 'Unknown Artist',
    genre: supabaseArtist.genre,
    imageUrl: supabaseArtist.image_url,
    bio: supabaseArtist.bio,
    socialLinks: parseSocialLinks(supabaseArtist.social_links),
  };
}

// Map Supabase release to frontend format
export function mapSupabaseRelease(supabaseRelease: SupabaseRelease): Release {
  return {
    id: supabaseRelease.id,
    slug: generateSlug(supabaseRelease.title),
    title: supabaseRelease.title || 'Untitled Release',
    artist: supabaseRelease.artist || 'Unknown Artist',
    artistSlug: supabaseRelease.artist_id?.toString(),
    bundleId: supabaseRelease.bundle_id,
    label: supabaseRelease.label,
    bundleType: supabaseRelease.bundle_type,
    musicStyle: supabaseRelease.music_style,
    digitalReleaseDate: supabaseRelease.digital_release_date,
    internalReference: supabaseRelease.internal_reference,
    trackCount: supabaseRelease.track_count,
    coverImageUrl: supabaseRelease.cover_image_url,
    imgUrl: supabaseRelease.img_url,
    beatportSaleUrl: supabaseRelease.beatport_sale_url,
    purchaseLink: supabaseRelease.purchase_link,
    shareLink: supabaseRelease.share_link,
    audioFilePath: generateAudioFilePath(
      supabaseRelease.audio_file_url,
      supabaseRelease.artist,
      supabaseRelease.title
    ),
    featured: supabaseRelease.featured,
    upcoming: supabaseRelease.upcoming,
    isLatest: supabaseRelease.bundle_id === '10341902', // Stormdrifter
    description: supabaseRelease.description,
  };
}

// Batch map arrays
export function mapSupabaseArtists(supabaseArtists: SupabaseArtist[]): Artist[] {
  return supabaseArtists.map(mapSupabaseArtist);
}

export function mapSupabaseReleases(supabaseReleases: SupabaseRelease[]): Release[] {
  return supabaseReleases.map(mapSupabaseRelease);
}