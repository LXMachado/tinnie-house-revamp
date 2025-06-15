import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertArtistSchema, insertReleaseSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for deployment monitoring
  app.get("/health", (req, res) => {
    res.status(200).json({ 
      status: "healthy", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version
    });
  });

  // Root endpoint
  app.get("/api", (req, res) => {
    res.json({ message: "Tinnie House Records API", version: "1.0.0" });
  });

  // Get all releases
  app.get("/api/releases", async (req, res) => {
    try {
      const releases = await Promise.race([
        storage.getReleases(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);
      res.json(releases);
    } catch (error) {
      console.error('Error fetching releases:', error);
      res.status(500).json({ error: "Failed to fetch releases" });
    }
  });

  // Get featured releases
  app.get("/api/releases/featured", async (req, res) => {
    try {
      const releases = await Promise.race([
        storage.getFeaturedReleases(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);
      res.json(releases);
    } catch (error) {
      console.error('Error fetching featured releases:', error);
      res.status(500).json({ error: "Failed to fetch featured releases" });
    }
  });

  // Get catalog releases (non-upcoming)
  app.get("/api/releases/catalog", async (req, res) => {
    try {
      const releases = await Promise.race([
        storage.getCatalogReleases(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);
      res.json(releases);
    } catch (error) {
      console.error('Error fetching catalog releases:', error);
      res.status(500).json({ error: "Failed to fetch catalog releases" });
    }
  });

  // Get latest release with audio
  app.get("/api/releases/latest", async (req, res) => {
    try {
      const release = await Promise.race([
        storage.getLatestReleaseWithAudio(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);
      res.json(release);
    } catch (error) {
      console.error('Error fetching latest release:', error);
      res.status(500).json({ error: "Failed to fetch latest release" });
    }
  });

  // Get single release
  app.get("/api/releases/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid release ID" });
      }
      
      const release = await Promise.race([
        storage.getRelease(id),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);
      
      if (!release) {
        return res.status(404).json({ error: "Release not found" });
      }
      res.json(release);
    } catch (error) {
      console.error('Error fetching release:', error);
      res.status(500).json({ error: "Failed to fetch release" });
    }
  });

  // Create new release
  app.post("/api/releases", async (req, res) => {
    try {
      const validatedData = insertReleaseSchema.parse(req.body);
      const release = await Promise.race([
        storage.createRelease(validatedData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 15000)
        )
      ]);
      res.status(201).json(release);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error('Error creating release:', error);
      res.status(500).json({ error: "Failed to create release" });
    }
  });

  // Get all artists
  app.get("/api/artists", async (req, res) => {
    try {
      const artists = await Promise.race([
        storage.getArtists(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);
      res.json(artists);
    } catch (error) {
      console.error('Error fetching artists:', error);
      res.status(500).json({ error: "Failed to fetch artists" });
    }
  });

  // Get single artist
  app.get("/api/artists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid artist ID" });
      }
      
      const artist = await Promise.race([
        storage.getArtist(id),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);
      
      if (!artist) {
        return res.status(404).json({ error: "Artist not found" });
      }
      res.json(artist);
    } catch (error) {
      console.error('Error fetching artist:', error);
      res.status(500).json({ error: "Failed to fetch artist" });
    }
  });

  // Create new artist
  app.post("/api/artists", async (req, res) => {
    try {
      const validatedData = insertArtistSchema.parse(req.body);
      const artist = await Promise.race([
        storage.createArtist(validatedData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 15000)
        )
      ]);
      res.status(201).json(artist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error('Error creating artist:', error);
      res.status(500).json({ error: "Failed to create artist" });
    }
  });

  // Submit contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      const submission = await Promise.race([
        storage.createContactSubmission(validatedData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 15000)
        )
      ]);
      res.status(201).json({ message: "Contact form submitted successfully", id: submission.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error('Error submitting contact form:', error);
      res.status(500).json({ error: "Failed to submit contact form" });
    }
  });

  // Get contact submissions (admin only)
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await Promise.race([
        storage.getContactSubmissions(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database timeout')), 10000)
        )
      ]);
      res.json(submissions);
    } catch (error) {
      console.error('Error fetching contact submissions:', error);
      res.status(500).json({ error: "Failed to fetch contact submissions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
