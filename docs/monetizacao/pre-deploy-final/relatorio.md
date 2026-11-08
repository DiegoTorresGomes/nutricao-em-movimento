# Limpeza técnica final antes do deploy do Lote 2

08/11/2026. **Correções locais concluídas e validadas no build de produção. Nenhum artigo ou registro do banco foi alterado. Sem commit, push ou deploy.** A produção ainda executa o código anterior; não confundir os resultados locais abaixo com uma implantação já realizada.

## Feed: causa, correção e escaping

A implementação real está em `src/app/feed.xml/route.ts`. O título fixo do canal continha `Nutrição & Movimento` diretamente no XML. O ampersand sem escape tornava o documento inválido, mesmo com HTTP 200 e itens extraíveis por regex.

O serializador foi isolado em `src/lib/rss.ts`, mantendo o formato RSS e os mesmos campos, sem nova arquitetura de conteúdo. A rota continua lendo somente os artigos publicados em português por `getPublishedPosts()` e retornando `application/rss+xml; charset=utf-8`.

O nome bruto vem de `siteConfig.name`, que **continua `Nutrição & Movimento`**. Somente sua serialização XML produz `Nutrição &amp; Movimento`. O parser recupera o mesmo nome visual. Não foi mudada a marca, o conteúdo dos artigos ou sua metadata.

| Campo | Tratamento auditado |
| --- | --- |
| Título e descrição do canal | Texto bruto escapado uma vez no serializador |
| Link do canal e atributo `atom:link href` | URL completa construída antes do escape, com escape XML único |
| Título e descrição dos itens | Escape único de `&`, `<`, `>`, aspas e apóstrofos; acentos preservados em UTF-8 |
| Categoria | Mesmo escape de texto bruto |
| Link e GUID dos itens | URL canônica completa escapada uma única vez; mesmo valor em ambos |
| Datas | UTC gerado a partir de `publishedAt`; `lastBuildDate` usa a maior data editorial ou publicação |
| Autor | O feed existente não serializa `<author>`; não foi criado campo de autor ou e-mail nem exposta a relação User carregada pela consulta |
| Corpo HTML do artigo | Não é serializado neste RSS; description é o resumo, não conteúdo HTML incorporado |

Não há concatenação de uma URL já escapada com novo escape, nem aplicação repetida do helper ao mesmo valor. O contrato é receber texto bruto. Não se faz decodificação indiscriminada de entidades do conteúdo armazenado. Os testes verificam ausência de `&amp;amp;`, `&amp;lt;` e `&amp;quot;` nos casos brutos, com round-trip exato no parser, inclusive URLs com `&` e texto com todos os caracteres solicitados.

## Parser XML real e execução local

Foi executado `npm run build` e iniciado temporariamente `next start` em `127.0.0.1:4183`. O verificador fez apenas GET das cinco rotas solicitadas, sem navegador/JavaScript, contador de views, formulários ou actions de escrita. O servidor de teste foi encerrado ao terminar.

`System.Xml.XmlDocument`, através de PowerShell, analisou as respostas reais `/feed.xml` e `/sitemap.xml`, não apenas strings simuladas. Os testes de caracteres especiais também usam esse parser real, com entrada e saída UTF-8.

| Verificação | Resultado |
| --- | --- |
| Feed local | XML válido, 30 itens |
| Identidades RSS | 30 GUIDs únicos, links/GUIDs canônicos iguais aos 30 registros publicados |
| Datas de publicação | Valores RSS iguais à publicação original, na precisão normal de segundos de RFC 822; `publishedAt` integral no banco permaneceu intacto |
| Título/descrição de cada item | Após parse, iguais ao título e resumo armazenados |
| Arquivado | Ausente do feed e sitemap |
| Sitemap local | XML válido, 40 URLs, sem duplicação dos artigos |
| Datas dos 30 artigos no sitemap | Todas iguais a `editorialUpdatedAt ?? publishedAt` |
| Lote 2 | Seis URLs presentes e seis `lastmod` editoriais corretos |
| `/pt`, `/pt/artigos`, perfil da autora | HTTP 200 no build local |

Evidências: [validacao-xml.json](validacao-xml.json), [feed-local.xml](feed-local.xml), [sitemap-local.xml](sitemap-local.xml), [xml-esperado.json](xml-esperado.json) e [verificacao-local.json](verificacao-local.json).

## Sitemap e significado de lastmod

A função `articleModifiedAt`, em `src/lib/editorial-dates.ts`, **já estava correta e não foi alterada**: usa `editorialUpdatedAt`, ou `publishedAt` quando não existe revisão editorial. Sem ambas, omite lastmod. `updatedAt` técnico não participa. Nenhuma data foi escrita ou recalculada no banco.

