import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout>
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        {/* Simple illustration built from the brand's visual elements */}
        <div className="relative mb-10 flex items-center justify-center">
          <span className="absolute h-40 w-40 rounded-full bg-[#E9DCC9]" aria-hidden="true" />
          <span
            className="absolute h-40 w-40 -translate-x-6 -translate-y-4 rounded-full border border-[#556B2F]/30"
            aria-hidden="true"
          />
          <span className="relative text-7xl font-black tracking-tight text-[#556B2F] sm:text-8xl">
            404
          </span>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">
          Página não encontrada
        </p>

        <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          Parece que este conteúdo saiu para se movimentar.
        </h1>

        <p className="mt-5 max-w-xl text-base leading-8 text-neutral-600">
          O endereço que você procurou não existe ou foi movido. Que tal voltar ao início ou
          explorar nossos artigos sobre nutrição, comportamento alimentar e vida em movimento?
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/pt"
            className="rounded-full bg-[#111111] px-7 py-3 text-sm font-bold !text-white transition hover:bg-[#556B2F]"
          >
            Voltar para a Home
          </Link>

          <Link
            href="/pt/artigos"
            className="rounded-full border border-black/10 px-7 py-3 text-sm font-bold text-[#111111] transition hover:border-[#556B2F] hover:text-[#556B2F]"
          >
            Ver artigos
          </Link>
        </div>
      </main>
    </PublicLayout>
  );
}
