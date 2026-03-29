import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
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

    // Reassign ALL entries to the current user's stable Google ID
    const expCount = await client.execute("SELECT COUNT(*) as cnt FROM experiences");
    const tripCount = await client.execute("SELECT COUNT(*) as cnt FROM trips");

    await client.execute({ sql: "UPDATE experiences SET user_id = ?", args: [currentUserId] });
    await client.execute({ sql: "UPDATE trips SET user_id = ?", args: [currentUserId] });

    return NextResponse.json({
      success: true,
      currentUserId,
      experiencesClaimed: (expCount.rows[0] as any).cnt,
      tripsClaimed: (tripCount.rows[0] as any).cnt,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
