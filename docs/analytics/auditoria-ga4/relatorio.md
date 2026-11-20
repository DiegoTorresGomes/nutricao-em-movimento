# Auditoria GA4 — Nutrição & Movimento

Data: 20/11/2026 · Produção auditada: `https://www.nutricaoemovimento.com` (deploy contendo `902c6f0` e `bf3883c`) · Measurement ID: `G-HDJ55H8QR6`

Nenhum código funcional, banco, AdSense ou CMP foi alterado. Nenhum commit, push ou deploy.

## Decisão

**Integração com falhas.**

A lógica de respeito à recusa e à revogação está correta. Há, porém, três defeitos confirmados em produção que distorcem os números:

| # | Defeito | Efeito nos relatórios | Desde |
|---|---|---|---|
| F1 | A CMP Google nunca responde para o visitante testado no Brasil; o site fica em `pending` para sempre, o banner local não aparece e o GA **nunca carrega** | Perda de praticamente todas as visitas não europeias | `902c6f0` (20/11/2026) |
| F2 | Em todo documento novo, os cookies `_ga` são apagados antes de a CMP responder | Quando o GA chega a funcionar, cada carga completa vira **novo usuário + nova sessão + `first_visit`** | `902c6f0` (20/11/2026) |
| F3 | Cada navegação client-side gera **dois `page_view`**: o manual do site e o automático do enhanced measurement ("alterações no histórico") | Visualizações de navegação interna em dobro | pelo menos desde `776b81b` (08/11/2026) |

F1 é a explicação mais provável para uma queda brusca a partir de 20/11. Antes disso, os números já eram estruturalmente menores do que o tráfego real: o GA só existe para quem aceita estatísticas (Consent Mode básico, sem modelagem; ver seção 6). Ao mesmo tempo, as visualizações de navegação interna vinham em dobro (F3).

## Níveis de evidência

| Nível | Verificado? | Como |
|---|---|---|
| Script carregado | Sim | Requisição a `googletagmanager.com/gtag/js?id=G-HDJ55H8QR6` observada |
| Evento criado | Sim | Payload de `/g/collect` decodificado (`en`, `dl`, `cid`, `sid`, `_fv`, `_ss`, `_s`, `gcs`) |
| Requisição enviada pelo navegador | Sim | Interceptada antes de sair |
| Requisição recebida pelo GA4 | **Não** | Hits respondidos com 204 sintético para não poluir a propriedade |
| DebugView | **Não** | Sem acesso ao painel GA4; procedimento em [testes.md](testes.md) |
| Relatórios consolidados | **Não** | Sem acesso ao painel GA4 |

Também foram bloqueadas as requisições de anúncio (`googleads.g.doubleclick.net/pagead/ads` etc.), para não gerar impressões automatizadas na conta AdSense.

## 1. Diagnóstico da implementação atual

