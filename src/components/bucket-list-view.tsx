"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import ExperienceCard from "./experience-card";
import type { Experience } from "@/lib/types";
import { deriveCategory, type ExperienceCategory } from "@/lib/utils";
import { LayoutGrid, List, MapPin, ChevronDown, Map } from "lucide-react";
import MapView from "./map-view";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useSearchParams, useRouter } from "next/navigation";
import CardMenu from "./card-menu";

type Tab = "wishlist" | "planned" | "visited";
type ViewMode = "card" | "list" | "map";
type SortMode = "newest" | "az" | "category";

export default function BucketListView({
  experiences,
  photoMap,
}: {
  experiences: Experience[];
  photoMap: Record<number, { url: string; altDescription: string | null }>;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as Tab) || "wishlist";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [view, setView] = useState<ViewMode>("card");
  const [sort, setSort] = useState<SortMode>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const [snackbar, setSnackbar] = useState("");
  const { t } = useI18n();

  // Show snackbar on delete
  useEffect(() => {
    if (searchParams.get("deleted") === "1") {
      setSnackbar(t("snackbar.deleted"));
      // Clean URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("deleted");
      const newUrl = params.toString() ? `/bucket-list?${params.toString()}` : "/bucket-list";
      router.replace(newUrl, { scroll: false });
      // Auto-dismiss
      const timer = setTimeout(() => setSnackbar(""), 3500);
      return () => clearTimeout(timer);
    }
  }, [searchParams, t, router]);

  // Sync tab with URL params
  useEffect(() => {
    const urlTab = searchParams.get("tab") as Tab;
    if (urlTab && ["wishlist", "planned", "visited"].includes(urlTab)) {
      setTab(urlTab);
    }
  }, [searchParams]);

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    if (sortOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [sortOpen]);

  const wishlist = experiences.filter((e) => e.status === "wishlist");
  const planned = experiences.filter((e) => e.status === "planned");
  const visited = experiences.filter((e) => e.status === "visited");

  const filtered = tab === "wishlist" ? wishlist : tab === "planned" ? planned : visited;

  const items = useMemo(() => {
    const sorted = [...filtered];
    if (sort === "az") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "category") {
      sorted.sort((a, b) => {
        const catA = deriveCategory(a.name);
        const catB = deriveCategory(b.name);
        if (catA === catB) return a.name.localeCompare(b.name);
        if (catA === "other") return 1;
        if (catB === "other") return -1;
        return catA.localeCompare(catB);
      });
    } else {
      sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return sorted;
  }, [filtered, sort]);

  // For category view, compute groups
  const categoryGroups = useMemo(() => {
    if (sort !== "category") return null;
    const groups: { category: ExperienceCategory; label: string; items: Experience[] }[] = [];
    const catMap: Record<string, Experience[]> = {};
    for (const exp of items) {
      const cat = deriveCategory(exp.name);
      if (!catMap[cat]) catMap[cat] = [];
      catMap[cat].push(exp);
    }
    const order: ExperienceCategory[] = ["adventure", "nature", "cultural", "festival", "city", "food", "wellness", "other"];
    for (const cat of order) {
      const catItems = catMap[cat];
      if (catItems && catItems.length > 0) {
        groups.push({ category: cat, label: t(`cat.${cat}` as any), items: catItems });
      }
    }
    return groups;
  }, [items, sort, t]);

  const count = { wishlist: wishlist.length, planned: planned.length, visited: visited.length };

  const sortOptions: { value: SortMode; label: string }[] = [
    { value: "newest", label: t("sort.newest") },
    { value: "az", label: t("sort.az") },
    { value: "category", label: t("sort.category") },
  ];

  return (
    <div>
      {/* Controls row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        {/* Segmented toggle */}
        <div className="flex border border-[#D4D0C8] w-fit" role="tablist" aria-label="Filter by status">
          <button
            role="tab"
            aria-selected={tab === "wishlist"}
            onClick={() => setTab("wishlist")}
            className={`px-3 py-3 md:px-6 md:py-2.5 text-[11px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] uppercase transition-colors ${
              tab === "wishlist"
                ? "bg-[#1A1A1A] text-white"
                : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70"
            }`}
          >
            {t("bucket.wishlist")}
            <span className="ml-1.5 md:ml-2 text-[9px] opacity-50">{count.wishlist}</span>
          </button>
          <button
            role="tab"
            aria-selected={tab === "planned"}
            onClick={() => setTab("planned")}
            className={`px-3 py-3 md:px-6 md:py-2.5 text-[11px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] uppercase transition-colors ${
              tab === "planned"
                ? "bg-[#1A1A1A] text-white"
                : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70"
            }`}
          >
            {t("bucket.planned")}
            <span className="ml-1.5 md:ml-2 text-[9px] opacity-50">{count.planned}</span>
          </button>
          <button
            role="tab"
            aria-selected={tab === "visited"}
            onClick={() => setTab("visited")}
            className={`px-3 py-3 md:px-6 md:py-2.5 text-[11px] md:text-[10px] tracking-[0.1em] md:tracking-[0.2em] uppercase transition-colors ${
              tab === "visited"
                ? "bg-[#1A1A1A] text-white"
                : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70"
            }`}
          >
            {t("bucket.visited")}
            <span className="ml-1.5 md:ml-2 text-[9px] opacity-50">{count.visited}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
        {/* Sort dropdown */}
        <div ref={sortRef} className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-1 px-3 py-3 md:px-3 md:py-2 border border-[#D4D0C8] text-[11px] md:text-[10px] tracking-[0.1em] md:tracking-[0.15em] uppercase text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors"
            aria-label={t("sort.label")}
          >
            {sortOptions.find((o) => o.value === sort)?.label}
            <ChevronDown size={12} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
          </button>
          {sortOpen && (
            <div className="absolute right-0 md:left-0 top-full mt-1 bg-white border border-[#D4D0C8] shadow-[0_2px_8px_rgba(0,0,0,0.08)] z-50 min-w-[120px]">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSort(opt.value); setSortOpen(false); }}
                  className={`w-full text-left px-3 py-2.5 md:py-2 text-[11px] md:text-[10px] tracking-[0.1em] uppercase transition-colors ${
                    sort === opt.value
                      ? "bg-[#F7F5F0] text-[#1A1A1A]"
                      : "text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-[#F7F5F0]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View toggle */}
        <div className="flex border border-[#D4D0C8]" role="group" aria-label="View mode">
          <button
            onClick={() => setView("card")}
            className={`p-3 md:p-2.5 transition-colors ${
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
            className={`p-3 md:p-2.5 transition-colors ${
              view === "list"
                ? "bg-[#1A1A1A] text-white"
                : "text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60"
            }`}
            aria-label={t("bucket.listView")}
            aria-pressed={view === "list"}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setView("map")}
            className={`p-3 md:p-2.5 transition-colors ${
              view === "map"
                ? "bg-[#1A1A1A] text-white"
                : "text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60"
            }`}
            aria-label={t("map.view")}
            aria-pressed={view === "map"}
          >
            <Map size={16} />
          </button>
        </div>
        </div>
      </div>

      {/* Map view — shows all experiences */}
      {view === "map" ? (
        <MapView experiences={experiences} />
      ) : /* Empty state */
      items.length === 0 ? (
        <div className="text-center py-10 md:py-16 border-t border-[#D4D0C8]">
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
      ) : sort === "category" && categoryGroups ? (
        /* Category-grouped view */
        <div className="space-y-8">
          {categoryGroups.map((group) => (
            <div key={group.category}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40">
                  {group.label}
                </span>
                <span className="text-[9px] text-[#1A1A1A]/25">{group.items.length}</span>
                <div className="flex-1 h-px bg-[#D4D0C8]" />
              </div>
              {view === "list" ? (
                <div>
                  {group.items.map((exp, i) => (
                    <ExperienceCard key={exp.id} experience={exp} index={i} />
                  ))}
                  <div className="border-t border-[#D4D0C8]" />
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {group.items.map((exp) => (
                    <PolaroidCard key={exp.id} experience={exp} photo={photoMap[exp.id]} />
                  ))}
                </div>
              )}
            </div>
          ))}
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {items.map((exp) => (
            <PolaroidCard key={exp.id} experience={exp} photo={photoMap[exp.id]} />
          ))}
        </div>
      )}

      {/* Snackbar */}
      {snackbar && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] text-white px-6 py-3 text-sm tracking-wide shadow-lg animate-[slideUp_0.3s_cubic-bezier(0.25,1,0.5,1)]"
          style={{ animation: "slideUp 0.3s cubic-bezier(0.25, 1, 0.5, 1)" }}
        >
          {snackbar}
        </div>
      )}
    </div>
  );
}

