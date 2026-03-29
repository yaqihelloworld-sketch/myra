import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    // Add best_months column if not exists
    await db.run(sql`ALTER TABLE experiences ADD COLUMN best_months TEXT`).catch(() => {});
    await db.run(sql`ALTER TABLE experiences ADD COLUMN estimated_budget TEXT`).catch(() => {});
    return NextResponse.json({ success: true, message: "Migration complete" });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
