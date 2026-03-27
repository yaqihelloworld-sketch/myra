"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { ExperiencePhoto } from "@/lib/types";
import { useI18n } from "@/lib/i18n";

type UnsplashResult = Omit<ExperiencePhoto, "id" | "experienceId">;

export default function PhotoPicker({
  initialQuery,
  onSelect,
  onClose,
}: {
  initialQuery: string;
  onSelect: (photo: UnsplashResult) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<UnsplashResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  const searchPhotos = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/photos/search?query=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  useEffect(() => {
    if (initialQuery) {
      searchPhotos(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return (
    <div className="border border-[#D4D0C8] bg-white p-6 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/50">
          {t("photos.title")}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/30 hover:text-[#1A1A1A] transition-colors"
        >
          {t("photos.close")}
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), searchPhotos(query))}
          placeholder={t("photos.searchPlaceholder")}
          className="flex-1 bg-transparent border-b border-[#D4D0C8] py-2 text-sm focus:border-[#1A1A1A] transition-colors placeholder:text-[#1A1A1A]/25"
        />
        <button
          type="button"
          onClick={() => searchPhotos(query)}
          className="border border-[#D4D0C8] px-4 py-2 text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/50 hover:border-[#1A1A1A]/30 transition-colors"
        >
          {t("photos.search")}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-[#1A1A1A]/40 italic py-8 text-center">
          {t("photos.searching")}
        </p>
      ) : results.length === 0 ? (
        <p className="text-sm text-[#1A1A1A]/40 italic py-8 text-center">
          {t("photos.noResults")}
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {results.map((photo) => (
            <button
              key={photo.unsplashId}
              type="button"
              onClick={() => onSelect(photo)}
              className="relative aspect-[3/2] overflow-hidden group"
            >
              <Image
                src={photo.thumbUrl}
                alt={photo.altDescription || "Travel photo"}
                fill
                className="object-cover group-hover:opacity-80 transition-opacity"
                sizes="200px"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end">
                <span className="text-[8px] text-white/0 group-hover:text-white/80 px-2 py-1 transition-colors truncate w-full">
                  {photo.photographerName}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="text-[8px] text-[#1A1A1A]/30 mt-3">
        {t("photos.attribution")}
      </p>
    </div>
  );
}
