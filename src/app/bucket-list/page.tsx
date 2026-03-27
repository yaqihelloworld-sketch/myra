import { db } from "@/db";
import { experiences, experiencePhotos } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import BucketListView from "@/components/bucket-list-view";
import BucketListSuggestions from "@/components/bucket-list-suggestions";
import BucketListHeader from "@/components/bucket-list-header";
import AuthGate from "@/components/auth-gate";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function BucketListPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <AuthGate>{null}</AuthGate>;
  }

  const userId = session.user.id;

  const allExperiences = await db
    .select()
    .from(experiences)
    .where(eq(experiences.userId, userId))
    .orderBy(desc(experiences.createdAt));

  // Fetch first photo for each experience
  const photos = await db.select().from(experiencePhotos);
  const photoMap: Record<number, { url: string; altDescription: string | null }> = {};
  for (const photo of photos) {
    if (!photoMap[photo.experienceId]) {
      photoMap[photo.experienceId] = {
        url: photo.url,
        altDescription: photo.altDescription,
      };
    }
  }

  return (
    <div>
      <BucketListHeader />
      <BucketListView experiences={allExperiences} photoMap={photoMap} />
      <BucketListSuggestions existingNames={allExperiences.map((e: any) => e.name)} />
    </div>
  );
}
