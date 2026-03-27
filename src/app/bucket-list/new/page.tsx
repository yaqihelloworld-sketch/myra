import ExperienceForm from "@/components/experience-form";
import ExperiencePageHeader from "@/components/experience-page-header";

export const dynamic = "force-dynamic";

export default function NewExperiencePage() {
  return (
    <div>
      <ExperiencePageHeader mode="new" />
      <div className="max-w-xl">
        <ExperienceForm />
      </div>
    </div>
  );
}
