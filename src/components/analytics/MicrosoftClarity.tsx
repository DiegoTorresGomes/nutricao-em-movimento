import Script from "next/script";

/**
 * Microsoft Clarity — prepared, inactive by default.
 *
 * Loads only when NEXT_PUBLIC_CLARITY_ID is set. Clarity is an analytics tool,
 * so in production it should be triggered through GTM under the "analytics"
 * consent category (Consent Mode) rather than loaded unconditionally. This
 * env-gated component exists so the integration point is ready and documented.
 * See docs/analytics-and-consent.md.
 */
export function MicrosoftClarity() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  if (!clarityId) {
    return null;
  }

  return (
    <Script id="ms-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityId}");
      `}
    </Script>
  );
}
