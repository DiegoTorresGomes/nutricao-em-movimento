# Correções estruturais editoriais

**Validação local posterior concluída:** MariaDB descartável, db push, fluxos HTTP e build completo passaram. Consulte o [relatório de conclusão](../correcoes-estruturais/relatorio.md) e suas evidências. O texto abaixo registra a preparação inicial; as pendências de testes locais nele mencionadas foram resolvidas na etapa posterior. O banco remoto continua intocado e a aplicação da coluna nele permanece apenas planejada.

Data: 7 de novembro de 2026. Preparação local, sem publicação, commit ou alteração do banco. A pedido do usuário, não foi usado o banco remoto nem aplicado DDL ou patch de artigos. Os relatórios da auditoria anterior continuam sendo um retrato histórico, sem regeneração nesta etapa.

**Pré-requisito de execução: a coluna `Post.editorialUpdatedAt` precisa existir no banco escolhido antes de executar esta versão da aplicação.** O Prisma Client gerado passa a selecionar essa coluna em consultas sem `select`. Não publicar este código nem iniciar testes de navegação contra a base remota antes de uma etapa de implantação de banco separada e autorizada. Nesta fase só foi compilado em modo `compile`, com variáveis de conexão substituídas por um endereço local sem banco.

## Diagnóstico e decisões

Foram conferidos o modelo Post, os caminhos de criação/edição/publicação agendada, views, template/metadata/BlogPosting, sitemap, feed, editor de blocos e os scripts/relatórios da auditoria dos 31 artigos. O contador usava `updateMany`, com `updatedAt @updatedAt`; a documentação do Prisma confirma a atualização automática desse atributo nas operações do ORM. Não houve reprodução com escrita no banco remoto.

Também foi encontrado `publishedAt: status === "PUBLISHED" ? new Date() : null` na edição: salvar novamente trocava a publicação original e despublicar a apagava. O cron também sobrescrevia a data ao republicar por agendamento. Ambos os caminhos foram corrigidos.

| Campo | Significado e comportamento |
| --- | --- |
| `publishedAt` | Primeira publicação. Preservada nas edições, arquivamento e republicação. Se ainda nula, preenchida na primeira publicação manual ou pelo cron. Não se reconstrói uma data histórica perdida. |
| `editorialUpdatedAt` | Último salvamento com mudança editorial nos campos abaixo. Nullable, sem default, sem backfill. Não representa certificação de revisão científica individual. |
| `updatedAt` | Controle técnico do registro pelo Prisma. Não usado como prova de revisão ou como data de modificação pública do artigo. |
| `views` | Contador atômico independente. A rota usa SQL parametrizado que altera apenas `views`, filtrando artigos publicados. |

Adotada a opção A do pedido: comparação automática antes de salvar. Campos considerados: título, descrição, conteúdo renderizado (incluindo referências), título/descrição SEO, categoria, capa e texto alternativo da capa. Abertura do editor não grava. Salvar sem mudanças não altera a data editorial. Status, agendamento, destaque da semana, tempo de leitura, palavra-chave administrativa e controles de conferência de telas não a alteram sozinhos. Criação inicial não preenche revisão; alterações posteriores em rascunhos também são mudanças editoriais. Jobs e contador não preenchem o novo campo.

Comparações normalizam H1 legado, os ajustes dirigidos do artigo #3, URLs internas e espaços nas extremidades do HTML. Assim a manutenção estrutural isolada não fabrica revisão dos 31 artigos. O `updatedAt` técnico ainda pode mudar num salvamento sem mudança editorial.

BlogPosting `datePublished` e Open Graph `publishedTime` usam apenas `publishedAt`. BlogPosting `dateModified`, Open Graph `modifiedTime` e sitemap `lastModified` usam `editorialUpdatedAt ?? publishedAt`; se ambas faltarem, omitem a data. Feed mantém publicação original e calcula sua atualização com as mesmas datas editoriais, sem fallback técnico. O `updatedAt` restante em `getArticleOfWeek` é critério técnico de desempate de destaque, não data pública; os usos de consentimento de cookies são de outro domínio.

## Artigo #3: correção dirigida sem reescrita

- Título: Relação Saudável com a Comida: O Que É e Como Construí-la no Dia a Dia.
- ID: `cmqlko9pe0000992rtm9c5ane`.
- Slug: `relacao-saudavel-com-a-comida-o-que-e-e-como-construi-la-no-dia-a-dia`.
- O template já fornece o H1 principal. O H1 interno do HTML legado vira H2, preservando atributos e texto, somente na apresentação desse slug.
- As duas âncoras que prometiam um guia de escala passam a descrever fome emocional/física, mantendo o destino existente. Uma frase imediatamente anterior deixa de prometer conteúdo completo sobre escala. Não há novo artigo nem redirecionamento.

As correções são idempotentes em `src/lib/editor/article-body.ts`. São aplicadas na renderização e persistidas se esse artigo for salvo futuramente no CMS; **o HTML armazenado no banco remoto não foi modificado**. Nos demais artigos, o corpo só recebe normalização dos hrefs oficiais para caminhos relativos. Outros hosts, imagens, PDFs, parâmetros, fragmentos e textos são preservados. Não se mudaram slugs, canonicals ou algoritmo de relacionados.

O CMS ativo é `BlockEditor`, não Tiptap: há dependências Tiptap instaladas, mas nenhum import/uso em `src`. Seus headings já são H2/H3. Mantidos os demais níveis do HTML legado; novos salvamentos de HTML manual convertem tags H1 em H2 na fronteira do servidor para impedir recorrência. Isso é uma normalização de headings, não um sanitizador geral de HTML.

## Referências: reutilização do bloco existente

