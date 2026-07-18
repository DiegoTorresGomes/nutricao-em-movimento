import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/PublicLayout";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça Weverlyn Alves, nutricionista, e a proposta do Nutrição & Movimento: ciência, acolhimento e constância para escolhas mais conscientes.",

  alternates: {
    canonical: "/pt/sobre",
  },

  openGraph: {
    title: "Sobre | Nutrição & Movimento",
    description:
      "Conheça Weverlyn Alves, nutricionista, e a proposta do Nutrição & Movimento: ciência, acolhimento e constância para escolhas mais conscientes.",
    url: "/pt/sobre",
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
    title: "Sobre | Nutrição & Movimento",
    description:
      "Conheça Weverlyn Alves, nutricionista, e a proposta do Nutrição & Movimento: ciência, acolhimento e constância para escolhas mais conscientes.",
    images: ["/images/og/nutricao-em-movimento.jpg"],
  },
};

export default function SobrePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#556B2F]">
          Sobre
        </p>

        <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Nutrição com ciência, acolhimento e constância.
        </h1>

        <div className="mt-8 max-w-3xl space-y-6 text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
          <p>
            Olá! Sou Weverlyn Alves, nutricionista apaixonada por ciência,
            alimentação e pela forma como pequenas escolhas diárias podem
            impactar a saúde e a qualidade de vida.
          </p>

          <p>
            Acredito que a alimentação vai muito além das calorias. Ela está
            diretamente relacionada ao bem-estar, à prevenção de doenças, ao
            desempenho físico e à construção de hábitos sustentáveis ao longo da
            vida.
          </p>

          <p>
            Minha trajetória acadêmica foi construída com o objetivo de
            compreender a saúde de forma ampla e integrada.
          </p>
        </div>

        <section className="mt-10 rounded-[1.75rem] bg-[#FAF8F4] p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">Formação acadêmica</h2>

          <ul className="mt-5 grid gap-3 text-base leading-7 text-neutral-700 sm:grid-cols-2">
            <li>• Bacharel em Nutrição</li>
            <li>• Pós-graduação em Engenharia de Alimentos</li>
            <li>• Bacharel em Biomedicina</li>
            <li>• Pós-graduação em Estética</li>
          </ul>
        </section>

        <section className="mt-10 max-w-3xl space-y-6 text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
          <h2 className="text-2xl font-semibold text-[#111111]">
            Sobre o Nutrição & Movimento
          </h2>

          <p>
            Criei o Nutrição & Movimento com o propósito de compartilhar
            informações confiáveis de maneira simples, prática e acessível.
          </p>

          <p>
            Aqui você encontrará conteúdos sobre alimentação saudável,
            comportamento alimentar, emagrecimento sustentável, atividade física,
            Bem-Estar Nutricional, qualidade de vida, ciência e saúde.
          </p>

          <p>
            Meu objetivo é transformar conhecimento científico em informações
            que possam ser aplicadas no dia a dia, ajudando as pessoas a
            desenvolverem uma relação mais consciente com a alimentação e com o
            próprio corpo.
          </p>

          <p>
            Acredito que o conhecimento é uma das ferramentas mais poderosas
            para promover mudanças duradouras e melhorar a qualidade de vida.
          </p>
        </section>

        <section className="mt-10 rounded-[1.75rem] border border-black/5 bg-white p-6 text-sm leading-7 text-neutral-700 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold text-[#111111]">Importante</h2>

          <p className="mt-4">
            Este espaço possui caráter exclusivamente informativo e educativo.
            As informações aqui publicadas não substituem avaliação, diagnóstico
            ou acompanhamento individualizado realizado por profissionais
            habilitados.
          </p>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-semibold">Seja bem-vindo(a)!</h2>

          <p className="mt-4 text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
            Espero que este conteúdo contribua para sua jornada de aprendizado e
            para escolhas cada vez mais conscientes no dia a dia.
          </p>
        </section>
      </main>
    </PublicLayout>
  );
}

