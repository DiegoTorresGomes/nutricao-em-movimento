# Consolidação A → B — implementação local validada, aplicação remota pendente

**Estado em 8 de novembro de 2026: código e aplicação no banco descartável concluídos; consolidação no banco remoto NÃO executada. Nenhum deploy, commit ou push.**

A versão foi aprovada por Weverlyn conforme o novo pedido. O texto-fonte aprovado foi mantido imutável, incluindo o aviso histórico de rascunho fora do corpo. Autorização, hash do pedido, hash do texto e destino configurado estão em [autorizacao-aplicacao.json](autorizacao-aplicacao.json). O hash do texto continua `7b40fe3b3071ed312a761e7f0f3035a542ae99bae5e88514cfa5f1ba5b1e1c77`.

## Por que a etapa remota permanece interrompida

O banco configurado é remoto e corresponde aos dois corpos públicos. A ainda retorna **200, sem Location**. Arquivar A nesse banco antes de ativar o redirect na instância hospedada retiraria seu registro da consulta de publicados, podendo resultar em 404 após renovar o cache. Alterar o middleware local não modifica o servidor hospedado. Isso conflita com executar agora a consolidação remota completa e simultaneamente proibir deploy.

O pedido determina: **“Se surgir qualquer incompatibilidade estrutural inesperada que possa afetar dados, redirect, indexação ou histórico editorial: INTERROMPER. Documentar. Não improvisar.”** Por isso, as escritas remotas ficaram bloqueadas. A nova rodada concluiu a implementação e os testes em ambiente isolado, sem reproduzir esse risco no site. Esta interrupção decorre do pedido, não de requisito de skill ou rejeição de revisão automática.

O aplicador exige 301 público direto para B nas duas variantes de domínio, preservando query, antes de permitir alterações remotas. O bloqueio foi testado contra o estado público real: [guard-remoto.json](guard-remoto.json). Não foi criado cliente de banco por essa sondagem. As consultas de conferência remota foram somente leitura.

## Identidades e estado dos registros

**A — Emagrecimento sustentável: hábitos que importam mais que força de vontade**

- ID: `cmrl2gz5k00009e2rg5qgjl1h`.
- Slug: `emagrecimento-sustentavel-habitos-que-importam-mais-que-forca-de-vontade`.
- URL: https://www.nutricaoemovimento.com/pt/artigos/emagrecimento-sustentavel-habitos-que-importam-mais-que-forca-de-vontade

**B — Emagrecimento sustentável: como cuidar do corpo com equilíbrio, nutrição e movimento**

- ID: `cmqppa7du0000ve2rnn31iyzq`.
- Slug: `emagrecimento-sustentavel-como-cuidar-do-corpo-com-equilibrio-nutricao-e-movimento`.
- URL: https://www.nutricaoemovimento.com/pt/artigos/emagrecimento-sustentavel-como-cuidar-do-corpo-com-equilibrio-nutricao-e-movimento

| Campo | Snapshot remoto inicial | Aplicação na cópia local | Conferência remota final |
| --- | --- | --- | --- |
| A status | PUBLISHED | ARCHIVED | PUBLISHED |
| A editorialUpdatedAt | null | null | null |
| A scheduledAt | 2026-07-29T07:00:00.000Z | mesmo valor | mesmo valor |
| A views | 11 | 11 | 12 observados, sem escrita nossa no contador |
| B status | PUBLISHED | PUBLISHED | PUBLISHED |
| B publishedAt | 2026-06-22T22:17:05.717Z | **mesmo valor exato** | **mesmo valor exato** |
| B editorialUpdatedAt | null | 2026-11-08T13:23:14.436Z | null |
| B views | 388 | 388 | 388 |
| B scheduledAt | null | null | null |

A variação de views de A foi observada entre as capturas remotas; não foi causada por uma escrita ou chamada ao endpoint de views desta tarefa. Não foi revertida para 11. Uma futura aplicação deve preservar o contador corrente, sem somar views a B. `updatedAt` pode mudar tecnicamente; a transação não o usa como revisão editorial.

