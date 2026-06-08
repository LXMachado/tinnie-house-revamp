import { STATIC_ARTISTS, STATIC_RELEASES } from '@/static-content';
import type { Artist, Release } from '@/types/content';

function processReleases(releases: Release[]): Release[] {
  const now = new Date();

  return releases.map((release) => {
    const isUpcoming = release.digitalReleaseDate ? new Date(release.digitalReleaseDate) > now : release.upcoming;
    const updatedRelease = {
      ...release,
      upcoming: isUpcoming,
    };

    // Fill in links for released tracks that have empty links.
    if (!isUpcoming && release.slug === 'polynomic-void' && !updatedRelease.purchaseLink) {
      updatedRelease.beatportSaleUrl = 'https://www.beatport.com/release/polynomic-void/5657786';
      updatedRelease.purchaseLink = 'https://www.beatport.com/release/polynomic-void/5657786';
      updatedRelease.shareLink = 'https://www.beatport.com/release/polynomic-void/5657786';
    }

    return updatedRelease;
  });
}

// Static content data source for the client app.
export const dbFallback = {
  async getArtists(): Promise<Artist[]> {
    return STATIC_ARTISTS;
  },

  async getReleases(): Promise<Release[]> {
    return processReleases(STATIC_RELEASES);
  },

  async getFeaturedReleases(): Promise<Release[]> {
    const allReleases = await this.getReleases();
    return allReleases.filter((release) => release.featured);
  },

  async getUpcomingReleases(): Promise<Release[]> {
    const allReleases = await this.getReleases();
    return allReleases.filter((release) => release.upcoming);
  },

  async getLatestReleases(): Promise<Release[]> {
    const allReleases = await this.getReleases();
    return allReleases.filter((release) => release.isLatest);
  },

  async getReleasesByArtist(artistSlug: string): Promise<Release[]> {
    const allReleases = await this.getReleases();
    return allReleases.filter((release) => release.artistSlug === artistSlug);
  },

  async getArtistBySlug(slug: string): Promise<Artist | null> {
    const allArtists = await this.getArtists();
    return allArtists.find((artist) => artist.slug === slug) || null;
  },

  async getReleaseBySlug(slug: string): Promise<Release | null> {
    const allReleases = await this.getReleases();
    return allReleases.find((release) => release.slug === slug) || null;
  },
};

export function getStaticDataFallback() {
  return {
    artists: STATIC_ARTISTS,
    releases: processReleases(STATIC_RELEASES),
  };
}