`src/app/sitemap.ts` continua selecionando apenas slug e as duas datas editoriais. Acrescentou-se `export const revalidate = 3600`, para que importações externas ao CMS não deixem a versão do sitemap sem limite temporal de regeneração dentro do Next. O build confirmou geração estática/ISR de uma hora. A expiração é atendida sob demanda e pode servir a versão anterior durante a regeneração; não é promessa de atualização pontual exata a cada hora nem de purge de CDN.

As datas `new Date()` das páginas institucionais já existiam e não foram alteradas. Elas não são usadas como lastmod dos artigos.

## Cache e invalidação

| Saída | Consulta/campo | Cache local e invalidação |
| --- | --- | --- |
| Sitemap | Prisma direto, datas editoriais | Agora ISR de 3600 s; `revalidatePath('/sitemap.xml')` nas mutações normais |
| Listagem | `getArticlesForListing`, seleciona `description` | ISR de 3600 s já existente; revalidatePath nas mutações de artigos |
| Perfil da autora | `getPublishedAuthorPosts`, seleciona `description` e limita a 12 recentes | ISR de 3600 s já existente; invalidação agora cobre criar, editar, excluir, cron de publicação e reagendamento |
| Feed | `getPublishedPosts`, title/description/category/publicação | GET Route Handler dinâmico no Next 15; não opta por cache estático ou fetch cache. Não possui revalidate temporal nem header de cache explícito no handler |
| `/pt` | Consultas atuais de destaques/recentes/mais lidos/configurações | Dinâmica no build, com invalidação de rota nas mutações existentes |

Não há fetch cache explícito, `unstable_cache`, tags ou `revalidateTag` nessas consultas Prisma. O cache observado da listagem/perfil é da saída da rota, não uma consulta escolhendo um campo antigo.

Há também uma camada HTTP já existente em `src/middleware.ts`: `/pt*` e `/sitemap.xml` recebem **`public, s-maxage=300, stale-while-revalidate=86400`**. Ela não cobre `/feed.xml`. Esse middleware não foi alterado. Um proxy/CDN que respeite esse header pode conservar respostas além da regeneração interna; `revalidatePath` não é evidência de purge de um cache externo.

As chamadas que faltavam foram acrescentadas, sem alterar a persistência ou executar as actions:

- Perfil da autora invalidado em criação, edição normal, exclusão, cron de publicação e reagendamento. Antes, a edição só invalidava o perfil no caso especial da consolidação.
- Reagendamento também invalida sitemap e feed, pois pode remover um artigo das saídas públicas.
- A invalidação já existente de home/listagem/artigo/sitemap/feed foi preservada; o caso especial da consolidação mantém suas demais invalidações.

Essas chamadas foram auditadas em código e compiladas; não foram exercitadas com mutações reais, pois esta etapa proíbe escrever no banco.

