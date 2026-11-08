import { clearOptionalCookies, getDefaultConsent, syncGoogleConsentMode, type ConsentState } from "./consent";
type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  __nemAnalyticsLoaded?: boolean;
  __nemAnalyticsPage?: string;
};
export function isPublicPath(pathname: string): boolean {
  return pathname === "/pt" || pathname.startsWith("/pt/");
}
export function hasLoadedAnalytics(): boolean {
  return Boolean((window as AnalyticsWindow).__nemAnalyticsLoaded);
}
export function applyConsentServices(consent: ConsentState | null, gaId: string | undefined): void {
  const current = consent ?? getDefaultConsent();
  const browser = window as AnalyticsWindow;
  const identifier = gaId && /^G-[A-Z0-9]+$/.test(gaId) ? gaId : null;
  syncGoogleConsentMode(current);
  if (identifier) Reflect.set(window, "ga-disable-" + identifier, !current.analytics);
  if (!current.analytics) {
    clearOptionalCookies();
    // Removing a script node cannot undo executed code. A fresh document ends it.
    if (browser.__nemAnalyticsLoaded) window.location.reload();
    return;
  }
  if (!identifier) return;
  if (!document.getElementById("nem-google-analytics")) {
    browser.gtag?.("js", new Date());
    browser.gtag?.("config", identifier, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement("script");
    script.id = "nem-google-analytics";
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + identifier;
    browser.__nemAnalyticsLoaded = true;
    document.head.appendChild(script);
  }
  if (browser.__nemAnalyticsPage !== window.location.href) {
    browser.__nemAnalyticsPage = window.location.href;
    browser.gtag?.("event", "page_view", { page_location: window.location.href });
  }
}
export function leavePublicPage(): void {
  if (!hasLoadedAnalytics()) return;
  syncGoogleConsentMode(getDefaultConsent());
  window.location.reload();
}