function PolaroidCard({
  experience,
  photo,
  onPhotoAdded,
}: {
  experience: Experience;
  photo?: { url: string; altDescription: string | null };
  onPhotoAdded?: () => void;
}) {
  const { t } = useI18n();
  return (
      <div className="block group">
        <div className="bg-white p-2.5 pb-4 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-[box-shadow,transform] duration-300 h-full flex flex-col" style={{ transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)" }}>
          {/* Photo */}
          <div className="aspect-[4/3] relative overflow-hidden bg-[#F0EDE6]">
            <Link href={`/bucket-list/${experience.id}`} className="block w-full h-full">
              {photo ? (
                <Image
                  src={photo.url}
                  alt={photo.altDescription || experience.name}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
                  <MapPin size={16} strokeWidth={1} className="text-[#1A1A1A]/10" />
                </div>
              )}
            </Link>

            {/* Status overlay */}
            {experience.status === "visited" && (
              <div className="absolute top-2 right-2 bg-[#1A1A1A]/70 text-white text-[9px] md:text-[8px] tracking-[0.15em] uppercase px-2 py-1 md:py-0.5 backdrop-blur-sm pointer-events-none">
                {t("bucket.visited")}
              </div>
            )}
            {experience.status === "planned" && (
              <div className="absolute top-2 right-2 bg-[#EBCFBE] text-[#1A1A1A]/70 text-[9px] md:text-[8px] tracking-[0.15em] uppercase px-2 py-1 md:py-0.5 backdrop-blur-sm pointer-events-none">
                {t("bucket.planned")}
              </div>
            )}
          </div>

          {/* Caption area — fixed height for uniform cards */}
          <Link href={`/bucket-list/${experience.id}`} className="pt-3 px-0.5 flex-1 flex flex-col min-h-[72px]">
            <div className="flex items-start justify-between">
              <h3 className="font-serif text-sm leading-snug group-hover:text-[#1A1A1A]/70 transition-colors line-clamp-2 flex-1">
                {experience.name}
              </h3>
              <CardMenu experienceId={experience.id} />
            </div>
            <p className="text-[10px] text-[#1A1A1A]/35 mt-0.5 h-4">
              {experience.country || "\u00A0"}
            </p>

            {/* Spacer to push content up */}
            <div className="mt-auto" />
          </Link>
        </div>
      </div>
  );
}
