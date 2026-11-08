# Correções de consentimento e preparação AdSense

Data: 08/11/2026. **Implementação e validação locais; sem deploy.**

## Resultado

Concluídos: ads.txt, centralização do publisher, bloqueio de Analytics até autorização, defaults e updates de Consent Mode, recusa na primeira camada, reabertura pelo footer, persistência/versionamento e correções de políticas. **A integração de veiculação AdSense/CMP foi interrompida por falta de comprovação da configuração certificada/regional. A publicidade está pausada no código entregue.** Não foi inventada certificação nem adicionada uma unidade de anúncio.

O servidor local de produção respondeu `/ads.txt` em **200, text/plain; charset=UTF-8**, com conteúdo exato. O último diagnóstico público continua sendo 404: nenhum arquivo chegou à produção nesta etapa. Não interpretar o resultado local como correção já publicada.

## Auditoria de entrada

Foram lidos [relatório geral](../adsense-pre-reenvio/relatorio-geral.md), [scorecard](../adsense-pre-reenvio/scorecard.md), [bloqueadores](../adsense-pre-reenvio/bloqueadores.md), [checklist](../adsense-pre-reenvio/checklist.md), layouts, banner, bibliotecas de consentimento, Analytics, políticas, configuração de terceiros e variáveis relevantes. A auditoria original permanece como retrato histórico da produção, sem sobrescrever seus resultados.

Antes: AdSense hardcoded no head global, inclusive login/erro; GA configurado e loader independente de autorização; defaults denied condicionados à presença de ferramentas; banner próprio v1 com analytics/ads desativados inicialmente, aceitar e personalizar, recusa apenas na segunda camada; localStorage + cookie; ausência de reabertura persistente; políticas com Analytics futuro, continuidade como concordância e afirmação não comprovada sobre mecanismos Google.

A configuração local tem GA preenchido, GTM/Clarity ausentes. Apenas a presença das variáveis foi registrada em [ambiente-publico.json](ambiente-publico.json), sem valores nem credenciais. O ambiente remoto não foi consultado nesta fase. Os componentes legados GTM/Clarity permanecem no repositório, **sem montagem**; preencher suas variáveis não os ativa agora.

