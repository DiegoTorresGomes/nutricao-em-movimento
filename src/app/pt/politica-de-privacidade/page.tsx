import { PublicLayout } from "@/components/layout/PublicLayout";

export default function PoliticaPrivacidadePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-5xl font-semibold">
          Política de Privacidade
        </h1>

        <p className="mt-8 leading-8 text-neutral-700">
          Esta página será atualizada com as informações referentes à LGPD,
          coleta de dados, cookies, newsletter e analytics.
        </p>
      </main>
    </PublicLayout>
  );
}