"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-7 h-7 rounded-full bg-[#D4D0C8] animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <button
        onClick={() => signIn("google")}
        className="text-[10px] md:text-xs tracking-[0.15em] text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors whitespace-nowrap"
      >
        SIGN IN
      </button>
    );
  }

  return (
    <button
      onClick={() => signOut()}
      className="flex items-center gap-2 group"
      title={`Signed in as ${session.user.name}\nClick to sign out`}
    >
      {session.user.image ? (
        <Image
          src={session.user.image}
          alt=""
          width={28}
          height={28}
          className="rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-[#EBCFBE] flex items-center justify-center text-[10px] font-medium text-[#1A1A1A]">
          {session.user.name?.[0] || "?"}
        </div>
      )}
    </button>
  );
}
