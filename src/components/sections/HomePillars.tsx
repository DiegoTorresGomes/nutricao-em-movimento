import { SectionLabel } from "@/components/ui/SectionLabel";

const pillars = [
  {
    title: "Comportamento alimentar",
    description:
      "Clareza para entender fome, emoções, escolhas e hábitos sem culpa ou radicalismo.",
  },
  {
    title: "Emagrecimento sustentável",
    description:
      "Estratégias possíveis para construir resultados consistentes sem efeito sanfona.",
  },
  {
    title: "Nutrição esportiva",
    description:
      "Alimentação alinhada ao treino, energia, performance e recuperação.",
  },
];

export function HomePillars() {
  return (
    <section className="border-y border-black/5 bg-[#FAF8F4] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <SectionLabel>Pilares</SectionLabel>

          <h2 className="mt-5 text-3xl font-semibold sm:text-4xl md:text-5xl">
            Conteúdo para quem quer sair do ciclo da culpa e construir constância.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-[1.75rem] bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-semibold">{pillar.title}</h3>
              <p className="mt-4 text-sm leading-7 text-neutral-700">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}