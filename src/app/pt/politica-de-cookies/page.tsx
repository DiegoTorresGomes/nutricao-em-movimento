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

const lastUpdate = "8 de novembro de 2026";

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
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">2. Recursos necessários</h2><p>A escolha de cookies é guardada em localStorage (nem-consent-v2) e no cookie próprio nem-consent por até 180 dias. O registro contém versão, categorias e data da decisão. Ele lembra inclusive a recusa e não é usado para publicidade. A área administrativa usa cookies de autenticação e segurança. A navegação pública não depende de aceitar estatísticas.</p><p>Se o navegador bloquear esse armazenamento, a decisão pode valer apenas durante a página aberta e o aviso pode reaparecer depois. Uma nova versão das preferências pode pedir outra decisão.</p></section>
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">3. Estatísticas opcionais</h2><p>Quando configurado, o Google Analytics é carregado somente após aceitar a categoria Estatísticas. Pode tratar dados de navegação, páginas, eventos, dispositivo e identificadores como cookies _ga e _ga_*. Relatórios agregados não significam que todos os dados de origem sejam anônimos. Sem decisão ou com recusa, o loader de Analytics não é carregado pela aplicação.</p><p>Google Tag Manager e Microsoft Clarity não são carregados nesta versão. Sua inclusão futura exige revisão desta política e do controle de consentimento.</p></section>
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">4. Publicidade</h2><p>A publicidade está pausada nesta versão: a aplicação não carrega o script do Google AdSense e a categoria Publicidade não pode ser ativada no painel. O identificador público da conta e o arquivo ads.txt apenas preparam a verificação do site; não ativam anúncios.</p><p>Se a publicidade for habilitada futuramente, o Google e seus parceiros poderão usar cookies e identificadores para selecionar anúncios, inclusive com base em visitas a este e a outros sites. Essa ativação depende de configuração e revisão próprias. Informações e controles externos estão na <a href="https://policies.google.com/technologies/ads?hl=pt-BR" target="_blank" rel="noreferrer" className="font-semibold text-[#556B2F] underline">política de publicidade do Google</a> e em <a href="https://adssettings.google.com/" target="_blank" rel="noreferrer" className="font-semibold text-[#556B2F] underline">Configurações de anúncios do Google</a>.</p></section>
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">5. Sua decisão</h2><p>O banner permite aceitar opcionais, recusar opcionais ou abrir Preferências. Os necessários permanecem ativos; estatísticas começam desativadas. Continuar navegando não é aceitação. O banner próprio registra escolhas e envia sinais ao Google Consent Mode; ele não é uma CMP certificada pelo Google nem comprova integração com o TCF.</p><p>A aplicação apresenta essas mesmas opções no Brasil e nas demais regiões, sem geolocalização. Publicidade personalizada no EEE, Reino Unido e Suíça depende de requisitos específicos, incluindo CMP certificada/TCF. Não declaramos que essa integração já esteja ativa.</p></section>
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">6. Alterar ou retirar consentimento</h2><p>Use “Preferências de cookies” no rodapé das páginas públicas para rever a escolha, salvar categorias ou recusar os opcionais. A nova decisão substitui a anterior. Ao retirar estatísticas depois de seu carregamento, a página é recarregada para encerrar o código já executado e impedir novo carregamento.</p><p>A aplicação tenta remover cookies opcionais conhecidos acessíveis no próprio domínio. Isso não apaga dados já enviados nem cookies de outros domínios. Para excluir outros registros, use as configurações do navegador; o <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noreferrer" className="font-semibold text-[#556B2F] underline">complemento de exclusão do Analytics</a> também é uma opção. A retirada de cookies não cancela uma inscrição de newsletter.</p></section>
          <section className="space-y-4"><h2 className="text-2xl font-semibold text-[#111111]">7. Mais informações</h2><p>Outros recursos necessários, como hospedagem e entrega de imagens, podem receber dados técnicos para atender às requisições. Recusar estatísticas não bloqueia a infraestrutura necessária. Consulte a <Link href="/pt/politica-de-privacidade" className="font-semibold text-[#556B2F] underline">Política de Privacidade</Link> e entre em contato pela <Link href="/pt/contato" className="font-semibold text-[#556B2F] underline">página de Contato</Link>. Esta política pode ser atualizada quando os serviços mudarem.</p></section>
        </div>
      </main>
    </PublicLayout>
  );
}
