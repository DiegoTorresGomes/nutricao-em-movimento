import { PublicLayout } from "@/components/layout/PublicLayout";

export default function SobrePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#556B2F]">
          Sobre
        </p>

        <h1 className="mt-5 text-5xl font-semibold">
          Nutrição com ciência, acolhimento e constância.
        </h1>

        <div className="mt-10 space-y-8 text-lg leading-8 text-neutral-700">
          <p>
            O Nutrição em Movimento nasceu com a missão de ajudar pessoas a
            construírem uma relação mais saudável com a alimentação.
          </p>

          <p>
            Acreditamos que resultados sustentáveis acontecem quando existe
            clareza, equilíbrio e constância.
          </p>

          <p>
            Nosso objetivo é transformar conhecimento científico em estratégias
            práticas para o dia a dia.
          </p>
        </div>
      </main>
    </PublicLayout>
  );
}