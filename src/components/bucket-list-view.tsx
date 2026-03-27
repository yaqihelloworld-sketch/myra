"use client";

import { useState } from "react";
import ExperienceCard from "./experience-card";
import type { Experience } from "@/lib/types";
import { parseCommaSeparated } from "@/lib/utils";
import { LayoutGrid, List, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

type Tab = "wishlist" | "planned" | "visited";
type ViewMode = "card" | "list";

export default function BucketListView({
  experiences,
  photoMap,
}: {
  experiences: Experience[];
  photoMap: Record<number, { url: string; altDescription: string | null }>;
}) {
  const [tab, setTab] = useState<Tab>("wishlist");
  const [view, setView] = useState<ViewMode>("card");
  const { t } = useI18n();

  const wishlist = experiences.filter((e) => e.status === "wishlist");
  const planned = experiences.filter((e) => e.status === "planned");
  const visited = experiences.filter((e) => e.status === "visited");

  const items = tab === "wishlist" ? wishlist : tab === "planned" ? planned : visited;
  const count = { wishlist: wishlist.length, planned: planned.length, visited: visited.length };

  return (
    <div>
      {/* Controls row */}
      <div className="flex items-center justify-between mb-8">
        {/* Segmented toggle */}
        <div className="flex border border-[#D4D0C8] w-fit" role="tablist" aria-label="Filter by status">
          <button
            role="tab"
            aria-selected={tab === "wishlist"}
            onClick={() => setTab("wishlist")}
            className={`px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors ${
              tab === "wishlist"
                ? "bg-[#1A1A1A] text-white"
                : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70"
            }`}
          >
            {t("bucket.wishlist")}
            <span className="ml-2 text-[9px] opacity-50">{count.wishlist}</span>
          </button>
          <button
            role="tab"
            aria-selected={tab === "planned"}
            onClick={() => setTab("planned")}
            className={`px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors ${
              tab === "planned"
                ? "bg-[#1A1A1A] text-white"
                : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70"
            }`}
          >
            {t("bucket.planned")}
            <span className="ml-2 text-[9px] opacity-50">{count.planned}</span>
          </button>
          <button
            role="tab"
            aria-selected={tab === "visited"}
            onClick={() => setTab("visited")}
            className={`px-6 py-2.5 text-[10px] tracking-[0.2em] uppercase transition-colors ${
              tab === "visited"
                ? "bg-[#1A1A1A] text-white"
                : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70"
            }`}
          >
            {t("bucket.visited")}
            <span className="ml-2 text-[9px] opacity-50">{count.visited}</span>
          </button>
        </div>

        {/* View toggle */}
        <div className="flex border border-[#D4D0C8]" role="group" aria-label="View mode">
          <button
            onClick={() => setView("card")}
            className={`p-2.5 transition-colors ${
              view === "card"
                ? "bg-[#1A1A1A] text-white"
                : "text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60"
            }`}
            aria-label={t("bucket.cardView")}
            aria-pressed={view === "card"}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2.5 transition-colors ${
              view === "list"
                ? "bg-[#1A1A1A] text-white"
                : "text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60"
            }`}
            aria-label={t("bucket.listView")}
            aria-pressed={view === "list"}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="text-center py-16 border-t border-[#D4D0C8]">
          <p className="font-serif text-lg mb-1">
            {tab === "wishlist" ? t("bucket.emptyWishlist") : tab === "planned" ? t("bucket.emptyPlanned") : t("bucket.emptyVisited")}
          </p>
          <p className="text-sm text-[#1A1A1A]/40">
            {tab === "wishlist"
              ? t("bucket.emptyWishlistDesc")
              : tab === "planned"
              ? t("bucket.emptyPlannedDesc")
              : t("bucket.emptyVisitedDesc")}
          </p>
        </div>
      ) : view === "list" ? (
        /* List view */
        <div>
          {items.map((exp, i) => (
            <ExperienceCard key={exp.id} experience={exp} index={i} />
          ))}
          <div className="border-t border-[#D4D0C8]" />
        </div>
      ) : (
        /* Card view — Polaroid wall */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((exp) => (
            <PolaroidCard key={exp.id} experience={exp} photo={photoMap[exp.id]} />
          ))}
        </div>
      )}
    </div>
  );
}

function PolaroidCard({
  experience,
  photo,
}: {
  experience: Experience;
  photo?: { url: string; altDescription: string | null };
}) {
  const seasons = parseCommaSeparated(experience.idealSeasons);
  const partnerTypes = parseCommaSeparated(experience.idealPartnerTypes);
  const { t } = useI18n();

  return (
    <Link
      href={`/bucket-list/${experience.id}`}
      className="block group"
    >
      <div className="bg-white p-2.5 pb-4 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-[box-shadow,transform] duration-300 h-full flex flex-col" style={{ transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)" }}>
        {/* Photo */}
        <div className="aspect-[4/3] relative overflow-hidden bg-[#F0EDE6]">
          {photo ? (
            <Image
              src={photo.url}
              alt={photo.altDescription || experience.name}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <MapPin size={18} strokeWidth={1} className="text-[#1A1A1A]/8" />
              <span className="text-[9px] tracking-[0.1em] uppercase text-[#1A1A1A]/10">
                {t("bucket.noPhoto")}
              </span>
            </div>
          )}

          {/* Status overlay */}
          {experience.status === "visited" && (
            <div className="absolute top-2 right-2 bg-[#1A1A1A]/70 text-white text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 backdrop-blur-sm">
              {t("bucket.visited")}
            </div>
          )}
          {experience.status === "planned" && (
            <div className="absolute top-2 right-2 bg-[#EBCFBE] text-[#1A1A1A]/70 text-[8px] tracking-[0.15em] uppercase px-2 py-0.5 backdrop-blur-sm">
              {t("bucket.planned")}
            </div>
          )}
        </div>

        {/* Caption area — fixed height for uniform cards */}
        <div className="pt-3 px-0.5 flex-1 flex flex-col min-h-[72px]">
          <h3 className="font-serif text-sm leading-snug group-hover:text-[#1A1A1A]/70 transition-colors line-clamp-1">
            {experience.name}
          </h3>
          <p className="text-[10px] text-[#1A1A1A]/35 mt-0.5 h-4">
            {experience.country || "\u00A0"}
          </p>

          {/* Badges — always rendered area */}
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {seasons.map((s) => (
              <span
                key={s}
                className="text-[8px] tracking-[0.1em] uppercase bg-[#EBCFBE] text-[#1A1A1A]/70 px-1.5 py-0.5"
              >
                {s}
              </span>
            ))}
            {partnerTypes.map((p) => (
              <span
                key={p}
                className="text-[8px] tracking-[0.1em] uppercase bg-[#EBCFBE]/30 text-[#1A1A1A]/50 px-1.5 py-0.5"
              >
                {p}
              </span>
            ))}
            {experience.doByAge && (
              <span className="text-[8px] tracking-[0.1em] uppercase bg-[#1A1A1A]/5 text-[#1A1A1A]/40 px-1.5 py-0.5">
                {experience.doByAge === "60+" ? "60+" : `< ${experience.doByAge}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
