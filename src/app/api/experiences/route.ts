import { db } from "@/db";
import { experiences } from "@/db/schema";
import { like, eq, and, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const season = searchParams.get("season");
  const partnerType = searchParams.get("partnerType");
  const maxDays = searchParams.get("maxDays");

  const conditions = [];
  if (status) conditions.push(eq(experiences.status, status));
  if (season) conditions.push(like(experiences.idealSeasons, `%${season}%`));
  if (partnerType)
    conditions.push(like(experiences.idealPartnerTypes, `%${partnerType}%`));
  if (maxDays)
    conditions.push(
      sql`${experiences.estimatedDays} <= ${parseInt(maxDays)} OR ${experiences.estimatedDays} IS NULL`
    );

  const results =
    conditions.length > 0
      ? await db
          .select()
          .from(experiences)
          .where(and(...conditions))
      : await db.select().from(experiences);

  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await db
    .insert(experiences)
    .values({
      name: body.name,
      description: body.description || null,
      city: body.city || null,
      country: body.country || "",
      idealSeasons: body.idealSeasons || "",
      idealPartnerTypes: body.idealPartnerTypes || "",
      estimatedDays: body.estimatedDays || null,
      doByAge: body.doByAge || null,
      status: body.status || "wishlist",
    })
    .returning();

  return NextResponse.json(result[0], { status: 201 });
}
