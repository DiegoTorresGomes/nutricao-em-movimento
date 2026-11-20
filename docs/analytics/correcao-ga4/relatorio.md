# Correção GA4 + CMP — Nutrição & Movimento

> **Substituído em parte (20/11/2026).** O caminho de desbloqueio de F1 descrito aqui ("publicar a mensagem → a CMP carrega → PASS") não se confirmou: a mensagem publicada não é entregue fora do EEE, Reino Unido e Suíça. F1 foi retirada da árvore e guardada como patch. Ver [../diagnostico-cmp-418/relatorio.md](../diagnostico-cmp-418/relatorio.md) e [../finalizacao-ga4/relatorio.md](../finalizacao-ga4/relatorio.md).

Data: 20/11/2026 · Base: `02ea2c7` · GA4 `G-HDJ55H8QR6` · AdSense `ca-pub-3638053236344020`

Nenhum commit, push ou deploy. Sem alterações em conteúdo, banco, sitemap, feed, newsletter, CSS, AdSense, CMP, tags nativas ou política de cookies.

## Decisão: **FAIL PARA DEPLOY**, bloqueado por F1 (dependência externa)

O código está tecnicamente pronto: 16/16 cenários de navegador, 35/35 testes de consentimento, lint, typecheck, build e verificação HTTP passaram. F2 e F3 estão resolvidas.

**F1 não pode ser resolvida com segurança só pelo código.** O site agora sai de `pending` de forma segura e acessível. Porém, com a configuração atual do AdSense, a Funding Choices **não é carregada para ninguém**, então nenhum visitante chega a um estado que autorize estatísticas. Os números do GA4 continuam em zero até a ação no painel descrita abaixo.

As duas formas de "destravar" sem essa ação foram rejeitadas, por serem inseguras ou improvisadas:

- liberar o banner local por tempo limite, o que infere aplicabilidade a partir da ausência de resposta (proibido pelos requisitos 2 e 4);
- instalar o tag `fundingchoicesmessages…?ers=1` + `signalGooglefcPresent`. É o tag de **recuperação de bloqueio de anúncios** do AdSense, e a documentação não o apresenta como mecanismo de consentimento (requisito 9).

### Para destravar (sem deploy)

1. AdSense → Privacidade e mensagens → **Regulamentações europeias**: criar e **publicar** a mensagem para `www.nutricaoemovimento.com`.
2. Nas configurações dessa mensagem, ativar o **Consent Mode**, incluindo o propósito de **analytics**. Sem isso, `analyticsStoragePurposeConsentStatus` vem sempre `NOT_CONFIGURED` (4).
3. Rodar contra a **produção atual** (a CMP não depende deste código):
   `node docs/analytics/auditoria-ga4/evidencias/cmp-probe.mjs https://www.nutricaoemovimento.com block /pt`
   PASS = requisição a `fundingchoicesmessages.google.com` + `__tcfapi` definido. Repetir com `?fc=alwaysshow&fctype=gdpr`: a mensagem deve aparecer.
4. Com o passo 3 aprovado, a decisão passa a **PASS PARA DEPLOY** sem mudar código. Se a CMP carregar só na pré-visualização e não para visitantes do Brasil, voltar a esta decisão: será preciso avaliar com o suporte Google um tag explícito de mensagens.

## Causas, comportamento anterior e posterior

### F1 — CMP `pending` para sempre

