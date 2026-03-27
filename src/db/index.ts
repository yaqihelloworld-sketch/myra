import * as schema from "./schema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _db: any;

function createDb() {
  if (_db) return _db;

  if (process.env.TURSO_DATABASE_URL) {
    // Vercel: use Turso (libsql)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@libsql/client");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/libsql");
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    _db = drizzle(client, { schema });
  } else {
    // Local: use better-sqlite3
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require("path");
    const dbPath = path.join(process.cwd(), "travel.db");
    const sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
    sqlite.pragma("foreign_keys = ON");
    _db = drizzle(sqlite, { schema });
  }

  return _db;
}

export const db = createDb();
