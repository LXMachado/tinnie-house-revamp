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