Os guias solicitados por AGENTS.md não estavam disponíveis em `node_modules/next/dist/docs/`. Antes de escrever código, foram consultadas as referências oficiais da versão Next 15.5.29 para [public](https://nextjs.org/docs/15/app/api-reference/file-conventions/public-folder), [Script](https://nextjs.org/docs/15/app/api-reference/components/script) e [usePathname](https://nextjs.org/docs/15/app/api-reference/functions/use-pathname).

## Publisher, ads.txt e verificação

O identificador público **ca-pub-3638053236344020** foi confirmado no layout anterior e nas evidências de HTML público da auditoria. Não houve divergência. Agora está em `src/config/monetization.ts`; a metadata `google-adsense-account` usa essa constante. `public/ads.txt` é a opção estática simples do Next:

```text
google.com, pub-3638053236344020, DIRECT, f08c47fec0942fa0
```

Um teste compara o arquivo exato à configuração central, incluindo publisher, DIRECT e authority ID. O arquivo estático inevitavelmente contém a linha literal; mudar a conta exige mudar a constante e o arquivo juntos e repetir esse teste. Não foram usadas credenciais privadas.

A metadata/ads.txt permitem preparar uma modalidade oficial de verificação sem carregar o script publicitário incondicionalmente. A verificação e a associação real da conta continuam sendo **AÇÃO HUMANA NO ADSENSE**. O Google aceita alternativas de conexão por metadata e ads.txt; ads.txt é fortemente recomendado, sem obrigatoriedade universal. [Conexão oficial](https://support.google.com/adsense/answer/7584263?hl=en), [guia ads.txt](https://support.google.com/adsense/answer/12171612?hl=en).

## Modelo de consentimento entregue

É um **banner próprio de consentimento com controle efetivo de carregamento do GA**, não apenas uma interface informativa. **Não é CMP certificada Google/IAB, não produz TC String e não comprova integração TCF.** O modelo registra escolhas locais e envia Consent Mode; não é um parecer jurídico ou prova centralizada de consentimento.

| Estado/ação | Comportamento |
|---|---|
| Novo visitante | Nenhum opcional autorizado; defaults dos quatro sinais denied; nenhum loader externo de GA/AdSense/GTM/Clarity |
| Aceitar opcionais | Autoriza Estatísticas; Analytics configurado é solicitado uma vez, após o update; Publicidade continua desativada |
| Recusar opcionais | Salva analytics=false/ads=false, fecha o aviso e não carrega opcionais |
| Preferências | Mostra Necessários sempre ativos, Estatísticas selecionável e Publicidade pausada/desabilitada |
| Salvar preferências | Substitui a decisão anterior pela categoria selecionada; não acumula autorizações antigas |
| Footer: Preferências de cookies | Reabre com a escolha atual; pode salvar, recusar ou fechar sem alterar; foco vai ao título e retorna ao controle de origem ao fechar |
| Retirar estatísticas já carregadas | Persiste recusa, envia denied, aplica ga-disable, tenta remover cookies opcionais próprios conhecidos e recarrega para encerrar código já executado |
| Recarregar com escolha válida | Lê a escolha e faz update antes de configurar GA; sem recusa/ausência de escolha não carrega o loader |
| Estado inválido, vencido ou v1 | Não é reutilizado; uma nova decisão é necessária |

Recusar, preferências e aceitar aparecem juntos na primeira camada, com o mesmo estilo visual e acesso. O painel tem limite de altura e rolagem para telas pequenas; isso é preparação no código, **sem validação visual de mobile nesta fase**. O diálogo é não modal; fechar sem alterar só é oferecido quando já há decisão válida.

### Persistência

Versão **2**, localStorage `nem-consent-v2` e cookie próprio `nem-consent`, com categorias e data ISO. Validade de até **180 dias**; cookie `Path=/`, `SameSite=Lax`, `Secure` em HTTPS. A versão antiga é invalidada; a chave antiga é removida ao salvar uma nova escolha. O parser exige versão/categorias válidas e data não vencida/futura. Cookie é fallback quando localStorage não funciona. Se ambos forem bloqueados, o estado vale em memória durante o documento e pode ser pedido novamente depois.

Eventos próprios atualizam a página; eventos de storage tratam mudanças entre abas. O registro local não contém IP nem identifica a pessoa e não é um log remoto de comprovação jurídica. A expiração é conferida na leitura; uma aba com o serviço aberto é reavaliada no foco/navegação. Não se promete apagamento de dados já transmitidos ou cookies de domínios de terceiros; o navegador oferece controles adicionais.

### Consent Mode e scripts

`ConsentModeInit` sempre emite uma fila local no head, sem requisição externa, mesmo sem GA configurado. Defaults:

- `analytics_storage`: denied;
- `ad_storage`: denied;
- `ad_user_data`: denied;
- `ad_personalization`: denied.

Somente `analytics_storage` pode virar granted após autorização. Os três sinais publicitários permanecem denied, inclusive ao aceitar opcionais, pois publicidade está pausada. GA é carregado dinamicamente e de modo assíncrono apenas no `PublicLayout` após autorização; o update precede config/page_view. Deduplicação impede loaders repetidos e a configuração desativa sinais Google e personalização de publicidade. Antes da decisão, não se usa loader GA em modo avançado para enviar pings sem cookies. A fila local de defaults não é uma chamada Google.

Revogação precisa de uma página nova porque remover um nó script não desfaz código executado. A nova página não carrega GA se a escolha for recusa; o site tenta limpar `_ga`, `_ga_*`, `_gid`, `_gat*`, `__gads`, `__gpi` e `__eoi` acessíveis nos escopos de domínio/caminho tentados. Não remove cookies essenciais ou de outros domínios. A condição efetiva de cookies Google reais exige futura inspeção controlada de navegador/rede; os testes desta entrega usam mocks. [Implementação oficial de Consent Mode](https://developers.google.com/tag-platform/security/guides/consent).

O loader global do AdSense foi retirado. Não há script publicitário para duplicar ou posição de anúncio alterada; não há unidades/formatos novos. A metadata contém apenas o ID público. Não existe flag/variável para ligar anúncios nesta entrega: concluir verificações da conta **e uma integração técnica futura revisada** é necessário para retomar a veiculação. Isso evita tratar o banner próprio como substituto de CMP certificada.

## Regiões e limite da parte CMP

Não foi criada geolocalização. Brasil e demais regiões recebem o mesmo controle explícito de Estatísticas e publicidade pausada. Para EEE/Reino Unido/Suíça, o Google exige CMP certificada com TCF para anúncios personalizados; elegibilidade de anúncios não personalizados/limitados deve ser conferida conforme estratégia e regras aplicáveis. Não afirmamos que o banner atual satisfaça esse requisito.

**AÇÃO HUMANA NO ADSENSE:** confirmar status/domínio/publisher, Privacy & Messaging, CMP publicada/certificada e regiões, Auto Ads e políticas. Configurar o painel não garante, sozinho, que a CMP será carregada e transmitirá sinais no código atual: o loader de anúncios permanece retirado. Uma integração futura precisa validar bootstrap da CMP, obtenção do sinal, ordem de carregamento e comunicação com os serviços. Não se deve carregar anúncios primeiro apenas para fazer uma mensagem aparecer. [Exigência regional oficial](https://support.google.com/adsense/answer/13554116?hl=en).

## Políticas e footer

- **Cookies:** substituído o texto contraditório por explicação do modelo atual: necessários, estatísticas condicionais, publicidade pausada, armazenamento/versionamento, rejeição, reabertura, revogação e limites. Removidos concordância por navegação e pressuposto de mecanismos Google já ativos.
- **Privacidade:** harmonizados cookies, GA, publicidade, contato e dados administrativos; retiradas garantias de anonimato integral e conformidade automática. A newsletter informa que cadastro/fluxo existem, mas envio automático não está integrado; não promete confirmação ou link de descadastro inexistentes. Expiração de token não foi confundida com eliminação do cadastro.
- **Termos:** somente ajuste da promessa de newsletter para concordar com o serviço real e atualização da data. A publicidade condicional continua compatível com eventual ativação futura; não foi reescrita por estética.
- **Disclaimer e Política Editorial:** auditados e **preservados**, sem conflito direto que exigisse mudança. Independência editorial/patrocínios permanecem como estavam.
- **Footer:** mantidos Privacidade, Cookies, Termos, Disclaimer e Editorial; adicionado um único botão “Preferências de cookies”.

Esses textos descrevem a versão local preparada. Só devem ser tomados como políticas em vigor no site depois de futura implantação conjunta e autorizada. A implementação/fornecedor da newsletter, seus CTAs, retenção e descadastro não foram corrigidos nesta fase; apenas as políticas deixaram de afirmar entregas não implementadas.

## Login/admin e navegação

O layout global não monta GA, GTM, Clarity ou AdSense. Banner e Analytics são montados exclusivamente no `PublicLayout`; documentos novos de login/admin/API/erro não recebem esses loaders. Um guard encerra a continuidade de código público numa navegação SPA para fora de `/pt`: links comuns fazem navegação de documento e há fallback de recarga para transições programáticas quando GA já executou. Isso não desfaz requisições que ocorreram anteriormente na página pública.

HTTP local: login e 2FA 200, admin sem sessão 307 para login, URL inexistente 404; nenhum loader remoto opcional no HTML dessas respostas. Sessão administrativa autenticada não foi criada/testada. A melhoria de noindex/metadata do login apontada na auditoria anterior **não foi implementada** nesta etapa focada em consentimento; robots/auth existentes foram preservados.

## Validação e segurança do escopo

Resultado: 16/16 testes de estado/componentes com mocks, lint sem erros e dois avisos preexistentes, typecheck aprovado, build Next 15.5.29 aprovado com 37 páginas geradas. Build local com Node 24.14.1, permitido pelo engines atual; isso não confirma runtime hospedado. Uma tentativa de rebuild falhou por EINVAL/readlink no `.next` do OneDrive. O cache foi preservado sob `node_modules/.cache/consent-next-20261108-115418`, ignorado pelo Git, e o build novo passou. Nenhum arquivo-fonte foi apagado. `.next/` continua no `.gitignore`, sem arquivos rastreados ou scripts de apoio adicionados ali.

Prisma generate foi executado pelo build, sem migração ou alteração de esquema/banco. Não foram enviados formulários, acionados endpoints de confirmação/cron/visualizações, alterados artigos ou executados scripts editoriais. Detalhes e limites em [testes.md](testes.md).

## Reavaliação estimada

**Estimativa do código local, não nova auditoria da produção:** Políticas/privacidade/consentimento **12/15** (antes 7); AdSense técnico, incluindo ads.txt, **8/10** (antes 6). Subtotal **20/25**, antes 13/25. Restam validação real/regional, painel Google e implantação futura; publicidade pausada não equivale a monetização operacional aprovada.

Mantidas as notas anteriores de editorial 22/30, confiança 17/20, SEO 13/15 e UX/performance 5/10, sem reauditar ou alterar artigos, o total projetado seria **77/100, AMARELO**, contra 70/100 da auditoria pública anterior. Não recomendar reenvio automático: Lote 2 e demais pendências continuam. Sem deploy, não se atribui 77 ao site público como fato atual.

## Arquivos e encerramento

Alterados: `src/app/layout.tsx`; políticas de cookies/privacidade/termos; `ConsentModeInit.tsx`; `CookieConsent.tsx`; Footer/PublicLayout; `src/lib/consent.ts`; `docs/analytics-and-consent.md`.

Criados: `public/ads.txt`; `src/config/monetization.ts`; `src/lib/consent-services.ts`; `ConsentedAnalytics.tsx`; `ConsentNavigationGuard.tsx`; `CookiePreferencesButton.tsx`; `scripts/consent.test.ts`; `scripts/check-consent-local.mjs`; `scripts/check-consent-http.mjs`; este relatório, checklist Google, testes e arquivos de evidência no mesmo diretório.

Artigos e Lote 2 não foram alterados; não houve escrita no banco, configuração remota, commit, push ou deploy. Pendências de segurança, Search Console, mobile, busca e serviço de newsletter não foram declaradas resolvidas. Não solicitar revisão AdSense automaticamente.
