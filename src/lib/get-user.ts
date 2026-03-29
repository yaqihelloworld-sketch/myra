import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function getUser() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      if (process.env.NODE_ENV === "development") {
        return { id: "dev", name: "Dev User", email: "dev@localhost" };
      }
      return null;
    }
    return session.user;
  } catch {
    if (process.env.NODE_ENV === "development") {
      return { id: "dev", name: "Dev User", email: "dev@localhost" };
    }
    return null;
  }
}

export function unauthorized() {
  return NextResponse.json({ error: "Sign in required" }, { status: 401 });
}
