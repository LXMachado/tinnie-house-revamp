import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio"),
  genre: text("genre"),
  imageUrl: text("image_url"),
  socialLinks: text("social_links"), // JSON string
  createdAt: timestamp("created_at").defaultNow(),
});

export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  bundleId: text("bundle_id").unique(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  artistId: integer("artist_id").references(() => artists.id),
  labelId: text("label_id"),
  label: text("label").default("Tinnie House Records"),
  ean: text("ean"),
  bundleType: text("bundle_type").default("Maxi Single"),
  musicStyle: text("music_style").default("Melodic House & Techno"),
  digitalReleaseDate: text("digital_release_date"),
  published: text("published").default("Y"),
  coverFileName: text("cover_file_name"),
  coverImageUrl: text("cover_image_url"), // Main cover URL from CSV
  imgUrl: text("img_url"), // Additional image URL
  internalReference: text("internal_reference"),
  coverFileHash: text("cover_file_hash"),
  trackCount: integer("track_count").default(1),
  beatportSaleUrl: text("beatport_sale_url"),
  audioFileUrl: text("audio_file_url"), // Path to the music file
  featured: boolean("featured").default(false),
  upcoming: boolean("upcoming").default(false),
  description: text("description"),
  releaseDate: timestamp("release_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updateDate: timestamp("update_date"),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  type: text("type").default("general"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const artistsRelations = relations(artists, ({ many }) => ({
  releases: many(releases),
}));

export const releasesRelations = relations(releases, ({ one }) => ({
  artist: one(artists, {
    fields: [releases.artistId],
    references: [artists.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertArtistSchema = createInsertSchema(artists).omit({
  id: true,
  createdAt: true,
});

export const insertReleaseSchema = createInsertSchema(releases).omit({
  id: true,
  createdAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
  status: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artists.$inferSelect;

export type InsertRelease = z.infer<typeof insertReleaseSchema>;
export type Release = typeof releases.$inferSelect;

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
