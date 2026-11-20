"use client";
import { useEffect, useState } from "react";
import { openConsentPreferences } from "@/lib/consent";
import { CMP_CHANGED, getCmpState, reopenGoogleCmp } from "@/lib/google-cmp";
const linkStyle = "block text-left transition hover:text-[#E9DCC9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E9DCC9]";
/**
 * One control per purpose: statistics (site banner) is always available; advertising privacy
 * (Google message) appears only when the Google CMP is present on the page.
 */
export function CookiePreferencesButton() {
  const [googleCmp, setGoogleCmp] = useState(false);
  useEffect(() => {
    const update = () => setGoogleCmp(getCmpState().api);
    update();
    window.addEventListener(CMP_CHANGED, update);
    return () => window.removeEventListener(CMP_CHANGED, update);
  }, []);
  return <div>
    <button type="button" onClick={openConsentPreferences} className={linkStyle}>Preferências de cookies</button>
    {googleCmp && <button type="button" onClick={reopenGoogleCmp} className={linkStyle + " mt-1"}>Privacidade e publicidade (Google)</button>}
  </div>;
}
