"use client";

import { useSession, signIn } from "next-auth/react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-5 h-5 border-2 border-[#D4D0C8] border-t-[#1A1A1A] rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-serif text-2xl mb-3">Sign in to continue</p>
        <p className="text-sm text-[#1A1A1A]/40 mb-8">
          Your bucket list and trips are saved to your account.
        </p>
        <button
          onClick={() => signIn("google")}
          className="text-xs tracking-[0.15em] border border-[#1A1A1A] px-6 py-3 hover:bg-[#1A1A1A] hover:text-[#F7F5F0] transition-colors"
        >
          SIGN IN WITH GOOGLE
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
