import { db } from "@/db";
import { trips, tripExperiences, experiences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/status-badge";
import { formatIndex } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tripId = parseInt(id);

  const tripResult = await db
    .select()
    .from(trips)
    .where(eq(trips.id, tripId));

  if (tripResult.length === 0) notFound();

  const trip = tripResult[0];

  const linkedExperiences = await db
    .select({ experience: experiences })
    .from(tripExperiences)
    .innerJoin(experiences, eq(tripExperiences.experienceId, experiences.id))
    .where(eq(tripExperiences.tripId, tripId));

  const exps = linkedExperiences.map((r: any) => r.experience);

  return (
    <div>
      <div className="mb-12">
        <Link
          href="/trips"
          className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/55 hover:text-[#1A1A1A] transition-colors"
        >
          &larr; BACK TO TRIPS
        </Link>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#1A1A1A]/55 mb-2 mt-6">
          TRIP DETAILS
        </p>
        <h1 className="font-serif text-3xl">{trip.name}</h1>
      </div>

      {/* Trip metadata */}
      <div className="border-t border-b border-[#D4D0C8] py-5 mb-12 grid grid-cols-2 md:grid-cols-4 gap-6">
        {trip.startDate && (
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/55 mb-1">
              &#9632; DATES
            </p>
            <p className="text-sm">
              {trip.startDate}
              {trip.endDate ? ` — ${trip.endDate}` : ""}
            </p>
          </div>
        )}
        {trip.season && (
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/55 mb-1">
              &#9650; SEASON
            </p>
            <p className="text-sm capitalize">{trip.season}</p>
          </div>
        )}
        {trip.partnerType && (
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/55 mb-1">
              &#9650; COMPANION
            </p>
            <p className="text-sm capitalize">{trip.partnerType}</p>
          </div>
        )}
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/55 mb-1">
            &#9632; EXPERIENCES
          </p>
          <p className="text-sm">{exps.length}</p>
        </div>
      </div>

      {/* Linked experiences */}
      <h2 className="text-[11px] tracking-[0.2em] uppercase text-[#1A1A1A]/50 mb-4">
        THE ITINERARY
      </h2>

      {exps.length === 0 ? (
        <div className="text-center py-12 border-t border-[#D4D0C8]">
          <p className="text-sm text-[#1A1A1A]/55 italic">
            No experiences linked to this trip yet.
          </p>
        </div>
      ) : (
        <div>
          {exps.map((exp: any, i: number) => (
            <Link
              key={exp.id}
              href={`/bucket-list/${exp.id}`}
              className="block group"
            >
              <div className="border-t border-[#D4D0C8] py-5 flex items-center justify-between gap-4">
                <div className="flex gap-4 items-start">
                  <span className="text-xs text-[#1A1A1A]/50 font-mono pt-0.5">
                    {formatIndex(i + 1)}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg group-hover:text-[#1A1A1A]/70 transition-colors">
                      {exp.name}
                    </h3>
                    <p className="text-sm text-[#1A1A1A]/50 mt-0.5">
                      {exp.city ? `${exp.city}, ` : ""}
                      {exp.country}
                    </p>
                  </div>
                </div>
                <StatusBadge status={exp.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
