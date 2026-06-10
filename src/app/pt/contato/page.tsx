import { PublicLayout } from "@/components/layout/PublicLayout";

export default function ContatoPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-5xl font-semibold">Contato</h1>

        <p className="mt-6 text-lg text-neutral-700">
          Em breve você poderá entrar em contato para consultas, parcerias e
          dúvidas.
        </p>

        <div className="mt-10 rounded-3xl bg-[#FAF8F4] p-8">
          contato@nutricaoemovimento.com
        </div>
      </main>
    </PublicLayout>
  );
}