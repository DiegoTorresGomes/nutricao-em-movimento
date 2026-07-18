"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CONSENT_VERSION,
  type ConsentState,
  readConsent,
  saveConsent,
} from "@/lib/consent";

function buildConsent(analytics: boolean, ads: boolean): ConsentState {
  return {
    necessary: true,
    analytics,
    ads,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [ads, setAds] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Only show the banner if the user hasn't decided yet (or policy changed).
    if (!readConsent()) {
      setVisible(true);
    }
  }, []);

  if (!mounted || !visible) {
    return null;
  }

  function persist(nextAnalytics: boolean, nextAds: boolean) {
    saveConsent(buildConsent(nextAnalytics, nextAds));
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Aviso de cookies"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <div className="mx-auto max-w-3xl rounded-3xl border border-black/10 bg-white p-5 shadow-xl sm:p-6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#556B2F]">
              Sua privacidade
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-700">
              Utilizamos cookies para melhorar sua experiência, analisar o tráfego e, mediante o seu
              consentimento, personalizar anúncios. Você pode aceitar todos ou escolher suas
              preferências. Saiba mais na{" "}
              <Link
                href="/pt/politica-de-cookies"
                className="font-semibold text-[#556B2F] underline"
              >
                Política de Cookies
              </Link>
              .
            </p>
          </div>

          {showPreferences && (
            <div className="space-y-3 rounded-2xl bg-[#FAF8F4] p-4">
              <label className="flex items-start justify-between gap-4 opacity-70">
                <span>
                  <span className="block text-sm font-bold text-[#111111]">Necessários</span>
                  <span className="block text-xs leading-5 text-neutral-600">
                    Essenciais para o funcionamento do site. Sempre ativos.
                  </span>
                </span>
                <input type="checkbox" checked disabled className="mt-1 h-5 w-5 accent-[#556B2F]" />
              </label>

              <label className="flex cursor-pointer items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-bold text-[#111111]">Estatísticas</span>
                  <span className="block text-xs leading-5 text-neutral-600">
                    Ajudam a entender como o site é utilizado (Google Analytics, Microsoft Clarity).
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                  className="mt-1 h-5 w-5 accent-[#556B2F]"
                />
              </label>

              <label className="flex cursor-pointer items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-bold text-[#111111]">Publicidade</span>
                  <span className="block text-xs leading-5 text-neutral-600">
                    Permitem anúncios personalizados (Google AdSense).
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={ads}
                  onChange={(event) => setAds(event.target.checked)}
                  className="mt-1 h-5 w-5 accent-[#556B2F]"
                />
              </label>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            {!showPreferences ? (
              <>
                <button
                  type="button"
                  onClick={() => setShowPreferences(true)}
                  className="order-2 rounded-full border border-black/10 px-5 py-2.5 text-sm font-bold text-[#111111] transition hover:border-[#556B2F] hover:text-[#556B2F] sm:order-1"
                >
                  Personalizar
                </button>
                <button
                  type="button"
                  onClick={() => persist(true, true)}
                  className="order-1 rounded-full bg-[#111111] px-6 py-2.5 text-sm font-bold !text-white transition hover:bg-[#556B2F] sm:order-2"
                >
                  Aceitar
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => persist(false, false)}
                  className="order-3 rounded-full border border-black/10 px-5 py-2.5 text-sm font-bold text-[#111111] transition hover:border-[#556B2F] hover:text-[#556B2F] sm:order-1"
                >
                  Recusar todos
                </button>
                <button
                  type="button"
                  onClick={() => persist(analytics, ads)}
                  className="order-2 rounded-full border border-[#556B2F] px-5 py-2.5 text-sm font-bold text-[#556B2F] transition hover:bg-[#556B2F]/5"
                >
                  Salvar preferências
                </button>
                <button
                  type="button"
                  onClick={() => persist(true, true)}
                  className="order-1 rounded-full bg-[#111111] px-6 py-2.5 text-sm font-bold !text-white transition hover:bg-[#556B2F] sm:order-3"
                >
                  Aceitar todos
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
