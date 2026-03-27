import { db } from "@/db";
import { trips, tripExperiences, experiences } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getUser, unauthorized } from "@/lib/get-user";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const tripId = parseInt(id);

  const tripResult = await db
    .select()
    .from(trips)
    .where(and(eq(trips.id, tripId), eq(trips.userId, user.id!)));

  if (tripResult.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const linkedExperiences = await db
    .select({ experience: experiences })
    .from(tripExperiences)
    .innerJoin(experiences, eq(tripExperiences.experienceId, experiences.id))
    .where(eq(tripExperiences.tripId, tripId));

  return NextResponse.json({
    ...tripResult[0],
    experiences: linkedExperiences.map((r: any) => r.experience),
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return unauthorized();

  const { id } = await params;
  const tripId = parseInt(id);
  const body = await request.json();

  const result = await db
    .update(trips)
    .set({
      name: body.name,
      startDate: body.startDate || null,
      endDate: body.endDate || null,
      season: body.season || null,
      partnerType: body.partnerType || null,
    })
    .where(and(eq(trips.id, tripId), eq(trips.userId, user.id!)))
    .returning();

  if (body.experienceIds !== undefined) {
    await db
      .delete(tripExperiences)
      .where(eq(tripExperiences.tripId, tripId));
    for (const expId of body.experienceIds) {
      await db.insert(tripExperiences).values({
        tripId,
        experienceId: expId,
      });
    }
  }

  return NextResponse.json(result[0]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser();
  if (!user) return unauthorized();

  const { id } = await params;
  await db.delete(trips).where(
    and(eq(trips.id, parseInt(id)), eq(trips.userId, user.id!))
  );
  return NextResponse.json({ success: true });
}
