import { db } from "@/db";
import { experiences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await db
    .select()
    .from(experiences)
    .where(eq(experiences.id, parseInt(id)));

  if (result.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(result[0]);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const result = await db
    .update(experiences)
    .set({
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
    .where(eq(experiences.id, parseInt(id)))
    .returning();

  if (result.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(result[0]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.delete(experiences).where(eq(experiences.id, parseInt(id)));
  return NextResponse.json({ success: true });
}
