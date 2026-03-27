import TripContextForm from "@/components/trip-context-form";
import DiscoverHeader from "@/components/discover-header";

export const dynamic = "force-dynamic";

export default function NewTripPage() {
  return (
    <div className="-mx-6 -my-10 px-6 py-10">
      <DiscoverHeader />
      <div className="max-w-[1400px] mx-auto">
        <TripContextForm />
      </div>
    </div>
  );
}
