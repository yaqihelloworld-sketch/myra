"use client";

import Link from "next/link";
import { formatIndex, parseCommaSeparated } from "@/lib/utils";
import type { Experience } from "@/lib/types";
import CardMenu from "./card-menu";

export default function ExperienceCard({
  experience,
  index,
}: {
  experience: Experience;
  index: number;
}) {
  const seasons = parseCommaSeparated(experience.idealSeasons);
  const partnerTypes = parseCommaSeparated(experience.idealPartnerTypes);

  return (
    <Link href={`/bucket-list/${experience.id}`} className="block group">
      <div className="border-t border-[#D4D0C8] py-5 flex items-start justify-between gap-4">
        <div className="flex gap-4 items-start flex-1 min-w-0">
          <span className="text-xs text-[#1A1A1A]/30 font-mono pt-0.5">
            {formatIndex(index + 1)}
          </span>
          <div className="min-w-0">
            <h3 className="font-serif text-lg group-hover:text-[#1A1A1A]/70 transition-colors">
              {experience.name}
            </h3>
            {experience.country && (
              <p className="text-sm text-[#1A1A1A]/50 mt-0.5">
                {experience.country}
              </p>
            )}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
              {seasons.map((s) => (
                <span
                  key={s}
                  className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/40"
                >
                  {s}
                </span>
              ))}
              {partnerTypes.length > 0 && seasons.length > 0 && (
                <span className="text-[10px] text-[#1A1A1A]/20">·</span>
              )}
              {partnerTypes.map((p) => (
                <span
                  key={p}
                  className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/40"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {experience.doByAge && (
            <span className="text-[10px] tracking-[0.1em] uppercase text-[#1A1A1A]/35 border border-[#D4D0C8] px-2 py-0.5">
              {experience.doByAge === "60+" ? "60+" : `< ${experience.doByAge}`}
            </span>
          )}
          <CardMenu experienceId={experience.id} />
        </div>
      </div>
    </Link>
  );
}
