import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  // Auth-protected: only signed-in users can run this
  let session;
  try { session = await auth(); } catch {}
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const currentUserId = session.user.id;

  try {
    if (!process.env.TURSO_DATABASE_URL) {
      return NextResponse.json({ error: "No Turso config" }, { status: 400 });
    }

    const { createClient } = await import("@libsql/client");
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    // Show existing user_ids
    const existing = await client.execute(
      "SELECT DISTINCT user_id, COUNT(*) as cnt FROM experiences GROUP BY user_id"
    );

    const claimAll = new URL(`http://x${""}`).searchParams.get("claim_all");

    return NextResponse.json({
      currentUserId,
      existingUserIds: existing.rows,
      hint: "Visit /api/migrate/claim to reassign all entries to your current account",
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
