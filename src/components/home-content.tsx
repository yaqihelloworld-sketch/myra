"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function HomeContent({
  wishlistCount,
  plannedCount,
  visitedCount,
}: {
  wishlistCount: number;
  plannedCount: number;
  visitedCount: number;
}) {
  const { t } = useI18n();

  return (
    <div className="py-16 md:py-24">
      {/* Hero */}
      <div className="text-center mb-20">
        <p className="text-xs italic text-[#1A1A1A]/40 mb-4 tracking-wide">
          {t("home.quote")}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-4">
          {t("home.heading1")}<br />
          <em>{t("home.heading2")}</em>{t("home.heading3")}
        </h1>
      </div>

      {/* Intent Cards */}
      <div className="grid md:grid-cols-2 gap-px bg-[#D4D0C8] max-w-2xl mx-auto mb-20">
        <Link
          href="/bucket-list/new"
          className="bg-[#F7F5F0] p-10 group hover:bg-[#EBCFBE] transition-colors"
        >
          <Image
            src="/book.svg"
            alt=""
            width={52}
            height={52}
            className="mb-3 opacity-80 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          />
          <h2 className="font-serif text-xl mb-2">{t("home.addBucketList")}</h2>
          <p className="text-xs text-[#1A1A1A]/40 leading-relaxed">
            {t("home.addBucketListDesc")}
          </p>
        </Link>

        <Link
          href="/trips/new"
          className="bg-[#F7F5F0] p-10 group hover:bg-[#EBCFBE] transition-colors"
        >
          <Image
            src="/globe-icon.svg"
            alt=""
            width={52}
            height={52}
            className="mb-3 opacity-80 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          />
          <h2 className="font-serif text-xl mb-2">{t("home.discoverTrip")}</h2>
          <p className="text-xs text-[#1A1A1A]/40 leading-relaxed">
            {t("home.discoverTripDesc")}
          </p>
        </Link>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-12 text-center">
        <div>
          <p className="font-serif text-2xl">{wishlistCount}</p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40 mt-1">
            {t("home.wishlist")}
          </p>
        </div>
        <div className="w-px bg-[#D4D0C8]" />
        <div>
          <p className="font-serif text-2xl">{plannedCount}</p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40 mt-1">
            {t("home.planned")}
          </p>
        </div>
        <div className="w-px bg-[#D4D0C8]" />
        <div>
          <p className="font-serif text-2xl">{visitedCount}</p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40 mt-1">
            {t("home.visited")}
          </p>
        </div>
      </div>
    </div>
  );
}
