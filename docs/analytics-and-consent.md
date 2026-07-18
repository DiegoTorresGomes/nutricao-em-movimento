# Analytics, Consent Mode & Cookie Banner

This project ships **privacy-first**: with no environment variables set, **zero
third-party scripts load** and **no analytics/ads cookies are created**. Only a
first-party consent preference is stored in `localStorage` (functional, not
tracking). Everything below is prepared and gated — activate only when ready.

## Architecture

| Piece | File | Behavior |
|-------|------|----------|
| Consent state + Consent Mode bridge | `src/lib/consent.ts` | Reads/writes the user's choice; `syncGoogleConsentMode()` calls `gtag('consent','update',…)` **only if** a Google tag is loaded. |
| Cookie banner (Aceitar / Personalizar / Política) | `src/components/consent/CookieConsent.tsx` | Rendered in `PublicLayout`. Persists the choice; never reappears after a decision (until policy `CONSENT_VERSION` bumps). Fixed-position → no CLS. |
| Consent Mode v2 defaults | `src/components/analytics/ConsentModeInit.tsx` | Sets all non-essential storage to `denied` **before** any tag. Renders only if an analytics env var exists. |
| Google Tag Manager | `src/components/analytics/GoogleTagManager.tsx` | Loads only if `NEXT_PUBLIC_GTM_ID` is set. |
| Microsoft Clarity | `src/components/analytics/MicrosoftClarity.tsx` | Loads only if `NEXT_PUBLIC_CLARITY_ID` is set. |
| Google Analytics (legacy direct) | `src/app/layout.tsx` | Loads only if `NEXT_PUBLIC_GA_ID` is set. Prefer loading GA4 **through GTM**. |
| Google AdSense | `src/app/layout.tsx` | Native `<script>` in `<head>`, hardcoded `client=ca-pub-3638053236344020`, matching the official AdSense snippet byte-for-byte (no `next/script`, no `afterInteractive`) so it ships in the initial SSR HTML for Google verification/crawling. |

## Consent flow (Consent Mode v2)

1. `ConsentModeInit` sets defaults: `ad_storage`, `ad_user_data`,
   `ad_personalization`, `analytics_storage` = **denied** (with `wait_for_update`).
2. The banner captures the choice and `saveConsent()` calls
   `gtag('consent','update', …)` granting only the accepted categories.
3. Tags loaded via GTM read these signals and behave accordingly.

## How to activate (when ready)

Add the relevant variables to `.env` (and the Hostinger environment), then redeploy:

```dotenv
# Recommended: load GA4 + AdSense + Clarity through GTM
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"

# Or GA4 directly (without GTM)
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Google AdSense: no env var — the official snippet is hardcoded in
# src/app/layout.tsx (client=ca-pub-3638053236344020). Change it there.

# Microsoft Clarity
NEXT_PUBLIC_CLARITY_ID="xxxxxxxxxx"
```

Recommended production setup: configure **GTM** and add GA4, AdSense and Clarity
as tags **inside GTM**, each triggered by the matching Consent Mode signal
(`analytics_storage` for GA4/Clarity, `ad_storage`/`ad_personalization` for
AdSense). This keeps a single consent source of truth.

## Newsletter e-mail (Double Opt-in)

The confirmation e-mail is sent through `src/lib/newsletter/send-confirmation.ts`.
Until an e-mail provider is configured it **does not send** — it logs the
confirmation URL server-side (dev) and returns. To activate, set the provider
env vars and implement the send inside that file (integration point is marked
with a `TODO`). See that file's comments for the expected variables.
