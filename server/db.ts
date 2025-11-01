import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

let db;
const isSQLite = process.env.DATABASE_URL?.startsWith('file:');

if (isSQLite) {
  // SQLite configuration
  const sqlite = new Database(process.env.DATABASE_URL.replace('file:', ''));
  db = drizzleSQLite(sqlite, { schema });
} else {
  // PostgreSQL configuration
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { db };