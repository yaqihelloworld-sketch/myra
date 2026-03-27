import { db } from "@/db";
import { experiences } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import HomeContent from "@/components/home-content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const wishlistCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(experiences)
    .where(eq(experiences.status, "wishlist"));

  const plannedCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(experiences)
    .where(eq(experiences.status, "planned"));

  const visitedCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(experiences)
    .where(eq(experiences.status, "visited"));

  return (
    <HomeContent
      wishlistCount={wishlistCount[0].count}
      plannedCount={plannedCount[0].count}
      visitedCount={visitedCount[0].count}
    />
  );
}
