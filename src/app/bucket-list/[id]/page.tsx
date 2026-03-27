import { db } from "@/db";
import { experiences } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import ExperienceForm from "@/components/experience-form";
import ExperiencePageHeader from "@/components/experience-page-header";
import AuthGate from "@/components/auth-gate";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return <AuthGate>{null}</AuthGate>;
  }

  const { id } = await params;
  const result = await db
    .select()
    .from(experiences)
    .where(and(eq(experiences.id, parseInt(id)), eq(experiences.userId, session.user.id)));

  if (result.length === 0) notFound();

  return (
    <div>
      <ExperiencePageHeader mode="edit" name={result[0].name} />
      <div className="max-w-xl">
        <ExperienceForm experience={result[0]} />
      </div>
    </div>
  );
}
