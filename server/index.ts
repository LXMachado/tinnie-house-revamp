import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve audio files from attached_assets directory
app.use('/assets', express.static(path.join(__dirname, '../attached_assets')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log the error for debugging
    log(`Error ${status}: ${message}`, "error");
    if (err.stack) {
      console.error(err.stack);
    }

    // Send error response if not already sent
    if (!res.headersSent) {
      res.status(status).json({ 
        error: message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
      });
    }

    // Don't throw the error in production to prevent crashes
    if (process.env.NODE_ENV !== "production") {
      next(err);
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  
  // Add graceful shutdown handling
  const gracefulShutdown = (signal: string) => {
    log(`Received ${signal}. Graceful shutdown...`, "server");
    server.close(() => {
      log("HTTP server closed.", "server");
      process.exit(0);
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
      log("Could not close connections in time, forcefully shutting down", "error");
      process.exit(1);
    }, 10000);
  };

  // Listen for termination signals
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Handle uncaught exceptions - don't exit in production
  process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`, "error");
    console.error(error.stack);
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  });

  // Handle unhandled promise rejections - don't exit in production
  process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}, reason: ${reason}`, "error");
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  });

  // Start server with timeout and error handling
  const startServer = () => {
    return new Promise<void>((resolve, reject) => {
      const serverInstance = server.listen(port, "0.0.0.0", () => {
        log(`serving on port ${port} (bound to 0.0.0.0)`);
        resolve();
      });

      serverInstance.on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          log(`Port ${port} is already in use`, "error");
          reject(new Error(`Port ${port} is already in use`));
        } else if (error.code === 'EACCES') {
          log(`Permission denied on port ${port}`, "error");
          reject(new Error(`Permission denied on port ${port}`));
        } else {
          log(`Server error: ${error.message}`, "error");
          reject(error);
        }
      });

      // Set timeout for server startup
      setTimeout(() => {
        reject(new Error('Server startup timeout'));
      }, 30000); // 30 second timeout
    });
  };

  try {
    await startServer();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log(`Failed to start server: ${errorMessage}`, "error");
    process.exit(1);
  }
})().catch((error) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  log(`Application startup failed: ${errorMessage}`, "error");
  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }
  process.exit(1);
});
