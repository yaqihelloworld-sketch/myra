"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { SEASONS, PARTNER_TYPES, STATUSES, DO_BY_AGES } from "@/lib/types";
import { parseCommaSeparated, toCommaSeparated } from "@/lib/utils";
import type { Experience, ExperiencePhoto } from "@/lib/types";
import PhotoPicker from "./photo-picker";
import { Sparkles, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type PendingPhoto = Omit<ExperiencePhoto, "id" | "experienceId">;

export default function ExperienceForm({
  experience,
}: {
  experience?: Experience;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = !!experience;
  const { t } = useI18n();

  const [name, setName] = useState(experience?.name || searchParams.get("name") || "");
  const [country, setCountry] = useState(experience?.country || searchParams.get("country") || "");
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>(
    experience ? parseCommaSeparated(experience.idealSeasons) : []
  );
  const [selectedPartnerTypes, setSelectedPartnerTypes] = useState<string[]>(
    experience ? parseCommaSeparated(experience.idealPartnerTypes) : []
  );
  const [doByAge, setDoByAge] = useState(experience?.doByAge || "");
  const [status, setStatus] = useState(experience?.status || "wishlist");
  const [saving, setSaving] = useState(false);

  // Best time recommendation
  const [fetchingBestTime, setFetchingBestTime] = useState(false);
  const [bestMonths, setBestMonths] = useState("");
  const [bestTimeTip, setBestTimeTip] = useState("");

  // Photo state
  const [photos, setPhotos] = useState<ExperiencePhoto[]>([]);
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);

  // Load existing photos when editing
  useEffect(() => {
    if (isEdit) {
      fetch(`/api/experiences/${experience.id}/photos`)
        .then((res) => res.json())
        .then((data) => setPhotos(data));
    }
  }, [isEdit, experience?.id]);

  function toggleItem(arr: string[], item: string): string[] {
    return arr.includes(item)
      ? arr.filter((i) => i !== item)
      : [...arr, item];
  }

  async function handleBestTime() {
    if (!name.trim()) return;
    setFetchingBestTime(true);
    setBestMonths("");
    setBestTimeTip("");

    try {
      const res = await fetch("/api/ai/autofill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      if (data.bestMonths) setBestMonths(data.bestMonths);
      if (data.tip) setBestTimeTip(data.tip);
      if (selectedSeasons.length === 0 && data.idealSeasons)
        setSelectedSeasons(data.idealSeasons);
    } catch {
      // Silently fail
    }

    setFetchingBestTime(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      description: null,
      city: null,
      country: country || "",
      idealSeasons: toCommaSeparated(selectedSeasons),
      idealPartnerTypes: toCommaSeparated(selectedPartnerTypes),
      estimatedDays: null,
      doByAge: doByAge || null,
      status,
    };

    const url = isEdit
      ? `/api/experiences/${experience.id}`
      : "/api/experiences";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const saved = await res.json();
    const expId = isEdit ? experience.id : saved.id;

    // Save pending photos
    for (const photo of pendingPhotos) {
      await fetch(`/api/experiences/${expId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(photo),
      });
    }

    router.push("/bucket-list");
    router.refresh();
  }

  async function handleDelete() {
    if (!isEdit) return;
    setSaving(true);
    await fetch(`/api/experiences/${experience.id}`, { method: "DELETE" });
    router.push("/bucket-list");
    router.refresh();
  }

  function addPhoto(photo: PendingPhoto) {
    const isDupe =
      pendingPhotos.some((p) => p.unsplashId === photo.unsplashId) ||
      photos.some((p) => p.unsplashId === photo.unsplashId);
    if (!isDupe) {
      setPendingPhotos((prev) => [...prev, photo]);
    }
    setShowPhotoPicker(false);
  }

  async function removeExistingPhoto(photoId: number) {
    if (!isEdit) return;
    await fetch(
      `/api/experiences/${experience.id}/photos?photoId=${photoId}`,
      { method: "DELETE" }
    );
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  }

  function removePendingPhoto(unsplashId: string) {
    setPendingPhotos((prev) => prev.filter((p) => p.unsplashId !== unsplashId));
  }

  const allPhotos = [
    ...photos.map((p) => ({ ...p, isPending: false as const })),
    ...pendingPhotos.map((p) => ({ ...p, id: 0, experienceId: 0, isPending: true as const })),
  ];

  const labelClass = "text-xs md:text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/50 mb-1.5 md:mb-1 block";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Name — hero field */}
      <div>
        <label htmlFor="experience-name" className="sr-only">{t("form.nameLabel")}</label>
        <input
          id="experience-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("form.namePlaceholder")}
          className="w-full bg-transparent border-none py-2 font-serif text-3xl md:text-4xl placeholder:text-[#1A1A1A]/15 leading-tight"
          required
        />
        <div className="h-px bg-[#1A1A1A]/10 mt-1" />
      </div>

      {/* Status toggle */}
      <div>
        <label className={labelClass}>&#9632; {t("form.status")}</label>
        <div className="flex gap-1 mt-2" role="group" aria-label="Status">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={status === s}
              onClick={() => setStatus(s)}
              className={`px-4 py-3 md:py-2 text-xs md:text-[10px] tracking-[0.15em] uppercase border transition-colors ${
                status === s
                  ? "bg-[#EBCFBE] text-[#1A1A1A] border-[#EBCFBE]"
                  : "border-[#D4D0C8] text-[#1A1A1A]/50 hover:border-[#1A1A1A]/30"
              }`}
            >
              {s === "visited" ? "completed" : s}
            </button>
          ))}
        </div>
      </div>


      {/* Photos Section */}
      <div>
        <label className={labelClass}>&#9632; {t("form.photos")}</label>

        {allPhotos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
            {allPhotos.map((photo) => (
              <div key={photo.unsplashId} className="relative group">
                <div className="aspect-[3/2] relative overflow-hidden">
                  <Image
                    src={photo.thumbUrl}
                    alt={photo.altDescription || "Travel photo"}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() =>
                    photo.isPending
                      ? removePendingPhoto(photo.unsplashId)
                      : removeExistingPhoto(photo.id)
                  }
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
                <a
                  href={photo.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[8px] text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 mt-0.5 block truncate"
                >
                  {photo.photographerName}
                </a>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowPhotoPicker(!showPhotoPicker)}
          className="border border-[#D4D0C8] px-4 py-3 md:py-2 text-xs md:text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/50 hover:border-[#1A1A1A]/30 transition-colors mt-2"
        >
          {showPhotoPicker ? t("form.hidePhotos") : t("form.findPhotos")}
        </button>

        {showPhotoPicker && (
          <PhotoPicker
            initialQuery={[name, country].filter(Boolean).join(" ")}
            onSelect={addPhoto}
            onClose={() => setShowPhotoPicker(false)}
          />
        )}
      </div>

      <div className="border-t border-[#D4D0C8]/50 md:border-[#D4D0C8] pt-6 flex items-center justify-between">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#1A1A1A] text-white px-8 py-3.5 md:py-3 text-xs md:text-[10px] tracking-[0.2em] uppercase hover:bg-[#1A1A1A]/80 transition-colors disabled:opacity-50"
        >
          {saving ? t("form.saving") : isEdit ? t("form.update") : t("form.addToList")}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="text-xs md:text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/30 hover:text-red-500 transition-colors py-2"
          >
            {t("form.delete")}
          </button>
        )}
      </div>
    </form>
  );
}