Snapshots: [antes-aplicacao.json](antes-aplicacao.json) preserva os dois registros remotos, campos editoriais, datas, categoria, metadata, conteúdo e cards; [antes-aplicacao-local.json](antes-aplicacao-local.json) e [depois-aplicacao-local.json](depois-aplicacao-local.json) registram a aplicação descartável. [depois-aplicacao.json](depois-aplicacao.json) é explicitamente a **conferência remota sem aplicação**, não prova de publicação. Estado remoto detalhado: [verificacao-remota-final.json](verificacao-remota-final.json).

## Código e preservação editorial

- Middleware central: A → B com **301**, antes da normalização www; nenhum acesso ao banco no redirect. Destino canônico fixo; query preservada, sem interpretar parâmetro como destino. Não se criou outra camada de redirect.
- B mantém título, slug e canonical com www. A resposta 301 local não renderiza BlogPosting de A. As URLs canônicas exatas foram testadas; não se afirma comportamento especial novo para todas as variantes de barra final do Next.
- `ARCHIVED` é o estado escolhido para A. O enum existente também contém DRAFT, REVIEW, SCHEDULED e PUBLISHED: rascunho/revisão não representam a consolidação concluída; agendamento poderia republicar; exclusão seria destrutiva. Nenhum registro é apagado e o slug de A permanece como origem permanente.
- A aplicação usa uma transação com comparação de estado, proteção contra alterações concorrentes e lista de campos permitidos. Reutiliza a política `hasEditorialChanges` do CMS para atribuir a revisão substancial de B; não copia a data da aplicação local para uma futura aplicação remota. A é apenas arquivado, sem preencher sua revisão ou limpar scheduledAt.
- A comparação fora da dupla foi estrita: **29 registros locais permaneceram iguais**. Na leitura remota final, os mesmos 29 fingerprints permaneceram iguais ao preflight. Não houve escrita remota.
- A conversão offline compara o texto visível com o Markdown aprovado. Não acrescenta seção, conselho, fonte, frase ou CTA. Mantém os dois parágrafos introdutórios; **o primeiro heading é H2**, com um H1 apenas no template. Interpretar “começa em H2” como primeiro heading permite preservar o texto aprovado sem inventar um título de introdução.
- Os parágrafos importados recebem opção explícita de links internos; texto e atributos são escapados, links de host externo/esquema executável não são aceitos por esse recurso. Blocos antigos conservam a renderização anterior. O editor mantém os dados e a prévia foi exercitada pelo salvamento real sem mudança.

## Conteúdo, metadata, referências e links

Conteúdo aprovado convertido em [pacote-aplicacao.json](pacote-aplicacao.json); [previa-aprovada.html](previa-aprovada.html) é somente uma prévia local marcada noindex. O Markdown de origem não foi regenerado ou reescrito. O PDF complementar e a newsletter semanal não foram reincorporados, conforme a versão aprovada.

**Meta description aplicada apenas na cópia local:**

> Entenda o emagrecimento sustentável e como começar com alimentação, movimento, pequenas metas e uma rotina possível, sem promessas de resultado.

**Excerpt aplicado apenas na cópia local:**

> Um guia para organizar alimentação, movimento e rotina, com pequenas metas e espaço para ajustes, sem depender apenas de motivação.

O template usa o seoDescription de B na meta description, Open Graph e Twitter, preservando o excerpt em apresentação/listagens. Esse comportamento é dirigido ao slug de B; não ativa os campos SEO dos demais artigos. A imagem, alt, categoria, título SEO salvo e conta técnica de autoria foram preservados. Autoria pública continua Weverlyn Alves, CRN 24101524; JSON-LD usa Weverlyn da Cruz Alves Torres e seu perfil canônico.

As **sete referências aprovadas** estão estruturadas em contentBlocks, sem novas fontes: Hall/Kahan; NIDDK; Singh et al.; Guia Alimentar; OMS; Tasali et al.; NIMH. Autor/instituição, título, publicação, ano e DOI/URL estão no pacote e correspondem à bibliografia aprovada. Suporte e limites permanecem em [referencias-consolidadas.md](referencias-consolidadas.md); a conferência HTTP dos sete endereços está em [verificacao-proposta.json](verificacao-proposta.json): quatro URLs institucionais 200 e três resoluções DOI 302. A aprovação humana foi informada pelo usuário; não se atribui uma segunda revisão científica independente a estes testes.

