"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { hasLoadedAnalytics, isPublicPath, leavePublicPage } from "@/lib/consent-services";
/** Ends executed public tags when SPA navigation enters login/admin or another non-public page. */
export function ConsentNavigationGuard() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname && !isPublicPath(pathname)) leavePublicPage();
  }, [pathname]);
  useEffect(() => {
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !hasLoadedAnalytics()) return;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin === window.location.origin && !isPublicPath(url.pathname)) {
        event.preventDefault();
        window.location.assign(url.href);
      }
    };
    document.addEventListener("click", navigate, true);
    return () => document.removeEventListener("click", navigate, true);
  }, []);
  return null;
}
