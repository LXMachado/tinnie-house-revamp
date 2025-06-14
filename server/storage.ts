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
import { eq, desc } from "drizzle-orm";

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
    return await db.select().from(releases).orderBy(desc(releases.releaseDate));
  }

  async getFeaturedReleases(): Promise<Release[]> {
    return await db.select().from(releases).where(eq(releases.featured, true)).orderBy(desc(releases.releaseDate));
  }

  async getCatalogReleases(): Promise<Release[]> {
    return await db.select().from(releases).where(eq(releases.upcoming, false)).orderBy(desc(releases.digitalReleaseDate));
  }

  async getRelease(id: number): Promise<Release | undefined> {
    const [release] = await db.select().from(releases).where(eq(releases.id, id));
    return release || undefined;
  }

  async createRelease(insertRelease: InsertRelease): Promise<Release> {
    const [release] = await db
      .insert(releases)
      .values(insertRelease)
      .returning();
    return release;
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
