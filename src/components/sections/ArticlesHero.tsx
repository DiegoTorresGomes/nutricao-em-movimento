import { SectionLabel } from "@/components/ui/SectionLabel";

export function ArticlesHero() {
  return (
    <section className="bg-[#FAF8F4] px-4 py-20 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>Artigos</SectionLabel>

        <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight md:text-7xl">
          Conteúdo para construir hábitos mais leves e duradouros.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-neutral-600">
          Artigos sobre comportamento alimentar, emagrecimento sustentável,
          nutrição esportiva e estratégias práticas para o dia a dia.
        </p>
      </div>
    </section>
  );
}