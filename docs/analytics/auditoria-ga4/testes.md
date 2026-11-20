# Testes reproduzíveis — GA4

Use um **perfil anônimo novo** em cada cenário, sem extensões de bloqueio. Não clique em anúncios.

## Ferramentas

- **Tag Assistant**: em `https://tagassistant.google.com`, conecte `https://www.nutricaoemovimento.com/pt`. A conexão ativa o modo de depuração e os eventos passam a aparecer no **DebugView** (GA4 → Admin → DebugView), com cerca de 10 s de atraso.
- **DevTools → Network**, com "Preserve log" ativo e os filtros:
  - `gtag/js` → o loader baixou (não prova coleta);
  - `collect?v=2` → hit enviado. Em Payload, veja `en=` (evento), `dl=` (página), `cid=` (client ID), `_s=` (sequência), `_fv=1`/`_ss=1` (primeira visita/início de sessão) e `gcs=` (G101 = analytics concedido);
  - `fundingchoicesmessages` → a CMP do Google carregou.
- **DevTools → Console**: `window.__nemCmp`, `document.cookie.match(/_ga=[^;]+/)` e `window.dataLayer.filter(a => a[0] === "consent")`.
- **GA4 Realtime**: só serve como confirmação final; não use como única evidência.

## Pré-teste — CMP

1. Abra `/pt` e aguarde 10 s.
2. Console: `window.__nemCmp`.

| Resultado | Interpretação |
|---|---|
| `null` / `undefined`, sem `fundingchoicesmessages` na rede | **F1 ativo**: os cenários abaixo falham; banner ausente e botão do rodapé desabilitado |
| `{source:"local"}` | Visitante fora da área regulada: siga os cenários com o banner do site |
| `{source:"google"}` | Visitante na área regulada: a escolha é feita na mensagem Google |

Para testar a mensagem europeia: `/pt?fc=alwaysshow&fctype=gdpr`.

## Cenário A — sem decisão

1. Abra `/pt` e não interaja.
2. Esperado: nenhum `gtag/js`, nenhum `collect`, nenhum cookie `_ga`. No `dataLayer`, apenas `consent default` com 4× `denied`. AdSense presente.
3. Tag Assistant: a tag GA4 **não** deve disparar.

## Cenário B — aceitar estatísticas

1. Clique em "Aceitar opcionais".
2. Esperado: `consent update analytics_storage: granted` → `gtag/js?id=G-HDJ55H8QR6` → **1** `collect` com `en=page_view`, `dl=/pt`, `_fv=1`, `_ss=1`, `gcs=G101`.
3. DebugView: `page_view` + `first_visit` + `session_start` para o dispositivo.

## Cenário C — 5 navegações (clicando em links, sem recarregar)

`/pt/artigos` → um artigo → `/pt/sobre` → `/pt/contato` → `/pt`.

- Esperado: **exatamente 1** `page_view` por página, com o mesmo `cid` e o mesmo `sid`.
- Hoje (F3): 2 por página. No Tag Assistant, um aparece associado a "History Change" e o outro ao `gtag('event','page_view')` manual.

## Cenário D — recusar

1. Em um perfil novo, clique em "Recusar opcionais". Navegue e recarregue.
2. Esperado: nenhum `gtag/js`, nenhum `collect`, nenhum `_ga`. O cookie `nem-consent` registra `analytics:false`.

## Cenário E — revogar

1. No perfil do cenário B, abra "Preferências de cookies" (rodapé), desmarque Estatísticas e salve.
2. Esperado: a página recarrega; `_ga` e `_ga_HDJ55H8QR6` são removidos; nenhum `gtag/js` ou `collect` depois disso, inclusive em navegação.

## Cenário F — nova sessão com consentimento salvo

1. No perfil do cenário B, anote o valor de `_ga`.
2. Feche a aba, abra `/pt/sobre` em uma nova aba e recarregue uma vez.
3. Esperado: o **mesmo** `_ga`/`cid`; o hit **sem** `_fv` (e com `_ss` apenas se a sessão expirou).
4. Hoje (F2): `_ga` some logo após a carga e reaparece com outro valor; cada carga traz `_fv=1 _ss=1`.

## Harness automatizado

Os arquivos em [evidencias/](evidencias/) usam `playwright-core` (instale fora do projeto) e o Chrome local. Os hits do GA recebem um 204 sintético e as requisições de anúncio são bloqueadas, então nada chega ao GA4 nem ao AdSense.

```bash
node ga-audit.mjs https://www.nutricaoemovimento.com saida.json                          # CMP real
node ga-audit.mjs https://www.nutricaoemovimento.com saida.json simulate-local-cmp 1500  # CMP simulada NOT_APPLICABLE
node cmp-probe.mjs https://www.nutricaoemovimento.com block "/pt?fc=alwaysshow&fctype=gdpr" hidefc
node ga-hydration.mjs https://www.nutricaoemovimento.com                                # page_view sob erro #418
```

## Critérios de aprovação após a correção

- O pré-teste nunca termina em `pending` depois de alguns segundos.
- B: 1 `page_view`. C: 5 `page_view` para 5 páginas. F: mesmo `cid` entre documentos.
- A, D, E: zero `collect`.
- DebugView e Realtime refletem B, C e F; os relatórios padrão consolidam em 24–48 h.
