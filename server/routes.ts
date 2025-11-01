import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertArtistSchema, insertReleaseSchema } from "@shared/schema";
import { z } from "zod";
import { readFileSync } from "fs";
import { join } from "path";

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
  // Helper function to load static JSON data
  const loadStaticData = (relativePath: string) => {
    try {
      const absolutePath = join(process.cwd(), 'client', 'public', relativePath);
      const fileContent = readFileSync(absolutePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error(`Failed to load ${relativePath}:`, error);
      return [];
    }
  };

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
    try {
      const releases = loadStaticData('data/releases.json');
      res.json(releases);
    } catch (error) {
      console.error('Error loading releases:', error);
      res.status(500).json({ error: "Failed to load releases" });
    }
  }));

  // Get featured releases
  app.get("/api/releases/featured", asyncHandler(async (req, res) => {
    try {
      const releases = loadStaticData('data/releases.json');
      const featuredReleases = releases.filter((release: any) => release.featured);
      res.json(featuredReleases);
    } catch (error) {
      console.error('Error loading featured releases:', error);
      res.status(500).json({ error: "Failed to load featured releases" });
    }
  }));

  // Get catalog releases (non-upcoming)
  app.get("/api/releases/catalog", asyncHandler(async (req, res) => {
    try {
      const releases = loadStaticData('data/releases.json');
      const catalogReleases = releases.filter((release: any) => !release.upcoming);
      res.json(catalogReleases);
    } catch (error) {
      console.error('Error loading catalog releases:', error);
      res.status(500).json({ error: "Failed to load catalog releases" });
    }
  }));

  // Get latest release with audio
  app.get("/api/releases/latest", asyncHandler(async (req, res) => {
    try {
      const releases = loadStaticData('data/releases.json');
      const latestRelease = releases.find((release: any) => release.isLatest) || releases[0];
      
      if (!latestRelease) {
        return res.status(404).json({ error: "No latest release found" });
      }
      
      res.json(latestRelease);
    } catch (error) {
      console.error('Error loading latest release:', error);
      res.status(500).json({ error: "Failed to load latest release" });
    }
  }));

  // Get single release
  app.get("/api/releases/:id", asyncHandler(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid release ID" });
      }
      
      const releases = loadStaticData('data/releases.json');
      const release = releases.find((r: any) => r.id === id);
      
      if (!release) {
        return res.status(404).json({ error: "Release not found" });
      }
      res.json(release);
    } catch (error) {
      console.error('Error loading release:', error);
      res.status(500).json({ error: "Failed to load release" });
    }
  }));

  // Create new release (fallback for database)
  app.post("/api/releases", asyncHandler(async (req, res) => {
    res.status(501).json({ error: "Static data mode - releases cannot be created" });
  }));

  // Get all artists
  app.get("/api/artists", asyncHandler(async (req, res) => {
    try {
      const artists = loadStaticData('data/artists.json');
      res.json(artists);
    } catch (error) {
      console.error('Error loading artists:', error);
      res.status(500).json({ error: "Failed to load artists" });
    }
  }));

  // Get single artist
  app.get("/api/artists/:id", asyncHandler(async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid artist ID" });
      }
      
      const artists = loadStaticData('data/artists.json');
      const artist = artists.find((a: any) => a.id === id);
      
      if (!artist) {
        return res.status(404).json({ error: "Artist not found" });
      }
      res.json(artist);
    } catch (error) {
      console.error('Error loading artist:', error);
      res.status(500).json({ error: "Failed to load artist" });
    }
  }));

  // Create new artist (fallback for database)
  app.post("/api/artists", asyncHandler(async (req, res) => {
    res.status(501).json({ error: "Static data mode - artists cannot be created" });
  }));

  // Submit contact form (fallback for database when not available)
  app.post("/api/contact", asyncHandler(async (req, res) => {
    try {
      const validatedData = insertContactSubmissionSchema.parse(req.body);
      // Try database first, fallback to simple acknowledgment if database fails
      try {
        const submission = await withTimeout(storage.createContactSubmission(validatedData), 5000);
        res.status(201).json({ message: "Contact form submitted successfully", id: submission.id });
      } catch (dbError) {
        console.warn('Database unavailable, contact form fallback mode:', dbError);
        // Return success even if database fails to not block users
        res.status(201).json({
          message: "Contact form submitted successfully (offline mode)",
          id: Date.now().toString()
        });
      }
    } catch (validationError) {
      res.status(400).json({ error: "Invalid contact form data" });
    }
  }));

  // Get contact submissions (admin only) - fallback for database
  app.get("/api/contact", asyncHandler(async (req, res) => {
    try {
      const submissions = await withTimeout(storage.getContactSubmissions(), 5000);
      res.json(submissions);
    } catch (dbError) {
      console.warn('Database unavailable for contact submissions:', dbError);
      res.json([]); // Return empty array when database is unavailable
    }
  }));

  const httpServer = createServer(app);
  return httpServer;
}
