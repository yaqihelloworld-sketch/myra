"use client";

import { I18nProvider } from "@/lib/i18n";
import SessionProvider from "@/components/session-provider";
import Nav from "@/components/nav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <I18nProvider>
        <Nav />
        <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
      </I18nProvider>
    </SessionProvider>
  );
}
