import type { Metadata } from "next";
import { Lato, Playfair_Display } from "next/font/google";
import Script from "next/script";
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
    default: "Nutrição em Movimento",
    template: "%s | Nutrição em Movimento",
  },

  description:
    "Conteúdos sobre comportamento alimentar, emagrecimento sustentável e nutrição esportiva para quem busca saúde, constância e equilíbrio sem radicalismos.",

  applicationName: "Nutrição em Movimento",

  authors: [
    {
      name: "Weverlyn da Cruz Alves Torres",
      url: "https://nutricaoemovimento.com/pt/sobre",
    },
  ],

  creator: "Weverlyn da Cruz Alves Torres",
  publisher: "Nutrição em Movimento",

  alternates: {
    canonical: "/pt",
  },

  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://nutricaoemovimento.com/pt",
    siteName: "Nutrição em Movimento",
    title: "Nutrição em Movimento",
    description:
      "Nutrição real para uma vida em movimento. Conteúdos sobre comportamento alimentar, emagrecimento sustentável e nutrição esportiva.",
    images: [
      {
        url: "/images/og/nutricao-em-movimento.jpg",
        width: 1200,
        height: 630,
        alt: "Nutrição em Movimento",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Nutrição em Movimento",
    description:
      "Nutrição real para uma vida em movimento. Conteúdos sobre comportamento alimentar, emagrecimento sustentável e nutrição esportiva.",
    images: ["/images/og/nutricao-em-movimento.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
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
      </head>

      <body className={`${playfair.variable} ${lato.variable}`}>{children}</body>
    </html>
  );
}
