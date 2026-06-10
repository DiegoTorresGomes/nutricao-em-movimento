import { SectionLabel } from "@/components/ui/SectionLabel";

export function NewsletterSection() {
  return (
    <section id="newsletter" className="bg-[#FAF8F4] px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid overflow-hidden rounded-[2.25rem] bg-[#111111] text-white md:grid-cols-[1.05fr_0.95fr]">
          <div className="p-8 sm:p-10 lg:p-14">
            <SectionLabel dark>Newsletter</SectionLabel>

            <h2 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight sm:text-5xl">
              Conteúdo real para uma rotina mais leve.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
              Receba reflexões, artigos e orientações educativas sobre comportamento
              alimentar, emagrecimento sustentável e nutrição esportiva.
            </p>

            <form className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="min-h-12 flex-1 rounded-full border border-white/10 bg-white px-5 text-sm text-[#111111] outline-none transition placeholder:text-neutral-500 focus:border-[#E9DCC9]"
              />

              <button
                type="button"
                className="min-h-12 rounded-full bg-[#E9DCC9] px-7 text-sm font-bold !text-[#111111] transition hover:bg-white"
              >
                Quero receber 
              </button>
            </form>

            <p className="mt-4 text-xs leading-6 text-white/45">
              Sem spam. Apenas conteúdos educativos para ajudar você a construir
              constância com mais clareza.
            </p>
          </div>

          <div className="hidden bg-[#E9DCC9] p-6 md:block">
            <div className="flex h-full min-h-[420px] items-center justify-center rounded-[1.75rem] bg-white text-center">
              <div className="px-8">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#556B2F]">
                  Corpo ativo
                </p>

                <p className="mt-4 text-4xl font-semibold leading-tight text-[#111111]">
                  mente alinhada,
                  <br />
                  vida em construção.
                </p>

                <p className="mt-6 text-sm leading-7 text-neutral-600">
                  Um convite semanal para uma relação mais leve com a alimentação.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}