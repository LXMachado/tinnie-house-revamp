// Shared data mapping utilities to transform between Supabase snake_case and frontend camelCase
import { STATIC_ARTISTS, STATIC_RELEASES } from "./static-content";

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

const artistOverridesBySlug = new Map(
  STATIC_ARTISTS.map((artist) => [artist.slug, artist]),
);

const artistOverridesByName = new Map(
  STATIC_ARTISTS.map((artist) => [artist.name.toLowerCase(), artist]),
);

const releaseOverridesBySlug = new Map(
  STATIC_RELEASES.map((release) => [release.slug, release]),
);

const releaseOverridesByBundleId = new Map(
  STATIC_RELEASES.filter((release) => Boolean(release.bundleId)).map((release) => [release.bundleId as string, release]),
);

const releaseOverridesByNormalizedTitle = new Map(
  STATIC_RELEASES.map((release) => [generateSlug(release.title), release]),
);

function findLooseReleaseOverride(slug: string): Release | undefined {
  const lowerSlug = slug.toLowerCase();
  return STATIC_RELEASES.find((release) => {
    const overrideSlug = (release.slug ?? generateSlug(release.title)).toLowerCase();
    return overrideSlug.includes(lowerSlug) || lowerSlug.includes(overrideSlug);
  });
}

const omitId = <T extends { id?: unknown }>(value?: T): Omit<T, "id"> | undefined => {
  if (!value) return undefined;
  const { id: _omit, ...rest } = value;
  return rest;
};

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
  const normalized = normalizeAudioPath(audioFileUrl);
  if (normalized) {
    return normalized;
  }

  if (!audioFileUrl) return undefined;

  // Fallback: build a path based on artist + title when we lack explicit folder structure
  const urlParts = audioFileUrl.split('/');
  const filename = urlParts[urlParts.length - 1];

  if (!filename || !filename.includes('.mp3')) {
    return undefined;
  }

  const safeFilename = filename.replace(/^\//, '');

  if (artist) {
    return `${generateSlug(artist)}/${safeFilename}`;
  }

  return safeFilename;
}

// Helper function to safely generate slug from string
function generateSlug(text?: string): string {
  if (!text) return 'untitled';
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeAudioPath(audioFileUrl?: string): string | undefined {
  if (!audioFileUrl) return undefined;

  // Remove protocol + host if present
  const withoutOrigin = audioFileUrl.replace(/^https?:\/\/[^/]+/i, '');
  const trimmed = withoutOrigin.replace(/^\/+/, '');

  if (!trimmed) {
    return undefined;
  }

  // If the path already includes audio/, strip the prefix so the frontend can reapply it consistently
  if (trimmed.startsWith('audio/')) {
    return trimmed.replace(/^audio\//, '');
  }

  return trimmed;
}

function mergeArtistWithOverrides(mappedArtist: Artist): Artist {
  const override = omitId(
    artistOverridesBySlug.get(mappedArtist.slug) ??
      artistOverridesByName.get(mappedArtist.name.toLowerCase()),
  );

  if (!override) {
    return mappedArtist;
  }

  return {
    ...mappedArtist,
    ...override,
    slug: override?.slug ?? mappedArtist.slug,
    name: override?.name ?? mappedArtist.name,
    genre: override?.genre ?? mappedArtist.genre,
    imageUrl: override?.imageUrl ?? mappedArtist.imageUrl,
    bio: override?.bio ?? mappedArtist.bio,
    socialLinks: override?.socialLinks ?? mappedArtist.socialLinks,
  };
}

function mergeReleaseWithOverrides(mappedRelease: Release, supabaseSource: SupabaseRelease): Release {
  const slug = mappedRelease.slug;
  const override = omitId(
    releaseOverridesBySlug.get(slug) ??
      releaseOverridesByNormalizedTitle.get(slug) ??
      findLooseReleaseOverride(slug) ??
      (supabaseSource.bundle_id ? releaseOverridesByBundleId.get(supabaseSource.bundle_id) : undefined),
  );

  const audioFilePath =
    override?.audioFilePath ??
    mappedRelease.audioFilePath ??
    normalizeAudioPath(supabaseSource.audio_file_url);

  const artistName = override?.artist ?? mappedRelease.artist;
  const artistSlug =
    override?.artistSlug ??
    mappedRelease.artistSlug ??
    (artistName ? generateSlug(artistName) : undefined);

  const merged: Release = {
    ...mappedRelease,
    ...(override ?? {}),
    artist: artistName,
    artistSlug,
    audioFilePath: audioFilePath,
    bundleId: override?.bundleId ?? mappedRelease.bundleId ?? supabaseSource.bundle_id ?? undefined,
    digitalReleaseDate: override?.digitalReleaseDate ?? mappedRelease.digitalReleaseDate,
    internalReference: override?.internalReference ?? mappedRelease.internalReference ?? undefined,
    trackCount: override?.trackCount ?? mappedRelease.trackCount ?? supabaseSource.track_count,
    featured: override?.featured ?? mappedRelease.featured ?? supabaseSource.featured,
    upcoming: override?.upcoming ?? mappedRelease.upcoming ?? supabaseSource.upcoming,
    isLatest: override?.isLatest ?? mappedRelease.isLatest ?? false,
    description: override?.description ?? mappedRelease.description ?? supabaseSource.description,
    coverImageUrl: override?.coverImageUrl ?? mappedRelease.coverImageUrl ?? supabaseSource.cover_image_url,
    imgUrl: override?.imgUrl ?? mappedRelease.imgUrl ?? supabaseSource.img_url ?? override?.coverImageUrl ?? mappedRelease.coverImageUrl,
    purchaseLink: override?.purchaseLink ?? mappedRelease.purchaseLink ?? supabaseSource.purchase_link ?? undefined,
    shareLink: override?.shareLink ?? mappedRelease.shareLink ?? supabaseSource.share_link ?? undefined,
    beatportSaleUrl: override?.beatportSaleUrl ?? mappedRelease.beatportSaleUrl ?? supabaseSource.beatport_sale_url ?? undefined,
  };

  return merged;
}

// Map Supabase artist to frontend format
export function mapSupabaseArtist(supabaseArtist: SupabaseArtist): Artist {
  const mappedArtist: Artist = {
    id: supabaseArtist.id,
    slug: generateSlug(supabaseArtist.name),
    name: supabaseArtist.name || 'Unknown Artist',
    genre: supabaseArtist.genre,
    imageUrl: supabaseArtist.image_url,
    bio: supabaseArtist.bio,
    socialLinks: parseSocialLinks(supabaseArtist.social_links),
  };

  return mergeArtistWithOverrides(mappedArtist);
}

// Map Supabase release to frontend format
export function mapSupabaseRelease(supabaseRelease: SupabaseRelease): Release {
  const mappedRelease: Release = {
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

  return mergeReleaseWithOverrides(mappedRelease, supabaseRelease);
}

// Batch map arrays
export function mapSupabaseArtists(supabaseArtists: SupabaseArtist[]): Artist[] {
  return supabaseArtists.map(mapSupabaseArtist);
}

export function mapSupabaseReleases(supabaseReleases: SupabaseRelease[]): Release[] {
  return supabaseReleases.map(mapSupabaseRelease);
}
