"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-[#D4D0C8]/50 mt-20">
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="font-serif text-sm tracking-tight text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 transition-colors">
          Myra
        </Link>
        <Link
          href="/about"
          className="text-[10px] tracking-[0.15em] uppercase text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 transition-colors"
        >
          {t("footer.about")}
        </Link>
      </div>
    </footer>
  );
}
