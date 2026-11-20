# Implementação final: GA4, consentimento por finalidade e AdSense

Data: 20/11/2026. Base: `02ea2c7` (`origin/main`). **Código pronto e validado localmente.** Não houve commit, push nem deploy: a aprovação da publicação é a única fronteira restante. Recebimento real no GA4 e comportamento da CMP europeia real só podem ser confirmados em produção (seção 6).

## 1. Problemas resolvidos

| | Status | Como |
|---|---|---|
| **F1** Brasileiro sem banner e sem Analytics | **Resolvido** | O banner do site é a autoridade de estatísticas para todos e não depende da CMP europeia. Não usa timeout, idioma, IP nem código minificado. |
| **F2** `_ga` apagado indevidamente | **Resolvido** | Os cookies só são removidos com recusa explícita. Inicialização, foco, navegação, recarga, espera da CMP e suspensão preservam o identificador. |
| **F3** `page_view` duplicado | **Resolvido** | Fonte única: `config` para a entrada e Enhanced Measurement (eventos de histórico) para as navegações. O envio manual foi removido. |
| **F4** React #418 com AdSense | **Resolvido** | Âncora `<noscript>` inerte como primeiro filho hidratável do `<head>`. A tag do AdSense não foi alterada. |

Causa de F4, confirmada no `react-dom` do projeto (`canHydrateInstance`):
- O `adsbygoogle.js` insere o `show_ads_impl.js` **sem `async`** antes do primeiro `<script>` do documento.
- Dentro do `<head>`, o React pula nós de outro tipo, mas um `<script>` com `src` só é pulado se tiver `async`. Por isso ele tomava o script do AdSense pelo script de defaults.
- O âncora faz o React passar por esse nó.
- **Validação:** com o AdSense real rodando antes da hidratação, o `show_ads_impl` foi inserido nas três rotas testadas e não houve #418 (cenário 21b).

## 2. Configuração final de consentimento

| Finalidade | Sinais | Autoridade | Observações |
|---|---|---|---|
| Publicidade | `ad_storage`, `ad_user_data`, `ad_personalization` | CMP certificada do Google | O site nunca escreve esses sinais. |
| Estatísticas | `analytics_storage` | Banner do site, para todos | GA4 só depois de "Aceitar estatísticas" (modo básico). Decisão v3 persistida; v1/v2 ignoradas. |

Regras de transição, enquanto o painel mantém "análise" ativa na mensagem europeia:
- uma recusa do Google prevalece (equivale a recusa explícita);
- uma concessão do Google sozinha não carrega o GA;
- com a CMP europeia aplicável e ainda sem resposta, um "sim" do site fica **suspenso** (`ga-disable`, zero hits, sem recarga, `_ga` preservado) e é retomado quando ela decide.

Atualizações de `analytics_storage`:
- **Enquanto o painel mantém "análise" ativa:** o site só envia uma atualização quando o valor na fila diverge da decisão e a reafirma logo depois de qualquer escrita do Google. Uma escrita conflitante do Google nunca resulta em coleta, porque o GA só carrega com o "sim" do site.
- **Depois da mudança no painel:** só o site escreve `analytics_storage` (cenário 13).

## 3. Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `src/lib/google-cmp.ts` | Estado `{api, gdprApplies, analytics, uiShown}` a partir da API oficial e dos eventos TCF |
| `src/lib/consent.ts` | `analyticsDecision`, v3, `analytics_storage` deduplicado e só esse sinal |
| `src/lib/consent-services.ts` | Decisão única: F2 (limpeza só com recusa) e F3 (sem envio manual); suspensão sem recarga |
| `src/components/analytics/ConsentedAnalytics.tsx` | F3: efeito único, sem reexecutar por rota |
| `src/components/consent/CookieConsent.tsx` | Banner para todos; botões Aceitar, Recusar e Gerenciar; recolhe-se durante a mensagem Google |
| `src/components/consent/CookiePreferencesButton.tsx` | Dois controles: estatísticas sempre; publicidade (Google) quando a CMP está presente |
| `src/app/_document/DocumentLayout.tsx` | Âncora de hidratação (F4) |
| `src/app/pt/politica-de-cookies/page.tsx`, `src/app/pt/politica-de-privacidade/page.tsx` | Textos que refletem o comportamento implementado (**revisão do proprietário**) |
| `scripts/consent.test.ts`, `scripts/ga4-browser.e2e.mjs` | Testes unitários e E2E |
| `docs/analytics-and-consent.md`, `docs/analytics/**` | Documentação e evidências |

Não foram alterados: artigos, banco, migrações, `public/`, sitemap, feed, newsletter, CSS, layout visual nem a tag nativa do AdSense.

## 4. Resultados dos testes

| Verificação | Resultado |
|---|---|
| Unitários de consentimento | **27/27** |
| Suíte completa | **60/61**. A falha é antiga e sem relação: `editorial-preview` (404 no CSS do fixture de prévia) |
| E2E em navegador (build de produção local, gtag real, coleta interceptada) | **27/27**, cobrindo os 25 cenários pedidos; ver `evidencias/ga4-browser-e2e.log` |
| HTTP (30 rotas: tag única, `async`, `crossorigin`, sem `data-nscript`, defaults antes do AdSense, login e admin sem AdSense/GA, feed, sitemap, robots, ads.txt) | **PASS** |
| `tsc`, `next build` | OK |
| `eslint` | 0 erros; 2 avisos antigos |

