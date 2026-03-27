export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/bucket-list/:path*",
    "/trips/:path*",
    "/api/experiences/:path*",
    "/api/trips/:path*",
    "/api/discover/:path*",
  ],
};
