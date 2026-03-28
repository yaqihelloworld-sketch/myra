import { db } from "@/db";
import { experiences } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import HomeContent from "@/components/home-content";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id || "";

  const counts = await db
    .select({
      status: experiences.status,
      count: sql<number>`count(*)`,
    })
    .from(experiences)
    .where(eq(experiences.userId, userId))
    .groupBy(experiences.status);

  const countMap: Record<string, number> = {};
  for (const row of counts) {
    countMap[row.status] = row.count;
  }

  return (
    <HomeContent
      wishlistCount={countMap["wishlist"] || 0}
      plannedCount={countMap["planned"] || 0}
      visitedCount={countMap["visited"] || 0}
    />
  );
}
