import ExperienceForm from "@/components/experience-form";
import ExperiencePageHeader from "@/components/experience-page-header";
import AuthGate from "@/components/auth-gate";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewExperiencePage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <AuthGate>{null}</AuthGate>;
  }

  return (
    <div>
      <ExperiencePageHeader mode="new" />
      <div className="max-w-xl">
        <ExperienceForm />
      </div>
    </div>
  );
}
