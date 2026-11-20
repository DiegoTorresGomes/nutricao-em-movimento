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

const lastUpdate = "20 de novembro de 2026";

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
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">1. Cookies e armazenamento</h2><p>Cookies são pequenos registros no navegador. Também usamos localStorage para lembrar escolhas e sessionStorage para evitar contar repetidamente a visualização de um artigo na mesma sessão. Esses recursos têm finalidades diferentes.</p></section>
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">2. Recursos necessários</h2><p>Sua escolha sobre estatísticas é guardada em localStorage (nem-consent-v3) e no cookie próprio nem-consent por até 180 dias. O registro contém versão, categoria e data da decisão. Ele lembra inclusive a recusa e não é usado para publicidade. A área administrativa usa cookies de autenticação e segurança. A navegação pública não depende de aceitar estatísticas.</p><p>Se o navegador bloquear esse armazenamento, a decisão pode valer apenas durante a página aberta e o aviso pode reaparecer depois. Quando as preferências mudam de versão, pedimos uma nova decisão: escolhas registradas em versões anteriores não são convertidas em autorização.</p></section>
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">3. Estatísticas opcionais</h2><p>O Google Analytics só é carregado depois que você aceita Estatísticas no aviso do site ou em “Preferências de cookies”. Essa escolha vale para todos os visitantes, em qualquer país, e não depende da mensagem do Google. Sem decisão ou com recusa, o Analytics não é carregado e nenhum dado de estatística é enviado.</p><p>Com Estatísticas aceitas, o Google Analytics pode tratar dados de navegação, páginas visitadas, eventos, dispositivo, origem do acesso e identificadores como os cookies _ga e _ga_*. Relatórios agregados não significam que todos os dados de origem sejam anônimos. Google Signals e personalização de anúncios pelo Analytics ficam desativados.</p><p>Enquanto a mensagem do Google também coletar a finalidade de análise (visitantes do EEE, Reino Unido e Suíça), uma recusa feita nela também impede as estatísticas, mesmo que você as tenha aceitado aqui; uma aceitação feita apenas na mensagem do Google não ativa o Analytics sem a sua escolha neste site.</p><p>Google Tag Manager e Microsoft Clarity não são carregados nesta versão. Sua inclusão futura exige revisão desta política e do controle de consentimento.</p></section>
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">4. Publicidade</h2><p>As páginas públicas carregam o Google AdSense para anúncios automáticos e para exibir a mensagem de consentimento do Google quando aplicável. Login, administração e APIs não recebem esse script. A presença do script não garante anúncios: a exibição depende da aprovação e das configurações do Google.</p><p>O Google e seus parceiros podem usar cookies e identificadores para publicidade conforme as escolhas e regras aplicáveis. No EEE, Reino Unido e Suíça, as escolhas de publicidade são feitas na mensagem do Google, uma plataforma de gestão de consentimento certificada. O aviso do site trata apenas de estatísticas: aceitar estatísticas não autoriza publicidade, e o aviso do site nunca altera escolhas de publicidade. Informações e controles externos estão na <a href="https://policies.google.com/technologies/ads?hl=pt-BR" target="_blank" rel="noreferrer" className="font-semibold text-[#556B2F] underline">política de publicidade do Google</a> e em <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer" className="font-semibold text-[#556B2F] underline">Configurações de anúncios do Google</a>.</p></section>
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">5. Sua decisão</h2><p>O aviso do site permite aceitar estatísticas, recusar estatísticas ou gerenciar preferências. Os recursos necessários permanecem ativos; estatísticas começam desativadas. Continuar navegando, fechar a página ou ignorar o aviso não é aceitação.</p><p>Quando a mensagem do Google estiver aberta, o aviso do site aguarda o fechamento dela para não sobrepor as duas interfaces; a ordem de exibição não autoriza nada. O aviso do site registra sua escolha e informa o Google Consent Mode apenas sobre estatísticas (analytics_storage). Ele não é uma plataforma de consentimento certificada pelo Google e não participa do TCF.</p></section>
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">6. Alterar ou retirar consentimento</h2><p>No rodapé, “Preferências de cookies” abre suas escolhas de estatísticas a qualquer momento. Quando a mensagem do Google estiver disponível na página, “Privacidade e publicidade (Google)” reabre essa mensagem para rever escolhas de publicidade. Cada controle altera apenas a sua própria finalidade, e a nova decisão substitui a anterior.</p><p>Ao retirar estatísticas, o Analytics deixa de enviar dados; se já estava carregado, a página é recarregada para encerrar o código em execução. A aplicação tenta remover os cookies opcionais conhecidos do Analytics acessíveis no próprio domínio. Isso não apaga dados já enviados nem cookies de outros domínios, e não altera cookies de publicidade. Para excluir outros registros, use as configurações do navegador; o <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="font-semibold text-[#556B2F] underline">complemento de exclusão do Analytics</a> também é uma opção. A retirada de cookies não cancela uma inscrição de newsletter.</p></section>
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">7. Mais informações</h2><p>Outros recursos necessários, como hospedagem e entrega de imagens, podem receber dados técnicos para atender às requisições. Recusar estatísticas não bloqueia a infraestrutura necessária. Consulte a <Link href="/pt/politica-de-privacidade" className="font-semibold text-[#556B2F] underline">Política de Privacidade</Link> e entre em contato pela <Link href="/pt/contato" className="font-semibold text-[#556B2F] underline">página de Contato</Link>. Esta política pode ser atualizada quando os serviços mudarem.</p></section>
        </div>
      </main>
    </PublicLayout>
  );
}
