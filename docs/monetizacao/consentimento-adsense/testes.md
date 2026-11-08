# Testes locais — consentimento e AdSense

Data: 08/11/2026. Node 24.14.1; Next 15.5.29; Prisma Client 7.10.1. Sem deploy.

## Comandos e resultados

| Verificação | Resultado |
|---|---|
| `node --import tsx --test scripts/consent.test.ts` | **16/16 passaram** |
| `npm run lint` | **Passou**, zero erros, dois avisos preexistentes |
| `npx --no-install tsc --noEmit` | **Passou** |
| `npm run build` | **Passou após reconstrução do cache**, 37 páginas |
| `node scripts/check-consent-http.mjs` | **Passou**, 11 GETs locais |
| `git diff --check` | Passou |
| `.next/` ignorado/sem rastreamento | Confirmado; scripts de apoio em `scripts/` |

Avisos preexistentes: `<img>` na segurança administrativa e import `destroySession` não utilizado no AdminLayout. Nenhuma supressão foi adicionada. A validação completa pode ser executada por `node scripts/check-consent-local.mjs`, que registra códigos e logs em UTF-8; não instala dependências, não migra banco e não faz deploy.

Houve falhas intermediárias de integração no desenvolvimento, corrigidas antes do resultado final. Uma tentativa final de rebuild encontrou EINVAL/readlink em `.next/diagnostics/framework.json`, comportamento já registrado no OneDrive. [Log dessa tentativa](build-tentativa-cache.log). O cache gerado foi movido integralmente, sem exclusão de fontes, para `node_modules/.cache/consent-next-20261108-115418`. O novo build passou. [Códigos das verificações e recuperação](validacoes.json).

`prisma generate` integra o comando de build e somente gerou cliente. Nenhuma mudança de schema exigia `prisma validate`, migração ou escrita de dados nesta fase. O build pode ler conteúdo para prerenderização; não foram executados cron, seed, scripts editoriais ou formulários de escrita.

## Estados, eventos e componentes reais com mocks

O arquivo [consent.test.ts](../../../scripts/consent.test.ts) usa node:test, VM, React/SSR e objetos de navegador simulados. O controlador real do banner é executado com hooks simulados, sem um navegador renderizado. Isso permite verificar estado e callbacks de botões sem contato com servidores Google. Não confundir com validação visual ou teste real de cookies de terceiros.

Os 16 casos cobrem:

1. Defaults denied dos quatro sinais, emitidos localmente sem rede.
2. Novo usuário, sem decisão e sem carregamento opcional.
3. Aceitar: persistência, update anterior a config e loader GA único/assíncrono; ads negados.
4. Recusar: recusa persistida, leitura nova e ausência de loader.
5. Aceitar → recusar: substituição do registro, ga-disable, limpeza de cookie opcional, preservação de sessão/preferência e recarga.
6. Recarregar após aceite: decisão lida antes da configuração.
7. Estado antigo, inválido, tipo incorreto ou expirado não autoriza serviços.
8. localStorage bloqueado, com fallback para cookie próprio.
9. Remoção de armazenamento e invalidação do estado em memória.
10. Eventos de reabertura e mudança sem concessão automática.
11. Limite público/privado: recarga se código público já tiver sido executado; nenhuma recarga desnecessária sem loader.
12. Sem identificador GA: aceite não cria requisição externa; sinais publicitários continuam denied.
13. Primeira camada e callbacks reais: recusar, preferências e aceitar.
14. Painel de preferências: escolha atual, salvar e publicidade desabilitada.
15. Linha exata ads.txt igual ao publisher central.
16. Controlador real: visitante novo, rejeição, reabertura, alteração de categoria, aceite, fechamento sem mudança e limpeza de listeners.

Evidência: [estados.log](estados.log), [lint.log](lint.log), [typecheck.log](typecheck.log). Arquivo vazio de typecheck corresponde a saída sem diagnósticos; seu exit code consta no JSON.

## HTTP do build de produção local

Servidor temporário: `node node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3107`. Testes usam apenas GET, sem execução de JavaScript e sem submissão de formulários.

| URL | Resultado |
|---|---|
| `/ads.txt` | 200, `text/plain; charset=UTF-8`, linha exata e newline final |
| `/pt/politica-de-privacidade` | 200; texto novo e botão de preferências |
| `/pt/politica-de-cookies` | 200; texto novo, sem aceitação por navegação, publicidade pausada |
| `/pt/termos-de-uso` | 200 |
| `/pt/disclaimer` | 200, conteúdo preservado |
| `/pt/politica-editorial` | 200, conteúdo preservado |
| `/pt/contato` | 200 |
| `/login` | 200, nenhum loader remoto opcional |
| `/login/2fa` | 200, nenhum loader remoto opcional |
| `/administracao` sem sessão | 307 para login |
| URL inexistente de teste | 404, nenhum loader remoto opcional |

Nas respostas HTML 200, os defaults locais e metadata com publisher foram encontrados; nenhum src de script de AdSense/GA/GTM/Clarity foi servido no HTML inicial. Isso é esperado: GA entra depois de uma escolha no cliente, testada com mocks. Não é afirmação de que nenhum script de primeira parte seja servido.

Evidência: [http-local.json](http-local.json). Nenhum artigo foi aberto com JavaScript nem teve contador acionado por esses testes. O processo temporário é encerrado ao concluir a validação.

## Limites

Não houve inspeção visual de desktop/mobile, execução real de GA, análise de cookies/rede reais, anúncios, CMP/TCF regional, conta Google ou sessão administrativa autenticada. O acesso visual já havia ficado indisponível na auditoria anterior; esta etapa usou os testes automatizados/mocks autorizados pelo pedido, sem inventar validação visual.

O build informa First Load JS compartilhado de 103 kB, home 113 kB, listagem 121 kB e artigo 111 kB. São estimativas de bundles do build local, **não LCP/INP/CLS nem métricas de campo**. Não foram refeitos PageSpeed ou auditoria editorial/segurança. O risco de dependências anterior e as pendências de Search Console permanecem.

Não houve teste em produção nem implantação. `/ads.txt` 200 é resultado local; o último estado público conhecido continua 404. Políticas novas e scripts só passam a valer no site após eventual deploy autorizado e nova conferência.
