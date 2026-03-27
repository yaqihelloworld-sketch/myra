import { db } from "@/db";
import { experiences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ExperienceForm from "@/components/experience-form";
import ExperiencePageHeader from "@/components/experience-page-header";

export const dynamic = "force-dynamic";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await db
    .select()
    .from(experiences)
    .where(eq(experiences.id, parseInt(id)));

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
