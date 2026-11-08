import type { Metadata } from "next";
import Link from "next/link";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { LegalPageSchema } from "@/components/seo/LegalPageSchema";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Saiba como o Nutrição & Movimento coleta, usa e protege seus dados pessoais, com informações sobre a LGPD, incluindo cookies, newsletter e analytics.",
  alternates: {
    canonical: "/pt/politica-de-privacidade",
  },
  openGraph: {
    title: "Política de Privacidade | Nutrição & Movimento",
    description:
      "Como o Nutrição & Movimento coleta, usa e protege seus dados pessoais, com informações sobre a LGPD.",
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

const lastUpdate = "8 de novembro de 2026";

export default function PoliticaPrivacidadePage() {
  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-6 py-20">
        <LegalPageSchema
          title="Política de Privacidade"
          path="/pt/politica-de-privacidade"
          description="Como o Nutrição & Movimento coleta, usa e protege seus dados pessoais, com informações sobre a LGPD."
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
              armazenamos e protegemos os seus dados pessoais, considerando a{" "}
              <strong>Lei nº 13.709/2018 (Lei Geral de Proteção de Dados — LGPD)</strong> e com as
              orientações de privacidade aplicáveis aos serviços utilizados.
            </p>
            <p>
              Esta política informa nossas práticas. A navegação não equivale a consentimento para
              estatísticas ou publicidade; as escolhas opcionais são feitas no painel de cookies.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">2. Dados que coletamos</h2>
            <p>Os dados variam conforme os recursos utilizados e suas escolhas:</p>

            <h3 className="text-lg font-semibold text-[#111111]">
              2.1. Dados fornecidos por você
            </h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Nome</strong> (quando informado voluntariamente em formulários);
              </li>
              <li>
                <strong>E-mail</strong> (ao entrar em contato ou em pedidos anteriores de newsletter);
              </li>
              <li>
                <strong>Mensagens</strong> enviadas pelos canais indicados na página de contato.
              </li>
            </ul>

            <h3 className="text-lg font-semibold text-[#111111]">
              2.2. Dados coletados automaticamente
            </h3>
            <p>Hospedagem e entrega de recursos podem receber dados técnicos necessários. Com Estatísticas aceitas, o Analytics configurado também pode tratar dados de navegação. Nem todos os itens abaixo são coletados em todas as visitas:</p>
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
                <strong>Newsletter:</strong> a captura pública está temporariamente desativada. Cadastros anteriores são tratados
                conforme as informações de retenção e os direitos descritos nesta Política;
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
                <strong>Estatísticas:</strong> medir audiência com Google Analytics quando configurado e somente após
                aceitar Estatísticas (base legal adotada para essa opção: consentimento);
              </li>
              <li>
                <strong>Publicidade:</strong> recurso pausado nesta versão; qualquer ativação futura exige
                revisão dos controles e informações aplicáveis.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">4. Cookies</h2>
            <p>Usamos armazenamento necessário para lembrar escolhas e manter funções essenciais. O painel próprio permite aceitar ou recusar estatísticas opcionais; publicidade está pausada. Use “Preferências de cookies” no rodapé para alterar ou retirar a decisão a qualquer momento. A escolha, com versão e data, fica em localStorage e cookie próprio por até 180 dias. Se o armazenamento for bloqueado, ela pode não persistir.</p><p>Detalhes na <Link href="/pt/politica-de-cookies" className="font-semibold text-[#556B2F] underline">Política de Cookies</Link>. O painel não é uma CMP certificada pelo Google e não comprova integração TCF.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">5. Google AdSense</h2>
            <p>A publicidade está pausada nesta versão. O identificador público da conta e o ads.txt permitem preparar a verificação do site, mas a aplicação não carrega o script de anúncios.</p><p>Uma ativação futura poderá envolver cookies do Google e parceiros, inclusive para anúncios com base em visitas a este e a outros sites. Depende de configuração própria de consentimento e requisitos regionais; não afirmamos existir CMP certificada ativa. Informações em <a href="https://policies.google.com/technologies/ads?hl=pt-BR" target="_blank" rel="noreferrer" className="font-semibold text-[#556B2F] underline">publicidade do Google</a> e controles em <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer" className="font-semibold text-[#556B2F] underline">Configurações de anúncios do Google</a>.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">6. Google Analytics</h2>
            <p>Quando configurado, o Google Analytics é utilizado para medir o uso das páginas públicas após aceitar Estatísticas. Sem decisão ou com recusa, a aplicação não carrega esse script. O serviço pode tratar identificadores, cookies, informações de dispositivo, origem e eventos de navegação; relatórios agregados não tornam todos os dados anônimos.</p><p>Você pode retirar a escolha pelo rodapé. Se o serviço já tiver sido carregado, a página será recarregada para encerrar sua execução; a retirada não desfaz dados já enviados. Há também um <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="font-semibold text-[#556B2F] underline">complemento de exclusão do Google Analytics</a>.</p>
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
            <p>A captura pública da newsletter está temporariamente desativada enquanto o envio automático não estiver integrado. Não recebemos novas inscrições nem confirmamos pedidos por esse fluxo e não enviamos materiais ou conteúdos periódicos.</p><p>Os cadastros anteriores foram preservados. Para solicitar informações, correção, retirada do pedido ou exclusão do cadastro, use a <Link href="/pt/contato" className="font-semibold text-[#556B2F] underline">página de Contato</Link>.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">9. Microsoft Clarity</h2>
            <p>Microsoft Clarity não é carregado nesta versão. Sua ativação futura depende de integração de consentimento, avaliação do tratamento e atualização desta política.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[#111111]">10. Google Tag Manager</h2>
            <p>Google Tag Manager não é carregado nesta versão. O gerenciamento remoto de tags requer auditoria própria antes de ativação para evitar scripts sem consentimento ou duplicados; preencher uma variável de ambiente não o ativa nesta implementação.</p>
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
            <p>Na área administrativa, dados de conta, autenticação, sessões e registros de segurança são usados para controle de acesso e prevenção de abuso. Essa área não carrega Analytics nem publicidade.</p>
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
              descritas nesta Política ou para atender a obrigações legais. Pedidos pendentes de newsletter podem permanecer no banco até revisão ou solicitação de exclusão;
              a expiração do token não apaga automaticamente o cadastro. A rotina automática de retenção
              e eliminação desses pedidos ainda precisa ser formalizada.
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
