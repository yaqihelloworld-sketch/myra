import { db } from "@/db";
import { trips, tripExperiences } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const results = await db.select().from(trips);
  return NextResponse.json(results);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const result = await db
    .insert(trips)
    .values({
      name: body.name,
      startDate: body.startDate || null,
      endDate: body.endDate || null,
      season: body.season || null,
      partnerType: body.partnerType || null,
    })
    .returning();

  const trip = result[0];

  if (body.experienceIds && body.experienceIds.length > 0) {
    for (const expId of body.experienceIds) {
      await db.insert(tripExperiences).values({
        tripId: trip.id,
        experienceId: expId,
      });
    }
  }

  return NextResponse.json(trip, { status: 201 });
}
