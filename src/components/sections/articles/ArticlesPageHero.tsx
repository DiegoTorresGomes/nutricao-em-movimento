import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

type ArticlesPageHeroProps = {
  totalCount: number;
};

export function ArticlesPageHero({ totalCount }: ArticlesPageHeroProps) {
  return (
    <section className="bg-[#FAF8F4] px-4 py-12 sm:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>Artigos</SectionLabel>

        <h1 className="mt-5 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Conteúdo para construir hábitos mais leves e duradouros.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
          Ciência, comportamento alimentar e estratégias práticas para cuidar
          da saúde sem radicalismos.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-neutral-600">
          <span className="font-semibold text-[#111111]">
            {totalCount} {totalCount === 1 ? "artigo publicado" : "artigos publicados"}
          </span>
          <span aria-hidden="true" className="text-neutral-300">
            •
          </span>
          <Link
            href="#explorar-por-tema"
            className="font-semibold text-[#556B2F] underline underline-offset-4 transition hover:text-[#465a28]"
          >
            Ver categorias
          </Link>
        </div>
      </div>
    </section>
  );
}
