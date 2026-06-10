import { PublicLayout } from "@/components/layout/PublicLayout";

export default function TermosPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-5xl font-semibold">Termos de Uso</h1>

        <p className="mt-8 leading-8 text-neutral-700">
          Esta página apresentará os termos de utilização do portal Nutrição em
          Movimento.
        </p>
      </main>
    </PublicLayout>
  );
}