Já existia o tipo de bloco `references`, com lista de strings e saída HTML simples, mas sem botão/interface próprios. Foi ampliado e disponibilizado no editor, sem biblioteca ou coluna adicional. Nenhum dos 31 artigos da captura possui esse bloco; suas bibliografias em HTML continuam como estavam.

Cada novo item aceita `author`, `title`, `publication`, `year`, `doi`, `url` e `sourceType`. `publication` pode incluir volume, número e páginas quando pertinentes. Não se exige DOI de um guideline/documento institucional que não o tenha. Os campos são preenchidos após conferência da fonte; nenhum exemplo fictício foi inserido como bibliografia. Itens legados em string continuam legíveis e editáveis, sem inferência de autoria/ano.

O renderizador compartilhado `src/lib/editor/references.ts` gera seção com H2 e lista numerada, quebra URLs longas e escapa os textos. No público, a saída faz parte do HTML servido pelo Server Component do artigo; não há JavaScript de referências enviado para esse fim. A prévia do editor reutiliza o mesmo renderizador. DOI válido tem precedência; alternativamente aceita URL absoluta HTTP/HTTPS sem credenciais. URLs inválidas/perigosas não geram hyperlinks. Links usam `target="_blank" rel="noopener noreferrer"`, sem `nofollow` automático. Não se acrescentou `citation` ao JSON-LD.

## Banco e aplicação posterior em desenvolvimento

O repositório possui `prisma/schema.prisma`, mas não possui diretório/histórico versionado `prisma/migrations`; `prisma.config.ts` apenas aponta para esse caminho. Mantido o histórico informado de `db push`, sem inaugurar migrations parciais que presumam uma baseline inexistente.

1. Preparar uma cópia local/de desenvolvimento com backup e conferir a identidade do servidor e banco. Configurar **tanto `DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME` quanto `DATABASE_URL`** para a mesma cópia: o runtime usa os primeiros, e a CLI usa o segundo. Não copiar comandos de alteração para a configuração remota atual.
2. Conferir estrutura real e `SHOW COLUMNS FROM Post LIKE 'editorialUpdatedAt'`. O arquivo `adicionar-data-editorial.sql` contém somente o DDL aditivo esperado; aplicá-lo apenas se a coluna não existir. Não executado nesta fase. Não usar `reset`, `--accept-data-loss` ou `db push` indiscriminado: outros desvios de schema podem existir.
3. Executar `npx prisma generate` e `npx prisma validate`. A coluna nova deve ser nullable e os registros antigos devem continuar nulos; não rodar UPDATE de backfill nem copiar `updatedAt`.
4. Na cópia, executar `npm run build` completo e validar navegação, metadata/JSON-LD, sitemap, feed e CMS. Conferir os 31 artigos, autoria e CRN. Fazer uma visualização e verificar que só `views` aumenta; salvar sem alteração e verificar publicação/data editorial preservadas; alterar conteúdo e verificar nova data editorial; testar primeira publicação e republicação agendada. Usar somente a cópia para essas escritas.
5. Planejar separadamente eventual implantação em produção, com backup, conferência de drift e criação da coluna antes de ativar o código. Isso não está autorizado/executado nesta entrega.

O DDL pode fazer commit implícito em MySQL/MariaDB; não prometer rollback de transação. Para recuar o código, manter a coluna nullable costuma preservar compatibilidade com a versão anterior. Não remover coluna nem apagar dados nesta fase.

## Verificação desta entrega

- `prisma generate` e `prisma validate`: concluídos sem conexão de dados.
- TypeScript (`tsc --noEmit`): sem erros.
- ESLint: sem erros; dois avisos preexistentes em segurança/AdminLayout. A configuração passou a ignorar artefatos `.next`, saídas de build e `next-env.d.ts`, evitando analisar arquivos gerados como fonte.
- Build Next 15.5.29 em modo `compile`: compilação concluída com destino de banco local inacessível, sem prerenderização que consulte o banco. **Não equivale a build completo nem validação de integração com MariaDB.**
- `node --import tsx --test scripts/check-editorial-structure.test.ts`: oito testes offline sobre os 31 corpos, normalização idempotente, duas âncoras, H1, publicação/revisão, salvamento sem mudanças, referências escapadas/links e rota de views com cliente mockado. Também executam a função real da página e `generateMetadata` para os 31 registros mockados: conferem BlogPosting, datas, canonical e autora, inclusive ignorando um `updatedAt` técnico artificialmente futuro e respeitando uma revisão editorial explícita. Conferem também sitemap/feed e omissão de datas desconhecidas. Nenhum teste abre conexão ou grava dados; não são testes de um banco MariaDB real.
- Autoria confirmada contra a captura: 31 IDs vinculados à conta técnica autorizada para Weverlyn; nome completo, perfil e CRN preservados. JSON-LD mantém sua estrutura e usa as novas datas. Não foi feita nova validação pública de uma versão implantada, pois não houve implantação.
- `.next/` continua no `.gitignore`, sem arquivos rastreados; nenhum script de apoio foi criado dentro dela. Scripts ficam em `scripts/`, documentação em `docs/editorial/`.

O anexo recebido termina literalmente em “19. POLÍTICA EDITORIAL / Não re”. A política existente foi preservada; não se presumiu uma continuação do texto truncado.

Fontes técnicas consultadas: [Prisma 7 — schema e @updatedAt](https://www.prisma.io/docs/orm/v7/reference/prisma-schema-reference), [Next 15 — generateMetadata](https://nextjs.org/docs/15/app/api-reference/functions/generate-metadata). O diretório solicitado por AGENTS, `node_modules/next/dist/docs/`, não existe nesta instalação; usada a documentação oficial correspondente à versão instalada como alternativa.
