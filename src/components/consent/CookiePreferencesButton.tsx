"use client";
import { openConsentPreferences } from "@/lib/consent";
export function CookiePreferencesButton() {
  return <button type="button" onClick={openConsentPreferences} className="text-left transition hover:text-[#E9DCC9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E9DCC9]">Preferências de cookies</button>;
}
