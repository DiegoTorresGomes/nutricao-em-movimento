# Finalização GA4: separação entre a CMP do Google e o consentimento local

Data: 20/11/2026. Base: `02ea2c7`. GA4 `G-HDJ55H8QR6`. AdSense `ca-pub-3638053236344020`.
Nenhum commit, push ou deploy. Nada foi alterado em artigos, banco, políticas, sitemap, feed, newsletter, tag nativa AdSense ou painel Google. O #418 não foi corrigido.

## Decisão

| Escopo | Decisão |
|---|---|
| F1 (banner local quando a não aplicabilidade for comprovada) | **FAIL: bloqueado.** Não existe sinal oficial que comprove a não aplicabilidade para o público brasileiro. |
| **F2 + F3 isoladas, sem mudar o estado de consentimento** (é o que está hoje na árvore de trabalho) | **PASS para deploy.** Não recupera a mensuração do público brasileiro (ver Riscos). |

## 1. Mecanismo de identificação da aplicabilidade

Sinais oficiais disponíveis ([API de Privacidade e mensagens](https://developers.google.com/funding-choices/fc-api-docs)):

| Sinal | O que comprova | Quando existe |
|---|---|---|
| `CONSENT_API_READY` | as APIs dos frameworks de consentimento estão definidas | só se o script da CMP carregar |
| `getGoogleConsentModeValues().analyticsStoragePurposeConsentStatus` = 1/2 | CMP aplicável e com decisão (concedido/negado) | idem |
| … = 3 `NOT_APPLICABLE` | "Consent is not applicable for the given consent mode purpose" | idem |
| … = 4 `NOT_CONFIGURED` | finalidade não configurada no painel | idem |
| … = 0 `UNKNOWN` | erro ou dados ainda não prontos | idem |
| `__tcfapi` → `gdprApplies` (IAB TCF) | se o GDPR se aplica, segundo a CMP | idem |

**O impedimento:** todos os sinais dependem de o script da CMP ser carregado. Quando a AdSense decide não carregá-lo, a página não recebe nada; ver [diagnóstico](../diagnostico-cmp-418/relatorio.md) seção 1.1, campo `isGdprCountry=false` no acesso a partir do Brasil.
- **A documentação não oferece saída:** não há sinal de que a CMP não vai carregar, nem descrição do comportamento da API quando nenhuma mensagem se aplica à região.
- **Métodos documentados como inúteis aqui:** `getConsentStatus()` "will always return UNKNOWN", e `getConsentedProviderIds()` "always returns an empty list".
- **O que a ajuda da AdSense diz:** a CMP "is displayed on sites or apps that publishers have configured to show European or US regulations consent messages" ([fonte](https://support.google.com/adsense/answer/16918505)). Não diz se o script carrega em outras regiões.

Por isso, um visitante brasileiro real é indistinguível de "CMP bloqueada ou com falha". O único jeito de separar os dois casos seria o tempo de espera, ou o valor interno minificado da AdSense, e ambos estão vetados. Pela regra desta etapa, o fallback não foi implementado.

## 2. Estados de consentimento: antes e depois

A máquina de quatro estados pedida já é a do código existente, com a ressalva do estado 4:

| Estado pedido | Produção (mantida) | Comportamento |
|---|---|---|
| 1. CMP aplicável e inicializada | `google` (enum 1/2) | a CMP do Google decide; o botão do rodapé reabre a mensagem do Google |
| 2. CMP comprovadamente não aplicável | `local` (enum 3) | banner próprio; Analytics só após "Aceitar opcionais" |
| 3. CMP pendente | `pending` (0, 4, sem resposta) | defaults negados; sem GA; botão desabilitado com orientação |
| 4. CMP indisponível ou com erro | **não diferenciável de 3** sem tempo de espera | fica em `pending` (negado) |

O patch F1 (guardado, não aplicado) criava o estado 4 depois de 10s, apenas para habilitar o rodapé e mostrar um aviso, sem conceder nada. Ele foi retirado porque, com a CMP não carregando no Brasil, todo visitante brasileiro cairia nesse aviso de "indisponível", o que é enganoso e não recupera nada.

**Antes e depois do deploy proposto:** os estados de consentimento ficam **idênticos aos de produção**. Mudam apenas F2 e F3, que agem depois da decisão.

## 3. Resultado de F1, F2 e F3

- **F1:** não resolvida. Patch guardado em `patches/f1-estado-indisponivel.patch`, com os testes em `patches/ga4-cmp.test.ts.f1`.
- **F2:** os `_ga` só são apagados com recusa explícita da autoridade vigente (Google com negação ou banner local com recusa). Inicialização, navegação, foco, recarga e `pending` não apagam nada.
- **F3:** uma única fonte de `page_view`. O `config` envia a página de entrada e o Enhanced Measurement (eventos de histórico) envia as navegações. Removidos: o `page_view` manual, o guard `__nemAnalyticsPage` e a dependência `[pathname]`.
  - **Dependência no painel do GA4:** manter ativa a opção "Alterações de página com base em eventos do histórico do navegador". Se for desativada, as navegações SPA deixam de ser medidas.

## 4. Testes no navegador: build de produção local, `E2E_CMP_MODE=producao`, 16/16 PASS

Hits do GA interceptados com resposta 204: **14 emitidos, 14 interceptados, nenhum chegou ao GA4.** Anúncios e `fundingchoicesmessages` bloqueados. A CMP é um stub do contrato documentado.

| Cenário pedido | Teste | page_views | Resultado |
|---|---|---|---|
| Brasileiro com não aplicabilidade confirmada (stub enum 3) | B/F | 0 antes de aceitar | banner próprio, sem GA, sem `_ga` |
| Brasileiro real hoje (CMP não carrega) | D | 0 | `pending`, defaults negados, sem GA, rodapé desabilitado com orientação |
| Europeu com CMP funcionando (stub enum 2 → 1) | C | 1 após a concessão do Google | sem banner local; botão reabre a mensagem Google |
| CMP indisponível | D | 0 | idem ao brasileiro real |
| CMP tardia (12,5s) | E | 0 | `pending` até a resposta e depois banner local; nada antes |
| Aceitação | G | 1 (`/pt`, `_fv=1 _ss=1`, `gcs=G101`) | — |
| Recusa | H | 0 | sem GA, banner não volta |
| Revogação pelo rodapé | I | 0 depois | recarrega, `_ga` removido |
| Recarga + nova aba | J | 3 (mesmo `cid`, sem `_fv`/`_ss`) | `_ga` intacto durante `pending` |
| Nova sessão (inatividade de 31 min) | J2 | 1 (`_ss=1`, `_fv=0`, mesmo `cid`) | — |
| Cinco navegações SPA | K | **5** (antes: 10) | ordem e URLs corretas, 1 sessão, loader único |
| Só query / só hash | L | 1 / 0 | nada extra no `focus` |
| Layouts raiz `/pt → /login → /pt` | M | 1 na volta | login sem GA e sem AdSense |
| Login e administração | O | 0 | sem GA, sem AdSense, CSS presente |
| React #418 | N | 1 | #418 reproduzido, CSS preservado |

### Cookies

- **Antes:** a auditoria registrou que cada carga completa criava um `cid` novo com `_fv=1`.
- **Depois:**
  - O `cid` se mantém em recarga, nova aba, nova sessão e na volta do `/login`.
  - O `_ga` sobrevive ao estado `pending`.
  - O `_ga` só é removido na recusa ou na revogação, como manda a Política de Cookies.
  - Os cookies da AdSense não são tocados pelo banner local (teste unitário).

### Privacidade

- **Antes de qualquer autorização,** em todos os cenários: zero hits, gtag não carregado, sem `_ga`.
- **Sinais publicitários:** o banner local não altera `ad_*`, que continuam sob a CMP do Google (teste unitário "local actions never overwrite Google signals").
- **Defaults e ordem:** os 4 defaults negados seguem antes da AdSense; a ordem não foi alterada.
- **Coleta real:** nenhuma; todos os hits foram interceptados.

### Validação geral

| Verificação | Resultado |
|---|---|
| Unitários de consentimento | 22/22 |
| Suíte completa | 55/56, com a falha antiga do `editorial-preview` (404 no CSS do fixture de prévia, sem relação com GA) |
| `tsc` | OK |
| `eslint` | 0 erros; 3 avisos antigos |
| `next build` | OK |

## 5. Arquivos alterados (árvore de trabalho = deploy proposto)

| Arquivo | Mudança |
|---|---|
| `src/lib/consent-services.ts` | F2 (limpeza só com recusa explícita) e F3 (sem `send_page_view:false` e sem page_view manual) |
| `src/components/analytics/ConsentedAnalytics.tsx` | F3: o efeito não reexecuta a cada `pathname` |
| `scripts/ga4-browser.e2e.mjs` (novo) | cenários A–O; `E2E_CMP_MODE=producao`\|`f1` |
| `docs/analytics/finalizacao-ga4/` | este relatório, evidências e patches |
| `docs/analytics/diagnostico-cmp-418/evidencias/*.mjs` | cabeçalho `eslint-disable` (scripts de evidência) |
| `docs/analytics/correcao-ga4/relatorio.md` | aviso de que o desbloqueio de F1 foi superado |

Os arquivos `google-cmp.ts`, `CookieConsent.tsx`, `CookiePreferencesButton.tsx` e `consent.test.ts` estão com o conteúdo idêntico ao de produção. Para restaurar F1: `git apply docs/analytics/finalizacao-ga4/patches/f1-estado-indisponivel.patch`, devolver `ga4-cmp.test.ts.f1` para `scripts/ga4-cmp.test.ts` e rodar o e2e com `E2E_CMP_MODE=f1`. O diff completo anterior está em `patches/backup-f1-f2-f3-completo.patch`.

## 6. Riscos residuais

1. **Mensuração:** sem F1, o GA4 continua **sem medir visitantes do Brasil**, exatamente como hoje. O deploy de F2 e F3 só melhora a qualidade dos dados de quem já for autorizado (visitantes europeus que concederem pela CMP do Google, ou o estado `local` caso a CMP algum dia responda `NOT_APPLICABLE`). Não espere alta nos números depois do deploy.
2. **Europa não verificada em ambiente real:** o cenário europeu usa um stub da API. É preciso testar a partir do EEE, num navegador real e sem antivírus que injete scripts. O Kaspersky da máquina de testes injeta código nas páginas.
3. **#418, pendência separada:** o `adsbygoogle.js` insere o `show_ads_impl` no `<head>` antes da hidratação. A recuperação mantém o CSS, mas remove o slot de Auto Ads naquela visita. Também pode remover iframes da CMP no EEE (hipótese não verificada).
4. **Painel do GA4:** a dependência dos eventos de histórico (seção 3).

## 7. Alternativa segura para recuperar a mensuração no Brasil (decisão sua, nada implementado)

O impedimento é de arquitetura: "região" não é um sinal disponível para o site. A alternativa que dispensa qualquer prova de região é **separar por finalidade, não por região**:
- **A CMP do Google cuida só da publicidade** (`ad_storage`, `ad_user_data`, `ad_personalization`).
- **O banner próprio cuida de estatísticas para todos os visitantes,** com opt-in explícito, revogação no rodapé e, por padrão, negado.

O que isso exige:
- **Uma alteração no painel, que precisa da sua decisão:** desativar o propósito de **análise** no Consent Mode da mensagem europeia. Assim a CMP deixa de ser a segunda autoridade para estatísticas, e a API passa a responder `NOT_CONFIGURED` para Analytics nos visitantes em que carrega.
- **Um ajuste de código pequeno, só depois dessa decisão.**

Ponto de atenção: visitantes do EEE veriam duas mensagens, a do Google para anúncios e a do site para estatísticas. Isso é juridicamente aceitável se o banner próprio cumprir os requisitos de consentimento, mas convém validar com quem responde pela política de privacidade.

## Fontes oficiais

- https://developers.google.com/funding-choices/fc-api-docs
- https://support.google.com/adsense/answer/16918505
- https://support.google.com/adsense/answer/10961068
- https://support.google.com/adsense/answer/13554116
