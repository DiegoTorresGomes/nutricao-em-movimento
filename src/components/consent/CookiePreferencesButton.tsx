"use client";
import { useEffect, useState } from "react";
import { openConsentPreferences } from "@/lib/consent";
import { CMP_CHANGED, getCmpState } from "@/lib/google-cmp";
export function CookiePreferencesButton() {
  const [source, setSource] = useState("pending");
  useEffect(() => {
    const update = () => setSource(getCmpState().source);
    update();
    window.addEventListener(CMP_CHANGED, update);
    return () => window.removeEventListener(CMP_CHANGED, update);
  }, []);
  return <div>
    <button type="button" disabled={source === "pending"} onClick={openConsentPreferences} className="text-left transition hover:text-[#E9DCC9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E9DCC9]">{source === "google" ? "Preferências de privacidade Google" : "Preferências de cookies"}</button>
    {source === "pending" && <p className="mt-1 text-xs">Aguardando controles Google. Se indisponíveis, verifique bloqueios do navegador e recarregue.</p>}
  </div>;
}
