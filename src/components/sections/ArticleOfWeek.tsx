import { SectionLabel } from "@/components/ui/SectionLabel";

export function ArticleOfWeek() {
  return (
    <section className="bg-[#faf8f4] px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>Artigo da semana</SectionLabel>

        <div className="mt-8 overflow-hidden rounded-[36px] border border-black/5 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="min-h-[420px] bg-[#E7DDCF]" />

            <div className="flex flex-col justify-center p-8 lg:p-14">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D67A5A]">
                Comportamento alimentar
              </span>

              <h2 className="mt-5 font-serif text-4xl leading-tight lg:text-5xl">
                Como parar de recomeçar toda segunda-feira.
              </h2>

              <p className="mt-6 text-lg leading-8 text-neutral-600">
                Entenda por que a motivação não é suficiente para manter hábitos
                saudáveis e descubra como construir constância sem radicalismo.
              </p>

              <button className="mt-8 w-fit rounded-full bg-black px-8 py-4 text-white transition hover:opacity-90">
                Ler artigo completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}