import { NextResponse } from "next/server";

export async function GET() {
  const results: string[] = [];

  try {
    // Use Turso client directly if available, otherwise use local DB
    if (process.env.TURSO_DATABASE_URL) {
      const { createClient } = await import("@libsql/client");
      const client = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN,
      });

      // Check existing columns
      const tableInfo = await client.execute("PRAGMA table_info(experiences)");
      const columns = tableInfo.rows.map((r: any) => r.name as string);
      results.push(`Existing columns: ${columns.join(", ")}`);

      // Add missing columns
      const migrations: [string, string][] = [
        ["user_id", "ALTER TABLE experiences ADD COLUMN user_id TEXT DEFAULT '' NOT NULL"],
        ["best_months", "ALTER TABLE experiences ADD COLUMN best_months TEXT"],
        ["estimated_budget", "ALTER TABLE experiences ADD COLUMN estimated_budget TEXT"],
        ["do_by_age", "ALTER TABLE experiences ADD COLUMN do_by_age TEXT"],
      ];

      for (const [col, sql] of migrations) {
        if (!columns.includes(col)) {
          try {
            await client.execute(sql);
            results.push(`Added column: ${col}`);
          } catch (err) {
            results.push(`Failed ${col}: ${err}`);
          }
        } else {
          results.push(`${col} exists`);
        }
      }

      // Check trips table
      const tripsInfo = await client.execute("PRAGMA table_info(trips)");
      const tripCols = tripsInfo.rows.map((r: any) => r.name as string);
      if (!tripCols.includes("user_id")) {
        try {
          await client.execute("ALTER TABLE trips ADD COLUMN user_id TEXT DEFAULT '' NOT NULL");
          results.push("Added user_id to trips");
        } catch (err) {
          results.push(`Failed trips user_id: ${err}`);
        }
      }

      // Check experience_photos table
      try {
        await client.execute("SELECT 1 FROM experience_photos LIMIT 1");
        results.push("experience_photos exists");
      } catch {
        try {
          await client.execute(`CREATE TABLE experience_photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            experience_id INTEGER NOT NULL,
            unsplash_id TEXT NOT NULL,
            url TEXT NOT NULL,
            thumb_url TEXT NOT NULL,
            alt_description TEXT,
            photographer_name TEXT NOT NULL,
            photographer_url TEXT NOT NULL,
            FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
          )`);
          results.push("Created experience_photos");
        } catch (err) {
          results.push(`Failed experience_photos: ${err}`);
        }
      }

      return NextResponse.json({ success: true, results });
    }

    return NextResponse.json({ success: false, error: "No Turso config — local DB doesn't need migration" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error), results }, { status: 500 });
  }
}
