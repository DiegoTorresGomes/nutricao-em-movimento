import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { consolidationSourcePath, consolidationTargetUrl } from "./lib/editorial-consolidation";

export function middleware(request: NextRequest) {
  // Resolve both host variants directly to the canonical destination, before
  // the general www redirect. Never query the publication database here.
  if (request.nextUrl.pathname === consolidationSourcePath) {
    const destination = new URL(consolidationTargetUrl);
    destination.search = request.nextUrl.search;
    return NextResponse.redirect(destination, 301);
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const requestHost = (forwardedHost ?? request.headers.get("host"))
    ?.split(",", 1)[0]
    .trim()
    .split(":", 1)[0]
    .toLowerCase();

  if (requestHost === "nutricaoemovimento.com") {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = "https:";
    canonicalUrl.hostname = "www.nutricaoemovimento.com";
    canonicalUrl.port = "";

    return NextResponse.redirect(canonicalUrl, 308);
  }

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
  matcher: ["/((?!_next/static|_next/image).*)"],
};
