"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import UserMenu from "@/components/user-menu";

export default function Nav() {
  const pathname = usePathname();
  const { lang, setLang, t } = useI18n();

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/bucket-list", label: t("nav.bucketList") },
    { href: "/trips/new", label: t("nav.discover") },
  ];

  return (
    <nav className="border-b border-[#D4D0C8]">
      <div className="max-w-5xl mx-auto px-6 py-4 md:py-5 flex items-center justify-between gap-4">
        <Link href="/" className="font-serif text-xl tracking-tight shrink-0">
          Myra
        </Link>
        <div className="flex items-center gap-5 md:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs md:text-xs tracking-[0.15em] md:tracking-[0.2em] whitespace-nowrap transition-colors py-1 ${
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href))
                  ? "text-[#1A1A1A]"
                  : "text-[#1A1A1A]/40 hover:text-[#1A1A1A]/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setLang(lang === "en" ? "zh" : "en")}
            className="text-xs md:text-xs tracking-wide text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors border-l border-[#D4D0C8] pl-5 md:pl-6 py-1 whitespace-nowrap"
            aria-label={lang === "en" ? "Switch to Chinese" : "切换到英文"}
          >
            {lang === "en" ? "中文" : "EN"}
          </button>
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
