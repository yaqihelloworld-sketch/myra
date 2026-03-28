"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

function AnimatedCount({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current || hasAnimated) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated || value === 0) return;
    const duration = 800;
    const steps = Math.min(value, 30);
    const stepTime = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      setCount(Math.round((current / steps) * value));
      if (current >= steps) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [hasAnimated, value]);

  return <span ref={ref}>{hasAnimated ? count : 0}</span>;
}

export default function HomeContent({
  wishlistCount,
  plannedCount,
  visitedCount,
}: {
  wishlistCount: number;
  plannedCount: number;
  visitedCount: number;
}) {
  const { t, lang } = useI18n();
  const isCN = lang === "zh";

  return (
    <div className="py-16 md:py-24">
      {/* Hero */}
      <div className="text-center mb-20">
        <p className="text-xs italic text-[#1A1A1A]/40 mb-4 tracking-wide">
          {t("home.quote")}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-4">
          {isCN ? (
            <>{t("home.heading1")}<strong>{t("home.heading2")}</strong><br />{t("home.heading4")}<strong>{t("home.heading5")}</strong></>
          ) : (
            <>{t("home.heading1")}<br /><em>{t("home.heading2")}</em>{t("home.heading3")}</>
          )}
        </h1>
      </div>

      {/* Intent Cards */}
      <div className="grid md:grid-cols-2 gap-3 max-w-2xl mx-auto mb-20">
        <Link
          href="/bucket-list/new"
          className="bg-white p-5 md:p-6 rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.03)] group hover:bg-[#EBCFBE] active:bg-[#EBCFBE] transition-colors"
        >
          <Image
            src="/book.svg"
            alt=""
            width={44}
            height={44}
            className="mb-3 opacity-75 group-hover:opacity-100 group-active:opacity-100 transition-opacity"
            aria-hidden="true"
          />
          <h2 className="font-serif text-lg md:text-xl mb-1.5">
            {t("home.addBucketList")}
          </h2>
          <p className="text-sm md:text-xs text-[#1A1A1A]/40 leading-relaxed">
            {t("home.addBucketListDesc")}
          </p>
        </Link>

        <Link
          href="/trips/new"
          className="bg-white p-5 md:p-6 rounded-lg shadow-[0_1px_4px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.03)] group hover:bg-[#EBCFBE] active:bg-[#EBCFBE] transition-colors"
        >
          <Image
            src="/globe-icon.svg"
            alt=""
            width={44}
            height={44}
            className="mb-3 opacity-75 group-hover:opacity-100 group-active:opacity-100 transition-opacity"
            aria-hidden="true"
          />
          <h2 className="font-serif text-lg md:text-xl mb-1.5">
            {t("home.discoverTrip")}
          </h2>
          <p className="text-sm md:text-xs text-[#1A1A1A]/40 leading-relaxed">
            {t("home.discoverTripDesc")}
          </p>
        </Link>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-8 md:gap-12 text-center">
        <Link href="/bucket-list?tab=wishlist" className="group transition-transform hover:-translate-y-0.5">
          <p className="font-serif text-2xl tabular-nums group-hover:text-[#EBCFBE] transition-colors">
            <AnimatedCount value={wishlistCount} />
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40 mt-1">
            {t("home.wishlist")}
          </p>
        </Link>
        <div className="w-px bg-[#D4D0C8]" />
        <Link href="/bucket-list?tab=planned" className="group transition-transform hover:-translate-y-0.5">
          <p className="font-serif text-2xl tabular-nums group-hover:text-[#EBCFBE] transition-colors">
            <AnimatedCount value={plannedCount} />
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40 mt-1">
            {t("home.planned")}
          </p>
        </Link>
        <div className="w-px bg-[#D4D0C8]" />
        <Link href="/bucket-list?tab=visited" className="group transition-transform hover:-translate-y-0.5">
          <p className="font-serif text-2xl tabular-nums group-hover:text-[#EBCFBE] transition-colors">
            <AnimatedCount value={visitedCount} />
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#1A1A1A]/40 mt-1">
            {t("home.visited")}
          </p>
        </Link>
      </div>
    </div>
  );
}
