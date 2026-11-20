import { getCmpState, GOOGLE_STATUS } from "./google-cmp";
/**
 * First-party statistics consent (the site banner is the statistics authority for every visitor).
 * Not a certified CMP and not legal proof of consent. Advertising stays with the Google CMP.
 * v3: statistics asked to every visitor. Older records (v1/v2) are ignored, never upgraded.
 */
export const CONSENT_STORAGE_KEY = "nem-consent-v3";
export const CONSENT_COOKIE_NAME = "nem-consent";
export const CONSENT_VERSION = 3;
const LEGACY_STORAGE_KEYS = ["nem-consent-v1", "nem-consent-v2"];
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180;
export const CONSENT_CHANGED = "nem:consent-changed";
export const OPEN_CONSENT = "nem:open-consent";
export type ConsentState = {
  necessary: true;
  analytics: boolean;
  ads: boolean;
  updatedAt: string;
  version: number;
};
let inMemory: ConsentState | null = null;
export function buildConsent(analytics: boolean): ConsentState {
  return { necessary: true, analytics, ads: false, updatedAt: new Date().toISOString(), version: CONSENT_VERSION };
}
export function getDefaultConsent(): ConsentState { return buildConsent(false); }
function parseConsent(raw: string | null): ConsentState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ConsentState>;
    const age = Date.now() - Date.parse(value.updatedAt ?? "");
    if (value.version !== CONSENT_VERSION || value.necessary !== true ||
      typeof value.analytics !== "boolean" || typeof value.ads !== "boolean" ||
      !Number.isFinite(age) || age < 0 || age >= CONSENT_MAX_AGE * 1000) return null;
    return { ...value, ads: false } as ConsentState;
  } catch { return null; }
}
/** fresh=true re-reads storage after a cross-tab change, including deletion. */
export function readConsent(fresh = false): ConsentState | null {
  if (typeof window === "undefined") return null;
  if (fresh) inMemory = null;
  const memory = parseConsent(JSON.stringify(inMemory));
  if (memory) return memory;
  try {
    const stored = parseConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
    if (stored) return stored;
  } catch { /* Cookie fallback supports blocked localStorage. */ }
  try {
    const cookie = document.cookie.split("; ").find((part) => part.startsWith(CONSENT_COOKIE_NAME + "="));
    return parseConsent(cookie ? decodeURIComponent(cookie.slice(CONSENT_COOKIE_NAME.length + 1)) : null);
  } catch { return null; }
}
export function saveConsent(consent: ConsentState): void {
  if (typeof window === "undefined") return;
  const next = parseConsent(JSON.stringify(consent));
  if (!next) return;
  inMemory = next;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    for (const key of LEGACY_STORAGE_KEYS) window.localStorage.removeItem(key);
  } catch { /* Choice still applies in this document if persistence is blocked. */ }
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = CONSENT_COOKIE_NAME + "=" + encodeURIComponent(JSON.stringify(next)) + "; Max-Age=" + CONSENT_MAX_AGE + "; Path=/; SameSite=Lax" + secure;
  } catch { /* Browser settings can prevent persistence. */ }
  syncGoogleConsentMode(next);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED, { detail: next }));
}
export function openConsentPreferences(): void { window.dispatchEvent(new Event(OPEN_CONSENT)); }
export type AnalyticsDecision = {
  /** GA4 may load and send hits. */
  allowed: boolean;
  /** An explicit "no" (site banner, or Google DENIED while it still collects the analytics purpose). */
  explicitDenial: boolean;
  /** Local "yes" held while an applicable Google CMP has not answered the analytics purpose yet. */
  suspended: boolean;
};
/**
 * Statistics need an explicit local "yes". The Google CMP can only restrict:
 * - DENIED (2) wins over a local "yes" while the panel's analytics purpose is enabled;
 * - an applicable Google CMP that has not answered yet (UNKNOWN/unread) is never an authorization;
 * - GRANTED (1) alone never authorizes; NOT_APPLICABLE (3) / NOT_CONFIGURED (4) leave the site in charge.
 * No timeout, language, IP or geography is involved: without the Google CMP, the site decides.
 */
export function analyticsDecision(consent: ConsentState | null): AnalyticsDecision {
  const cmp = getCmpState();
  const local = consent?.analytics === true;
  const googleDenied = cmp.analytics === GOOGLE_STATUS.DENIED;
  const googlePending = cmp.api && cmp.gdprApplies !== false && (cmp.analytics === undefined || cmp.analytics === GOOGLE_STATUS.UNKNOWN);
  return {
    allowed: local && !googleDenied && !googlePending,
    explicitDenial: consent?.analytics === false || googleDenied,
    suspended: local && !googleDenied && googlePending,
  };
}
type ConsentArgs = { 0?: unknown; 1?: unknown; 2?: Record<string, unknown> };
/** analytics_storage as currently queued for Google tags (last default/update in dataLayer). */
function queuedAnalyticsSignal(): unknown {
  const queue = (window as unknown as { dataLayer?: ConsentArgs[] }).dataLayer;
  if (!Array.isArray(queue)) return undefined;
  let value: unknown;
  for (const entry of queue) {
    if (entry && entry[0] === "consent" && (entry[1] === "default" || entry[1] === "update") && entry[2] && "analytics_storage" in entry[2]) value = entry[2].analytics_storage;
  }
  return value;
}
/**
 * Sends analytics_storage only (never ad_* signals) and only when the queued value differs, so the
 * site re-asserts its decision after any other writer and never issues redundant updates.
 */
export function syncGoogleConsentMode(consent: ConsentState | null): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  const value = analyticsDecision(consent).allowed ? "granted" : "denied";
  if (queuedAnalyticsSignal() === value) return;
  gtag("consent", "update", { analytics_storage: value });
}
/** Known optional first-party cookies only; external cookies need browser controls. */
export function clearOptionalCookies(): void {
  const names = document.cookie.split(";").map((entry) => entry.trim().split("=")[0]);
  const parts = window.location.hostname.split(".");
  const domains = ["", ...parts.slice(0, -1).map((_, i) => "; Domain=." + parts.slice(i).join("."))];
  const paths = new Set(["/", ...window.location.pathname.split("/").slice(1).map((_, i, values) => "/" + values.slice(0, i + 1).join("/"))]);
  for (const name of names) {
    if (!/^(_ga($|_)|_gid$|_gat($|_))/.test(name)) continue;
    for (const domain of domains) for (const path of paths) {
      document.cookie = name + "=; Max-Age=0; Path=" + path + domain;
    }
  }
}
