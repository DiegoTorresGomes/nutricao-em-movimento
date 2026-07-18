import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { LegalPageSchema } from "@/components/seo/LegalPageSchema";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de utilização do portal Nutrição & Movimento: regras de uso do conteúdo, responsabilidades e direitos.",
  alternates: {
    canonical: "/pt/termos-de-uso",
  },
  openGraph: {
    title: "Termos de Uso | Nutrição & Movimento",
    description:
      "Termos de utilização do portal Nutrição & Movimento: regras de uso do conteúdo, responsabilidades e direitos.",
    url: "/pt/termos-de-uso",
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
    title: "Termos de Uso | Nutrição & Movimento",
    description: "Termos de utilização do portal Nutrição & Movimento.",
    images: ["/images/og/nutricao-em-movimento.jpg"],
  },
};

const lastUpdate = "18 de julho de 2026";

export default function TermosPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-6 py-20">
        <LegalPageSchema
          title="Termos de Uso"
          path="/pt/termos-de-uso"
          description="Termos de utilização do portal Nutrição & Movimento: regras de uso do conteúdo, responsabilidades e direitos."
        />

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">
          Condições de utilização
        </p>

        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">Termos de Uso</h1>

        <p className="mt-5 text-sm text-neutral-500">Última atualização: {lastUpdate}</p>

        <div className="mt-10 space-y-10 text-base leading-8 text-neutral-700">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">1. Objetivo do site</h2>
            <p>
              O <strong>Nutrição & Movimento</strong> é um portal de conteúdo educativo dedicado a
              temas de nutrição, comportamento alimentar, emagrecimento sustentável e Bem-Estar
              Nutricional. Ao acessar e utilizar este site, você concorda integralmente com estes Termos
              de Uso. Caso não concorde com qualquer disposição, recomendamos que não utilize o site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">2. Direitos autorais</h2>
            <p>
              Todo o conteúdo publicado — textos, artigos, imagens, marca, layout e identidade visual —
              é protegido pela legislação de propriedade intelectual e pertence ao Nutrição &
              Movimento ou a seus respectivos autores e licenciadores. É vedada a reprodução total ou
              parcial sem autorização prévia e expressa, exceto pequenos trechos para fins de citação,
              desde que citada a fonte e incluído link para a página original.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">3. Uso permitido</h2>
            <p>
              Você pode acessar, ler e compartilhar os conteúdos para fins pessoais, informativos e não
              comerciais, respeitando os direitos autorais e a integridade das informações.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">4. Uso proibido</h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>Reproduzir ou comercializar o conteúdo sem autorização;</li>
              <li>Utilizar o site para fins ilícitos, fraudulentos ou que violem direitos de terceiros;</li>
              <li>
                Tentar acessar áreas restritas, comprometer a segurança ou introduzir códigos maliciosos;
              </li>
              <li>Extrair dados de forma automatizada (scraping) sem autorização;</li>
              <li>Apresentar o conteúdo como se fosse aconselhamento profissional individualizado.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">
              5. Responsabilidades do usuário
            </h2>
            <p>
              Você é responsável pelo uso que faz das informações disponibilizadas e por fornecer dados
              verdadeiros ao interagir com formulários. As informações têm caráter educativo e não
              substituem a orientação de um profissional de saúde habilitado, conforme detalhado em nosso{" "}
              <Link href="/pt/disclaimer" className="font-semibold text-[#556B2F] underline">
                Disclaimer
              </Link>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">
              6. Limitação de responsabilidade
            </h2>
            <p>
              O conteúdo é fornecido &ldquo;no estado em que se encontra&rdquo;, sem garantias de
              resultados. Não nos responsabilizamos por decisões tomadas com base nas informações do
              site, tampouco por eventuais danos diretos ou indiretos decorrentes do uso ou da
              impossibilidade de uso do portal. Cada pessoa possui necessidades individuais que devem
              ser avaliadas por profissional habilitado.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">7. Links externos</h2>
            <p>
              O site pode conter links para páginas de terceiros. Não temos controle sobre o conteúdo,
              as políticas ou as práticas desses sites e não nos responsabilizamos por eles. O acesso a
              links externos é de responsabilidade exclusiva do usuário.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">8. Publicidade</h2>
            <p>
              O site pode exibir anúncios de terceiros, inclusive por meio do Google AdSense. Não nos
              responsabilizamos pelo conteúdo dos anúncios nem pelas ofertas de anunciantes. O
              tratamento de dados relacionado à publicidade está descrito na nossa{" "}
              <Link
                href="/pt/politica-de-privacidade"
                className="font-semibold text-[#556B2F] underline"
              >
                Política de Privacidade
              </Link>{" "}
              e na{" "}
              <Link href="/pt/politica-de-cookies" className="font-semibold text-[#556B2F] underline">
                Política de Cookies
              </Link>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">9. Newsletter</h2>
            <p>
              A assinatura da newsletter é voluntária e utiliza confirmação dupla (double opt-in). Você
              pode cancelar a qualquer momento pelo link de descadastro presente nos e-mails. O
              tratamento do seu e-mail segue a nossa Política de Privacidade.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">10. Comentários</h2>
            <p>
              Caso funcionalidades de comentários venham a ser disponibilizadas no futuro, o usuário
              será o único responsável pelo conteúdo que publicar, comprometendo-se a não divulgar
              material ofensivo, ilegal ou que viole direitos de terceiros. Reservamo-nos o direito de
              moderar ou remover comentários inadequados.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">11. Alterações nos Termos</h2>
            <p>
              Estes Termos de Uso podem ser atualizados a qualquer momento. A versão vigente é sempre a
              publicada nesta página, com a data de última atualização indicada no topo. O uso contínuo
              do site após alterações implica concordância com os novos termos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">12. Legislação e foro</h2>
            <p>
              Estes Termos são regidos pelas leis da <strong>República Federativa do Brasil</strong>.
              Fica eleito o foro da comarca do domicílio do controlador para dirimir eventuais
              controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja. Dúvidas
              podem ser encaminhadas pela nossa{" "}
              <Link href="/pt/contato" className="font-semibold text-[#556B2F] underline">
                página de Contato
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </PublicLayout>
  );
}