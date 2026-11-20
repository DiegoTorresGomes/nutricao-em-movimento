# Matriz de consentimento: Alternativa A (protótipo)

## Como foi executada

- **Protótipo:** a Alternativa A rodou numa worktree descartável no scratchpad, criada a partir do HEAD com F2/F3 e já removida. O diff está em `evidencias/prototipo-alternativa-a.diff`. A árvore do projeto não foi alterada.
- **Build e navegador:** build de produção local, Chrome headless e o **gtag.js real**.
- **Proteção da propriedade real:**
  - todos os hits `/g/collect` foram interceptados com resposta 204;
  - as requisições de anúncio e a `fundingchoicesmessages` real foram bloqueadas.
- **CMP do Google:** simulada a partir do contrato documentado (`callbackQueue`, `getGoogleConsentModeValues`, `showRevocationMessage`, eventos TCF), com duas hipóteses declaradas:
  - **H1:** depois da escolha, a CMP chama `gtag('consent','update')` para as finalidades dela;
  - **H2:** com o propósito de análise ativo (ON), essa chamada inclui `analytics_storage`.
- **Como os sinais foram lidos:** os quatro sinais vêm da reprodução dos comandos `consent` do `dataLayer`. Quando houve hit, foram conferidos com o `gcs` que o gtag.js real calculou (`G101` = publicidade negada e análise concedida, nos cenários B e F).
- **Resultado:** **21/21 PASS**. Script em `evidencias/arch-matrix.mjs`; resultado em `evidencias/arch-matrix.json` e `arch-matrix-run.log`.
- **Guarda de vazamento:** nenhum hit chegou à rede sem interceptação (`reachedNetwork=0`). Nesta rodada houve 21 hits, todos interceptados. Em rodadas anteriores, 2 hits foram cancelados no fechamento do contexto do navegador, antes da rede.

Legenda:
- **D/G:** denied/granted.
- **Sinais:** na ordem `ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`.
- **Esperado e observado:** em todas as linhas o observado foi igual ao esperado. A coluna "Observado" registra o valor medido.
- **Valores simulados:** `ad_*` nos cenários europeus vêm da simulação (H1). O resto é medição real.

| # | Cenário | Esperado | Observado | GA4 carregado | `_ga` | page_view | AdSense | Decisão salva | Coleta indevida |
|---|---|---|---|---|---|---|---|---|---|
| A | Brasileiro novo (CMP não carrega) | D D D D, banner visível | D D D D, banner visível, rodapé só "Preferências de cookies" | não | não | 0 | sim | — | nenhuma |
| B | Brasileiro aceita | D G D D | D G D D, `gcs=G101` | sim | sim | 1 | sim | `analytics=true` | nenhuma |
| C | Brasileiro recusa (e recarrega) | D D D D | D D D D, banner não volta | não | não | 0 | sim | `analytics=false` | nenhuma |
| D-OFF | Europeu, mensagem Google na tela (análise OFF) | D D D D, banner próprio recolhido | igual; após "sim" do Google: G D G G e o banner próprio surge | não | não | 0 | sim | — | nenhuma |
| D-ON | Igual, análise ON | D D D D; o Google sozinho não concede estatísticas | após "sim, sim" do Google: G **D** G G (o "sim" do Google para análise não basta) | não | não | 0 | sim | — | nenhuma |
| E | Europeu aceita publicidade e recusa estatísticas | G D G G | G D G G | não | não | 0 | sim | `false` | nenhuma |
| F-OFF | Europeu recusa publicidade e aceita estatísticas | D G D D | D G D D, `gcs=G101` | sim | sim | 1 | sim | `true` | nenhuma |
| F-ON contraditório | Google recusa análise, site aceita | prevalece a recusa | D D D D (site registrou "sim", Google "não") | não | não | 0 | sim | `true` | nenhuma |
| F-ON coerente | Google aceita análise e site aceita | D G D D | antes do "sim" do site: análise D; depois: D G D D | sim | sim | 1 | sim | `true` | nenhuma |
| G | CMP indisponível (12 s) | igual a A | igual a A (indistinguível, e não precisa distinguir) | não | não | 0 | sim | — | nenhuma |
| H-OFF | CMP tardia (9 s), site já aceito | estatísticas mantidas, sem recarga | antes D G D D; com a CMP na tela: D G D D, banner recolhido; final G G G G; 0 recargas | sim | sim | 1 | sim | `true` | nenhuma |
| H-ON | Igual, análise ON | igual | igual: 0 recargas, final G G G G | sim | sim | 1 | sim | `true` | nenhuma |
| I | Persistido (recarga e nova aba) | G G G G, sem banner, mesmo `cid` | igual; 3 page_views com o mesmo `cid` | sim | sim | 3 (1 por carga) | sim | `true` | nenhuma |
| J | Revogação de estatísticas (rodapé do site) | análise D; recarga; `_ga` removido | D D D D (publicidade já negada em K); 0 hits depois | não | removido | 0 depois | sim | `false` | nenhuma |
| J-ads | Revogar estatísticas com publicidade concedida | G D G G | G D G G (o banner não toca `ad_*`) | não | removido | — | sim | `false` | nenhuma |
| K | Revogação de publicidade (rodapé Google) | D G D D; GA continua | D G D D; mensagem Google reaberta e banner próprio recolhido; GA e `_ga` mantidos | sim | sim | — | sim | `true` | nenhuma |
| L | Cinco navegações SPA | +5 | +5 (`/pt/artigos` → artigo → `/pt/sobre` → `/pt/contato` → `/pt`), mesmo `cid` | sim | sim | 5 | sim | `true` | nenhuma |
| M | `/pt` → `/login` → `/pt` | login sem GA/AdSense; 1 na volta | login: GA 0, AdSense 0 (defaults negados no documento novo); volta: 1, mesmo `cid` | só em `/pt` | sim | 1 | não no login | `true` | nenhuma |
| N | Login, 2FA, administração | sem GA, sem AdSense | 0 / 0 / 0 (`/administracao` → `/login`); nenhuma requisição gtag ou adsbygoogle | não | — | 0 | não | — | nenhuma |
| O | React #418 | 1 page_view, CSS preservado | #418 reproduzido; 1 page_view; 1 folha de estilo | sim | sim | 1 | sim | `true` | nenhuma |
| — | Guarda de vazamento | nenhum hit fora da interceptação | 21 emitidos, 21 interceptados, 0 na rede | — | — | — | — | — | nenhuma |

## Leitura

- **Nenhuma finalidade é autorizada implicitamente.** Estatísticas só ficam `granted` depois do "Aceitar" do site, e a publicidade só muda pela CMP do Google.
- **A recusa sempre prevalece.** Com análise ON, uma recusa do Google bloqueia mesmo com "sim" do site, e um "sim" do Google sem "sim" do site não basta.
- **Revogação por finalidade:** cada finalidade se revoga separadamente (J, J-ads, K), sem efeito cruzado.
- **Sem recarga com a CMP tardia:** uma CMP que chega depois não recarrega a página nem derruba um consentimento local explícito (H).
- **F2 e F3 preservadas:** `_ga` estável (I, M), 5 page_views em 5 navegações (L) e #418 sem perda de CSS (O).
- **Duas mensagens no EEE:** o europeu vê duas mensagens em sequência (D). Com análise ON, as estatísticas são perguntadas duas vezes (D-ON, F-ON contraditório). É o argumento para a fase 2 do painel.
