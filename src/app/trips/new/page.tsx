import TripContextForm from "@/components/trip-context-form";
import DiscoverHeader from "@/components/discover-header";
import AuthGate from "@/components/auth-gate";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewTripPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return <AuthGate>{null}</AuthGate>;
  }

  return (
    <div className="-mx-6 -my-10 px-6 py-10">
      <DiscoverHeader />
      <div className="max-w-[1400px] mx-auto">
        <TripContextForm />
      </div>
    </div>
  );
}
