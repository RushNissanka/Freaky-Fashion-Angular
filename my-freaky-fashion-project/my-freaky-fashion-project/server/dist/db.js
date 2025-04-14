"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = initDB;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Initializes the SQLite database.
 * Opens or creates 'freaky-fashion.db' and ensures the 'products' table exists.
 */
async function initDB() {
    // 🔒 Prevent incorrect paths
    const dbPath = path_1.default.resolve(__dirname, '..', 'freaky-fashion.db');
    // 🧪 Optional: Check file existence
    const dbExists = fs_1.default.existsSync(dbPath);
    if (!dbExists) {
        console.log('📦 Creating new database at:', dbPath);
    }
    // 🔗 Connect to SQLite database
    const db = await (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database,
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
