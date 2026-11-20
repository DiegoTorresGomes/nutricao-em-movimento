# Integração AdSense e CMP — 20/11/2026

## Auditoria complementar da Home `/`

A revisão de cobertura encontrou `src/app/page.tsx` executando somente `redirect('/pt')`. Em teste HTTP sem seguir redirecionamento, `/` respondeu **307**, Location `/pt`, canonical `https://www.nutricaoemovimento.com/pt` e **zero descritores AdSense**. Evidência: `home-antes.json`. Essa rota usa somente RootLayout; não passa pelo layout filho `/pt`. Não há conteúdo Home renderizado na origem.

A informação de que Search Console selecionou `/` foi fornecida pelo usuário; não muda o comportamento local constatado. **Decisão confirmada pelo usuário: preservar o redirecionamento `/` → `/pt`; o AdSense executa apenas no destino.** Portanto, `/` deve continuar com 307 e zero loaders; `/pt` deve responder 200 com exatamente um descritor afterInteractive. Nenhum redirecionamento ou canonical foi alterado nesta revisão. A exigência inicial de loader na origem foi substituída por essa escolha explícita. Não há decisão de cobertura pendente.

O teste HTTP foi ampliado para uma lista explícita de páginas públicas e para respostas técnicas: feed, sitemap, robots, ads.txt, manifest e imagem. Esses endpoints foram apenas lidos, sem alterar seus arquivos. A composição dos layouts exclui login, administração e APIs do loader.

## Auditoria anterior

- AdSense: **A (somente metadata)** e **D (nenhum loader)**. `src/app/layout.tsx`, RootLayout, exportava `google-adsense-account` para todas as páginas HTML. `src/config/monetization.ts` centralizava `ca-pub-3638053236344020`; `public/ads.txt` já continha o publisher DIRECT correspondente. Nenhum slot ou `adsbygoogle.push()` ativo.
- GA: uma implementação direta em `src/lib/consent-services.ts`, montada por `ConsentedAnalytics` em PublicLayout. ID público configurado localmente: `G-HDJ55H8QR6` (`NEXT_PUBLIC_GA_ID`; conferir ambiente do deploy). Loader dinâmico `gtag/js` somente após escolha positiva. `config` com `send_page_view:false`, Google Signals e personalização desativados; um `page_view` por URL completa em cada documento, inclusive navegação acompanhada pelo componente. GTM e Clarity legados não são montados: zero instâncias ativas deles.
- Defaults: `ConsentModeInit` no head global inicializa fila local e os quatro sinais denied; não faz requisições.
- Banner: necessários sempre ativos, estatísticas booleanas e publicidade desabilitada/pausada. Aceitar e recusar salvavam apenas estatísticas. Persistência `nem-consent-v2` em localStorage e cookie `nem-consent`, versão 2, validade 180 dias; fallback em memória/cookie e sincronização entre abas. Footer emitia `nem:open-consent`.
- Conflitos encontrados: salvar preferências, montar GA, focar a janela e sair do público reenviavam publicidade denied; recusar estatísticas apagava também cookies `__gads`, `__gpi`, `__eoi`. Isso poderia sobrescrever/interferir na CMP Google. Políticas e documentação ainda afirmavam ausência de publicidade/CMP.

## Arquitetura final

