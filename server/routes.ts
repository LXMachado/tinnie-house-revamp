import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertArtistSchema, insertReleaseSchema } from "@shared/schema";
import { z } from "zod";

// Async timeout wrapper for deployment readiness
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`Operation timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

// Enhanced error handler for async operations
const asyncHandler = (fn: (req: any, res: any, next: any) => Promise<any>) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for deployment monitoring
  app.get("/health", (req, res) => {
    try {
      res.status(200).json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        env: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      res.status(500).json({ 
        status: "unhealthy",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Root endpoint
  app.get("/api", (req, res) => {
    res.json({ message: "Tinnie House Records API", version: "1.0.0" });
  });

  // Get all releases
  app.get("/api/releases", asyncHandler(async (req, res) => {
    const releases = await withTimeout(storage.getReleases(), 10000);
    res.json(releases);
  }));

  // Get featured releases
  app.get("/api/releases/featured", asyncHandler(async (req, res) => {
    const releases = await withTimeout(storage.getFeaturedReleases(), 10000);
    res.json(releases);
  }));

  // Get catalog releases (non-upcoming)
  app.get("/api/releases/catalog", asyncHandler(async (req, res) => {
    const releases = await withTimeout(storage.getCatalogReleases(), 10000);
    res.json(releases);
  }));

  // Get latest release with audio
  app.get("/api/releases/latest", asyncHandler(async (req, res) => {
    const release = await withTimeout(storage.getLatestReleaseWithAudio(), 10000);
    
    if (!release) {
      return res.status(404).json({ error: "No latest release found" });
    }
    
    res.json(release);
  }));

  // Get single release
  app.get("/api/releases/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid release ID" });
    }
    
    const release = await withTimeout(storage.getRelease(id), 10000);
    
    if (!release) {
      return res.status(404).json({ error: "Release not found" });
    }
    res.json(release);
  }));

  // Create new release
  app.post("/api/releases", asyncHandler(async (req, res) => {
    const validatedData = insertReleaseSchema.parse(req.body);
    const release = await withTimeout(storage.createRelease(validatedData), 15000);
    res.status(201).json(release);
  }));

  // Get all artists
  app.get("/api/artists", asyncHandler(async (req, res) => {
    const artists = await withTimeout(storage.getArtists(), 10000);
    res.json(artists);
  }));

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
      ]) as any;
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
