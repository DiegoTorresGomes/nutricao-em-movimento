import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { LegalPageSchema } from "@/components/seo/LegalPageSchema";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Entenda como o Nutrição & Movimento utiliza cookies próprios e de terceiros, incluindo Google AdSense e Google Analytics, e como você pode gerenciar suas preferências.",

  alternates: {
    canonical: "/pt/politica-de-cookies",
  },

  openGraph: {
    title: "Política de Cookies | Nutrição & Movimento",
    description:
      "Como o Nutrição & Movimento utiliza cookies próprios e de terceiros (Google AdSense e Analytics) e como gerenciar suas preferências.",
    url: "/pt/politica-de-cookies",
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
    title: "Política de Cookies | Nutrição & Movimento",
    description:
      "Como o Nutrição & Movimento utiliza cookies próprios e de terceiros e como gerenciar suas preferências.",
    images: ["/images/og/nutricao-em-movimento.jpg"],
  },
};

const lastUpdate = "18 de julho de 2026";

export default function PoliticaCookiesPage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-6 py-20">
        <LegalPageSchema
          title="Política de Cookies"
          path="/pt/politica-de-cookies"
          description="Como o Nutrição & Movimento utiliza cookies próprios e de terceiros (Google AdSense e Analytics) e como gerenciar suas preferências."
        />

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">
          Transparência
        </p>

        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
          Política de Cookies
        </h1>

        <p className="mt-5 text-sm text-neutral-500">
          Última atualização: {lastUpdate}
        </p>

        <div className="mt-10 space-y-10 text-base leading-8 text-neutral-700">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">1. O que são cookies</h2>
            <p>
              Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador,
              tablet ou celular) quando você visita um site. Eles permitem que o site lembre suas
              ações e preferências por um período, tornando a navegação mais eficiente e
              personalizada. Também podem ser usadas tecnologias semelhantes, como{" "}
              <em>local storage</em>, <em>session storage</em> e <em>web beacons</em>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">2. Como utilizamos cookies</h2>
            <p>
              O <strong>Nutrição & Movimento</strong> utiliza cookies para garantir o
              funcionamento correto do site, entender como os conteúdos são utilizados e, no
              futuro, exibir anúncios relevantes que ajudam a manter o projeto gratuito. Dividimos
              os cookies nas categorias abaixo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">3. Cookies próprios</h2>
            <p>
              São definidos pelo próprio domínio do site e usados para funções essenciais, como
              manter a sessão da área administrativa, lembrar preferências de navegação e
              armazenar, de forma temporária, o registro de que um artigo já foi contabilizado como
              visualizado na sua sessão. Esses cookies não identificam você para fins publicitários.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">4. Cookies de terceiros</h2>
            <p>
              Alguns serviços externos podem definir cookies quando você navega pelo site. Os
              principais estão descritos a seguir.
            </p>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#111111]">Google AdSense</h3>
              <p>
                Utilizamos (ou pretendemos utilizar) o Google AdSense para exibir anúncios. O
                Google e seus parceiros usam cookies para veicular anúncios com base em visitas
                anteriores a este e a outros sites. O cookie de publicidade do Google
                (<em>cookie DoubleClick / __gads / __gpi</em>) permite exibir anúncios mais
                relevantes e limitar o número de vezes que um mesmo anúncio é mostrado. Você pode
                saber mais e ajustar suas preferências nas{" "}
                <a
                  href="https://policies.google.com/technologies/ads?hl=pt-BR"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#556B2F] underline"
                >
                  configurações de anúncios do Google
                </a>
                .
              </p>

              <h3 className="text-lg font-semibold text-[#111111]">
                Google Analytics (uso futuro)
              </h3>
              <p>
                Poderemos utilizar o Google Analytics para entender, de forma agregada e anônima,
                como os visitantes usam o site (páginas mais lidas, tempo de permanência, origem do
                tráfego). Esses cookies (<em>_ga</em>, <em>_ga_*</em>) coletam informações
                estatísticas e não são usados para identificar você pessoalmente.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">
              5. Personalização de anúncios
            </h2>
            <p>
              Anúncios podem ser personalizados com base no seu comportamento de navegação. Você
              tem total controle sobre isso: é possível desativar a personalização de anúncios do
              Google diretamente na página{" "}
              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#556B2F] underline"
              >
                Configurações de anúncios
              </a>{" "}
              ou optar por não participar do uso de cookies de terceiros por meio do{" "}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#556B2F] underline"
              >
                aboutads.info
              </a>
              . Mesmo sem personalização, você continuará vendo anúncios, porém menos relevantes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">6. Consentimento</h2>
            <p>
              Ao continuar navegando no site, você concorda com o uso de cookies conforme descrito
              nesta política. Para visitantes localizados em regiões que exigem consentimento
              prévio (como o Espaço Econômico Europeu), o Google exibe mecanismos de consentimento
              compatíveis antes da veiculação de anúncios personalizados.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">
              7. Como desabilitar os cookies
            </h2>
            <p>
              Você pode bloquear ou apagar cookies a qualquer momento nas configurações do seu
              navegador. Veja as instruções oficiais:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#556B2F] underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/pt-BR/kb/gerencie-configuracoes-de-cookies-e-dados-de-sites"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#556B2F] underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/pt-br/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#556B2F] underline"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/pt-br/microsoft-edge/excluir-cookies-no-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#556B2F] underline"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>
            <p>
              Lembre-se de que desativar cookies pode afetar o funcionamento de algumas partes do
              site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">8. Alterações nesta política</h2>
            <p>
              Esta Política de Cookies pode ser atualizada periodicamente para refletir mudanças na
              legislação ou nos serviços que utilizamos. Recomendamos revisitá-la de tempos em
              tempos. Para saber mais sobre o tratamento dos seus dados, consulte também a nossa{" "}
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
