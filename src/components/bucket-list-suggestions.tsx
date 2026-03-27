"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, Heart, Users } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface Suggestion {
  name: string;
  country: string;
  metric: string;
  metricType: "trending" | "loved" | "popular";
}

const SUGGESTIONS: Suggestion[] = [
  { name: "Northern Lights in Iceland", country: "Iceland", metric: "94% say life-changing", metricType: "loved" },
  { name: "Machu Picchu sunrise hike", country: "Peru", metric: "2.1M mentions", metricType: "popular" },
  { name: "Santorini sunset", country: "Greece", metric: "Trending 2026", metricType: "trending" },
  { name: "Safari in Serengeti", country: "Tanzania", metric: "1.8M mentions", metricType: "popular" },
  { name: "Cherry blossom season in Kyoto", country: "Japan", metric: "89% say magical", metricType: "loved" },
  { name: "Bali rice terraces", country: "Indonesia", metric: "Trending 2026", metricType: "trending" },
  { name: "Walk the Camino de Santiago", country: "Spain", metric: "91% say transformative", metricType: "loved" },
  { name: "Great Barrier Reef diving", country: "Australia", metric: "1.4M mentions", metricType: "popular" },
  { name: "Petra by candlelight", country: "Jordan", metric: "97% say unforgettable", metricType: "loved" },
  { name: "Hot air balloon over Cappadocia", country: "Turkey", metric: "Trending 2026", metricType: "trending" },
  { name: "Maldives overwater villa", country: "Maldives", metric: "1.6M mentions", metricType: "popular" },
  { name: "Road trip along Route 66", country: "USA", metric: "88% say iconic", metricType: "loved" },
  { name: "Amalfi Coast drive", country: "Italy", metric: "1.2M mentions", metricType: "popular" },
  { name: "Swim in cenotes", country: "Mexico", metric: "Trending 2026", metricType: "trending" },
  { name: "Taj Mahal at sunrise", country: "India", metric: "92% say breathtaking", metricType: "loved" },
  { name: "Hike Patagonia's Torres del Paine", country: "Chile", metric: "Trending 2026", metricType: "trending" },
  { name: "Gondola ride in Venice", country: "Italy", metric: "1.9M mentions", metricType: "popular" },
  { name: "Explore Marrakech souks", country: "Morocco", metric: "86% say sensory overload", metricType: "loved" },
  { name: "New Year's Eve in Sydney", country: "Australia", metric: "1.1M mentions", metricType: "popular" },
  { name: "Train ride through Swiss Alps", country: "Switzerland", metric: "Trending 2026", metricType: "trending" },
  { name: "Angkor Wat at dawn", country: "Cambodia", metric: "93% say awe-inspiring", metricType: "loved" },
  { name: "Northern Norway whale watching", country: "Norway", metric: "Trending 2026", metricType: "trending" },
  { name: "La Tomatina festival", country: "Spain", metric: "850K mentions", metricType: "popular" },
  { name: "Floating markets of Bangkok", country: "Thailand", metric: "87% say vibrant", metricType: "loved" },
];

const METRIC_ICON = {
  trending: TrendingUp,
  loved: Heart,
  popular: Users,
};

const METRIC_COLOR = {
  trending: "text-[#1A1A1A]/40",
  loved: "text-[#EBCFBE]",
  popular: "text-[#1A1A1A]/25",
};

export default function BucketListSuggestions({
  existingNames,
}: {
  existingNames: string[];
}) {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const { t } = useI18n();

  const normalizedExisting = new Set(
    existingNames.map((n) => n.toLowerCase().trim())
  );

  const available = SUGGESTIONS.filter(
    (s) => !normalizedExisting.has(s.name.toLowerCase().trim())
  );

  const visible = showAll ? available : available.slice(0, 12);

  if (available.length === 0) return null;

  function handleClick(suggestion: Suggestion) {
    const params = new URLSearchParams({
      name: suggestion.name,
      country: suggestion.country,
    });
    router.push(`/bucket-list/new?${params.toString()}`);
  }

  return (
    <div className="mt-16 border-t border-[#D4D0C8] pt-10">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={13} className="text-[#1A1A1A]/25" />
        <h2 className="text-[10px] tracking-[0.25em] uppercase text-[#1A1A1A]/40">
          {t("bucket.inspiration")}
        </h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {visible.map((s) => {
          const Icon = METRIC_ICON[s.metricType];
          return (
            <button
              key={s.name}
              onClick={() => handleClick(s)}
              className="group inline-flex items-center gap-2 border border-[#D4D0C8] px-3 py-2 hover:border-[#1A1A1A]/25 hover:bg-white transition-all"
            >
              <span className="text-xs text-[#1A1A1A]/70 group-hover:text-[#1A1A1A] transition-colors">
                {s.name}
              </span>
              <span className="flex items-center gap-1 shrink-0">
                <Icon size={8} className={METRIC_COLOR[s.metricType]} />
                <span className="text-[8px] tracking-[0.05em] text-[#1A1A1A]/25">
                  {s.metric}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {!showAll && available.length > 12 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 transition-colors"
        >
          {t("bucket.showMore")} ({available.length - 12})
        </button>
      )}
    </div>
  );
}