São quatro links contextuais (prato, fomes, exercícios e relação com a comida) e um CTA de contato. Nenhum link aponta a A no corpo consolidado. Nova leitura de todos os 31 corpos publicados encontrou **zero links contextuais para A**; portanto nenhum outro artigo precisou de substituição. O aplicador interrompe se descobrir novos links recebidos, para revisão individual, em vez de substituição indiscriminada. Backlinks externos não foram alterados.

Não foi criada curadoria manual de relacionados. A cópia local arquivada deixa de ser elegível às consultas de publicados; os cinco conjuntos antigos de cards foram conferidos por HTTP, sem A e sem auto-link provocado por substituição. O salvamento de B invalida também perfil da autora e páginas publicadas da mesma categoria, além de home, listagem, sitemap, feed e B já cobertos pelo fluxo existente.

## HTTP, schema, coleções e cache

Validação real com MariaDB e Next, primeiro desenvolvimento e depois **next start do build completo**, em loopback. Evidências: [validacao-local.json](validacao-local.json) e [validacao-build-local.json](validacao-build-local.json).

| Verificação | Local validado | Site remoto atual |
| --- | --- | --- |
| A, www e sem www, query de teste | 301 direto a B com www; sem corpo Article; sem loop | A ainda 200; redirect não implantado |
| B | 200, corpo aprovado exato, um H1, autoria, imagem HTTP 200/MIME image, CTA e sete referências | 200, corpo anterior |
| B JSON-LD | datePublished original; dateModified revisão local; headline e mainEntityOfPage de B; author e perfil corretos | Sem nova revisão aplicada |
| Indexabilidade | B sem noindex/bloqueio robots; A redireciona | A ainda existe como conteúdo independente |
| Sitemap | A ausente; B presente; lastmod igual à revisão | A e B ainda presentes |
| Feed | A ausente; B com excerpt aprovado e publicação original | Sem alteração por esta tarefa |
| Home, listagem e filtro, autora | Sem A, coleções respeitam elegibilidade/paginação existentes | Preflight ainda encontrou A em listagem/perfil |
| Cinco conjuntos de cards | Sem A, seleção automática | Nenhuma remoção remota executada |
| Admin e editor de B | 200 autenticados somente na instância descartável; POST real sem mudança 303, sem nova data editorial | Escrita/autenticação administrativa não executada |

O teste aqueceu listagem, sitemap, feed e perfil antes da alteração local e conferiu a invalidação após o salvamento. Uma segunda aplicação local reconheceu o estado concluído e executou **zero escritas**. A verificação do build confirmou as mesmas saídas.

**A diferença pública não é descrita como “apenas cache”: a consolidação remota não foi aplicada nem o código implantado.** Caches hospedados precisarão de verificação/invalidação autenticada quando houver uma fase autorizada de ativação. Um processo local não purga o cache da instância hospedada.

## Reauditoria

**B consolidado na aplicação local: 83/100**, sem aumento em relação à proposta. Critérios/pesos: utilidade 23/25; profundidade/clareza 17/20; originalidade 10/15; E-E-A-T 12/15; referências 8/10; leitura/estrutura 5/5; links 4/5; SEO 4/5.

O ganho sobre B antigo (73) permanece nas fontes, estrutura, decisão prática e integração do conteúdo de A. Limites: orientações gerais, ausência de pesquisa própria, alguns destinos antigos ainda pedem revisão e nenhuma medição de desempenho orgânico. Aprovação humana e renderização correta não tornam a peça automaticamente A nem justificam somar pontos. **B remoto continua sem a aplicação desta versão; não é atribuído 83 ao seu conteúdo antigo.**

A sobreposição editorial A/B fica resolvida **no estado local validado**, com uma URL de conteúdo e origem permanente redirecionada. No site público isso ainda não foi concluído. Sem dados de queries/impressões/cliques, competição orgânica permanece hipótese; não se promete resultado de ranking.

## Testes técnicos e ambiente

- `prisma validate`: passou.
- `prisma generate`: passou, 7.10.1. Nenhuma migração ou db push remoto.
- `npm run lint`: passou, zero erros e dois avisos preexistentes (img de segurança e destroySession não usado).
- `tsc --noEmit`: passou.
- Oito testes editoriais existentes e três novos: **11/11 passaram**.
- `npm run build` **completo passou: 37/37 páginas**, compilação, lint, tipos, dados, otimização e traces. Configuração de banco e segredos do processo eram exclusivamente locais.
- Integração de desenvolvimento e produção local: passou, incluindo transação, arquivo histórico, CMS real, cache e idempotência.

