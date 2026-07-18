import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { sendContactMessageAction } from "./actions";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Entre em contato com o Nutrição & Movimento para dúvidas, consultas, parcerias ou orientações iniciais.",

  alternates: {
    canonical: "/pt/contato",
  },

  openGraph: {
    title: "Contato | Nutrição & Movimento",
    description:
      "Entre em contato com o Nutrição & Movimento para dúvidas, consultas, parcerias ou orientações iniciais.",
    url: "/pt/contato",
    type: "website",
    images: [
      {
        url: "/images/og/nutricao-em-movimento.jpg",
        width: 1200,
        height: 630,
        alt: "Nutrição & Movimento",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Contato | Nutrição & Movimento",
    description:
      "Entre em contato com o Nutrição & Movimento para dúvidas, consultas, parcerias ou orientações iniciais.",
    images: ["/images/og/nutricao-em-movimento.jpg"],
  },
};

type ContatoPageProps = {
  searchParams?: Promise<{
    status?: string;
  }>;
};

export default async function ContatoPage({ searchParams }: ContatoPageProps) {
  const params = await searchParams;

  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#556B2F]">
          Contato
        </p>

        <h1 className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          Fale com a nutricionista.
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
          Envie sua mensagem para dúvidas, consultas, parcerias ou orientações
          iniciais.
        </p>

        <div className="mt-10 grid gap-8 rounded-[1.75rem] bg-[#FAF8F4] p-5 sm:p-8 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-semibold">Canais oficiais</h2>

            <p className="mt-4 text-sm leading-7 text-neutral-700">
              Você também pode entrar em contato pelos canais abaixo.
            </p>

            <div className="mt-6 grid gap-3 text-sm font-bold">
              <a
                href="mailto:contato@nutricaoemovimento.com"
                className="rounded-2xl bg-white p-4 transition hover:text-[#556B2F]"
              >
                contato@nutricaoemovimento.com
              </a>

              <a
                href="https://wa.me/5521979762589"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-white p-4 transition hover:text-[#556B2F]"
              >
                WhatsApp
              </a>
            </div>
          </div>

          <form action={sendContactMessageAction} className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-bold">Nome</label>
              <input
                name="name"
                required
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-bold">E-mail</label>
              <input
                name="email"
                type="email"
                required
                className="h-12 rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none focus:border-[#556B2F]"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-bold">Mensagem</label>
              <textarea
                name="message"
                required
                rows={5}
                className="rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none focus:border-[#556B2F]"
              />
            </div>

            {params?.status === "sucesso" && (
              <p className="rounded-2xl bg-green-50 p-3 text-sm font-bold text-green-700">
                Mensagem enviada com sucesso.
              </p>
            )}

            {params?.status === "erro" && (
              <p className="rounded-2xl bg-red-50 p-3 text-sm font-bold text-red-700">
                Preencha nome, e-mail válido e mensagem com pelo menos 10 caracteres.
              </p>
            )}

            <button
              type="submit"
              className="w-fit rounded-full bg-[#556B2F] px-7 py-3 text-sm font-bold !text-white transition hover:bg-[#465a28]"
            >
              Enviar mensagem
            </button>
          </form>
        </div>
      </main>
    </PublicLayout>
  );
}
