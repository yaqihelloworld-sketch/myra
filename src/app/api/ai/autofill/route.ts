import { NextRequest, NextResponse } from "next/server";
import { lookupTravelInfo, fetchWikipediaInfo } from "@/lib/travel-knowledge";

export async function POST(request: NextRequest) {
  const { name } = await request.json();

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  // Try local knowledge base first (instant, free)
  const localResult = lookupTravelInfo(name);
  if (localResult) {
    return NextResponse.json(localResult);
  }

  // Fallback: try Wikipedia (free, slightly slower)
  const wikiResult = await fetchWikipediaInfo(name);
  if (wikiResult) {
    return NextResponse.json(wikiResult);
  }

  // If nothing found, return minimal defaults without specific months
  return NextResponse.json({
    estimatedDays: 5,
    estimatedBudget: "$1,500–$3,000",
    tip: "Research the local climate and peak seasons for the best experience.",
  });
}