**Causa confirmada:**
- A [documentação oficial](https://developers.google.com/funding-choices/fc-api-docs) diz que o tag do AdSense implanta as mensagens "once the message is published".
- Em produção, nenhuma requisição à Funding Choices ocorre, nem com `?fc=alwaysshow&fctype=gdpr`, que segundo a mesma documentação pré-visualiza a mensagem "on a site with messages published". Logo, **não há mensagem publicada**.
- Diagnóstico ([fc-diagnostico-tag-manual.mjs](evidencias/fc-diagnostico-tag-manual.mjs)), feito só no navegador de teste: carregado manualmente, o loader da FC responde em cerca de 0,5 s com os 4 propósitos = `3` (NOT_APPLICABLE), `__tcfapi` com `gdprApplies:false` e nenhuma mensagem nem na pré-visualização GDPR. O publisher existe na plataforma, mas sem mensagem publicada.

| | Antes | Depois |
|---|---|---|
| CMP não responde | `pending` infinito, botão do rodapé desabilitado | `pending` por até 10 s, depois `unavailable`: o botão se habilita e abre um aviso acessível ("Controles de privacidade indisponíveis") com "Tentar novamente" e "Fechar". Nada é concedido nem registrado |
| `NOT_APPLICABLE` (3) | `local` | `local` (mecanismo oficial) |
| `GRANTED`/`DENIED` (1/2) | `google` | `google` |
| `NOT_CONFIGURED` (4) | `pending` infinito | `local` somente se o TCF da própria CMP informar `gdprApplies:false`; `unavailable` se `true` |
| `UNKNOWN` (0) | `pending` | continua aguardando ("error or not ready yet"); o tempo limite leva a `unavailable` |
| CMP tardia | n/a | `unavailable` → `google`/`local` permitido. Depois de confirmada, a autoridade **fica travada** no documento: nunca alterna nem volta atrás, e a escolha salva não é tocada |

Não há uso de IP, idioma, timezone ou VPN. O texto atual da Política de Cookies já descreve exatamente esse comportamento ("Enquanto essa informação estiver indisponível, estatísticas permanecem bloqueadas e o painel próprio não é exibido").

### F2 — `_ga` apagado antes da CMP

**Causa:** `clearOptionalCookies()` rodava sempre que `analyticsAllowed` era falso, o que inclui `pending` na montagem de todo documento.

**Depois:** só limpa diante de **negação explícita** da autoridade vigente (Google `DENIED`, ou recusa no painel local). Montagem, `pending`, `unavailable`, navegação, foco, recarga e ausência de decisão não tocam cookies.

### F3 — `page_view` duplicado

**Causa:** havia um `page_view` manual a cada mudança de `pathname` e, além dele, o enhanced measurement com `enableHistoryEvents:true` no container publicado. `send_page_view:false` não desativa o rastreamento por histórico.

**Depois:** uma única fonte. O `config` envia o page_view de entrada e o enhanced measurement envia as navegações. O page_view manual, o guard `__nemAnalyticsPage`, a dependência `[pathname]` e o envio tardio no `focus` foram removidos.

**Dependência do painel GA4:** em Fluxo de dados → Medição otimizada → Visualizações de página → "Alterações de página com base em eventos do histórico do navegador" deve continuar **ativo** (hoje está). Se for desativado, as navegações client-side deixam de ser contadas; a entrada continua.

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| [src/lib/google-cmp.ts](../../../src/lib/google-cmp.ts) | Estado `unavailable`, tempo limite de 10 s, enum oficial, `NOT_CONFIGURED` + `gdprApplies`, trava de autoridade |
| [src/lib/consent-services.ts](../../../src/lib/consent-services.ts) | Limpeza só com negação explícita; `config` sem `send_page_view:false`; sem page_view manual |
| [src/components/analytics/ConsentedAnalytics.tsx](../../../src/components/analytics/ConsentedAnalytics.tsx) | Efeito sem `[pathname]` |
| [src/components/consent/CookieConsent.tsx](../../../src/components/consent/CookieConsent.tsx) | `CmpUnavailableNotice` (mesmas classes do painel, foco no título, retorno do foco) |
| [src/components/consent/CookiePreferencesButton.tsx](../../../src/components/consent/CookiePreferencesButton.tsx) | Habilitado em `unavailable`, dica via `aria-describedby` |
| [scripts/consent.test.ts](../../../scripts/consent.test.ts) | 2 testes ajustados à nova semântica (`NOT_CONFIGURED` sem TCF; documento novo sem estado prévio) |
| [scripts/ga4-cmp.test.ts](../../../scripts/ga4-cmp.test.ts) | Novo: 13 testes unitários |
| [scripts/ga4-browser.e2e.mjs](../../../scripts/ga4-browser.e2e.mjs) | Novo: 16 cenários de navegador |

Os defaults de consentimento, o tag AdSense e o `DocumentLayout` não foram alterados.

## Resultados por cenário

Os testes de navegador rodaram em Chrome real (headless) contra `next start` local.
- Hits `/g/collect` respondidos com 204 sintético: **14 emitidos = 14 interceptados**, nada chegou ao GA4.
- Anúncios e Funding Choices bloqueados.
- CMP simulada por stub do contrato oficial.
- Evidência: [ga4-browser-e2e.json](evidencias/ga4-browser-e2e.json).

| | Cenário | Resultado |
|---|---|---|
| A | CMP pendente | PASS: sem GA, sem banner, botão desabilitado com dica |
| B | `NOT_APPLICABLE` | PASS: `local`, banner visível, zero hits |
| C | CMP Google ativa | PASS: sem banner local, botão "Preferências de privacidade Google" reabre a mensagem; concessão Google → 1 page_view |
| D | CMP indisponível | PASS: `unavailable` após 10 s; aviso por teclado, foco no título e retorno ao botão; zero hits |
| E | CMP tardia | PASS: `unavailable` → `local` → banner; nada concedido |
| F | Novo visitante | PASS: zero hits, sem `_ga`, nada persistido |
| G | Aceitação | PASS: 1 page_view `/pt`, `_fv=1 _ss=1`, `gcs=G101` |
| H | Recusa | PASS: zero hits em navegação e recarga |
| I | Revogação | PASS: recarrega, `_ga` removido, zero hits depois |
| J | Recarga e nova aba | PASS: `_ga` intacto durante `pending`; 3 page_views com o mesmo `cid`, sem `_fv`/`_ss` |
| J2 | Nova sessão (30 min de inatividade emulados) | PASS: mesmo `cid`, `_ss=1`, sem `_fv` |
| K | 5 páginas client-side | PASS: exatamente `/pt/artigos → artigo → /pt/sobre → /pt/contato → /pt`, mesmo `cid`/`sid`, loader único |
| L | Só query / só hash | PASS: 1 page_view `/pt/artigos?q=sono`, nenhum extra no `focus`; hash-only gera 0 (comportamento do GA4) |
| M | Layouts raiz `/pt → /login → /pt` | PASS: login sem GA/AdSense; volta com 1 page_view, mesmo `cid` |
| N | Erro #418 | PASS: #418 reproduzido, 1 page_view, CSS preservado |
| O | Login, 2FA, admin | PASS: sem gtag, sem adsbygoogle, sem hits, com CSS |

Antes (auditoria): 5 navegações geravam 10 page_views (F3), e cada carga completa gerava novo `cid` com `_fv=1` (F2). Depois: 5 e 5, sem `_fv` repetido.

### Validação técnica

- `ga4-cmp.test.ts` 13/13 e `consent.test.ts` 22/22.
- Suíte completa: 67/68.
- **Falha preexistente separada:** `editorial-preview.test.ts` (1 caso). O servidor de prévias editoriais devolve 404 para o CSS listado no manifesto de prévias. Já falhava sem estas mudanças e não tem relação com GA/CMP.
- `npm run lint`: 0 erros, 2 avisos preexistentes.
- `tsc --noEmit`: OK.
- `npm run build`: OK.
- `check-adsense-cmp-http.mjs`: OK em 30 rotas. AdSense no head inicial com `async`; defaults inline antes dele; nenhum loader em login/admin/API.

### Como reexecutar

```bash
node --import tsx --test scripts/ga4-cmp.test.ts scripts/consent.test.ts
# com `next start -p 3107` rodando e playwright-core instalado fora do projeto:
PLAYWRIGHT_CORE=/caminho/playwright-core/index.mjs AUDIT_BASE_URL=http://127.0.0.1:3107 node scripts/ga4-browser.e2e.mjs
```

O gtag agrupa eventos e envia cerca de 6 s depois (ou no unload). O teste espera essa janela. Simular `visibilitychange` faz o gtag reter os hits, então isso não deve ser usado.

## Limitações relacionadas à CMP Google

- A CMP real nunca carregou neste ambiente. Os cenários A–E usam um stub fiel ao contrato documentado, não a Funding Choices real.
- Não verificado: se, depois de publicada a mensagem, o tag do AdSense carrega a CMP também para visitantes fora da UE (necessário para receber `NOT_APPLICABLE` no Brasil). O passo 3 do desbloqueio responde a isso.
- No cenário C, o hit saiu com `gcs=G100` porque o stub não emite `consent update`. A CMP real faz isso quando o Consent Mode está ativo na UI ("no additional work is needed"). Confirmar no Tag Assistant.
- Com `NOT_CONFIGURED` e `gdprApplies:true`, o rodapé mostra o aviso de indisponibilidade e não reabre a mensagem Google. Esse caso só existe se o painel for configurado sem o propósito de analytics.

## Testes pendentes (GA4 Realtime/DebugView), após desbloqueio e deploy

Seguir [../auditoria-ga4/testes.md](../auditoria-ga4/testes.md) com Tag Assistant conectado:

1. Brasil, perfil novo: `__nemCmp = {source:"local"}` em poucos segundos; banner; aceitar → DebugView com `page_view` + `first_visit` + `session_start`.
2. Navegar por 5 páginas: 5 `page_view` no DebugView, todos marcados como "History Change", exceto o primeiro.
3. Recarregar e abrir nova aba: mesmo dispositivo no DebugView, sem novo `first_visit`.
4. `?fc=alwaysshow&fctype=gdpr`: mensagem Google; conceder/negar e conferir `analytics_storage` no Tag Assistant (Consent tab).
5. Revogar: nenhum evento novo no DebugView.
6. Realtime: usuários e visualizações coerentes com o tráfego real; os relatórios padrão consolidam em 24–48 h. Anotar no GA4 as datas de 20/11 (início de F1/F2) e do deploy.

## Avaliação de privacidade

- Defaults: 4× `denied`, inline, antes do AdSense; inalterados.
- Nenhum consentimento é inferido de tempo, ausência de resposta, região ou idioma. `unavailable` não concede nada.
- A CMP Google mantém autoridade sempre que se declara aplicável (1/2). O painel local só atua com confirmação Google (`NOT_APPLICABLE`, ou `NOT_CONFIGURED` + `gdprApplies:false`).
- Uma única autoridade por documento; uma CMP tardia não sobrescreve escolha salva.
- Recusa e revogação continuam removendo `_ga*` e recarregando, como manda a Política de Cookies. Cookies AdSense não são tocados pelo painel.
- Preservar `_ga` em `pending` não gera coleta: o GA não carrega até haver permissão.
- Consent Mode continua **básico** para GA4 (sem pings sem cookie, sem modelagem); o avançado não foi habilitado. Nenhum evento, ID ou contagem artificial foi criado.
