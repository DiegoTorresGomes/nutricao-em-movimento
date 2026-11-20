# Analytics e consentimento

Atualizado em 20/11/2026. Separação por finalidade; implementação local pronta para deploy (ver [implementação final](analytics/implementacao-final/relatorio.md)).

## AdSense e defaults

Uma única tag assíncrona nativa do AdSense fica no HTML inicial do head de /pt e das páginas públicas desse layout, com o publisher ca-pub-3638053236344020 e sem `data-nscript`. Os quatro defaults denied rodam no script inline imediatamente anterior. Auto Ads e mensagens são geridos no painel Google.

Um `<noscript data-nem-hydration-anchor>` inerte precede o script de defaults. Motivo: o `adsbygoogle.js` insere o `show_ads_impl.js`, sem `async`, antes do primeiro `<script>` do documento. Se isso acontecesse antes da hidratação, o React 19 tomaria esse script pelo de defaults (erro #418). Com o âncora, o React o ignora.

## Quem decide cada finalidade

**Publicidade** (`ad_storage`, `ad_user_data`, `ad_personalization`): a CMP certificada do Google (mensagem de Regulamentações europeias), quando aplicável. O site nunca escreve esses sinais.

**Estatísticas** (`analytics_storage`): o banner do site, para todos os visitantes e independentemente de a CMP carregar. Não há inferência por tempo, idioma, IP ou geografia.
- **Botões:** Aceitar estatísticas, Recusar estatísticas, Gerenciar preferências.
- **Persistência:** v3, por até 180 dias, em localStorage `nem-consent-v3` e no cookie `nem-consent`, com fallback em memória. Registros v1/v2 são ignorados, nunca convertidos.
- **Interface:** o banner aguarda enquanto a mensagem do Google está aberta (TCF `cmpuishown`), para as duas interfaces nunca se sobreporem.

**Transição, enquanto o painel mantiver o propósito de análise ativo na mensagem europeia:**
- uma recusa do Google (DENIED) prevalece sobre o "sim" do site e equivale a uma recusa explícita;
- uma concessão do Google (GRANTED) sozinha nunca carrega o GA;
- com a CMP aplicável ainda sem resposta (UNKNOWN), um "sim" do site fica suspenso: `ga-disable` ligado, sem hits, sem recarga e sem apagar `_ga`.

O site só envia `analytics_storage`, e só quando o valor na fila difere do decidido. Assim reafirma a decisão após outro escritor e não gera atualizações redundantes.

**Depois de desativar a análise no painel:** a CMP passa a responder NOT_CONFIGURED (4) e só o site decide estatísticas.

## Google Analytics

O GA é direto e único, carregado somente após `analytics_storage=granted` (Consent Mode básico), com `NEXT_PUBLIC_GA_ID`. Não há loader GA no HTML inicial. Google Signals e personalização de anúncios pelo GA ficam desativados. GTM e Clarity não são montados.

Há uma única fonte de `page_view`:
- o `config` envia a página de entrada;
- as navegações vêm do Enhanced Measurement por eventos de histórico, que precisa ficar ativo no painel do GA4.

## Revogação e cookies

Uma recusa explícita desativa o GA, limpa só os cookies GA acessíveis e recarrega se o GA já executou. Inicialização, foco, navegação, recarga, estado suspenso e espera da CMP nunca apagam `_ga`. Cookies publicitários, dados já enviados e cookies externos não são afetados.

O rodapé tem dois controles:
- "Preferências de cookies", para estatísticas, sempre disponível;
- "Privacidade e publicidade (Google)", que reabre a mensagem via `showRevocationMessage` e só aparece quando a CMP está presente.

## Outros pontos

Login e administração usam um layout raiz com os defaults, sem AdSense e sem GA. A transição entre os layouts abre um documento novo. APIs e XML são servidos fora dos layouts de página.

Newsletter permanece sem provedor integrado. Não houve mudança de banco, sitemap, feed ou conteúdo editorial.
