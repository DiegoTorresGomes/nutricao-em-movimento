# Testes

## Revisão da cobertura da Home

- `home-antes.json`: `/` respondeu 307 para `/pt`, canonical `/pt`, nenhum descritor AdSense. O usuário confirmou preservar esse comportamento: o loader executa apenas no destino.
- O teste HTTP passou em **24 rotas/respostas**: `/` com 307, Location e canonical `/pt`, zero loaders e destino 200 com um descritor; uma lista explícita de 11 páginas públicas; login/2FA, três respostas administrativas, API inexistente e seis respostas técnicas/asset. Metadata publicitária verificada exatamente uma vez em cada página elegível. Nenhum loader nas respostas técnicas/não HTML. Resultados finais em `http-local.json`.
- Os 22 testes de consentimento passaram novamente; lint passou com os mesmos dois avisos preexistentes; typecheck e `npm run build` passaram. A lógica CMP/GA não foi modificada nesta revisão. O build desta revisão preserva o redirecionamento `/` → `/pt`; não valida uma Home renderizada em `/`.
- **LOCAL: Node 24.14.1 PASS. HOSTINGER: Node 22 precisa ser validado no deploy.** O runtime local é permitido por package.json e não é erro.

## Escopo comprovável localmente

- `node --import tsx --test scripts/consent.test.ts`: 22 testes PASS. Cenários A sem decisão, B aceite, C recusa e D alteração/reabertura exercitados com mocks e controller real. Cobertura adicional de CMP pendente, enum oficial 0–4, precedência da CMP sobre preferência local, revogação de analytics, callback TCF, reabertura pela fila oficial e preservação de cookies AdSense. As chamadas consent observadas nesse teste são simuladas; não são sinais reais Google.
- `npm run lint`: PASS, dois avisos preexistentes (img em administração/segurança e import destroySession não utilizado em AdminLayout).
- `npx --no-install tsc --noEmit`: PASS após corrigir tipo da fila Google.
- `npm run build`: PASS em Node 24.14.1, Next 15.5.29, Prisma 7.10.1. Primeira tentativa falhou no tipo da fila e foi corrigida. Sem fontes novas nem dependências alteradas.
- `node scripts/check-adsense-cmp-http.mjs`: valida a cobertura acima. Verifica descritor único de carregamento afterInteractive nas rotas públicas, publisher/metadata, defaults no head, nenhum GA remoto inicial e ausência do descritor nas rotas operacionais. Obtém o slug de um artigo publicado por leitura da listagem; não altera banco. Inspeciona redirects sem segui-los automaticamente e consulta explicitamente o destino da Home. Admin autenticado não foi aberto; foi verificado o redirecionamento para login e a composição dos layouts no código. A rota API usada é uma URL inexistente/404, sem executar endpoints que possam gravar dados. Nenhuma resposta local continha CSP.
- Um protótipo async nativo foi rejeitado pelo teste de ordem porque React antecipou o script antes dos defaults; a solução final usa afterInteractive.

## Limites e cenário E

O runtime do navegador CUA não iniciou. Portanto Network/console e escolhas Google reais não foram verificadas; não há evidência de valores reais de ad_storage, analytics_storage, ad_user_data ou ad_personalization, nem confirmação de ausência de erros TCF, hydration ou CSP no browser. O teste de enum não equivale a testar a mensagem europeia.

Após um deploy autorizado em separado, abrir janela privada em `https://www.nutricaoemovimento.com/pt?fc=alwaysshow&fctype=gdpr`, mecanismo oficial documentado pela Google. Não adicionar parâmetros ao código. Validar concessão, recusa, opções parciais e reabertura pelo footer; repetir com decisão já salva e navegação SPA. Limpar dados de teste ou fechar o perfil temporário ao terminar. O modo preview não comprova geolocalização nem comportamento da região real; complementar com sessão real EEE/UK/CH e sessão Brasil.

Em DevTools, distinguir download do loader AdSense de requisição de anúncio. Observar pagead2.googlesyndication.com, googleads, doubleclick, googletagmanager e google-analytics. GA não deve baixar/enviar page_view sem consentimento de estatísticas; com aceite, somente uma instância e um evento por navegação. Rejeitar depois do aceite deve recarregar e impedir novo loader. Inspecionar login/admin em documento novo e após navegação pública, inclusive sem aceitar analytics.

Consultar valores pela API Google apenas dentro de `CONSENT_MODE_DATA_READY`; o dataLayer mostra comandos, mas não constitui sozinho prova do estado final. Conferir que nenhum update local contém campos de ads. Não clicar em anúncios para testar. Ausência de anúncios durante revisão não é falha da integração.