1. `src/app/pt/layout.tsx` inclui um único `next/script` (`nem-adsense`), async, crossorigin anonymous, URL oficial com o publisher confirmado. Auto Ads continua exclusivamente no painel: nenhum ins, slot ou push manual.
2. Estratégia **afterInteractive**: defaults locais executam no head antes de hidratação; o AdSense inicializa depois sem depender de aceitar no banner. `beforeInteractive` exige o root layout e atingiria também login/admin na estrutura atual. O protótipo com script async nativo foi descartado porque o React 19 o antecipou no head antes dos defaults (falha detectada no teste HTTP). Na versão instalada, next/script insere o loader após hidratação; não se afirma que o elemento remoto esteja no head do HTML inicial. Esse desvio da recomendação de posição Google preserva a ordem de consentimento e usa a API documentada do Next. A URL pode aparecer em preload/RSC sem constituir uma segunda execução.
3. O layout de rota cobre `/pt`, listagem, artigos, autora, sobre, contato e políticas. Não é montado por login, 2FA, administração ou APIs. Metadata global preservada, inclusive em login, sem equivaler a publicidade.
4. O guard existente foi ampliado para reconhecer AdSense, além do GA. Links internos para fora do público abrem documento novo; navegação programática detectada fora do público recarrega. Assim código já executado não persiste na área operacional. A ausência inicial de loader é estrutural; o guard complementa essa separação em transições SPA e não oferece isolamento retroativo durante o breve intervalo até o efeito em navegação programática.
5. `src/lib/google-cmp.ts` usa somente APIs documentadas: `callbackQueue`, `CONSENT_MODE_DATA_READY`, `getGoogleConsentModeValues`, `CONSENT_API_READY`, `__tcfapi('addEventListener',0,...)` e `showRevocationMessage`. Não traduz finalidades TCF manualmente nem detecta geografia por IP.
6. O enum de analytics da Google define a autoridade: GRANTED/ DENIED → Google; NOT_APPLICABLE → preferências locais; UNKNOWN/NOT_CONFIGURED/ausente → pendente, GA bloqueado. Se CMP for bloqueada ou não inicializar, não há fallback temporal que conceda permissão: banner e botão aguardam a Google. Isso também pode impedir o painel próprio fora da Europa sob bloqueadores; o footer informa como tentar novamente.
7. No escopo Google, o banner próprio fica oculto. GA só carrega com analytics Google concedido e não emite consent update próprio. Fora desse escopo, o banner preserva a preferência v2 e atualiza **somente analytics_storage**. `ads:false` no registro legado não representa nem modifica consentimento publicitário. Os três sinais de ads não são escritos por código próprio após os defaults. Fora da região Google permanecem conservadoramente denied; o painel próprio não concede publicidade, e disponibilidade de formatos limitados depende da Google.
8. Alterações TCF concluídas solicitam nova leitura pela fila oficial no próximo turno de execução. Retirada de analytics marca ga-disable, limpa somente cookies GA acessíveis e recarrega quando GA já executou. Cookies publicitários não são apagados pelo painel. Preferência local antiga não vence a escolha da CMP.
9. O footer mantém acesso às preferências locais quando aplicável; no escopo Google muda o texto para “Preferências de privacidade Google” e chama a reabertura oficial via fila. Não cria uma segunda CMP.

## Google CMP, políticas e CSP

A publicação, associação do domínio, Auto Ads e Consent Mode de ads/analytics no painel foram informados pelo usuário; não foram auditados por acesso à conta. A tag AdSense permite entregar a mensagem publicada; Google decide a aplicabilidade regional e transmite TCF/Consent Mode. O bridge apenas lê analytics e gerencia o loader GA. Não se afirma que mensagens ou anúncios foram efetivamente servidos.

As duas políticas receberam somente correções dos trechos incompatíveis com a ativação: publicidade, autoridade regional, estatísticas e reabertura. Nenhum artigo ou conteúdo editorial foi alterado. Nenhum banco, sitemap, feed, ads.txt, fonte ou dependência foi alterado.

Não havia CSP em next.config ou middleware. Testes HTTP locais registram o header recebido; não se adicionou allowlist ampla. CSP/CDN do host precisa ser inspecionada após deploy, caso exista. Não houve observação real de bloqueio CSP Google.

## Validação e limites

Consulte `testes.md`, `http-local.json` e `checklist-deploy.md`. Estado local é coberto por mocks; isso não prova execução real Google. O navegador CUA falhou ao iniciar (caminho do runtime inexistente). Não houve captura Network, console, hydration, consent signals reais ou mensagem europeia forçada. Build local executado em Node **24.14.1**, permitido por package.json; Node 22 solicitado não estava no runtime usado e segue como validação do ambiente de destino. Next 15.5.29 e Prisma 7.10.1 preservados. O diretório `node_modules/next/dist/docs/` não existe neste pacote; foram consultados docs oficiais da versão 15 e implementação instalada.

## Arquivos

Alterados: `src/lib/consent.ts`, `src/lib/consent-services.ts`, `src/components/analytics/ConsentedAnalytics.tsx`, `src/components/consent/CookieConsent.tsx`, `src/components/consent/CookiePreferencesButton.tsx`, as páginas de políticas de cookies/privacidade, `scripts/consent.test.ts`, `docs/analytics-and-consent.md`.

Criados: `src/lib/google-cmp.ts`, `src/app/pt/layout.tsx`, `scripts/check-adsense-cmp-http.mjs`, os três Markdown desta pasta e `http-local.json`.

Nenhum commit, push ou deploy executado.

## Referências oficiais

- [Google Privacy & Messaging API: filas, enums, TCF, revogação e teste](https://developers.google.com/funding-choices/fc-api-docs)
- [Configurações Consent Mode AdSense](https://support.google.com/adsense/answer/16053245?hl=en)
- [Escopo regional da mensagem e atualizações Consent Mode](https://support.google.com/adsense/answer/10961068?hl=en)
- [Next 15: estratégias Script](https://nextjs.org/docs/15/app/api-reference/components/script)
