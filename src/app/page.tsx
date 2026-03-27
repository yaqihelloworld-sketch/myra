import { db } from "@/db";
import { experiences } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import HomeContent from "@/components/home-content";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id || "";

  const wishlistCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(experiences)
    .where(and(eq(experiences.status, "wishlist"), eq(experiences.userId, userId)));

  const plannedCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(experiences)
    .where(and(eq(experiences.status, "planned"), eq(experiences.userId, userId)));

  const visitedCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(experiences)
    .where(and(eq(experiences.status, "visited"), eq(experiences.userId, userId)));

  return (
    <HomeContent
      wishlistCount={wishlistCount[0].count}
      plannedCount={plannedCount[0].count}
      visitedCount={visitedCount[0].count}
    />
  );
}