Contagem de `page_view`:

| Situação | page_views |
|---|---|
| Antes do consentimento, recusa, revogação, CMP pendente ou suspensa, login e admin | 0 |
| Aceite | 1, com `_fv=1`, `_ss=1`, `gcs=G101` e `tid=G-HDJ55H8QR6` |
| Cinco navegações | 5, em ordem, mesmo `cid`, uma sessão, engajamento `_et` > 0 e `seg=1` |
| Mudança de query string | 1 |
| Mudança só de hash | 0 |
| Recarga, nova aba | 1 cada |
| Nova sessão (inatividade de 31 min) | 1, com `_ss=1` e `_fv=0` |

Cookies:
- `cid` preservado em recarga, nova aba, nova sessão, volta do `/login` e suspensão;
- `_ga` removido só na recusa ou revogação;
- cookies do AdSense nunca tocados.

Privacidade:
- zero hits antes do consentimento válido;
- o banner nunca concede `ad_*`;
- o Google nunca autoriza estatísticas sozinho;
- com bloqueadores (só AdSense, ou AdSense + GA), o site continua estável e sem erros;
- 27 hits emitidos, 27 interceptados, nenhum chegou à rede.

## 5. Implantação

**Commit preparado (não executado):**

```bash
git add src/lib/google-cmp.ts src/lib/consent.ts src/lib/consent-services.ts \
  src/components/analytics/ConsentedAnalytics.tsx src/components/consent/CookieConsent.tsx \
  src/components/consent/CookiePreferencesButton.tsx src/app/_document/DocumentLayout.tsx \
  src/app/pt/politica-de-cookies/page.tsx src/app/pt/politica-de-privacidade/page.tsx \
  scripts/consent.test.ts scripts/ga4-browser.e2e.mjs docs/analytics-and-consent.md docs/analytics
git commit -m "feat: consent by purpose for GA4, keep Google CMP for ads, fix AdSense hydration (#418)"
git push origin main
```

**Ordem de ativação:**
1. Aprovar os textos das políticas e publicar o código: push para `main` e o deploy da Hostinger pelo mesmo fluxo usado no commit `02ea2c7` (redeploy da aplicação Node no hPanel, se não for automático). Não há migração nem variável de ambiente nova; `NEXT_PUBLIC_GA_ID` continua sendo exigida no build.
2. Validar em produção (seção 6).
3. **Só depois**, desativar a análise no painel do AdSense (seção 7). O código já funciona com a opção ativada ou desativada.

**Rollback:** `git revert <commit> && git push origin main` e redeploy. Alternativa: reimplantar `02ea2c7`. A decisão v3 fica ignorada pelo código anterior (chave diferente), sem efeito colateral. Se o passo 3 já tiver sido feito, marcar de novo a análise no painel.

## 6. Checklist único de verificação em produção

Em navegador real no Brasil, perfil limpo e sem antivírus ou extensão que injete scripts:
1. `/pt`: o banner aparece; DevTools → Rede sem `/g/collect`; sem cookie `_ga`.
2. Tag Assistant (tagassistant.google.com, conectar `https://www.nutricaoemovimento.com/pt`): `consent default` com os 4 sinais negados antes de qualquer tag.
3. "Aceitar estatísticas":
   - Tag Assistant: `consent update` só com `analytics_storage: granted`;
   - GA4 → Relatórios → Tempo real: 1 usuário;
   - GA4 → Administrador → DebugView (com o modo depuração do Tag Assistant): `page_view`, `first_visit`, `session_start`.
4. Navegar por cinco páginas: cinco `page_view` no DebugView, sem duplicatas. `user_engagement` deve aparecer ao sair ou ocultar a aba.
5. Rodapé → "Preferências de cookies" → desmarcar Estatísticas → Salvar: a página recarrega, `_ga` some e não há novos hits.
6. Console sem erro #418 em `/pt`, `/pt/sobre` e `/pt/artigos`, com layout intacto.
7. **EEE (quando houver acesso real):** a mensagem Google aparece e o banner do site aguarda; depois o banner pergunta estatísticas. No Tag Assistant, a CMP emite `ad_*` (hipótese H1) e, com análise ativa, também `analytics_storage` (hipótese H2), com o site reafirmando sua decisão logo em seguida.

## 7. Pendências humanas

1. **Aprovar a publicação:** commit, push e deploy, incluindo os novos textos das Políticas de Cookies e de Privacidade. Recomenda-se revisão jurídica dos textos; esta entrega não afirma conformidade legal.
2. **AdSense, depois de validar o passo 6 em produção:** Privacidade e mensagens → cartão **Regulamentações europeias** → **Configurações** → em Consent Mode, manter marcada "Ativar o modo de consentimento para fins de publicidade" e **desmarcar** "Ativar o modo de consentimento para fins de análise" → Salvar. A opção vale para todas as mensagens europeias da conta.
3. **GA4:** Administrador → Fluxos de dados → fluxo web → Medição otimizada (engrenagem) → Visualizações de página → Mostrar configurações avançadas → confirmar **"Alterações de página com base em eventos do histórico do navegador" ativado**.