| Item | Situação |
|---|---|
| Implementações GA | **Uma**: loader direto em [consent-services.ts](../../../src/lib/consent-services.ts), montado por `ConsentedAnalytics` apenas em `PublicLayout` |
| GTM | [GoogleTagManager.tsx](../../../src/components/analytics/GoogleTagManager.tsx) existe, mas **não é importado em nenhum lugar** e `NEXT_PUBLIC_GTM_ID` não está definido. Inativo |
| Measurement ID | `NEXT_PUBLIC_GA_ID="G-HDJ55H8QR6"` no `.env`; o mesmo valor está embutido no chunk de produção `9193-*.js`. Nenhuma outra ID no código |
| Loaders duplicados | Não. Um `<script id="nem-google-analytics">` por documento, protegido por `getElementById`; contagem estável em 1 durante 7 navegações SPA |
| Config | `send_page_view: false`, `allow_google_signals: false`, `allow_ad_personalization_signals: false` |
| Page views | Manuais: `gtag("event","page_view",{page_location})` sempre que `location.href` difere do último enviado |
| Defaults | Inline no `<head>` antes de qualquer tag: as 4 chaves `denied` (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`) |
| Updates | Só em modo `local`: `analytics_storage` = escolha do banner. Em modo `google`, a CMP faz o update |
| Container publicado (`gtag/js`) | Enhanced measurement ativo: `enableHistoryEvents`, `enablePageView`, `enableScroll`, `enableOutboundClick`, `enableForm`, `enableDownload`, `enableVideo`; `redactEmail` |
| IDs/eventos artificiais | Nenhum `client_id`, `user_id` ou evento customizado é criado pelo código. Mas F2 provoca, indiretamente, novos `client_id` a cada carga |

### Autoridade de consentimento

```text
analyticsAllowed = cmp.source === "google" ? cmp.analytics
                 : cmp.source === "local"  && escolhaLocal.analytics
                 : false  // "pending"
```

`cmp.source` só sai de `pending` quando a Funding Choices executa `CONSENT_MODE_DATA_READY`:
- valor 1 ou 2 → `google`
- valor 3 (NOT_APPLICABLE) → `local`
- valores 0 e 4, ou ausência da CMP → `pending` para sempre

O banner local só aparece com `source === "local"`, e o botão "Preferências de cookies" fica desabilitado em `pending`.

## 2. Mapa de carregamento das tags

```text
HTML (head)
 ├─ inline: dataLayer + gtag stub + consent default (4× denied)    ← síncrono, antes de tudo
 └─ adsbygoogle.js?client=ca-pub-3638053236344020 (async)          ← sempre, em /pt/**
       └─ show_ads_impl.js → requisição de anúncio
       └─ Funding Choices (fundingchoicesmessages.google.com)       ← NÃO observada (F1)

Hidratação → ConsentedAnalytics (useEffect, deps [pathname])
 ├─ startGoogleCmp(): cria window.googlefc.callbackQueue e registra callbacks
 ├─ applyConsentServices() imediato  → source "pending" → ga-disable=true + clearOptionalCookies()  (F2)
 └─ CMP_CHANGED (se a CMP responder) → applyConsentServices()
        └─ permitido → gtag('js'), gtag('config', send_page_view:false)
                     → <script id="nem-google-analytics" src="gtag/js?id=G-HDJ55H8QR6">
                     → gtag('event','page_view')

Listeners: CMP_CHANGED, nem:consent-changed, storage, focus → applyConsentServices()
Login/2FA/admin: layout raiz (sem-adsense) sem PublicLayout → nenhum GA, nenhum AdSense
```

## 3. Mapa de eventos e pageviews

| Evento | Origem | Observado |
|---|---|---|
| `page_view` (entrada) | Manual, após config | 1 por documento ✔ |
| `page_view` (navegação SPA) | Manual (efeito em `pathname`) **+** enhanced measurement (history) | **2 por navegação** ✘ (F3) |
| `page_view` (só query string, mesmo pathname) | Enhanced measurement; o manual só dispara no próximo `focus` da janela | 1, com atraso/ordem não determinística |
| `session_start` / `first_visit` | GA4 deriva das flags `_ss=1` / `_fv=1` no primeiro hit | Corretos na primeira visita; **repetidos em toda carga completa** por F2 |
| `user_engagement` | Automático (`_et`), ao ocultar a página ou trocar de página | `_et` presente nos hits SPA; o envio isolado na saída não foi capturado em headless |
| `scroll`, `click` (outbound), `form_start`/`form_submit`, `file_download`, `video_*` | Enhanced measurement | Ativos na configuração; não exercitados |

Sequência observada (CMP simulada como NOT_APPLICABLE; ver [evidencias/cenarios-cmp-simulada-nao-aplicavel.json](evidencias/cenarios-cmp-simulada-nao-aplicavel.json)):

```text
_s=1  page_view /pt                _fv=1 _ss=1   ← aceite (cenário B)
_s=2  page_view /pt/artigos        _et=5666      ┐ navegação 1
_s=3  page_view /pt/artigos        _et=965       ┘
_s=4  page_view /pt/artigos/setembro-amarelo-…   ┐ navegação 2
_s=5  page_view /pt/artigos/setembro-amarelo-…   ┘
_s=6/7   /pt/sobre   (2×)
_s=8/9   /pt/contato (2×)
_s=10/11 /pt         (2×)
```

5 páginas navegadas resultaram em 10 `page_view`, com o mesmo `cid` e `sid`.

## 4. Acessos não registrados

| Causa | Impacto | Classificação |
|---|---|---|
| **F1**: CMP ausente → `pending` permanente → GA nunca carrega e não há banner para aceitar | Praticamente 100% das visitas fora da área regulada (incluindo o Brasil) desde 20/11 | **Defeito** |
| Visitante não interage com o banner | Não medido (opt-in) | Esperado pela arquitetura |
| Visitante recusa | Não medido | Correto |
| Bloqueadores de anúncio/rastreio | Bloqueiam gtag.js; ao bloquear o AdSense também impedem a CMP (→ `pending`) | Esperado |
| Saída antes de gtag.js baixar após o aceite | Perda marginal | Esperado |
| Login/2FA/admin | Não medidos (sem `PublicLayout`) | Intencional; também evita tráfego interno de administração |

Evidência de F1 ([cenarios-cmp-real.json](evidencias/cenarios-cmp-real.json) e `cmp-probe.mjs`):
- `window.__nemCmp` permaneceu `null`, `__tcfapi` indefinido e o iframe `googlefcPresent` ausente após 12 s.
- Nenhuma requisição a `fundingchoicesmessages.google.com`, inclusive com `?fc=alwaysshow&fctype=gdpr`.
- O AdSense registrou `gen_204?id=adsense_fc_has_namespace_but_no_iframes`: ele detecta o `window.googlefc` criado pelo site sem que a CMP real exista.
- Removendo esse namespace (experimento diagnóstico), o beacon some, mas a CMP **continua sem carregar**. A causa provável, portanto, é a configuração em AdSense → Privacidade e mensagens (mensagem não publicada ou não aplicável a esta região), e não só o namespace. Sem acesso ao painel, isso não pôde ser confirmado.
- Resultado: banner ausente, botão "Preferências de cookies" desabilitado, zero hits em todos os cenários.

## 5. Duplicações

| Hipótese | Resultado |
|---|---|
| Manual + enhanced measurement em navegação SPA | **Confirmada** (F3): 2 `page_view` por navegação, com `_s` distintos |
| Retentativas de transporte | Artefato de teste: com `abort` cada hit aparecia 2× em menos de 3 ms; com resposta 204 desapareceu. Não ocorre com rede normal |
| Reinserção do loader GA | Não reproduzida dentro de um documento (1 script durante toda a navegação). Uma "nova inserção" ocorre a cada documento novo (recarga forçada por revogação, guard de saída do público, troca de layout raiz), como esperado. Combinada com F2, cada uma vira um novo usuário |
| Mudança de layout raiz (`/pt` ↔ `/login`) | Gera documento novo, e o GA não existe no lado operacional. Não duplica; ao voltar ao público, F2 cria novo usuário |
| Hidratação com erro #418 (AdSense insere nós antes da hidratação) | 1 `page_view` por documento mesmo com #418 forçado (`ga-hydration.mjs`). Não duplica |
| Efeito com `[pathname]` re-registrando listeners | Não duplica, pois o guard `__nemAnalyticsPage` impede o reenvio para o mesmo `href` |
| Pageview automático do config | Desligado (`send_page_view:false`) ✔ |

## 6. Consent Mode

- **GA4: modo básico.** gtag.js só é baixado após permissão. Sem permissão, não há pings sem cookies e o GA4 não modela. A diferença entre tráfego real e GA é, portanto, estrutural e proporcional à taxa de não aceite. Migrar para o modo avançado é decisão jurídica/LGPD, não técnica, e não é recomendada aqui por padrão.
- **AdSense: carregado sempre**, com os 4 defaults `denied`. Em modo `local`, `ad_*` nunca são concedidos, o que significa anúncios não personalizados.
- **Ordem**: os defaults executam antes do AdSense (inline síncrono no head, verificado no HTML de produção).
- **Sinal no hit**: `gcs=G101` (analytics concedido, ads negado) nos hits após o aceite, coerente.
- **Integração banner próprio × CMP Google**: a CMP tem precedência, o banner local só vale com NOT_APPLICABLE e não há fallback quando a CMP não aparece (origem de F1). Os testes automatizados (`consent.test.ts`) fixam `__nemCmp = {source:"local"}`, por isso não detectaram F1 nem F2.

## 7. Testes reproduzíveis

Ver [testes.md](testes.md) (Tag Assistant, DebugView, Network, Realtime) e os harnesses em [evidencias/](evidencias/).

Resumo dos cenários executados contra produção:

| Cenário | CMP real (como está) | CMP simulada = NOT_APPLICABLE |
|---|---|---|
| A — sem decisão | Sem GA, sem hits ✔; **sem banner** ✘ | Sem GA, sem hits, banner visível ✔ |
| B — aceitar | **Impossível**: banner não existe ✘ | gtag.js carregado; 1 `page_view /pt` com `_fv=1 _ss=1`, `gcs=G101` ✔ |
| C — 5 navegações | n/a | 10 `page_view` (2 por página) ✘ F3 |
| D — recusar | Impossível (sem banner) | Sem GA em navegação e recarga ✔ |
| E — revogar | Impossível (botão desabilitado) | Recarrega, `_ga` removido, sem GA depois ✔ |
| F — nova sessão com consentimento salvo | n/a | `_ga` apagado antes da CMP responder; `cid` 1971058733 → 2136698188 → 90713044 em 2 cargas; cada uma `_fv=1 _ss=1` ✘ F2 |

## 8. Correções recomendadas (por prioridade)

**P0 — F1: GA nunca carrega fora da área regulada**
1. No AdSense → Privacidade e mensagens, conferir se há mensagem publicada (regulamentações europeias) para o site, se ela cobre `www.nutricaoemovimento.com` e se a opção de usar a CMP do Google está ativa.
2. No código, nunca deixar o visitante preso em `pending`. Opção recomendada: instalar o tag oficial da Funding Choices (`fundingchoicesmessages.google.com/i/pub-3638053236344020?ers=1` + `signalGooglefcPresent`), para que `CONSENT_MODE_DATA_READY` responda NOT_APPLICABLE fora da área regulada. Em paralelo, adicionar um fallback por tempo limite que passe a `local` (banner opt-in) se a CMP não responder.
3. Acrescentar testes para `pending` → timeout e para a CMP ausente.

**P1 — F2: `_ga` apagado a cada documento**
- Em `applyConsentServices`, limpar cookies e marcar `ga-disable` apenas diante de uma **negação explícita** (`google` com `analytics=false`, ou `local` com recusa). Em `pending`, apenas não carregar.
- Teste: um consentimento salvo mais um documento novo devem manter o mesmo `_ga`.

**P1 — F3: `page_view` duplicado**
Escolher **uma** fonte (aplicar as duas zera os pageviews de SPA):
- (a) **Sem deploy**: GA4 → Fluxos de dados → Medição otimizada → Visualizações de página → desmarcar "Alterações de página com base em eventos do histórico do navegador". Mantém o page_view manual, mas mudanças só de query string passam a depender do `focus` (ver P2).
- (b) **Recomendada, com código**: remover o `page_view` manual e usar `send_page_view: true` no `config`, deixando o enhanced measurement cuidar das navegações (inclusive de query string).

**P2**
- Se a opção (a) for escolhida, disparar o page_view manual também em mudanças de `searchParams` e remover o envio no listener `focus`.
- GA4 Admin: definir regra de **tráfego interno** (IP da autora/equipe) e ativar o filtro, primeiro como teste, depois ativo. Conferir em Coleta de dados se não há filtros de desenvolvedor ativos indevidamente.
- Registrar uma anotação no GA4 em 20/11/2026 (início de F1/F2) para interpretar a série histórica.

**P3**
- Remover ou documentar o `GoogleTagManager.tsx` inativo, para evitar uma segunda implementação acidental.
- Os testes de consentimento devem cobrir `pending`, a CMP ausente e cargas repetidas de documento.

## 9. Riscos de privacidade e regressão

- **Fallback para `local`**: aceitável para privacidade porque o banner local é opt-in e só controla estatísticas. Risco: um visitante europeu cuja CMP demore mais que o tempo limite veria o banner local. Mitigar com um tempo generoso, sem conceder `ad_*` no modo local (como hoje).
- **Não limpar cookies em `pending`**: os cookies `_ga` de quem já aceitou ficam no navegador até a CMP responder. O GA continua sem carregar até então, então não há coleta sem permissão.
- **Opção (b) de F3**: garantir que o `config` só ocorra após a permissão (como hoje); senão o `send_page_view:true` dispararia antes do consentimento.
- **Leitura da série histórica**: após as correções, haverá um salto de usuários e visitas (fim de F1) acompanhado de queda de "novos usuários" e de pageviews por navegação (fim de F2/F3). Não comparar períodos sem as anotações.
- Não foi alterado nada; as validações do estado atual seguem abaixo.

## 10. Validações executadas

- Testes: 54 passaram. `editorial-preview.test.ts` falha (1), igual à base anterior e sem relação com GA.
- `npm run lint`: 0 erros, 2 avisos preexistentes.
- `tsc --noEmit`: OK.
- Build: não executado, pois não houve alteração de código.

## Limitações

- Sem acesso ao painel GA4 (Realtime, DebugView, filtros, tráfego interno, medição otimizada além do que o container público revela) nem ao painel AdSense (Privacidade e mensagens).
- Testes em Chrome headless a partir do Brasil; o comportamento da CMP na Europa não foi observado.
- Os hits foram interceptados com 204 sintético, então o recebimento pelo GA4 não está comprovado.
- Os cenários B–F usaram uma CMP **simulada** como NOT_APPLICABLE (stub de `window.googlefc`), porque a CMP real não carrega. Isso valida o código do site, não a CMP do Google.
