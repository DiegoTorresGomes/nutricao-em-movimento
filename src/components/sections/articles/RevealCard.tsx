"use client";

import { useRevealOnScroll } from "./hooks";

type RevealCardProps = {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
};

// Wrapper mínimo de client component só para a animação de entrada — o
// conteúdo (children) pode continuar vindo de Server Components. Sem JS, o
// elemento nunca fica com opacity 0 (ver hooks.ts).
export function RevealCard({ children, delayMs = 0, className = "" }: RevealCardProps) {
  const reveal = useRevealOnScroll<HTMLDivElement>({ delayMs });

  return (
    <div ref={reveal.ref} className={`${reveal.className} ${className}`} style={reveal.style}>
      {children}
    </div>
  );
}
