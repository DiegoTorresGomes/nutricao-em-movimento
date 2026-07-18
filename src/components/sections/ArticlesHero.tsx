import { SectionLabel } from "@/components/ui/SectionLabel";

export function ArticlesHero() {
  return (
    <section className="bg-[#FAF8F4] px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>Artigos</SectionLabel>

        <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Conteúdo para construir hábitos mais leves e duradouros.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
          Artigos sobre comportamento alimentar, emagrecimento sustentável,
          Bem-Estar Nutricional e estratégias práticas para o dia a dia.
        </p>
      </div>
    </section>
  );
}