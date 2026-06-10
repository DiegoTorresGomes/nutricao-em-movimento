export function FeaturedArticle() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.4em] text-[#556B2F]">
            Artigo da Semana
          </p>

          <h2 className="font-serif text-4xl text-[#111111] md:text-5xl">
            Como parar de recomeçar toda segunda-feira
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-[16/10] rounded-3xl bg-[#E9DCC9]" />

          <div className="flex flex-col justify-center">
            <span className="mb-4 text-sm uppercase tracking-[0.3em] text-[#556B2F]">
              Comportamento Alimentar
            </span>

            <p className="mb-8 text-lg leading-relaxed text-gray-700">
              Descubra por que a motivação não é suficiente para manter uma rotina saudável e como construir hábitos duradouros sem dietas radicais.
            </p>

            <button className="w-fit rounded-full bg-[#111111] px-8 py-4 text-white transition hover:opacity-90">
              Ler artigo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}