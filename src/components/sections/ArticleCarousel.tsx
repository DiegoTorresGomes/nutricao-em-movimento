"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

const articles = [
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
  {
    category: "Hábitos e rotina",
    title: "Como organizar sua alimentação sem viver de marmita sem graça",
    description:
      "Pequenas decisões de rotina podem facilitar escolhas melhores sem transformar sua vida em dieta.",
  },
  {
    category: "Saúde mental e alimentação",
    title: "Quando a ansiedade aparece no prato",
    description:
      "Uma reflexão sobre emoções, alimentação e estratégias para reduzir culpa e automatismos.",
  },
];

export function ArticleCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  function scrollCarousel(direction: "left" | "right") {
    if (!carouselRef.current) return;

    const scrollAmount = 380;

    carouselRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <section className="bg-[#FAF8F4] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>Carrossel editorial</SectionLabel>

            <h2 className="mt-5 text-3xl font-semibold sm:text-4xl md:text-5xl">
              Conteúdos para continuar lendo.
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Artigos anteriores"
              onClick={() => scrollCarousel("left")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] shadow-sm transition hover:border-[#556B2F] hover:text-[#556B2F]"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              aria-label="Próximos artigos"
              onClick={() => scrollCarousel("right")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] shadow-sm transition hover:border-[#556B2F] hover:text-[#556B2F]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-2"
        >
          {articles.map((article) => (
            <ArticleCard key={article.title} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
}