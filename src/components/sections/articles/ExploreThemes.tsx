import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionLabel";

type ThemeWithCount = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  count: number;
};

type ExploreThemesProps = {
  themes: ThemeWithCount[];
};

// Só recebe categorias JÁ FILTRADAS por quem chama (ativas e com pelo menos 1
// post publicado) — ver derivação em page.tsx. Nada é hardcoded aqui.
export function ExploreThemes({ themes }: ExploreThemesProps) {
  if (themes.length === 0) return null;

  return (
    <section id="explorar-por-tema" className="scroll-mt-24 bg-[#FAF8F4] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>Categorias</SectionLabel>
        <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
          Explorar por tema
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <Link
              key={theme.id}
              href={`/pt/artigos?categoria=${encodeURIComponent(theme.slug)}#todos-os-artigos`}
              className="group flex flex-col justify-between rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#556B2F]/30 hover:shadow-md"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#111111] transition group-hover:text-[#556B2F]">
                  {theme.name}
                </h3>
                {theme.description ? (
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
                    {theme.description}
                  </p>
                ) : null}
              </div>

              <span className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                {theme.count} {theme.count === 1 ? "artigo" : "artigos"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
