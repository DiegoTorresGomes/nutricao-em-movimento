"use client";

import { useEffect, useRef, useState } from "react";

// Lê `prefers-reduced-motion` e reage a mudanças. Usado para desligar
// perspectiva/rotação do carrossel e as animações de entrada — mantendo os
// mesmos elementos funcionais e navegáveis, só sem o movimento.
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return reduced;
}

// Animação de entrada por IntersectionObserver. Importante: o elemento
// começa VISÍVEL (opacity/translate neutros) e só ganha a classe "oculta" via
// state definido no cliente após o mount — ou seja, se o JS não rodar, o
// conteúdo nunca fica escondido. Isso satisfaz "conteúdo essencial visível
// mesmo se JS falhar".
export function useRevealOnScroll<T extends HTMLElement>(options?: { delayMs?: number }) {
  const ref = useRef<T | null>(null);
  const [state, setState] = useState<"idle" | "hidden" | "visible">("idle");
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setState("visible");
      return;
    }

    const node = ref.current;
    if (!node) return;

    // Só agora (client, pós-mount) o elemento passa a "hidden" — nunca no SSR.
    setState("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const delay = options?.delayMs ?? 0;

  const className =
    state === "hidden"
      ? "opacity-0 translate-y-4"
      : "opacity-100 translate-y-0";

  return {
    ref,
    className: `transition-all duration-500 ease-out ${className}`,
    style: { transitionDelay: `${delay}ms` },
  };
}
