import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { nutritionistConfig } from "@/config/nutritionist";
import { ContactExperience } from "./ContactExperience";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com Weverlyn Alves para consultas presenciais e online, parcerias, imprensa ou dúvidas sobre o Nutrição & Movimento.",

  alternates: {
    canonical: "/pt/contato",
  },

  openGraph: {
    title: "Contato | Nutrição & Movimento",
    description:
      "Entre em contato com Weverlyn Alves para consultas presenciais e online, parcerias, imprensa ou dúvidas sobre o Nutrição & Movimento.",
    url: "/pt/contato",
    type: "website",
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
    title: "Contato | Nutrição & Movimento",
    description:
      "Entre em contato com Weverlyn Alves para consultas presenciais e online, parcerias, imprensa ou dúvidas sobre o Nutrição & Movimento.",
    images: ["/images/og/nutricao-em-movimento.jpg"],
  },
};

export default function ContatoPage() {
  const { contact } = nutritionistConfig;

  return (
    <PublicLayout>
      <main>
        {/* 2.1 — Hero de contato */}
        <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 md:pt-20">
          <div className="max-w-3xl">
            <SectionLabel>Contato</SectionLabel>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Vamos conversar?
            </h1>

            <p className="mt-6 text-base leading-8 text-neutral-700 sm:text-lg">
              Entre em contato para consultas, parcerias, imprensa ou dúvidas
              gerais. Sua mensagem será respondida com atenção e clareza.
            </p>

            <p className="mt-5 text-sm font-medium text-neutral-600">
              Tempo médio de resposta: {contact.responseTime.toLowerCase()}.
            </p>
          </div>
        </section>

        <ContactExperience />
      </main>
    </PublicLayout>
  );
}
