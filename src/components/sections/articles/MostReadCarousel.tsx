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

// Distância (px) para diferenciar um clique de um arraste.
const DRAG_THRESHOLD = 6;
// Inércia — deliberadamente sutil ("muito suave, sem exagero").
const FRICTION = 0.94; // multiplicador de velocidade aplicado a cada frame
const MIN_VELOCITY = 0.02; // px/ms — abaixo disso, a inércia para
const MAX_VELOCITY = 3; // px/ms — teto para um flick muito rápido não "voar"

// Carrossel editorial com sensação de profundidade (perspectiva + rotação Y +
// escala) construído só com CSS transform/opacity + Pointer Events + scroll
// nativo — sem biblioteca de animação/carrossel. O scroll horizontal nativo
// com scroll-snap é a base funcional fora da interação de arraste; durante o
// drag e a inércia o snap é desativado para o movimento acompanhar o ponteiro
// 1:1, e reativado assim que o carrossel assenta.
export function MostReadCarousel({ articles }: MostReadCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const scrollRafRef = useRef<number | null>(null);
  const inertiaRafRef = useRef<number | null>(null);

  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });
  const hasDraggedRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, t: 0 });
  const velocityRef = useRef(0); // px/ms, com sinal (direção do arraste)

  const [activeIndex, setActiveIndex] = useState(0);
  // true durante o drag OU a inércia — controla snap e a transição CSS dos
  // cards (desligada durante a interação para o 3D acompanhar 1:1 o mouse).
  const [isInteracting, setIsInteracting] = useState(false);
  // true só enquanto o botão está pressionado — controla cursor/seleção.
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

  // Cobre scroll nativo (roda do mouse, swipe touch, scrollIntoView das
  // setas/teclado) — sempre rAF-throttled, nunca mais de 1 recálculo por frame.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    function onScroll() {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        updateTransforms();
        scrollRafRef.current = null;
      });
    }

    updateTransforms();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [updateTransforms]);

  // Para a inércia em andamento (novo drag, unmount, etc.).
  const stopInertia = useCallback(() => {
    if (inertiaRafRef.current !== null) {
      cancelAnimationFrame(inertiaRafRef.current);
      inertiaRafRef.current = null;
    }
  }, []);

  useEffect(() => stopInertia, [stopInertia]);

  function runInertia() {
    function step() {
      const el = scrollerRef.current;
      if (!el) {
        inertiaRafRef.current = null;
        setIsInteracting(false);
        return;
      }

      velocityRef.current *= FRICTION;

      if (Math.abs(velocityRef.current) < MIN_VELOCITY) {
        inertiaRafRef.current = null;
        velocityRef.current = 0;
        setIsInteracting(false); // reativa o scroll-snap ao assentar
        return;
      }

      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      let next = el.scrollLeft - velocityRef.current * 16; // ~16ms/frame

      if (next <= 0 || next >= maxScrollLeft) {
        next = Math.max(0, Math.min(maxScrollLeft, next));
        el.scrollLeft = next;
        inertiaRafRef.current = null;
        velocityRef.current = 0;
        setIsInteracting(false);
        return;
      }

      el.scrollLeft = next;
      updateTransforms();
      inertiaRafRef.current = requestAnimationFrame(step);
    }

    inertiaRafRef.current = requestAnimationFrame(step);
  }

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

    stopInertia();
    isPointerDownRef.current = true;
    hasDraggedRef.current = false;
    velocityRef.current = 0;
    dragStartRef.current = { x: event.clientX, scrollLeft: scroller.scrollLeft };
    lastPointerRef.current = { x: event.clientX, t: performance.now() };
    scroller.setPointerCapture(event.pointerId);
    setIsDragging(true);
    setIsInteracting(true); // desativa snap e a transição CSS dos cards já aqui
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isPointerDownRef.current) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const delta = event.clientX - dragStartRef.current.x;
    if (Math.abs(delta) > DRAG_THRESHOLD) hasDraggedRef.current = true;

    // 1:1 com o ponteiro — sem esperar pointerup, sem passar por setState.
    scroller.scrollLeft = dragStartRef.current.scrollLeft - delta;

    // Velocidade instantânea (px/ms), suavizada com a amostra anterior — usada
    // só na inércia pós-soltar.
    const now = performance.now();
    const dt = now - lastPointerRef.current.t;
    if (dt > 0) {
      const instantVelocity = (event.clientX - lastPointerRef.current.x) / dt;
      velocityRef.current = velocityRef.current * 0.7 + instantVelocity * 0.3;
      velocityRef.current = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocityRef.current));
    }
    lastPointerRef.current = { x: event.clientX, t: now };

    // Atualiza o efeito 3D em sincronia direta com o arraste (rAF-throttled,
    // não depende só do evento "scroll" assíncrono do navegador).
    if (scrollRafRef.current === null) {
      scrollRafRef.current = requestAnimationFrame(() => {
        updateTransforms();
        scrollRafRef.current = null;
      });
    }
  }

  function endDrag(event: React.PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }

    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    setIsDragging(false);

    if (reducedMotion || Math.abs(velocityRef.current) < MIN_VELOCITY) {
      velocityRef.current = 0;
      setIsInteracting(false); // sem inércia: já assenta e reativa o snap
      return;
    }

    runInertia(); // isInteracting continua true até a inércia parar sozinha
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
          scroller continua 100% funcional (drag, scroll nativo, setas,
          teclado), só sem a profundidade 3D. scroll-snap fica ativo em
          repouso e é desligado durante o drag/inércia (isInteracting) para o
          movimento acompanhar o ponteiro sem "puxar" para o card mais
          próximo no meio do gesto. */}
      <div
        ref={scrollerRef}
        role="list"
        tabIndex={0}
        aria-label="Lista de artigos mais lidos, arrastável e navegável com as setas do teclado"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onKeyDown={onKeyDown}
        className={`no-scrollbar mt-10 flex gap-6 overflow-x-auto px-4 py-4 sm:px-16 lg:px-[12%] ${
          isInteracting ? "" : "snap-x snap-mandatory"
        } ${reducedMotion ? "" : "perspective-[1400px]"} ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
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
            className={`w-[78vw] shrink-0 snap-center sm:w-[360px] ${
              isInteracting ? "" : "transition-[transform,opacity] duration-300 ease-out"
            }`}
          >
            <ArticleCard
              variant="compact"
              slug={article.slug}
              title={article.title}
              description={article.description}
              category={article.category.name}
              coverImage={article.coverImage}
              date={formatShortDate(article.publishedAt)}
              imageDraggable={false}
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
