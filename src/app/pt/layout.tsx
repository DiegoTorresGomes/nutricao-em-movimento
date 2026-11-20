import { ADSENSE_CLIENT } from "@/config/monetization";
import Script from "next/script";

/** Scope to public routes; defaults execute in head before hydration loads ads. */
export default function PublicRouteLayout({ children }: { children: React.ReactNode }) {
  return <>
    <Script id="nem-adsense" strategy="afterInteractive" async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`} crossOrigin="anonymous" />
    {children}
  </>;
}
