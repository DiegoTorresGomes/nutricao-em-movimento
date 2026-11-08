"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_CHANGED, CONSENT_STORAGE_KEY, readConsent } from "@/lib/consent";
import { applyConsentServices } from "@/lib/consent-services";
/** Mounted only by PublicLayout. No GTM, Clarity or advertising loader. */
export function ConsentedAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    const update = () => applyConsentServices(readConsent(), process.env.NEXT_PUBLIC_GA_ID);
    const storage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== CONSENT_STORAGE_KEY) return;
      readConsent(true);
      update();
    };
    update();
    window.addEventListener(CONSENT_CHANGED, update);
    window.addEventListener("storage", storage);
    window.addEventListener("focus", update);
    return () => {
      window.removeEventListener(CONSENT_CHANGED, update);
      window.removeEventListener("storage", storage);
      window.removeEventListener("focus", update);
    };
  }, [pathname]);
  return null;
}
