import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import postgres from 'postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL && !process.env.SUPABASE_URL) {
  throw new Error(
    "DATABASE_URL or SUPABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Conditionally create database based on environment
const isSQLite = process.env.DATABASE_URL?.startsWith('file:');

if (isSQLite) {
  // SQLite configuration
  const sqlitePath = process.env.DATABASE_URL?.replace('file:', '') || './database.sqlite';
  const sqlite = new Database(sqlitePath);
  const db = drizzleSQLite(sqlite, { schema });
  (global as any).db = db;
} else if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  // Supabase configuration
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  // Use postgres-js for Drizzle ORM with Supabase connection string
  const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL or SUPABASE_DB_URL must be set for Supabase");
  }
  
  const client = postgres(databaseUrl, { ssl: 'require' });
  const db = drizzle(client, { schema });
  (global as any).supabase = supabase;
  (global as any).db = db;
} else {
  // PostgreSQL configuration (fallback)
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL must be set");
  }
  
  const client = postgres(databaseUrl, { ssl: 'require' });
  const db = drizzle(client, { schema });
  (global as any).db = db;
}

// Export the global instances
export const db = (global as any).db;
export const supabase = (global as any).supabase;