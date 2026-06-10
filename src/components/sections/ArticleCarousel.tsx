"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

type CarouselArticle = {
  slug: string;
  title: string;
  description: string;
  coverImage?: string | null;
  views?: number;
  category: {
    name: string;
  };
};

type ArticleCarouselProps = {
  articles: CarouselArticle[];
};

export function ArticleCarousel({ articles }: ArticleCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  if (articles.length === 0) {
    return null;
  }

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
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] shadow-sm transition hover:border-[#556B2F] hover:text-[#556B2F]"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              aria-label="Próximos artigos"
              onClick={() => scrollCarousel("right")}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] shadow-sm transition hover:border-[#556B2F] hover:text-[#556B2F]"
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
            <ArticleCard
              key={article.slug}
              slug={article.slug}
              title={article.title}
              description={article.description}
              category={article.category.name}
              coverImage={article.coverImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}