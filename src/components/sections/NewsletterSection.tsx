import { subscribeNewsletterAction } from "@/app/pt/newsletter/actions";

type NewsletterSectionProps = {
  status?: string;
};

export function NewsletterSection({ status }: NewsletterSectionProps) {
  return (
    <section
      id="newsletter"
      className="bg-[#111111] px-4 py-16 text-white sm:px-6 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] bg-[#FAF8F4] p-6 text-[#111111] sm:p-10 md:p-12">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#556B2F]">
                Newsletter
              </p>

              <h2 className="mt-5 text-3xl font-semibold sm:text-4xl md:text-5xl">
                Receba conteúdos para construir constância.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-700 sm:text-base">
                Reflexões, artigos e orientações educativas sobre comportamento
                alimentar, rotina, saúde e movimento.
              </p>
            </div>

            <form action={subscribeNewsletterAction} className="grid gap-4">
              <label className="text-sm font-bold">Seu e-mail</label>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="voce@email.com"
                  className="h-12 flex-1 rounded-full border border-black/10 bg-white px-5 text-sm outline-none focus:border-[#556B2F]"
                />

                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-[#556B2F] px-6 py-3 text-sm font-bold !text-white transition hover:bg-[#465a28]"
                >
                  Inscrever
                </button>
              </div>

              {status === "sucesso" && (
                <p className="rounded-2xl bg-green-50 p-3 text-sm font-bold text-green-700">
                  Inscrição realizada com sucesso.
                </p>
              )}

              {status === "erro" && (
                <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">
                  Informe um e-mail válido.
                </p>
              )}

              <p className="text-xs leading-5 text-neutral-500">
                Sem spam. Você poderá sair da lista quando quiser.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}