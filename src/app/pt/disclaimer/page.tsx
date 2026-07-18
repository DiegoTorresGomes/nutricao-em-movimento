import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { LegalPageSchema } from "@/components/seo/LegalPageSchema";

export const metadata: Metadata = {
  title: "Disclaimer Nutricional",
  description:
    "As informações do Nutrição & Movimento têm caráter educativo e não substituem consulta, diagnóstico ou tratamento com profissional de saúde habilitado.",
  alternates: {
    canonical: "/pt/disclaimer",
  },
  openGraph: {
    title: "Disclaimer Nutricional | Nutrição & Movimento",
    description:
      "As informações do Nutrição & Movimento têm caráter educativo e não substituem consulta com profissional de saúde habilitado.",
    url: "/pt/disclaimer",
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
    title: "Disclaimer Nutricional | Nutrição & Movimento",
    description:
      "As informações têm caráter educativo e não substituem consulta com profissional de saúde.",
    images: ["/images/og/nutricao-em-movimento.jpg"],
  },
};

const lastUpdate = "18 de julho de 2026";

export default function DisclaimerPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-6 py-20">
        <LegalPageSchema
          title="Disclaimer Nutricional"
          path="/pt/disclaimer"
          description="As informações do Nutrição & Movimento têm caráter educativo e não substituem consulta com profissional de saúde habilitado."
        />

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">
          Aviso de responsabilidade
        </p>

        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
          Disclaimer Nutricional
        </h1>

        <p className="mt-5 text-sm text-neutral-500">Última atualização: {lastUpdate}</p>

        <div className="mt-10 space-y-8 text-base leading-8 text-neutral-700">
          <div className="rounded-[2rem] border border-black/5 bg-[#FAF8F4] p-6 sm:p-8">
            <p>
              <strong className="text-[#111111]">Leia com atenção.</strong> Todo o conteúdo do{" "}
              <strong>Nutrição & Movimento</strong> tem <strong>finalidade estritamente
              educativa e informativa</strong> e <strong>não substitui</strong>, em nenhuma
              hipótese, a consulta, a avaliação, o diagnóstico ou o tratamento realizados por um
              profissional de saúde habilitado.
            </p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">Natureza do conteúdo</h2>
            <ul className="list-disc space-y-3 pl-6">
              <li>O conteúdo possui finalidade educativa e informativa;</li>
              <li>
                <strong>Não substitui</strong> a consulta individualizada com nutricionista;
              </li>
              <li>
                <strong>Não substitui</strong> a avaliação, o acompanhamento ou a prescrição médica;
              </li>
              <li>
                Cada pessoa possui necessidades, condições de saúde e objetivos diferentes — o que
                funciona para uma pessoa pode não ser adequado para outra;
              </li>
              <li>
                Resultados <strong>variam</strong> de indivíduo para indivíduo e dependem de
                múltiplos fatores;
              </li>
              <li>Não realizamos diagnóstico de qualquer condição de saúde por meio do site;</li>
              <li>Não prescrevemos tratamentos, dietas individualizadas ou medicamentos;</li>
              <li>
                <strong>Não incentivamos a automedicação</strong> nem a adoção de dietas restritivas
                sem acompanhamento;
              </li>
              <li>Não garantimos resultados específicos de emagrecimento, desempenho ou saúde.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">Procure sempre um profissional</h2>
            <p>
              Antes de iniciar qualquer plano alimentar, mudança de hábitos, suplementação ou
              atividade física, <strong>procure sempre um profissional de saúde habilitado</strong>{" "}
              (nutricionista e/ou médico), que poderá avaliar o seu caso de forma individualizada.
              Em caso de sintomas, condições clínicas ou dúvidas sobre sua saúde, busque atendimento
              adequado.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">Limitação de responsabilidade</h2>
            <p>
              O Nutrição & Movimento não se responsabiliza por decisões, condutas ou eventuais danos
              decorrentes da interpretação ou da aplicação, por conta e risco do usuário, das
              informações aqui publicadas. Ao utilizar este site, você declara estar ciente e de
              acordo com este aviso. Consulte também os nossos{" "}
              <Link href="/pt/termos-de-uso" className="font-semibold text-[#556B2F] underline">
                Termos de Uso
              </Link>{" "}
              e a nossa{" "}
              <Link
                href="/pt/politica-de-privacidade"
                className="font-semibold text-[#556B2F] underline"
              >
                Política de Privacidade
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </PublicLayout>
  );
}