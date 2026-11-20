# Plano de implementação: Alternativa A (não executado)

Pré-requisitos: condições 1 a 3 do [relatório](relatorio.md#4-condições-do-go) aceitas, e decisão sobre o calendário da revisão do AdSense.

## Fase 1: código (funciona com o painel atual)

Ponto de partida: árvore atual (HEAD + F2/F3). O protótipo validado está em `evidencias/prototipo-alternativa-a.diff` e serve de referência. Não deve ser aplicado sem revisão.

| Arquivo | Mudança |
|---|---|
| `src/lib/google-cmp.ts` | Estado `{ api, gdprApplies, analytics, uiShown }`. `api` vem de `CONSENT_API_READY`; `gdprApplies`, `cmpuishown` e `useractioncomplete`/`tcloaded` vêm de `__tcfapi addEventListener`; `analytics` vem de `getGoogleConsentModeValues`. Remover o conceito de "fonte" local/google/pending. |
| `src/lib/consent.ts` | `analyticsDecision()`: `allowed = local === true && google !== 2`; `explicitDenial = local === false \|\| google === 2`. `syncGoogleConsentMode` envia sempre apenas `analytics_storage` e é reaplicado a cada mudança da CMP. `CONSENT_VERSION = 3` e chave `nem-consent-v3`, para pedir nova decisão sob o texto novo (remover a v2 ao salvar). |
| `src/lib/consent-services.ts` | Usar `analyticsDecision`. Manter F2 (limpar só com recusa explícita) e F3 (sem page_view manual). |
| `src/components/consent/CookieConsent.tsx` | Visível para qualquer visitante sem decisão; recolhido enquanto `uiShown`; "Preferências" sempre abre o painel próprio. Texto: estatísticas pelo site, publicidade pela mensagem Google. |
| `src/components/consent/CookiePreferencesButton.tsx` | "Preferências de cookies" sempre habilitado (estatísticas). "Privacidade e publicidade (Google)" só quando `api` for verdadeiro (`showRevocationMessage`). |
| `scripts/consent.test.ts` | Atualizar para a nova regra; incluir os casos "o Google só restringe" e "o banner não toca `ad_*`". |
| `scripts/ga4-browser.e2e.mjs` | Incorporar os cenários da matriz (A a O, OFF e ON). |
| `src/app/pt/politica-de-cookies/page.tsx` e `politica-de-privacidade/page.tsx` | Seções 3 a 6: estatísticas decididas pelo banner do site em todas as regiões; publicidade pela CMP do Google no EEE, Reino Unido e Suíça; dois controles no rodapé. **Texto sujeito a revisão jurídica e à sua aprovação.** |
| `docs/analytics-and-consent.md` | Atualizar a descrição da arquitetura. |

Fica sem alteração:
- defaults inline e a ordem antes do AdSense;
- tag nativa do AdSense;
- layouts raiz;
- Consent Mode básico (GA não carrega antes do "sim");
- artigos, banco, sitemap, feed, newsletter e CSS;
- #418.

### Ordem dos comandos (documentada)

1. Inline: `gtag('consent','default', 4× denied)`. Já existe.
2. Tag do AdSense (CMP do Google, quando aplicável).
3. Decisão do site: `gtag('consent','update',{analytics_storage})`. Na carga, se houver decisão salva, isso acontece **antes** do loader.
4. Só com `granted`: `gtag('js')`, `gtag('config', G-…)` e inserção do `gtag/js`.
5. Mudança na CMP: reaplicar o passo 3. Se o resultado for negado e o GA já tiver rodado, recarregar.

### Verificação antes do deploy

- **Automatizada:** `tsc`, `eslint`, `next build`, unitários, e2e (matriz completa) e verificação HTTP das rotas.
- **Manual, num navegador real no Brasil:**
  - DebugView: `page_view`, `first_visit` e `session_start` só depois do aceite;
  - cinco navegações geram cinco `page_view`;
  - revogação para a coleta.

## Fase 2: painel (posterior, com aprovação explícita)

1. Só depois da revisão do AdSense: em Privacidade e mensagens → Regulamentações europeias → Configurações, desmarcar **Enable consent mode for analytics purposes**. Manter publicidade.
2. Nenhuma mudança de código é necessária: a regra da fase 1 já trata `NOT_CONFIGURED` (4) como "o Google não decide estatísticas".
3. Validar a partir do EEE (checklist).

## Implantação e reversão

- **Deploy:** um commit para a fase 1. F2/F3 vão juntas, ou antes, se você preferir implantá-las primeiro como já aprovado.
- **Reversão:**
  - Código: reverter o commit. A versão v3 da decisão fica ignorada pelo código antigo (chave diferente), sem efeito colateral.
  - Painel: marcar de novo a caixa de análise.
- **Monitorar na primeira semana:**
  - taxa de aceite (eventos no GA4 depois do aceite);
  - relatórios de mensagens do Privacidade e mensagens;
  - mudanças nas requisições do AdSense;
  - erros no console além do #418 já conhecido.
