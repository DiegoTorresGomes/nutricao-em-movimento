"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { buildConsent, CONSENT_CHANGED, CONSENT_STORAGE_KEY, OPEN_CONSENT, readConsent, saveConsent } from "@/lib/consent";

import { CMP_CHANGED, getCmpState } from "@/lib/google-cmp";

type PanelProps = {
  preferences: boolean;
  analytics: boolean;
  onAnalytics: (value: boolean) => void;
  onPreferences: () => void;
  onSave: (analytics: boolean) => void;
  onClose?: () => void;
};
const buttonStyle = "rounded-full border border-[#556B2F] bg-white px-5 py-2.5 text-sm font-bold text-[#111111] hover:bg-[#FAF8F4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#556B2F]";

/** Presentational panel kept separate so actual buttons can be exercised without third-party services. */
export function CookieConsentPanel({ preferences, analytics, onAnalytics, onPreferences, onSave, onClose }: PanelProps) {
  return <div role="dialog" aria-modal="false" aria-labelledby="cookie-consent-title" className="fixed inset-x-0 bottom-0 z-[60] max-h-[90dvh] overflow-y-auto px-3 pb-3 sm:px-4 sm:pb-4">
    <div className="mx-auto max-w-3xl rounded-3xl border border-black/10 bg-white p-5 shadow-xl sm:p-6">
      <h2 id="cookie-consent-title" tabIndex={-1} className="text-sm font-bold uppercase tracking-[0.22em] text-[#556B2F]">Sua privacidade</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-700">Usamos armazenamento necessário para lembrar sua decisão. Com sua permissão, usamos o Google Analytics para estatísticas de uso do site; sem ela, nada é medido. Este aviso trata apenas de estatísticas e não autoriza publicidade: as escolhas de publicidade são feitas na mensagem do Google, quando exibida. Você pode mudar sua escolha a qualquer momento em “Preferências de cookies”, no rodapé. <Link href="/pt/politica-de-cookies" className="font-semibold text-[#556B2F] underline">Política de Cookies</Link>.</p>
      {preferences && <div className="mt-4 space-y-3 rounded-2xl bg-[#FAF8F4] p-4">
        <label className="flex items-start justify-between gap-4"><span><strong className="block text-sm">Necessários</strong><span className="block text-xs leading-5">Lembram sua decisão e mantêm funções essenciais. Sempre ativos.</span></span><input type="checkbox" checked disabled className="mt-1 h-5 w-5 accent-[#556B2F]" /></label>
        <label className="flex cursor-pointer items-start justify-between gap-4"><span><strong className="block text-sm">Estatísticas</strong><span className="block text-xs leading-5">Google Analytics, para medir visitas e uso das páginas. Desativado até você aceitar.</span></span><input type="checkbox" checked={analytics} onChange={(event) => onAnalytics(event.target.checked)} className="mt-1 h-5 w-5 accent-[#556B2F]" /></label>
        <p className="text-xs leading-5">Publicidade: o Google AdSense e a mensagem do Google têm controles próprios. Este painel altera apenas Estatísticas.</p>
      </div>}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
        <button type="button" className={buttonStyle} onClick={() => onSave(false)}>Recusar estatísticas</button>
        <button type="button" className={buttonStyle} onClick={preferences ? () => onSave(analytics) : onPreferences}>{preferences ? "Salvar preferências" : "Gerenciar preferências"}</button>
        <button type="button" className={buttonStyle} onClick={() => onSave(true)}>Aceitar estatísticas</button>
        {onClose && <button type="button" className={buttonStyle} onClick={onClose}>Fechar sem alterar</button>}
      </div>
    </div>
  </div>;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [preferences, setPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const decision = readConsent();
    // Shown to every visitor without a decision, independently of the Google CMP; it only
    // steps aside while the Google message is open, so the two interfaces never overlap.
    setVisible(!decision && !getCmpState().uiShown);
    setAnalytics(decision?.analytics ?? false);
    const reopen = () => {
      const current = readConsent();
      opener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setAnalytics(current?.analytics ?? false);
      setCanClose(Boolean(current));
      setPreferences(true);
      setVisible(true);
    };
    const changed = () => setVisible(false);
    const storage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== CONSENT_STORAGE_KEY) return;
      const current = readConsent(true);
      setAnalytics(current?.analytics ?? false);
      setVisible(!current && !getCmpState().uiShown);
    };
    const cmpChanged = () => {
      if (getCmpState().uiShown) setVisible(false);
      else if (!readConsent()) setVisible(true);
    };
    window.addEventListener(CMP_CHANGED, cmpChanged);
    window.addEventListener(OPEN_CONSENT, reopen);
    window.addEventListener(CONSENT_CHANGED, changed);
    window.addEventListener("storage", storage);
    return () => {
      window.removeEventListener(CMP_CHANGED, cmpChanged);
      window.removeEventListener(OPEN_CONSENT, reopen);
      window.removeEventListener(CONSENT_CHANGED, changed);
      window.removeEventListener("storage", storage);
    };
  }, []);
  useEffect(() => {
    if (visible && preferences) document.getElementById("cookie-consent-title")?.focus();
  }, [visible, preferences]);
  if (!visible) return null;
  const close = () => { setVisible(false); opener.current?.focus(); };
  return <CookieConsentPanel preferences={preferences} analytics={analytics} onAnalytics={setAnalytics} onPreferences={() => setPreferences(true)} onSave={(value) => { saveConsent(buildConsent(value)); close(); }} onClose={canClose ? close : undefined} />;
}
