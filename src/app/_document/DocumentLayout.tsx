import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import localFont from "next/font/local";
import { CONSENT_DEFAULT_SCRIPT } from "@/components/analytics/ConsentModeInit";
import { AdSenseHeadScript } from "@/components/analytics/AdSenseHeadScript";
import { ConsentNavigationGuard } from "@/components/analytics/ConsentNavigationGuard";
import { ADSENSE_CLIENT } from "@/config/monetization";
import { siteConfig } from "@/config/site";
import { nutritionistConfig } from "@/config/nutritionist";
import "../globals.css";

const playfair = localFont({
  src: "../fonts/PlayfairDisplay-Variable.woff2",
  variable: "--font-playfair",
  weight: "500 700",
  style: "normal",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: "Nutrição & Movimento",
    template: "%s | Nutrição & Movimento",
  },

  description:
    "Conteúdos sobre comportamento alimentar, emagrecimento sustentável e Bem-Estar Nutricional para quem busca saúde, constância e equilíbrio sem radicalismos.",

  applicationName: "Nutrição & Movimento",
  other: { "google-adsense-account": ADSENSE_CLIENT },

  authors: [
    {
      name: nutritionistConfig.name,
      url: nutritionistConfig.authorUrl,
    },
  ],

  creator: nutritionistConfig.name,
  publisher: "Nutrição & Movimento",

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: `${siteConfig.url}/pt`,
    siteName: "Nutrição & Movimento",
    title: "Nutrição & Movimento",
    description:
      "Nutrição real para uma vida em movimento. Conteúdos sobre comportamento alimentar, emagrecimento sustentável e Bem-Estar Nutricional.",
    images: [
      {
        url: "/images/og/nutricao-em-movimento.jpg",
        width: 1200,
        height: 630,
        alt: "Nutrição & Movimento",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Nutrição & Movimento",
    description:
      "Nutrição real para uma vida em movimento. Conteúdos sobre comportamento alimentar, emagrecimento sustentável e Bem-Estar Nutricional.",
    images: ["/images/og/nutricao-em-movimento.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "/pt",
    types: {
      "application/rss+xml": [
        {
          url: "/feed.xml",
          title: "Nutrição & Movimento — Artigos",
        },
      ],
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#556B2F",
};

export default function DocumentLayout({
  children,
  adsense = false,
}: {
  children: React.ReactNode;
  adsense?: boolean;
}) {
  return (
    <html lang="pt-BR">
      {/* Never set innerHTML on <head>: a client re-render would wipe React-managed stylesheets. */}
      <head>
        {/*
          Hydration anchor (React #418 fix). adsbygoogle.js inserts show_ads_impl.js, without an
          async attribute, before the document's first <script> (Next's chunk scripts, which precede
          these children). While hydrating <head>, React 19 skips foreign nodes of a different tag
          but would claim that foreign <script> as the consent script below. A first hydratable
          element of another tag makes React skip past it. Inert: renders nothing, loads nothing.
        */}
        <noscript data-nem-hydration-anchor="" />
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT_SCRIPT }} />
        {adsense && <AdSenseHeadScript />}
      </head>

      <body className={`${playfair.variable} ${lato.variable}`}>
        <ConsentNavigationGuard />
        {children}
      </body>
    </html>
  );
}
