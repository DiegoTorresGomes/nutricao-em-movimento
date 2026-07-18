/**
 * Google Consent Mode v2 — default state.
 *
 * Sets every non-essential storage to "denied" BEFORE any Google tag loads,
 * so nothing is collected until the visitor grants consent in the cookie
 * banner (which then calls gtag('consent','update', ...) — see lib/consent.ts).
 *
 * Rendered as a plain inline <head> script (Google's recommended pattern) so it
 * executes synchronously before the GTM/GA loaders. Renders only when at least
 * one Google/Microsoft tool is configured via env, so today (no env set) it
 * emits nothing. To activate: define NEXT_PUBLIC_GTM_ID (and/or NEXT_PUBLIC_GA_ID
 * / NEXT_PUBLIC_CLARITY_ID). See docs/analytics-and-consent.md.
 */
export function ConsentModeInit() {
  const hasAnalytics = Boolean(
    process.env.NEXT_PUBLIC_GTM_ID ||
      process.env.NEXT_PUBLIC_GA_ID ||
      process.env.NEXT_PUBLIC_CLARITY_ID
  );

  if (!hasAnalytics) {
    return null;
  }

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'denied',
            wait_for_update: 500
          });
        `,
      }}
    />
  );
}
