import { 
  users, 
  artists, 
  releases, 
  contactSubmissions,
  type User, 
  type InsertUser,
  type Artist,
  type InsertArtist,
  type Release,
  type InsertRelease,
  type ContactSubmission,
  type InsertContactSubmission
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, isNotNull } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Artists
  getArtists(): Promise<Artist[]>;
  getArtist(id: number): Promise<Artist | undefined>;
  createArtist(artist: InsertArtist): Promise<Artist>;
  
  // Releases
  getReleases(): Promise<Release[]>;
  getFeaturedReleases(): Promise<Release[]>;
  getCatalogReleases(): Promise<Release[]>;
  getLatestReleaseWithAudio(): Promise<Release | undefined>;
  getRelease(id: number): Promise<Release | undefined>;
  createRelease(release: InsertRelease): Promise<Release>;
  
  // Contact submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Artists
  async getArtists(): Promise<Artist[]> {
    return await db.select().from(artists).orderBy(desc(artists.createdAt));
  }

  async getArtist(id: number): Promise<Artist | undefined> {
    const [artist] = await db.select().from(artists).where(eq(artists.id, id));
    return artist || undefined;
  }

  async createArtist(insertArtist: InsertArtist): Promise<Artist> {
    const [artist] = await db
      .insert(artists)
      .values(insertArtist)
      .returning();
    return artist;
  }

  // Releases
  async getReleases(): Promise<Release[]> {
    const rawReleases = await db.select().from(releases).orderBy(desc(releases.releaseDate));
    return rawReleases.map((release: Release) => ({
      ...release,
      // Map database field names to frontend expected field names
      audioFilePath: release.audioFileUrl, // Convert audioFileUrl to audioFilePath
      slug: this.generateSlug(release.title),
      artistSlug: this.generateArtistSlug(release.artist),
      isLatest: release.bundleId === '10341902', // Set Stormdrifter as latest
    }));
  }

  async getFeaturedReleases(): Promise<Release[]> {
    const rawReleases = await db.select().from(releases).where(eq(releases.featured, true)).orderBy(desc(releases.releaseDate));
    return rawReleases.map((release: Release) => ({
      ...release,
      audioFilePath: release.audioFileUrl,
      slug: this.generateSlug(release.title),
      artistSlug: this.generateArtistSlug(release.artist),
      isLatest: release.bundleId === '10341902',
    }));
  }

  async getCatalogReleases(): Promise<Release[]> {
    const rawReleases = await db.select().from(releases).where(eq(releases.upcoming, false)).orderBy(desc(releases.digitalReleaseDate));
    return rawReleases.map((release: Release) => ({
      ...release,
      audioFilePath: release.audioFileUrl,
      slug: this.generateSlug(release.title),
      artistSlug: this.generateArtistSlug(release.artist),
      isLatest: release.bundleId === '10341902',
    }));
  }

  async getLatestReleaseWithAudio(): Promise<Release | undefined> {
    // Get Stormdrifter specifically for hero section
    const [stormdrifter] = await db.select()
      .from(releases)
      .where(eq(releases.bundleId, '10341902'));
    
    if (!stormdrifter) return undefined;
    
    return {
      ...stormdrifter,
      audioFilePath: stormdrifter.audioFileUrl,
      slug: this.generateSlug(stormdrifter.title),
      artistSlug: this.generateArtistSlug(stormdrifter.artist),
      isLatest: true,
    };
  }

  async getRelease(id: number): Promise<Release | undefined> {
    const [release] = await db.select().from(releases).where(eq(releases.id, id));
    if (!release) return undefined;
    
    return {
      ...release,
      audioFilePath: release.audioFileUrl,
      slug: this.generateSlug(release.title),
      artistSlug: this.generateArtistSlug(release.artist),
      isLatest: release.bundleId === '10341902',
    };
  }

  async createRelease(insertRelease: InsertRelease): Promise<Release> {
    const [release] = await db
      .insert(releases)
      .values(insertRelease)
      .returning();
    return {
      ...release,
      audioFilePath: release.audioFileUrl,
      slug: this.generateSlug(release.title),
      artistSlug: this.generateArtistSlug(release.artist),
      isLatest: release.bundleId === '10341902',
    };
  }

  // Helper methods to generate slugs
  private generateSlug(title: string): string {
    return title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private generateArtistSlug(artist: string): string {
    return artist.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Contact submissions
  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }
}

export const storage = new DatabaseStorage();
