/** First-party preferences, not a certified CMP or legal proof of consent. */
export const CONSENT_STORAGE_KEY = "nem-consent-v2";
export const CONSENT_COOKIE_NAME = "nem-consent";
export const CONSENT_VERSION = 2;
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
    window.localStorage.removeItem("nem-consent-v1");
  } catch { /* Choice still applies in this document if persistence is blocked. */ }
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = CONSENT_COOKIE_NAME + "=" + encodeURIComponent(JSON.stringify(next)) + "; Max-Age=" + CONSENT_MAX_AGE + "; Path=/; SameSite=Lax" + secure;
  } catch { /* Browser settings can prevent persistence. */ }
  syncGoogleConsentMode(next);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED, { detail: next }));
}
export function openConsentPreferences(): void { window.dispatchEvent(new Event(OPEN_CONSENT)); }
export function syncGoogleConsentMode(consent: ConsentState): void {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  });
}
/** Known optional first-party cookies only; external cookies need browser controls. */
export function clearOptionalCookies(): void {
  const names = document.cookie.split(";").map((entry) => entry.trim().split("=")[0]);
  const parts = window.location.hostname.split(".");
  const domains = ["", ...parts.slice(0, -1).map((_, i) => "; Domain=." + parts.slice(i).join("."))];
  const paths = new Set(["/", ...window.location.pathname.split("/").slice(1).map((_, i, values) => "/" + values.slice(0, i + 1).join("/"))]);
  for (const name of names) {
    if (!/^(_ga($|_)|_gid$|_gat($|_)|__gads$|__gpi$|__eoi$)/.test(name)) continue;
    for (const domain of domains) for (const path of paths) {
      document.cookie = name + "=; Max-Age=0; Path=" + path + domain;
    }
  }
}
