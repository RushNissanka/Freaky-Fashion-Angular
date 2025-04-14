import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs';

/**
 * Initializes the SQLite database.
 * Opens or creates 'freaky-fashion.db' and ensures the 'products' table exists.
 */
export async function initDB(): Promise<Database> {
  // 🔒 Prevent incorrect paths
  const dbPath = path.resolve(__dirname, '..', 'freaky-fashion.db');

  // 🧪 Optional: Check file existence
  const dbExists = fs.existsSync(dbPath);
  if (!dbExists) {
    console.log('📦 Creating new database at:', dbPath);
  }

  // 🔗 Connect to SQLite database
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // ✅ Ensure table exists
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      sku TEXT,
      imagePath TEXT,
      imagePath2 TEXT,
      imagePath3 TEXT,
      imagePath4 TEXT,
      imagePath5 TEXT,
      publishDate TEXT,
      slug TEXT NOT NULL UNIQUE,
      quantity INTEGER DEFAULT 1,
      sortOrder INTEGER
    );
  `);

  // 🧩 Log for debugging
  console.log('🗄️  Database initialized:', dbPath);
  return db;
}
