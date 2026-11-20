# Auditoria de arquitetura: consentimento por finalidade, GA4 e CMP do Google

Data: 20/11/2026. Base: `02ea2c7` + F2/F3 locais (não implantadas). Etapa somente de auditoria e proposta: nenhum código funcional, painel, política, patch ou tag AdSense foi alterado. Sem commit, push ou deploy.

**Classificação: GO CONDICIONAL.** A Alternativa A (separação por finalidade) é tecnicamente viável e compatível com a documentação oficial do Google, mas depende das verificações da seção 4.

Documentos desta pasta:
- [comparativo-alternativas.md](comparativo-alternativas.md)
- [matriz-consentimento.md](matriz-consentimento.md)
- [plano-implementacao.md](plano-implementacao.md)
- [checklist-google.md](checklist-google.md)

Evidências: `evidencias/` (protótipo, script e resultado da matriz).

## 1. Estado inspecionado

- **Árvore Git:** `main` em `02ea2c7`. As mudanças funcionais são só F2 e F3 (`consent-services.ts`, `ConsentedAnalytics.tsx`). Os demais arquivos marcados como modificados têm conteúdo idêntico ao HEAD; a diferença é só de fim de linha. F1 está guardada em `docs/analytics/finalizacao-ga4/patches/` e não foi aplicada.
- **Defaults:** os quatro sinais começam negados em script inline, antes do `adsbygoogle.js` (`ConsentModeInit.tsx`, `DocumentLayout.tsx`).
- **Regra atual de autoridade:** a CMP do Google decide estatísticas quando responde 1/2. O banner próprio só aparece com `NOT_APPLICABLE` (3). O banner atualiza apenas `analytics_storage` e nunca `ad_*` (`consent.ts`).
- **Políticas:** a [Política de Cookies](../../../src/app/pt/politica-de-cookies/page.tsx) afirma que "No EEE, Reino Unido e Suíça, a CMP Google gerencia publicidade/TCF e estatísticas" e que o painel próprio "não é exibido" enquanto a aplicabilidade estiver indisponível. A Alternativa A contradiz esses trechos, então as políticas precisariam mudar.
- **Efeito em produção hoje:** a CMP não carrega no Brasil, o estado fica `pending`, o GA nunca carrega e o banner próprio nunca aparece (ver [diagnóstico](../diagnostico-cmp-418/relatorio.md)).

## 2. O que a documentação oficial diz, o que foi observado e o que é hipótese

