"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatShortDate } from "./format";
import { usePrefersReducedMotion } from "./hooks";
import type { ArticleListItem } from "@/lib/posts";

type MostReadCarouselProps = {
  articles: ArticleListItem[];
};

// Carrossel editorial com sensação de profundidade (perspectiva + rotação Y +
// escala) construído só com CSS transform/opacity + Pointer Events + scroll
// nativo — sem biblioteca de animação/carrossel. O scroll horizontal nativo
// com scroll-snap é a base funcional; o efeito 3D é uma camada visual sobre
// ele, recalculada via rAF a cada evento de scroll.
export function MostReadCarousel({ articles }: MostReadCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const rafRef = useRef<number | null>(null);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });
  const hasDraggedRef = useRef(false);
  const isPointerDownRef = useRef(false);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const updateTransforms = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const containerRect = scroller.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;
    const halfWidth = containerRect.width / 2 || 1;

    let closestIndex = 0;
    let closestDistance = Infinity;

    articles.forEach((article, index) => {
      const card = cardRefs.current.get(article.id);
      if (!card) return;

      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const rawDistance = (cardCenter - containerCenter) / halfWidth;
      const distance = Math.max(-2, Math.min(2, rawDistance));

      if (reducedMotion) {
        card.style.transform = "none";
        card.style.opacity = "1";
      } else {
        const clamped = Math.min(Math.abs(distance), 1);
        const rotateY = -distance * 10; // graus — leve, nunca extremo
        const scale = 1 - clamped * 0.08; // 1 no centro, ~0.92 nas laterais
        const opacity = 1 - clamped * 0.35; // nunca abaixo de ~0.65 (legível)

        card.style.transform = `perspective(1400px) rotateY(${rotateY}deg) scale(${scale})`;
        card.style.opacity = String(opacity);
        card.style.zIndex = String(100 - Math.round(clamped * 50));
      }

      if (Math.abs(rawDistance) < closestDistance) {
        closestDistance = Math.abs(rawDistance);
        closestIndex = index;
      }
    });

    setActiveIndex((prev) => (prev === closestIndex ? prev : closestIndex));
  }, [articles, reducedMotion]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function onScroll() {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        updateTransforms();
        rafRef.current = null;
      });
    }

    updateTransforms();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [updateTransforms]);

  function scrollToIndex(index: number) {
    const clamped = Math.max(0, Math.min(articles.length - 1, index));
    const article = articles[clamped];
    const card = article ? cardRefs.current.get(article.id) : null;
    card?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  // Drag horizontal com mouse/trackpad (desktop). Toque usa o scroll nativo
  // do navegador, que já oferece swipe + scroll-snap sem nenhum JS extra.
  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    dragStartRef.current = { x: event.clientX, scrollLeft: scroller.scrollLeft };
    scroller.setPointerCapture(event.pointerId);
    setIsDragging(true);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isPointerDownRef.current) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const delta = event.clientX - dragStartRef.current.x;
    if (Math.abs(delta) > 4) hasDraggedRef.current = true;
    scroller.scrollLeft = dragStartRef.current.scrollLeft - delta;
  }

  function endDrag() {
    isPointerDownRef.current = false;
    setIsDragging(false);
  }

  // Evita que um arraste vire clique-navegação indesejado no card.
  function onClickCapture(event: React.MouseEvent<HTMLDivElement>) {
    if (hasDraggedRef.current) {
      event.preventDefault();
      event.stopPropagation();
      hasDraggedRef.current = false;
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(activeIndex + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(activeIndex - 1);
    }
  }

  if (articles.length === 0) return null;

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Artigos mais lidos"
      className="overflow-hidden bg-[#FAF8F4] py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <SectionLabel>Populares</SectionLabel>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
              Mais lidos
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-500" aria-hidden="true">
              {activeIndex + 1} / {articles.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Artigo anterior"
                onClick={() => scrollToIndex(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] shadow-sm transition hover:border-[#556B2F] hover:text-[#556B2F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#556B2F] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Próximo artigo"
                onClick={() => scrollToIndex(activeIndex + 1)}
                disabled={activeIndex === articles.length - 1}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] shadow-sm transition hover:border-[#556B2F] hover:text-[#556B2F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#556B2F] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* perspective só é aplicado sem reduced-motion — em reduced-motion o
          scroller continua 100% funcional (scroll nativo + snap), só sem a
          profundidade 3D. */}
      <div
        ref={scrollerRef}
        role="list"
        tabIndex={0}
        aria-label="Lista de artigos mais lidos, navegável com as setas do teclado"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        className={`no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 py-4 sm:px-16 lg:px-[12%] ${
          reducedMotion ? "" : "perspective-[1400px]"
        } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {/* touch-action fica no default (auto): o navegador já resolve
            corretamente scroll horizontal do carrossel vs. scroll vertical
            da página em overflow-x-auto — não sobrescrever aqui. */}
        {articles.map((article) => (
          <div
            key={article.id}
            role="listitem"
            ref={(node) => {
              if (node) cardRefs.current.set(article.id, node);
              else cardRefs.current.delete(article.id);
            }}
            className="w-[78vw] shrink-0 snap-center transition-[transform,opacity] duration-300 ease-out sm:w-[360px]"
          >
            <ArticleCard
              variant="compact"
              slug={article.slug}
              title={article.title}
              description={article.description}
              category={article.category.name}
              coverImage={article.coverImage}
              date={formatShortDate(article.publishedAt)}
            />
          </div>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Exibindo artigo {activeIndex + 1} de {articles.length}: {articles[activeIndex]?.title}
      </p>
    </section>
  );
}
