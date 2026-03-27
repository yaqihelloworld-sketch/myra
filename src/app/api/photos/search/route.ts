import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=9&orientation=landscape`,
    {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Unsplash API error" },
      { status: res.status }
    );
  }

  const data = await res.json();

  const photos = data.results.map(
    (p: {
      id: string;
      urls: { regular: string; thumb: string };
      alt_description: string | null;
      user: { name: string; links: { html: string } };
    }) => ({
      unsplashId: p.id,
      url: p.urls.regular,
      thumbUrl: p.urls.thumb,
      altDescription: p.alt_description,
      photographerName: p.user.name,
      photographerUrl: p.user.links.html,
    })
  );

  return NextResponse.json(photos);
}
