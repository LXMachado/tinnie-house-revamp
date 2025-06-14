import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertArtistSchema, insertReleaseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all releases
  app.get("/api/releases", async (req, res) => {
    try {
      const releases = await storage.getReleases();
      res.json(releases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch releases" });
    }
  });

  // Get featured releases
  app.get("/api/releases/featured", async (req, res) => {
    try {
      const releases = await storage.getFeaturedReleases();
      res.json(releases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured releases" });
    }
  });

  // Get catalog releases (non-upcoming)
  app.get("/api/releases/catalog", async (req, res) => {
    try {
      const releases = await storage.getCatalogReleases();
      res.json(releases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch catalog releases" });
    }
  });

  // Get single release
  app.get("/api/releases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const release = await storage.getRelease(id);
      if (!release) {
        return res.status(404).json({ error: "Release not found" });
      }
      res.json(release);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch release" });
    }
  });

  // Create new release
  app.post("/api/releases", async (req, res) => {
    try {
      const validatedData = insertReleaseSchema.parse(req.body);
      const release = await storage.createRelease(validatedData);
      res.status(201).json(release);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create release" });
    }
  });

  // Get all artists
  app.get("/api/artists", async (req, res) => {
    try {
      const artists = await storage.getArtists();
      res.json(artists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artists" });
    }
  });

  // Get single artist
  app.get("/api/artists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const artist = await storage.getArtist(id);
      if (!artist) {
        return res.status(404).json({ error: "Artist not found" });
      }
      res.json(artist);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch artist" });
    }
  });

  // Create new artist
  app.post("/api/artists", async (req, res) => {
    try {
      const validatedData = insertArtistSchema.parse(req.body);
      const artist = await storage.createArtist(validatedData);
      res.status(201).json(artist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create artist" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedData);
      res.status(201).json({ message: "Contact form submitted successfully", id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // Get contact submissions (admin only)
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
