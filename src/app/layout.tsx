import type { Metadata, Viewport } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { ConsentModeInit } from "@/components/analytics/ConsentModeInit";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";
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
  metadataBase: new URL("https://nutricaoemovimento.com"),

  title: {
    default: "Nutrição & Movimento",
    template: "%s | Nutrição & Movimento",
  },

  description:
    "Conteúdos sobre comportamento alimentar, emagrecimento sustentável e Bem-Estar Nutricional para quem busca saúde, constância e equilíbrio sem radicalismos.",

  applicationName: "Nutrição & Movimento",

  authors: [
    {
      name: "Weverlyn da Cruz Alves Torres",
      url: "https://nutricaoemovimento.com/pt/sobre",
    },
  ],

  creator: "Weverlyn da Cruz Alves Torres",
  publisher: "Nutrição & Movimento",

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://nutricaoemovimento.com/pt",
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

        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
            </Script>
          </>
        )}

        {/*
          Google AdSense: carregado exatamente como o snippet oficial do Google,
          via <script> nativo diretamente no <head> — sem next/script e sem
          strategy="afterInteractive" — para que o HTML entregue ao navegador
          seja idêntico ao fornecido pelo AdSense (necessário para verificação
          e crawling do site pelos robôs do Google).
        */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3638053236344020"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body className={`${playfair.variable} ${lato.variable}`}>
        {/* Prepared, inactive until their env vars are set (see docs). */}
        <GoogleTagManager />
        <MicrosoftClarity />
        {children}
      </body>
    </html>
  );
}
