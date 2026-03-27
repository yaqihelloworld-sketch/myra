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

  // If nothing found, return a helpful message
  return NextResponse.json({
    bestMonths: "Varies — research recommended",
    idealSeasons: ["spring", "autumn"],
    tip: "We couldn't find specific timing data for this experience. Spring and autumn are generally safe bets for most destinations.",
  });
}
