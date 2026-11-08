import type { Metadata, Viewport } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import { ConsentModeInit } from "@/components/analytics/ConsentModeInit";
import { ConsentNavigationGuard } from "@/components/analytics/ConsentNavigationGuard";
import { ADSENSE_CLIENT } from "@/config/monetization";
import { siteConfig } from "@/config/site";
import { nutritionistConfig } from "@/config/nutritionist";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Consent Mode v2 defaults must run before any tag (see docs). */}
        <ConsentModeInit />
      </head>

      <body className={`${playfair.variable} ${lato.variable}`}>
        <ConsentNavigationGuard />
        {children}
      </body>
    </html>
  );
}
