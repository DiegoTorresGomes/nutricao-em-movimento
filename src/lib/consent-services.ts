import { analyticsDecision, clearOptionalCookies, syncGoogleConsentMode, type ConsentState } from "./consent";
type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  __nemAnalyticsLoaded?: boolean;
};
export function isPublicPath(pathname: string): boolean {
  return pathname === "/pt" || pathname.startsWith("/pt/");
}
export function hasLoadedAnalytics(): boolean {
  return Boolean((window as AnalyticsWindow).__nemAnalyticsLoaded || document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]'));
}
export function applyConsentServices(consent: ConsentState | null, gaId: string | undefined): void {
  const { allowed, explicitDenial } = analyticsDecision(consent);
  const browser = window as AnalyticsWindow;
  const identifier = gaId && /^G-[A-Z0-9]+$/.test(gaId) ? gaId : null;
  syncGoogleConsentMode(consent);
  // Documented GA opt-out flag: stops hits immediately, also while a decision is only suspended.
  if (identifier) Reflect.set(window, "ga-disable-" + identifier, !allowed);
  if (!allowed) {
    // F2: only an explicit "no" removes _ga cookies. No decision, a suspended decision, navigation,
    // focus, reload or a CMP still loading never delete the visitor identifier.
    if (explicitDenial) {
      clearOptionalCookies();
      // Removing a script node cannot undo executed code. A fresh document ends it.
      if (browser.__nemAnalyticsLoaded) window.location.reload();
    }
    return;
  }
  if (!identifier) return;
  if (!document.getElementById("nem-google-analytics")) {
    browser.gtag?.("js", new Date());
    // Single page_view source: config sends the landing page; client-side navigations are sent
    // by GA4 enhanced measurement ("page changes based on browser history events").
    browser.gtag?.("config", identifier, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement("script");
    script.id = "nem-google-analytics";
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + identifier;
    browser.__nemAnalyticsLoaded = true;
    document.head.appendChild(script);
  }
}
export function leavePublicPage(): void {
  if (!hasLoadedAnalytics()) return;
  syncGoogleConsentMode(null);
  window.location.reload();
}
