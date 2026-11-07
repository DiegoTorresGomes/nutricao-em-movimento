# Validação das correções estruturais editoriais

7 de novembro de 2026, America/Sao_Paulo. **Validação local concluída. Não houve alteração do banco remoto, backfill histórico, commit, push ou deploy.**

## Ambiente e isolamento

Docker, Podman e MariaDB não estavam instalados. Usada a distribuição portátil oficial **MariaDB 11.4.13-MariaDB**, sem serviço do Windows, exclusivamente em **127.0.0.1:33317**, banco `nutricao_editorial_disposable`. A versão foi obtida por `SELECT VERSION()` no banco local. Não se consultou o servidor remoto para descobrir sua versão.

Distribuição: [arquivo oficial Windows x64](https://archive.mariadb.org/mariadb-11.4.13/winx64-packages/mariadb-11.4.13-winx64.zip). Instalação portátil conforme a [documentação oficial](https://mariadb.com/docs/server/server-management/install-and-upgrade-mariadb/installing-mariadb/binary-packages/installing-mariadb-windows-zip-packages). Binários, dados, configuração privada e logs ficaram em `%TEMP%\nutricao-editorial-mariadb-11.4.13`, fora do repositório. Nenhuma senha local foi adicionada a arquivos versionáveis. O `.env` existente não foi sobrescrito.

`scripts/editorial-local-env.mjs` injeta a configuração apenas no processo filho e recusa divergência entre `DATABASE_URL` e os campos `DB_*`, host diferente de 127.0.0.1, porta diferente de 33317 ou outro banco. Segredos de autenticação/cron são gerados localmente, substituindo os remotos nos processos de teste. Não houve clonagem dos 31 artigos: o banco contém apenas fixtures fictícias, usuário local, categoria local e artigos criados pelos testes. O slug legado foi reutilizado somente numa fixture para exercitar a regra dirigida de apresentação.

O servidor `npm run dev` usou `127.0.0.1:33117` e foi encerrado ao terminar. O MariaDB também foi encerrado após a validação; seus arquivos temporários foram preservados para eventual reprodução. Não há serviço de inicialização automática.

## Schema e db push

Revisados diff, Post, criação, edição, cron, views, página/metadata/JSON-LD e os oito testes offline antes dos novos testes. O campo é **`editorialUpdatedAt DateTime?`**, nullable, **sem default no schema e sem `@updatedAt`**. No MariaDB foi confirmado como `datetime(3)`, `IS_NULLABLE=YES`, default implícito SQL `NULL`, sem atributos automáticos em `EXTRA`.

`publishedAt` continua nullable e representa a primeira publicação. `updatedAt DateTime @updatedAt` continua técnico, gerenciado pelo Prisma; não é um trigger SQL `ON UPDATE`. `views` continua inteiro não nulo, default 0. A inspeção de `information_schema.COLUMNS` está no arquivo de evidências.

Executados com conexão explicitamente local:

- `prisma validate`: passou.
- `prisma generate`: passou, Prisma 7.10.1.
- `prisma db push`: criou a estrutura no banco descartável vazio.
- Criado o artigo fictício com P1 fixo, revisão nula e views 0; registrado o estado.
- Segundo `prisma db push`: informou que a base já estava sincronizada; não apagou dados/tabelas. A fixture, `views`, `publishedAt` e `updatedAt` foram comparados antes/depois e permaneceram iguais.

Não houve `DROP`, `RESET`, `--accept-data-loss` ou migration destrutiva. A aplicação numa base vazia e a reaplicação idempotente foram testadas; não se simulou uma cópia integral do schema/dados remotos. O repositório continua sem cadeia consolidada de migrations versionadas. Não foi criada uma baseline artificial.

## Resultados funcionais reais

Os testes usaram **HTTP contra `npm run dev`, Prisma e MariaDB reais**, sem mocks. Login submeteu o formulário real e recebeu cookie de sessão local. Edição e criação submeteram os marcadores `$ACTION_*` obtidos dos formulários administrativos reais; o cron e views foram chamados nas rotas usadas pela aplicação. O script terminou com código 0. Não foi feita automação visual de cliques/hidratação no navegador.

| Verificação | Resultado observado |
| --- | --- |
| Estado inicial | `publishedAt=P1=2026-01-15T12:00:00.000Z`, `editorialUpdatedAt=null`, `views=0`. |
| POST de views | `views=1`; publicação P1 e revisão nula preservadas. Nesta implementação o próprio `updatedAt` também permaneceu igual, pois o SQL parametrizado altera apenas o contador. |
| JSON-LD após view | `datePublished=P1`, `dateModified=P1`. Confirmado no HTML obtido por GET; sem dependência de `updatedAt`. |
| Abrir editor | Não alterou a revisão editorial. |
| Salvar sem mudança | Manteve `editorialUpdatedAt=null`, inclusive ao persistir a normalização estrutural do legado. |
| Primeira edição de conteúdo | Registrou E1=`2026-11-07T17:19:10.612Z`; P1 permaneceu igual. O JSON-LD passou a `dateModified=E1`. |
| Salvar novamente sem mudança | Preservou E1. |
| Segunda edição de conteúdo | Registrou E2=`2026-11-07T17:19:11.482Z`; publicação continuou P1. |
| Novo artigo | Criado como rascunho pelo fluxo administrativo; publicação inicialmente nula. Ao publicar, recebeu primeira publicação, sem fabricar revisão editorial. H1 manual interno foi convertido em H2 já no salvamento. |
| Agendamento vencido | Criado pelo admin com data programada conhecida. Cron publicou exatamente um artigo, atribuiu primeira publicação e manteve revisão nula e data programada. |
| Edição após publicação agendada | Manteve a primeira publicação e atribuiu revisão editorial própria. |
| Republicação agendada | Artigo original voltou a PUBLISHED pelo cron mantendo P1 e E2. Novo cron publicou zero; não repetiu a publicação. |
| Agendamento futuro | Permaneceu SCHEDULED, publicação nula e instante programado intacto. |
| H1 legado | Um único H1 principal no HTML. O H1 interno virou H2; os H2/H3 e o texto fictício original permaneceram. |
| Duas âncoras | Textos sobre fome emocional/física e mesmo destino relativo correto, sem promessa de guia completo de escala. |
| Destino das âncoras | GET público, sem JavaScript/contador, retornou **HTTP 200**. Título e conteúdo correspondem a fome emocional/física; ambas as âncoras usam essa mesma URL. |
| Referências | Criação via admin com `contentBlocks`: autor/instituição, título, publicação, ano, DOI e URL suportados; DOI teve precedência no item que continha ambos; um segundo item testou URL direta. Texto legado também foi exibido. Links externos com `target="_blank" rel="noopener noreferrer"`. Referências explicitamente fictícias, somente locais. |
| Autoria/schema | BlogPosting no HTML preservou o nome completo e o perfil canônico configurados; data de publicação P1 e modificação E2 confirmadas ao final. Nenhum `citation` adicional foi inserido. |

Os horários acima estão em UTC como armazenados/serializados, correspondentes a 14:19 em São Paulo. Evidências completas, sem credenciais: [evidencias-local.json](./evidencias-local.json). O arquivo contém somente registros fictícios e metadados técnicos locais.

Destino conferido: [Fome emocional ou fome física? Aprenda a identificar a diferença](https://www.nutricaoemovimento.com/pt/artigos/fome-emocional-ou-fome-fisica-aprenda-a-identificar-a-diferenca). Esse GET foi a única verificação pública necessária; nenhuma ação de escrita foi enviada ao site remoto.

## Aplicação e build completo

HTTP 200 confirmado para `/pt`, `/pt/artigos`, artigo fictício, `/administracao`, editor do artigo, `/sitemap.xml` e `/feed.xml`. A rota administrativa real não tem acento: `/administracao`.

**`npm run build` completo passou**, usando o banco local: geração do Prisma Client, compilação, lint, checagem de tipos, coleta de dados, geração de **37/37 páginas**, otimização e traces. Não foi usado modo parcial `compile` nesta validação. Também passaram `tsc --noEmit`, `npm run lint` e os oito testes offline existentes, mantidos sem remoção. Persistem apenas os dois avisos preexistentes de `<img>` na tela de segurança e import não usado em AdminLayout.

Os scripts locais acrescentam validação de integração relevante para publicação original, revisão, contador e datas públicas. Não se adicionou biblioteca, mudou schema adicional, reescreveu conteúdo real nem alterou os fluxos funcionais para acomodar o teste. Os artefatos `.next` deste teste são locais, ignorados pelo Git e não devem ser usados para publicar o site: foram gerados com fixtures/configuração locais.

## Reprodução com o ambiente temporário preservado

As senhas estão somente no `connection.json` privado do diretório temporário. Não imprimir nem copiar esse arquivo para o repositório. Se ele tiver sido removido pela limpeza do Windows, criar outro ambiente descartável a partir da distribuição oficial e gerar novos segredos locais, sem reutilizar `.env` remoto.

Para reiniciar a instância existente, usar `Start-Process -WindowStyle Hidden` no `bin\mariadbd.exe` da pasta portátil, com `--no-defaults`, `--basedir` apontando à pasta extraída, `--datadir` apontando ao `data` temporário, `--port=33317` e `--bind-address=127.0.0.1`. Redirecionar stdout/stderr para arquivos temporários. Não executar `mariadb-install-db` sobre o diretório já inicializado.

Na raiz do projeto, em PowerShell:

```powershell
$localConfig = Join-Path $env:TEMP 'nutricao-editorial-mariadb-11.4.13\connection.json'
node scripts/editorial-local-env.mjs $localConfig --import tsx scripts/check-editorial-local.ts prepare
node scripts/editorial-local-env.mjs $localConfig node_modules/prisma/build/index.js validate
node scripts/editorial-local-env.mjs $localConfig node_modules/prisma/build/index.js generate
node scripts/editorial-local-env.mjs $localConfig node_modules/prisma/build/index.js db push
node scripts/editorial-local-env.mjs $localConfig --import tsx scripts/check-editorial-local.ts seed
node scripts/editorial-local-env.mjs $localConfig node_modules/prisma/build/index.js db push
node scripts/editorial-local-env.mjs $localConfig --import tsx scripts/check-editorial-local.ts verify-push
node scripts/editorial-local-env.mjs $localConfig --import tsx scripts/check-editorial-local.ts run
node --import tsx --test scripts/check-editorial-structure.test.ts
node node_modules/typescript/bin/tsc --noEmit
npm run lint
node scripts/editorial-local-env.mjs $localConfig 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run build
node scripts/editorial-local-env.mjs $localConfig --import tsx scripts/check-editorial-local.ts stop
```

Interromper a sequência se um comando falhar; não trocar para o banco remoto para contornar um erro. O runner inicia/encerra seu próprio `npm run dev` e precisa de permissão para encerrar a própria árvore de processos no Windows. Não reutiliza um servidor desconhecido na porta 33117. O npm-cli indicado corresponde à instalação deste computador. `seed` restaura exclusivamente a fixture principal local; cada execução usa nomes distintos nos novos artigos, sem apagar registros. `stop` encerra somente o MariaDB local validado pelo guard.

## Produção: somente plano, não executado

SQL mínimo equivalente, após backup, conferência do destino e confirmação de que a coluna ainda não existe:

```sql
ALTER TABLE `Post` ADD COLUMN `editorialUpdatedAt` DATETIME(3) NULL;
```

Conferência antes/depois: `SHOW COLUMNS FROM Post LIKE 'editorialUpdatedAt';`. Não repetir o ALTER se a coluna já existir; não substituir por `db push` irrestrito no servidor remoto, pois outros desvios podem existir. Nenhum DROP, RESET, limpeza ou UPDATE de backfill faz parte do plano.

**A alteração isolada é retrocompatível com a versão anterior do código:** somente acrescenta coluna nullable; consultas antigas continuam usando os campos anteriores e inserts que a omitem recebem NULL. Não muda colunas existentes nem exige preenchimento. Isso não dispensa conferir versão, permissões, tamanho da tabela, triggers externos e eventual bloqueio do ALTER no ambiente real, não inspecionado nesta fase. DDL pode fazer commit implícito, não há promessa de rollback transacional.

Ordem segura para uma implantação futura e separadamente autorizada:

1. Fazer backup verificável e identificar explicitamente o banco correto.
2. Conferir a estrutura real, ausência da nova coluna e condições de execução do ALTER.
3. Adicionar somente a coluna nullable; não preencher registros históricos.
4. Confirmar `datetime(3)`, nullable e antigos registros com NULL; manter a versão anterior funcionando.
5. Fazer novo build para o ambiente correto e implantar o código com Prisma Client correspondente. Não promover os artefatos locais desta validação.
6. Fazer smoke test do site e artigo existente: publicação original preservada, schema/autora/canonical corretos e modificação igual à publicação quando não há revisão.
7. Validar admin, salvamento sem alteração e edição editorial controlada.
8. Validar views e JSON-LD: incremento não representa revisão.
9. Conferir cron, sitemap, feed e logs. Se necessário recuar o código, manter a coluna nullable; não apagá-la como parte do rollback.

**Sem backfill automático:** os artigos históricos devem continuar `editorialUpdatedAt=NULL` até uma edição/revisão editorial real. Nunca copiar `updatedAt`, data de views ou uma data recente genérica.

## Arquivos e Git

Nesta conclusão foram adicionados `scripts/editorial-local-env.mjs`, `scripts/check-editorial-local.ts`, este relatório e as evidências; atualizada a documentação inicial para apontar à validação concluída. As alterações da implementação anterior permanecem para revisão. Nenhum arquivo-fonte necessário foi removido. `.next/` continua ignorada e sem arquivos rastreados; scripts de apoio estão em `scripts/`.

Estado esperado antes de commit: 12 arquivos rastreados modificados e 11 arquivos novos não rastreados (23 no total). Nenhum commit, push ou deploy executado. Relação completa:

```text
 M eslint.config.mjs
 M prisma/schema.prisma
 M src/app/administracao/artigos/[id]/editar/EditPostForm.tsx
 M src/app/administracao/artigos/[id]/editar/actions.ts
 M src/app/administracao/artigos/novo/actions.ts
 M src/app/api/cron/publish-scheduled-posts/route.ts
 M src/app/api/posts/[id]/view/route.ts
 M src/app/feed.xml/route.ts
 M src/app/pt/artigos/[slug]/page.tsx
 M src/app/sitemap.ts
 M src/components/editor/BlockEditor.tsx
 M src/lib/editor/render-blocks-to-html.ts
?? docs/editorial/correcoes-estruturais/evidencias-local.json
?? docs/editorial/correcoes-estruturais/relatorio.md
?? docs/editorial/estrutura-editorial/README.md
?? docs/editorial/estrutura-editorial/adicionar-data-editorial.sql
?? scripts/check-editorial-local.ts
?? scripts/check-editorial-structure.test.ts
?? scripts/editorial-local-env.mjs
?? src/components/editor/ReferencesEditor.tsx
?? src/lib/editor/article-body.ts
?? src/lib/editor/references.ts
?? src/lib/editorial-dates.ts
```

## Limites e riscos pendentes

- Nenhum banco de produção foi migrado ou testado com escrita. O código não deve ser implantado antes da coluna; a ordem acima continua obrigatória.
- A versão/schema completos do servidor remoto não foram auditados nesta fase. A validação foi em MariaDB 11.4.13 com fixtures, não uma cópia integral de produção.
- Testados HTML e Server Actions reais via HTTP, sem automação visual do navegador, upload de imagens, entrega de e-mails ou serviços externos.
- O histórico de publicação já perdido antes desta correção não foi reconstruído. A correção preserva os valores atualmente disponíveis.
- Datas editoriais representam salvamento de mudança relevante segundo a política implementada, não certificação independente de revisão científica.
- Normalização de H1 e links legados continua dirigida à apresentação/ao salvamento posterior; o HTML dos artigos reais no banco remoto permanece intocado.
- Os dois avisos de lint preexistentes permanecem. Nenhuma biblioteca foi atualizada nesta conclusão.
