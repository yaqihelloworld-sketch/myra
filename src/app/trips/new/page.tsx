import TripContextForm from "@/components/trip-context-form";
import DiscoverHeader from "@/components/discover-header";
import AuthGate from "@/components/auth-gate";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewTripPage() {
  let session;
  try { session = await auth(); } catch {}
  const isDev = process.env.NODE_ENV === "development";

  if (!session?.user?.id && !isDev) {
    return <AuthGate>{null}</AuthGate>;
  }

  return (
    <div className="-mx-6 -my-10 px-6 py-6 md:py-10">
      <DiscoverHeader />
      <div className="max-w-[1400px] mx-auto">
        <TripContextForm />
      </div>
    </div>
  );
}
