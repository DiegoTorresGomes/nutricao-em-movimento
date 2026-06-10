import { SectionLabel } from "@/components/ui/SectionLabel";

const categories = [
  {
    title: "Comportamento alimentar",
    description: "Entenda fome, emoções, escolhas e hábitos sem culpa.",
  },
  {
    title: "Emagrecimento sustentável",
    description: "Estratégias possíveis para constância sem efeito sanfona.",
  },
  {
    title: "Nutrição esportiva",
    description: "Energia, performance e recuperação alinhadas à rotina.",
  },
  {
    title: "Hábitos e rotina",
    description: "Organização alimentar simples para a vida real.",
  },
];

export function VisualCategories() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <SectionLabel>Categorias</SectionLabel>

          <h2 className="mt-5 text-3xl font-semibold sm:text-4xl md:text-5xl">
            Escolha por onde começar sua jornada.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <a
              key={category.title}
              href="/pt/artigos"
              className="group min-h-64 rounded-[2rem] border border-black/5 bg-[#FAF8F4] p-6 transition hover:-translate-y-1 hover:bg-[#111111] hover:text-white hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#556B2F] transition group-hover:text-[#E9DCC9]">
                Categoria
              </p>

              <h3 className="mt-8 text-2xl font-semibold leading-tight">
                {category.title}
              </h3>

              <p className="mt-5 text-sm leading-7 text-neutral-700 transition group-hover:text-white/70">
                {category.description}
              </p>

              <span className="mt-8 inline-flex text-sm font-bold text-[#556B2F] transition group-hover:text-[#E9DCC9]">
                Ver artigos
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}