import { PublicLayout } from "@/components/layout/PublicLayout";

export default function DisclaimerPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-6 py-20">
        <h1 className="text-5xl font-semibold">Disclaimer</h1>

        <p className="mt-8 leading-8 text-neutral-700">
          As informações disponibilizadas neste site possuem caráter educativo
          e informativo e não substituem consulta, diagnóstico ou tratamento
          realizado por profissional de saúde habilitado.
        </p>
      </main>
    </PublicLayout>
  );
}