import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { nutritionistConfig } from "@/config/nutritionist";
import { getPublishedPostsCount } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Sobre Weverlyn Alves",
  description:
    "Conheça Weverlyn Alves, nutricionista e autora do Nutrição & Movimento. Ciência, comportamento alimentar e escolhas possíveis para uma vida mais saudável.",

  alternates: {
    canonical: "/pt/sobre",
  },

  openGraph: {
    title: "Sobre Weverlyn Alves | Nutrição & Movimento",
    description:
      "Conheça Weverlyn Alves, nutricionista e autora do Nutrição & Movimento. Ciência, comportamento alimentar e escolhas possíveis para uma vida mais saudável.",
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
    title: "Sobre Weverlyn Alves | Nutrição & Movimento",
    description:
      "Conheça Weverlyn Alves, nutricionista e autora do Nutrição & Movimento. Ciência, comportamento alimentar e escolhas possíveis para uma vida mais saudável.",
    images: ["/images/og/nutricao-em-movimento.jpg"],
  },
};

export default async function SobrePage() {
  const publishedPostsCount = await getPublishedPostsCount();

  const {
    name,
    displayName,
    role,
    crn,
    headline,
    summary,
    photoUrl,
    photoAlt,
    formations,
    themes,
    attendance,
    instagramUrl,
  } = nutritionistConfig;

  // Indicadores editoriais: apenas métricas reais e calculáveis.
  const stats = [
    { value: publishedPostsCount, label: "Artigos publicados" },
    { value: formations.length, label: "Formações acadêmicas" },
    { value: themes.length, label: "Temas editoriais" },
  ];

  // JSON-LD Person — coerente com a Home. Sem CRN inventado, sem
  // medicalSpecialty. knowsAbout reflete os temas realmente exibidos.
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    alternateName: displayName,
    jobTitle: role,
    description: summary,
    image: `https://nutricaoemovimento.com${photoUrl}`,
    url: "https://nutricaoemovimento.com/pt/sobre",
    sameAs: [instagramUrl],
    knowsAbout: themes.map((theme) => theme.title),
    worksFor: {
      "@type": "Organization",
      name: "Nutrição & Movimento",
      url: "https://nutricaoemovimento.com",
    },
  };

  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <main>
        {/* 2.1 — Hero de autoridade */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20">
          <div className="grid gap-10 min-[960px]:grid-cols-[0.9fr_1.1fr] min-[960px]:items-center min-[960px]:gap-14">
            {/* Coluna visual — largura limitada e centralizada para não dominar
                a tela em telas estreitas/tablet; lado a lado a partir de 960px. */}
            <div className="mx-auto w-full max-w-[420px] rounded-[2rem] bg-[#E9DCC9] p-4 sm:max-w-[460px] sm:p-5 min-[960px]:order-1">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-white">
                <Image
                  src={photoUrl}
                  alt={photoAlt}
                  fill
                  priority
                  sizes="(min-width: 640px) 420px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Coluna de conteúdo */}
            <div className="min-[960px]:order-2">
              <SectionLabel>Sobre a nutricionista</SectionLabel>

              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {displayName}
              </h1>

              <p className="mt-4 text-sm font-bold uppercase tracking-[0.25em] text-[#556B2F]">
                {role}
                {crn ? <span className="text-neutral-400"> · {crn}</span> : null}
              </p>

              <p className="mt-2 text-sm font-medium text-neutral-600">
                {attendance.label}
              </p>

              <p className="mt-6 max-w-xl text-xl font-semibold leading-snug text-[#111111] sm:text-2xl">
                {headline}
              </p>

              <p className="mt-5 max-w-xl text-base leading-8 text-neutral-700">
                {summary}
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                {themes.slice(0, 4).map((theme) => (
                  <span
                    key={theme.title}
                    className="rounded-full border border-black/10 bg-[#FAF8F4] px-4 py-2 text-xs font-bold text-neutral-700"
                  >
                    {theme.title}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button href="/pt/contato">Falar com a nutricionista</Button>
                <Button href="/pt/artigos" variant="outline">
                  Ver artigos
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 2.2 — Credenciais / Formação acadêmica */}
        <section className="border-y border-black/5 bg-[#FAF8F4] px-4 py-12 sm:px-6 md:py-14">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-[#556B2F]">
              Formação acadêmica
            </h2>

            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {formations.map((formation) => (
                <li
                  key={formation}
                  className="border-l-2 border-[#556B2F]/40 pl-4 text-base font-semibold leading-6 text-[#111111]"
                >
                  {formation}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2.3 — Áreas de conteúdo e atuação */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20">
          <div className="max-w-3xl">
            <SectionLabel>Áreas de atuação</SectionLabel>
            <h2 className="mt-5 text-3xl font-semibold sm:text-4xl md:text-5xl">
              Temas que orientam este trabalho
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme) => (
              <article
                key={theme.title}
                className="rounded-[1.75rem] bg-[#FAF8F4] p-6"
              >
                <h3 className="text-xl font-semibold text-[#111111]">
                  {theme.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-700">
                  {theme.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* 2.4 — Trajetória e propósito */}
        <section className="border-t border-black/5 bg-white px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:gap-14">
            <div>
              <h2 className="text-2xl font-semibold text-[#111111] sm:text-3xl">
                Uma visão integrada da saúde
              </h2>
              <p className="mt-5 text-base leading-8 text-neutral-700">
                Acredito que a alimentação vai muito além das calorias. Ela se
                conecta ao bem-estar, à prevenção de doenças, ao desempenho
                físico e à construção de hábitos que se sustentam ao longo da
                vida. Minha formação foi construída para compreender a saúde de
                forma ampla e integrada, unindo nutrição, ciência e
                comportamento.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-[#111111] sm:text-3xl">
                Conhecimento que cabe na vida real
              </h2>
              <p className="mt-5 text-base leading-8 text-neutral-700">
                Meu objetivo é transformar conhecimento científico em
                orientações que caibam na rotina, ajudando as pessoas a
                desenvolverem uma relação mais consciente e leve com a
                alimentação e com o próprio corpo. Acredito que o conhecimento é
                uma das ferramentas mais poderosas para promover mudanças
                duradouras.
              </p>
            </div>
          </div>
        </section>

        {/* 2.5 — Indicadores de autoridade (apenas métricas reais) */}
        <section className="border-y border-black/5 bg-[#111111] px-4 py-14 text-white sm:px-6 md:py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="sr-only">Indicadores editoriais</h2>
            <dl className="grid gap-8 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse text-center sm:text-left"
                >
                  <dt className="mt-2 text-sm font-bold uppercase tracking-[0.2em] text-white/70">
                    {stat.label}
                  </dt>
                  <dd className="text-5xl font-semibold tracking-tight text-[#E9DCC9] sm:text-6xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* 2.6 — Sobre o blog */}
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">
          <SectionLabel>O projeto</SectionLabel>
          <h2 className="mt-5 text-3xl font-semibold sm:text-4xl">
            Sobre o Nutrição &amp; Movimento
          </h2>

          <div className="mt-6 space-y-6 text-base leading-8 text-neutral-700">
            <p>
              Criei o Nutrição &amp; Movimento para compartilhar informações
              confiáveis de maneira simples, prática e acessível.
            </p>
            <p>
              Aqui você encontra conteúdos sobre alimentação saudável,
              comportamento alimentar, emagrecimento sustentável, atividade
              física, Bem-Estar Nutricional e qualidade de vida — sempre com o
              propósito de transformar ciência em aplicação cotidiana, incentivar
              escolhas conscientes e apoiar mudanças sustentáveis.
            </p>
          </div>

          <div className="mt-8">
            <Button href="/pt/artigos" variant="olive">
              Explorar artigos
            </Button>
          </div>
        </section>

        {/* 2.7 — Aviso editorial e de saúde */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-20">
          <div className="rounded-[2rem] border border-black/5 bg-[#FAF8F4] p-6 sm:p-8">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">
              Aviso importante
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-700">
              Este espaço possui caráter exclusivamente informativo e educativo.
              As informações publicadas não substituem avaliação, diagnóstico ou
              acompanhamento individualizado realizado por profissionais
              habilitados.
            </p>
            <Link
              href="/pt/disclaimer"
              className="mt-4 inline-flex items-center text-sm font-bold text-[#556B2F] underline underline-offset-4 transition hover:text-[#465a28]"
            >
              Leia o Disclaimer Nutricional
            </Link>
          </div>
        </section>

        {/* 2.8 — CTA final */}
        <section className="border-t border-black/5 bg-white px-4 py-16 sm:px-6 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Informação confiável para escolhas mais conscientes.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-neutral-700">
              Explore os conteúdos do Nutrição &amp; Movimento ou fale
              diretamente com a nutricionista.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/pt/artigos">Explorar artigos</Button>
              <Button href="/pt/contato" variant="outline">
                Entrar em contato
              </Button>
            </div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}
