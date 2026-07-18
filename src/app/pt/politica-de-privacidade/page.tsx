import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { LegalPageSchema } from "@/components/seo/LegalPageSchema";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como o Nutrição & Movimento coleta, usa e protege seus dados pessoais, em conformidade com a LGPD, incluindo cookies, newsletter e analytics.",
  alternates: {
    canonical: "/pt/politica-de-privacidade",
  },
  openGraph: {
    title: "Política de Privacidade | Nutrição & Movimento",
    description:
      "Como o Nutrição & Movimento coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.",
    url: "/pt/politica-de-privacidade",
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
    title: "Política de Privacidade | Nutrição & Movimento",
    description:
      "Como o Nutrição & Movimento coleta, usa e protege seus dados pessoais (LGPD).",
    images: ["/images/og/nutricao-em-movimento.jpg"],
  },
};

const lastUpdate = "18 de julho de 2026";

export default function PoliticaPrivacidadePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-6 py-20">
        <LegalPageSchema
          title="Política de Privacidade"
          path="/pt/politica-de-privacidade"
          description="Como o Nutrição & Movimento coleta, usa e protege seus dados pessoais, em conformidade com a LGPD."
        />

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">
          Privacidade e proteção de dados
        </p>

        <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
          Política de Privacidade
        </h1>

        <p className="mt-5 text-sm text-neutral-500">Última atualização: {lastUpdate}</p>

        <div className="mt-10 space-y-10 text-base leading-8 text-neutral-700">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">1. Introdução</h2>
            <p>
              O <strong>Nutrição & Movimento</strong> (&ldquo;nós&rdquo;, &ldquo;nosso&rdquo; ou
              &ldquo;site&rdquo;) é um portal de conteúdo educativo sobre nutrição, comportamento
              alimentar, emagrecimento sustentável e Bem-Estar Nutricional. Levamos a sua privacidade a
              sério e esta Política descreve, de forma transparente, como coletamos, utilizamos,
              armazenamos e protegemos os seus dados pessoais, em conformidade com a{" "}
              <strong>Lei nº 13.709/2018 (Lei Geral de Proteção de Dados — LGPD)</strong> e com as
              boas práticas exigidas pelo Google (AdSense e Search).
            </p>
            <p>
              Ao utilizar o site, você declara estar ciente e de acordo com as práticas descritas
              nesta Política de Privacidade.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">2. Dados que coletamos</h2>
            <p>Podemos coletar duas categorias de dados:</p>

            <h3 className="text-lg font-semibold text-[#111111]">
              2.1. Dados fornecidos por você
            </h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Nome</strong> (quando informado voluntariamente em formulários);
              </li>
              <li>
                <strong>E-mail</strong> (ao assinar a newsletter ou entrar em contato);
              </li>
              <li>
                <strong>Mensagens</strong> enviadas através do formulário de contato.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-[#111111]">
              2.2. Dados coletados automaticamente
            </h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Endereço de IP;</li>
              <li>Tipo e versão do navegador;</li>
              <li>Tipo de dispositivo e sistema operacional;</li>
              <li>Páginas acessadas e conteúdos visualizados;</li>
              <li>Data, hora e duração da visita;</li>
              <li>Origem do tráfego (site de referência);</li>
              <li>Cookies e tecnologias semelhantes (ver seção 4).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">
              3. Finalidade e base legal do tratamento
            </h2>
            <p>Utilizamos os dados coletados para as seguintes finalidades:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Newsletter:</strong> enviar conteúdos e novidades a quem manifestou interesse
                (base legal: consentimento);
              </li>
              <li>
                <strong>Contato:</strong> responder dúvidas, solicitações e mensagens (base legal:
                consentimento / procedimentos preliminares);
              </li>
              <li>
                <strong>Melhoria da experiência:</strong> entender como o conteúdo é utilizado e
                aprimorar a navegação (base legal: legítimo interesse);
              </li>
              <li>
                <strong>Segurança:</strong> prevenir fraudes, abusos e acessos indevidos (base legal:
                legítimo interesse);
              </li>
              <li>
                <strong>Estatísticas:</strong> medir audiência de forma agregada e anônima (base
                legal: legítimo interesse / consentimento quando aplicável);
              </li>
              <li>
                <strong>Publicidade:</strong> exibir anúncios e, mediante consentimento, personalizá-los
                (base legal: consentimento).
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">4. Cookies</h2>
            <p>
              Utilizamos cookies próprios e de terceiros para o funcionamento do site, análise de
              audiência e publicidade. O detalhamento completo das categorias, finalidades e formas de
              gerenciamento está descrito na nossa{" "}
              <Link href="/pt/politica-de-cookies" className="font-semibold text-[#556B2F] underline">
                Política de Cookies
              </Link>
              . Você pode gerenciar suas preferências a qualquer momento pelo banner de consentimento
              ou pelas configurações do seu navegador.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">5. Google AdSense</h2>
            <p>
              Este site poderá exibir anúncios por meio do <strong>Google AdSense</strong>. Para isso,
              o Google e seus parceiros utilizam cookies para veicular anúncios com base em visitas
              anteriores a este e a outros sites.
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                Fornecedores terceiros, incluindo o Google, usam cookies (como o cookie{" "}
                <strong>DoubleClick / DART</strong>) para exibir anúncios;
              </li>
              <li>
                A personalização de anúncios depende do seu consentimento e pode ser desativada;
              </li>
              <li>
                Você pode gerenciar as preferências em{" "}
                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#556B2F] underline"
                >
                  Configurações de anúncios do Google
                </a>{" "}
                e obter mais informações na{" "}
                <a
                  href="https://policies.google.com/technologies/ads?hl=pt-BR"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#556B2F] underline"
                >
                  política de publicidade do Google
                </a>
                .
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">6. Google Analytics</h2>
            <p>
              Poderemos utilizar o <strong>Google Analytics</strong>, serviço de análise de tráfego do
              Google, para coletar estatísticas de uso de forma agregada e anônima (páginas mais
              visitadas, tempo de permanência, origem do tráfego). Esse serviço só será ativado
              mediante o seu consentimento e não é utilizado para identificá-lo pessoalmente. Você pode
              impedir a coleta instalando o{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#556B2F] underline"
              >
                complemento de exclusão do Google Analytics
              </a>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">7. Cloudinary</h2>
            <p>
              As imagens exibidas no site podem ser hospedadas e processadas pelo{" "}
              <strong>Cloudinary</strong>, serviço de gestão e otimização de mídia. Ao carregar uma
              imagem, seu navegador se comunica com os servidores do Cloudinary, que podem registrar
              dados técnicos (como IP e tipo de dispositivo) para fins de entrega e segurança do
              conteúdo, conforme a política de privacidade do próprio Cloudinary.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">8. Newsletter</h2>
            <p>
              Ao assinar a nossa newsletter, o seu e-mail é armazenado de forma segura em nossa base de
              dados. Adotamos o modelo de <strong>confirmação dupla (double opt-in)</strong>: após o
              cadastro, você recebe um e-mail solicitando a confirmação da assinatura e só passa a
              integrar a lista após clicar no link de confirmação.
            </p>
            <p>
              Registramos a data, a hora e o endereço de IP do consentimento, exclusivamente para fins
              de comprovação legal (LGPD). Você pode <strong>cancelar a assinatura a qualquer
              momento</strong> por meio do link de descadastro presente em todos os e-mails que
              enviamos, sem qualquer custo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">9. Microsoft Clarity</h2>
            <p>
              Poderemos utilizar o <strong>Microsoft Clarity</strong> para entender como os visitantes
              interagem com o site por meio de métricas comportamentais, mapas de calor e reprodução de
              sessões, com o objetivo de melhorar a experiência de navegação. Quando ativo, esse serviço
              opera mediante consentimento e captura informações de uso e interação de forma agregada.
              Mais informações estão disponíveis na declaração de privacidade da Microsoft.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">10. Google Tag Manager</h2>
            <p>
              Poderemos utilizar o <strong>Google Tag Manager</strong> para gerenciar, de forma
              centralizada, as tags de medição e marketing do site. O Tag Manager, por si só, não coleta
              dados pessoais — ele apenas orquestra a execução de outras ferramentas (como Analytics e
              Clarity), sempre respeitando as suas escolhas de consentimento.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">
              11. Direitos do titular dos dados
            </h2>
            <p>
              Nos termos da LGPD, você, como titular dos dados, pode exercer a qualquer momento os
              seguintes direitos:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Confirmação e acesso</strong> aos dados que tratamos;
              </li>
              <li>
                <strong>Correção</strong> de dados incompletos, inexatos ou desatualizados;
              </li>
              <li>
                <strong>Anonimização, bloqueio ou eliminação</strong> de dados desnecessários ou
                tratados em desconformidade com a lei;
              </li>
              <li>
                <strong>Portabilidade</strong> dos dados a outro fornecedor de serviço;
              </li>
              <li>
                <strong>Eliminação</strong> dos dados tratados com base no consentimento;
              </li>
              <li>
                <strong>Revogação do consentimento</strong> a qualquer momento;
              </li>
              <li>
                <strong>Oposição</strong> a tratamentos realizados com base em legítimo interesse.
              </li>
            </ul>
            <p>
              Para exercer esses direitos, entre em contato conosco pela nossa{" "}
              <Link href="/pt/contato" className="font-semibold text-[#556B2F] underline">
                página de Contato
              </Link>
              .
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">12. Segurança dos dados</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger os seus dados contra acessos
              não autorizados, perda, alteração ou divulgação indevida, incluindo conexão criptografada
              (HTTPS), controle de acesso à área administrativa, autenticação em duas etapas e
              armazenamento em ambiente seguro. Nenhum método de transmissão pela internet é 100%
              seguro, mas trabalhamos continuamente para preservar a integridade das informações.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">
              13. Compartilhamento de dados
            </h2>
            <p>
              Não vendemos os seus dados pessoais. O compartilhamento ocorre apenas com prestadores de
              serviço necessários ao funcionamento do site (como provedores de hospedagem, e-mail,
              mídia e ferramentas de análise e publicidade citadas nesta Política) e, quando exigido,
              com autoridades competentes, no cumprimento de obrigações legais ou regulatórias.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">14. Retenção dos dados</h2>
            <p>
              Mantemos os dados pessoais apenas pelo tempo necessário para cumprir as finalidades
              descritas nesta Política ou para atender a obrigações legais. Dados de newsletter são
              mantidos enquanto durar a assinatura; após o cancelamento, são eliminados ou anonimizados,
              ressalvados os registros de consentimento exigidos por lei.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">
              15. Contato do controlador
            </h2>
            <p>
              O controlador dos dados é o <strong>Nutrição & Movimento</strong>. Para questões
              relacionadas a esta Política de Privacidade ou ao exercício dos seus direitos, entre em
              contato pela nossa{" "}
              <Link href="/pt/contato" className="font-semibold text-[#556B2F] underline">
                página de Contato
              </Link>
              . Responderemos às solicitações dentro dos prazos previstos na legislação aplicável.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">
              16. Alterações nesta Política
            </h2>
            <p>
              Esta Política de Privacidade pode ser atualizada periodicamente para refletir mudanças
              legais, regulatórias ou nos serviços utilizados. A data da última atualização é sempre
              indicada no topo desta página. Recomendamos que você a revise regularmente. Alterações
              relevantes poderão ser comunicadas por meios adequados.
            </p>
          </section>
        </div>
      </main>
    </PublicLayout>
  );
}