Referências da versão instalada: [sitemap é metadata cacheada por padrão](https://nextjs.org/docs/15/app/api-reference/file-conventions/metadata/sitemap), [revalidate e regeneração de segmentos](https://nextjs.org/docs/15/app/api-reference/file-conventions/route-segment-config) e [alcance de revalidatePath](https://nextjs.org/docs/15/app/api-reference/functions/revalidatePath). O diretório `node_modules/next/dist/docs/` solicitado pelo AGENTS.md não existe nesta instalação; por isso foram consultadas as páginas oficiais do Next 15.5.29 antes das alterações.

## Listagem, perfil e futuro deploy

O build atual reconstruiu os artefatos com o banco já contendo o Lote 2. Em `/pt/artigos`, os seis slugs e os seis resumos novos aparecem. No perfil, #30 e #22 aparecem com resumos novos; os outros quatro não integram os 12 mais recentes, conforme a consulta existente. Essa ausência não é exclusão nem erro de campo. Não foi alterado esse limite.

Um deploy normal **com este novo build** deve disponibilizar o RSS corrigido e os artefatos reconstruídos. O build local prova que a aplicação gera os valores corretos. É necessário conferir as respostas reais depois da implantação, inclusive eventual cache do hosting/proxy, sem presumir que o build local invalida a instância hospedada. Não foi criado endpoint de purge, bypass por query, chamada administrativa ou hack de cache.

A consulta pública nesta etapa confirmou que a produção ainda apresenta o ampersand sem escape no feed e `x-nextjs-cache: HIT` no sitemap/listagem/perfil: [producao-sem-deploy.json](producao-sem-deploy.json). Isso é esperado **antes de implantar o código**, não falha do teste local. Não houve deploy nesta tarefa.

## Campos SEO: situação exata

| Nome no pacote editorial | Campo real persistido | Consumo público atual |
| --- | --- | --- |
| metaTitle | `Post.seoTitle` | Salvo pelo CMS; não usado pelo generateMetadata dos artigos |
| metaDescription | `Post.seoDescription` | Salvo pelo CMS; usado somente na exceção já implementada para o artigo consolidado #4 |
| excerpt | `Post.description` | Usado por cards, listagem, perfil, RSS e resumo da página; também é a descrição de metadata dos artigos comuns, incluindo os seis do Lote 2 |

O título público/OG/Twitter continua vindo de `article.title`; a descrição usa `consolidationDescription(article)`, que só dá preferência a seoDescription no alvo da consolidação e usa description nos demais.

**Não existe implementação local geral pronta para passar a consumir seoTitle/seoDescription apenas com deploy.** A frase anterior “depende de implantação futura” precisava dessa precisão: há uma funcionalidade geral ainda não implementada, além da exceção da consolidação. Publicar este código não a acrescenta. Por escopo, não foi alterado o template nem introduzida uma nova regra global de metadata sobre os 30 artigos.

## Testes e integridade

| Comando/verificação | Resultado |
| --- | --- |
| `npx --no-install prisma validate` | Aprovado |
| `npx --no-install prisma generate` | Aprovado, client 7.10.1; sem migração/db push |
| `npm run lint` | Sem erros, dois avisos preexistentes |
| `npx --no-install tsc --noEmit` | Aprovado |
| `npm run build` | Aprovado; Next 15.5.29, 37/37 páginas, otimização e traces completos |
| Testes RSS + validador/pacote/guards/preview | 19/19 aprovados |
| Cinco GETs do servidor de produção local | Todos HTTP 200 |
| Parser real de feed e sitemap | Ambos aprovados |
| `git diff --check` | Conferido na finalização |

Os dois avisos anteriores de lint são img em `src/app/administracao/seguranca/page.tsx:100` e `destroySession` não utilizado em `src/components/admin/AdminLayout.tsx:3`. Uma falha inicial do teste sintético foi de codificação do stdin do PowerShell; foi corrigida definindo UTF-8 na entrada e saída, e ambos os testes passaram. Não se confundiu esse problema do harness com corrupção do RSS.

Foram capturados os 31 registros Post por SELECT antes e depois. O baseline inicial também foi comparado ao resultado aplicado do Lote 2. **Não houve diferença em nenhum campo de nenhum registro, inclusive views.** Os seis do lote e os 25 restantes permanecem iguais; publishedAt, scheduledAt, status, slug, IDs, metadata e conteúdo foram preservados. Views do artigo #18 continua 23. Nenhum script de aplicação, action de mutação ou contador foi executado. Evidências: [antes-banco.json](antes-banco.json) e [integridade-final.json](integridade-final.json).

## Arquivos desta etapa

Alterados:

- `src/app/feed.xml/route.ts` — usa o serializador com escaping de canal/itens/URLs.
- `src/app/sitemap.ts` — ISR de uma hora, mantendo o cálculo editorial.
- `src/app/administracao/artigos/novo/actions.ts`.
- `src/app/administracao/artigos/[id]/editar/actions.ts`.
- `src/app/administracao/calendario/actions.ts`.
- `src/app/api/admin/posts/[id]/delete/route.ts`.
- `src/app/api/cron/publish-scheduled-posts/route.ts` — as cinco alterações acima são somente chamadas de invalidação.

Criados:

- `src/lib/rss.ts` — serializador puro, sem acesso ao banco.
- `scripts/predeploy-feed.test.ts` — round-trip XML real e semântica das datas.
- `scripts/predeploy-integrity.ts` — SELECT e comparação de todos os campos.
- `scripts/verify-predeploy-final.mjs` — GET das cinco saídas locais e evidências.
- `scripts/validate-predeploy-xml.ps1` — parser real e conferências de identidades/datas.
- Este relatório e os JSON/XML de evidência nesta pasta.

As mudanças já existentes do checklist editorial e os pacotes anteriores foram preservados. Nenhum artigo C foi corrigido; não se abriu lote, alterou AdSense, Search Console ou CMP. Nenhuma dependência foi instalada. `.next/` continua ignorado; não foi incluído arquivo-fonte necessário dentro dele.

**Sem alteração de artigos/banco, sem commit, sem push e sem deploy.** A confirmação pública da correção do feed e da atualização dos caches fica para a implantação futura autorizada.
