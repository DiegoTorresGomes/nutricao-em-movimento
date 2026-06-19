import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/administracao") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/login")
  ) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return response;
  }

  if (
    pathname.startsWith("/pt") ||
    pathname === "/" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=86400"
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};