| Ponto | Classificação | Fonte ou evidência |
|---|---|---|
| A ajuda do GA4 admite banner próprio ("you can also build a consent banner yourself… integrate with Google's consent API yourself") | **Documentado** | [GA4 14546213](https://support.google.com/analytics/answer/14546213) |
| CMP certificada é exigida para **servir anúncios personalizados** no EEE, Reino Unido e Suíça; o texto não menciona Analytics | **Documentado** | [AdSense 13554116](https://support.google.com/adsense/answer/13554116) |
| "Google does not require advertisers to use a CMP from the partner Program"; a política exige repassar as escolhas (Consent Mode ou TCF) e se aplica a usuários do EEE, Reino Unido e Suíça | **Documentado** | [EU user consent policy help](https://www.google.com/about/company/user-consent-policy-help/) |
| A CMP oferece duas caixas: publicidade e, só se esta estiver marcada, análise. A de análise faz a mensagem "gather consent for the analytics storage purpose". A configuração vale para a conta toda | **Documentado** | [AdSense 16053245](https://support.google.com/adsense/answer/16053245), [16088460](https://support.google.com/adsense/answer/16088460) |
| A CMP só atualiza escolhas de quem vê a mensagem; defaults para outras regiões são responsabilidade do site | **Documentado** | [AdSense 16053245](https://support.google.com/adsense/answer/16053245) |
| O `default` deve rodar antes de qualquer comando de medição; o `update` vem depois da escolha, na mesma página | **Documentado** | [Tag Platform – consent](https://developers.google.com/tag-platform/security/guides/consent) |
| `update` parcial (só `analytics_storage`) mantém os `ad_*` | **Observado** com o gtag.js real (hits com `gcs=G101`); a documentação não declara isso explicitamente | matriz, cenários B e F |
| A CMP chama `gtag('consent','update')` sozinha depois da escolha (H1); com análise ativa, inclui `analytics_storage` (H2) | **Hipótese**, não documentada e não observada (não houve acesso real a partir do EEE) | simulação |
| Desativar a análise não muda a interface nem o TCF da mensagem | **Não comprovado**; a documentação não fala disso | — |
| Eventos TCF `cmpuishown` e `useractioncomplete` (IAB) servem para recolher o banner próprio enquanto a mensagem do Google está na tela | Padrão IAB; **observado só na simulação** | matriz, cenário D |

Valores internos do código minificado do Google não foram usados como contrato.

## 3. Respostas objetivas

**A separação por finalidade é tecnicamente viável?**
Sim. O protótipo, numa worktree descartável, passou nos 21 cenários da matriz com GA4 interceptado e CMP simulada. Para o Brasil não é preciso detectar a aplicabilidade: o banner próprio pede estatísticas a todos.

**É compatível com a documentação oficial do Google?**
Sim, nos pontos documentados:
- banner próprio para Analytics é admitido;
- CMP certificada é exigida apenas para anúncios personalizados;
- o propósito de análise é uma opção do painel;
- defaults fora do EEE são responsabilidade do site.

Não há documentação sobre coordenar duas fontes de `analytics_storage`. Por isso a recomendação é eliminar a sobreposição.

**Quais condições ainda precisam ser confirmadas?** Ver seção 4.

**Desativar a análise na CMP do Google é necessário, opcional ou inadequado?**
É **necessário para a arquitetura-alvo e opcional para a segurança**.
- **Com análise ativa:** o protótipo segue seguro (uma recusa do Google prevalece e uma concessão do Google sozinha não basta, cenários F-ON). Mas o europeu responde duas vezes à mesma pergunta e pode dar respostas opostas.
- **Com análise desativada:** a sobreposição some.
- **Quando fazer:** só depois da revisão do AdSense e com aprovação explícita. Nesta etapa nada foi alterado.

**Qual arquitetura atende melhor ao blog?**
A Alternativa A em duas fases: primeiro o código, com regra restritiva compatível com o painel atual, e depois o painel. Ver o [comparativo](comparativo-alternativas.md).

**Qual é a menor implementação segura?** Seis arquivos de código, mais as políticas (ver o [plano](plano-implementacao.md)):
- **Autoridade de estatísticas:** o banner próprio passa a ser a autoridade para todos os visitantes.
- **Papel do Google:** só restringe, com uma recusa explícita (2).
- **Banner:** recolhe-se enquanto a mensagem do Google está aberta.
- **Rodapé:** ganha controles separados por finalidade.
- **Versão:** a versão da decisão sobe para v3.
- **Preservados:** F2 e F3.

**Quais alterações seriam necessárias no painel Google?**
Fase 2, opcional e posterior: desmarcar "Enable consent mode for analytics purposes" na mensagem de Regulamentações europeias. A publicidade e a mensagem continuam como estão.

**O que precisa mudar no código?**
- `google-cmp.ts`: lê API, `gdprApplies`, status de análise e `uiShown`.
- `consent.ts`: `analyticsDecision`, `update` sempre só de `analytics_storage`, v3.
- `consent-services.ts`: usa a decisão.
- `CookieConsent.tsx`: aparece para todos e se recolhe com `cmpuishown`.
- `CookiePreferencesButton.tsx`: dois botões.
- Testes.
- Políticas de Cookies e de Privacidade.

**Como validar GA4 e AdSense depois da mudança?**
Ver o [checklist](checklist-google.md):
- Tag Assistant e DebugView no Brasil;
- `gcs`/`gcd` nos hits;
- acesso real a partir do EEE, para confirmar H1/H2 e a sequência das mensagens;
- página de consentimento do GA4;
- relatórios de mensagens do Privacidade e mensagens;
- AdSense sem mudança de requisições.

**Qual é o risco de regressão?** Baixo a moderado:
- **Comportamento novo e visível:** o banner aparece para todo brasileiro.
- **Interface sem teste real:** a sequência de duas mensagens no EEE não foi testada de verdade.
- **Políticas:** precisam acompanhar a mudança.
- **Sem mudança:** F2, F3, AdSense, layouts raiz e #418 (pendência separada) continuaram como estavam na matriz.

**A solução pode ser aprovada para implementação?**
**GO CONDICIONAL.** Pode ser implementada assim que as condições 1 a 3 da seção 4 forem aceitas. As condições 4 a 6 se verificam antes e depois do deploy.

## 4. Condições do GO

1. **Validação jurídica** (LGPD e, para visitantes do EEE, GDPR e ePrivacy) do banner próprio como mecanismo de consentimento para estatísticas: granularidade, prova da decisão (versão, data e categorias já registradas), revogação e textos. Esta auditoria não declara conformidade legal.
2. **Revisão das Políticas de Cookies e de Privacidade**, para refletir a separação por finalidade. É mudança de texto institucional e requer sua aprovação.
3. **Aceite da mudança de interface:** o banner passa a aparecer para todo visitante sem decisão, e os europeus veem duas mensagens em sequência.
4. **Validação real a partir do EEE**, sem antivírus que injete scripts, de H1/H2 e da sequência das mensagens (Tag Assistant). Não basta simular geolocalização.
5. **Calendário do AdSense:** implementar o código só quando a revisão em andamento terminar, ou aceitar conscientemente o risco de alterar a interface durante ela. A mudança no painel (fase 2) vem depois.
6. **Painel do GA4:** manter ativa a opção de mudanças de página por eventos do histórico (dependência de F3).

## 5. Limitações

- **CMP simulada:** a CMP real não carregou em nenhum teste, porque o acesso é a partir do Brasil.
- **O que é real e o que é modelo:**
  - os valores de `ad_*` nos cenários europeus vêm da simulação (H1);
  - os valores de `analytics_storage`, o carregamento do GA, os cookies e o `page_view` são reais, medidos com o gtag.js de verdade e hits interceptados.
- **#418:** não foi corrigido. Continua reproduzido e com CSS preservado (cenário O).
- **Fonte de terceiros:** a informação de que o Google passaria a usar IP para medição de anúncios no EEE a partir de agosto de 2026 veio só de um resumo da página da política e precisa ser conferida. Se confirmada, afeta o texto da Política de Privacidade.
