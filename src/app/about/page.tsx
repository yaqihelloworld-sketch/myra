"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function AboutPage() {
  const { t } = useI18n();

  const steps = [
    { num: "01", title: t("about.step1Title"), desc: t("about.step1Desc") },
    { num: "02", title: t("about.step2Title"), desc: t("about.step2Desc") },
    { num: "03", title: t("about.step3Title"), desc: t("about.step3Desc") },
  ];

  return (
    <div className="max-w-xl mx-auto py-16 md:py-24">
      <Link
        href="/"
        className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors"
      >
        &larr; HOME
      </Link>

      <h1 className="font-serif text-3xl md:text-4xl mt-8 mb-3">
        {t("about.heading")}
      </h1>
      <p className="text-sm text-[#1A1A1A]/50 leading-relaxed mb-16">
        {t("about.p1")}
      </p>

      {/* How it works */}
      <div className="space-y-10 mb-16">
        {steps.map((step) => (
          <div key={step.num} className="flex gap-5">
            <span className="font-serif text-2xl text-[#EBCFBE] shrink-0 w-8">
              {step.num}
            </span>
            <div>
              <h2 className="font-serif text-lg mb-1">{step.title}</h2>
              <p className="text-sm text-[#1A1A1A]/45 leading-relaxed">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 flex gap-4">
        <Link
          href="/trips/new"
          className="bg-[#1A1A1A] text-white px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-[#1A1A1A]/85 transition-colors"
        >
          START DISCOVERING
        </Link>
        <Link
          href="/bucket-list"
          className="border border-[#D4D0C8] px-6 py-3 text-xs tracking-[0.2em] uppercase text-[#1A1A1A]/50 hover:border-[#1A1A1A]/30 hover:text-[#1A1A1A]/70 transition-colors"
        >
          MY BUCKET LIST
        </Link>
      </div>
    </div>
  );
}