Usado MariaDB portátil 11.4.13 em 127.0.0.1:33317, banco separado `nutricao_consolidacao_disposable`. O wrapper valida a configuração local anterior antes de trocar apenas o banco para o descartável novo, sem editar .env. Foram copiadas 31 peças públicas para testar consultas e cards; a conta de teste é sintética. Fixtures antigas de `nutricao_editorial_disposable` não foram reescritas. Tokens de teste só foram enviados ao loopback.

Os processos HTTP locais e o MariaDB portátil foram encerrados ao final. O resumo das checagens está em [testes-tecnicos.json](testes-tecnicos.json). Arquivos do banco descartável e artefatos temporários foram preservados, sem apagamento de fontes.

O primeiro encerramento via taskkill foi recusado pelo Windows; o processo próprio foi identificado e encerrado com a permissão do ambiente, e a verificação foi repetida com saída 0. O runner agora encerra seu próprio processo por sinal. Não houve rejeição automática impedindo trabalho autorizado.

O OneDrive marcou artefatos gerados como reparse points, causando EINVAL/readlink ao limpar a saída anterior. Duas pastas `.next` foram preservadas em diretórios temporários, com origem/destino verificados; nenhuma exclusão recursiva, arquivo-fonte ou script foi removido. O build completo em saída limpa passou. `.next/` continua ignorada e sem arquivos rastreados. Esses artefatos de testes locais **não devem ser implantados**, pois usam a base descartável.

A instalação não contém `node_modules/next/dist/docs`; antes das alterações foram consultadas as páginas oficiais do [NextResponse para Next 15](https://nextjs.org/docs/15/app/api-reference/functions/next-response) e [middleware para Next 15](https://nextjs.org/docs/15/app/api-reference/file-conventions/middleware). A implementação usa o status explícito 301, sem depender do padrão permanente 308 de outras APIs.

## Arquivos desta implementação

Modificados: `src/middleware.ts`; `src/app/pt/artigos/[slug]/page.tsx`; `src/app/administracao/artigos/[id]/editar/actions.ts`; `src/lib/editor/render-blocks-to-html.ts`; `src/lib/editor/references.ts`; `analise.md`; `plano-consolidacao.md`; `depois-aplicacao.json` (estado remoto explicitamente não aplicado).

Criados: `src/lib/editorial-consolidation.ts`; `scripts/build-consolidacao-emagrecimento.ts`; `scripts/apply-consolidacao-emagrecimento.ts`; `scripts/check-consolidacao-local.ts`; `scripts/consolidacao-emagrecimento.test.ts`; `scripts/consolidacao-local-env.mjs`. Neste diretório: pacote/preview, snapshots locais, validações local/build, autorização, verificação remota, guard remoto e este relatório. Os arquivos analíticos e os dois scripts de análise anteriores também aparecem como não rastreados no Git; não foram recriados como se fossem parte do código novo. Nenhuma dependência/schema/configuração de conexão foi alterada.

## Continuidade necessária, sem autorização de deploy nesta entrega

1. Revisar este conjunto de código e testes. O texto aprovado não precisa ser reescrito.
2. Em fase com ativação explicitamente autorizada, disponibilizar o código na instância hospedada e confirmar 301 A → B. Nesta entrega isso **não foi feito nem está autorizado**.
3. Fazer snapshot remoto fresco e executar a aplicação transacional com o fingerprint de destino registrado. O CLI exige `--apply-remote --expected-target HASH` e recusa o estado público atual. A data editorial será a da aplicação real, nunca a do teste local.
4. Salvar B sem mudanças pelo CMS hospedado com esta versão do código para invalidar as saídas afetadas; a checagem local comprova que isso preserva a revisão já registrada. Conferir todas as URLs/schema/caches novamente.

Não usar o snapshot de views antigo para sobrescrever contadores correntes, não copiar o banco descartável para produção e não executar o aplicador com configuração de destino não verificada. Se o estado editorial mudar desde a aprovação, o aplicador para antes de escrever.

**Nenhum artigo remoto, contador, data ou status foi alterado por esta tarefa. Nenhum redirect público foi ativado. Nenhum commit, push ou deploy foi executado.**
