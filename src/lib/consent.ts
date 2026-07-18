/**
 * First-party cookie/consent state model (LGPD + Google Consent Mode v2).
 *
 * The user's choice is stored in localStorage as a functional/necessary
 * preference — it is NOT a tracking cookie and is set regardless of consent so
 * we can remember not to show the banner again. No analytics/ads cookies are
 * ever set until the corresponding category is granted here.
 */

export const CONSENT_STORAGE_KEY = "nem-consent-v1";
/** First-party cookie mirror so the SERVER can read the choice (future SSR gating). */
export const CONSENT_COOKIE_NAME = "nem-consent";
export const CONSENT_VERSION = 1;
/** 6 months, in seconds. */
const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export type ConsentState = {
  /** Strictly necessary — always true, cannot be disabled. */
  necessary: true;
  /** Analytics (Google Analytics, Microsoft Clarity). */
  analytics: boolean;
  /** Advertising (Google AdSense personalization). */
  ads: boolean;
  /** ISO timestamp of the decision (LGPD proof of consent). */
  updatedAt: string;
  version: number;
};

/** Default state before any decision: only necessary is on. */
export function getDefaultConsent(): ConsentState {
  return {
    necessary: true,
    analytics: false,
    ads: false,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
}

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ConsentState;
    // Invalidate stored consent if the policy version changed.
    if (parsed.version !== CONSENT_VERSION) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(consent: ConsentState): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Storage may be unavailable (private mode); the banner will reappear.
  }

  writeConsentCookie(consent);
  syncGoogleConsentMode(consent);
}

/**
 * Mirrors the choice into a first-party, non-HttpOnly cookie so a future
 * Server Component / middleware can read consent at render time (e.g. decide
 * server-side whether to inject a tag) without changing today's client flow.
 * Compact value keeps request headers small (CWV-friendly): "v1:a1:ads0".
 */
function writeConsentCookie(consent: ConsentState): void {
  if (typeof document === "undefined") return;

  const value = `v${consent.version}:a${consent.analytics ? 1 : 0}:ads${consent.ads ? 1 : 0}`;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";

  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; Max-Age=${CONSENT_COOKIE_MAX_AGE}; Path=/; SameSite=Lax${secure}`;
}

/**
 * Google Consent Mode v2 bridge. If (and only if) a Google tag has been loaded
 * (window.gtag defined — see the gated analytics components), this propagates
 * the user's choice. With no Google tag active it is a safe no-op.
 */
export function syncGoogleConsentMode(consent: ConsentState): void {
  if (typeof window === "undefined") return;

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;

  gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.ads ? "granted" : "denied",
    ad_user_data: consent.ads ? "granted" : "denied",
    ad_personalization: consent.ads ? "granted" : "denied",
  });
}
