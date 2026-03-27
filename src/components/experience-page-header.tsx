"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function ExperiencePageHeader({
  mode,
  name,
}: {
  mode: "new" | "edit";
  name?: string;
}) {
  const { t } = useI18n();

  return (
    <div className="mb-12">
      <Link
        href="/bucket-list"
        className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
      >
        &larr; {mode === "new" ? t("newExp.back") : t("editExp.back")}
      </Link>
      {mode === "new" && (
        <h1 className="font-serif text-3xl mt-6">
          {t("newExp.heading")}
        </h1>
      )}
    </div>
  );
}
