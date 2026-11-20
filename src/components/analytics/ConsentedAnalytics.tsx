"use client";
import { useEffect } from "react";
import { CONSENT_CHANGED, CONSENT_STORAGE_KEY, readConsent } from "@/lib/consent";
import { applyConsentServices } from "@/lib/consent-services";
import { CMP_CHANGED, startGoogleCmp } from "@/lib/google-cmp";
/** Mounted only by PublicLayout. One direct GA loader, gated by consent; no manual page_view. */
export function ConsentedAnalytics() {
  useEffect(() => {
    const update = () => applyConsentServices(readConsent(), process.env.NEXT_PUBLIC_GA_ID);
    const storage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== CONSENT_STORAGE_KEY) return;
      readConsent(true);
      update();
    };
    window.addEventListener(CMP_CHANGED, update);
    startGoogleCmp();
    update();
    window.addEventListener(CONSENT_CHANGED, update);
    window.addEventListener("storage", storage);
    window.addEventListener("focus", update);
    return () => {
      window.removeEventListener(CMP_CHANGED, update);
      window.removeEventListener(CONSENT_CHANGED, update);
      window.removeEventListener("storage", storage);
      window.removeEventListener("focus", update);
    };
  }, []);
  return null;
}
