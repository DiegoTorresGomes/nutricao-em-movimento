import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

const featuredArticles = [
  {
    category: "Comportamento alimentar",
    title: "Como diferenciar fome física de fome emocional",
    description:
      "Entenda os sinais do corpo e da mente para construir uma relação mais consciente com a comida.",
  },
  {
    category: "Emagrecimento sustentável",
    title: "Por que dietas restritivas falham com tanta frequência?",
    description:
      "A constância nasce de estratégias possíveis, não de regras extremas que não cabem na rotina.",
  },
  {
    category: "Nutrição esportiva",
    title: "O que comer antes do treino para ter mais energia?",
    description:
      "Aprenda princípios simples para melhorar sua disposição sem complicar sua alimentação.",
  },
];

export function FeaturedArticles() {
  return (
    <section className="px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>Últimos artigos</SectionLabel>

            <h2 className="mt-5 text-3xl font-semibold sm:text-4xl md:text-5xl">
              Leituras para começar hoje.
            </h2>
          </div>

          <Button href="/pt/artigos" variant="outline">
            Ver todos os artigos
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {featuredArticles.map((article) => (
            <article
              key={article.title}
              className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="h-48 bg-[#E9DCC9]" />

              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D67A5A]">
                  {article.category}
                </p>

                <h3 className="mt-4 text-2xl font-semibold leading-tight">
                  {article.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-700">
                  {article.description}
                </p>

                <a
                  href="/pt/artigos"
                  className="mt-6 inline-flex text-sm font-bold text-[#556B2F]"
                >
                  Ler artigo
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}