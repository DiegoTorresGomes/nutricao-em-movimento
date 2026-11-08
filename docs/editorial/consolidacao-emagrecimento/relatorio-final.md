# Consolidação editorial aplicada no banco remoto

**Aplicação remota concluída em 8 de novembro de 2026. A arquivado sem exclusão, B consolidado e redirect 301 confirmado. Cache estático permanece como pendência explicitamente aceita pelo usuário. Nenhum commit, push ou novo deploy nesta etapa.**

A aprovação integral de Weverlyn Alves e a autorização para concluir no banco configurado foram fornecidas no pedido atual. Não houve nova redação nem inclusão de fontes. A evidência da autorização e dos hashes está em [autorizacao-remota.json](autorizacao-remota.json).

## Identidades e snapshots

**A — Emagrecimento sustentável: hábitos que importam mais que força de vontade**

- ID: `cmrl2gz5k00009e2rg5qgjl1h`.
- Slug: `emagrecimento-sustentavel-habitos-que-importam-mais-que-forca-de-vontade`.
- URL: https://www.nutricaoemovimento.com/pt/artigos/emagrecimento-sustentavel-habitos-que-importam-mais-que-forca-de-vontade

**B — Emagrecimento sustentável: como cuidar do corpo com equilíbrio, nutrição e movimento**

- ID: `cmqppa7du0000ve2rnn31iyzq`.
- Slug: `emagrecimento-sustentavel-como-cuidar-do-corpo-com-equilibrio-nutricao-e-movimento`.
- URL: https://www.nutricaoemovimento.com/pt/artigos/emagrecimento-sustentavel-como-cuidar-do-corpo-com-equilibrio-nutricao-e-movimento

Snapshot fresco antes de qualquer escrita: [antes-aplicacao-remota.json](antes-aplicacao-remota.json). Estado após a transação e conferência: [depois-aplicacao-remota.json](depois-aplicacao-remota.json). Incluem campos dos posts, conteúdo integral, datas, views, scheduledAt, metadata, categoria e relação administrativa de autoria, sem credenciais. Referências legadas estão preservadas no HTML original; a ausência de um bloco estruturado no snapshot anterior não significa ausência da bibliografia no texto.

| Campo | Antes remoto | Depois remoto |
| --- | --- | --- |
| A status | PUBLISHED | **ARCHIVED** |
| A publishedAt | 2026-07-29T07:00:03.607Z | **mesmo valor** |
| A editorialUpdatedAt | null | **null** |
| A views | **12** | **12** |
| A scheduledAt | 2026-07-29T07:00:00.000Z | **mesmo valor** |
| B status | PUBLISHED | PUBLISHED |
| B publishedAt | **2026-06-22T22:17:05.717Z** | **mesmo valor exato** |
| B editorialUpdatedAt | null | **2026-11-08T13:45:29.480Z** |
| B views | **388** | **388** |
| B scheduledAt | null | **null** |

A revisão corresponde a 08/11/2026, 10:45:29 em São Paulo. Não se copiou a data de publicação de A nem a revisão gerada no teste local. `updatedAt` mudou tecnicamente nos dois registros. IDs, slugs, títulos, categoria, authorId, imagens, alt, demais campos de histórico e revisão de dispositivos foram preservados. Não se somaram ou zeraram contadores.

Os 11 views de A em uma captura anterior eram históricos: o snapshot remoto fresco já registrava 12. Foram preservados os **12 atuais**, sem restaurar um contador antigo.

## Guard e aplicação controlada

Antes da escrita, o aplicador confirmou A → **301 direto para B**, com e sem www e com query; B retornou **200**, com canonical autorreferente correto. Evidência: [guard-antes-aplicacao-remota.json](guard-antes-aplicacao-remota.json).

Foi usado o aplicador transacional já validado, com fingerprint explícito do destino, hash do texto aprovado, verificação do estado editorial anterior e comparação de campos permitidos. Resultado: **APPLIED_REMOTE, duas linhas alteradas**. B recebeu somente conteúdo, contentBlocks, excerpt, seoDescription e revisão editorial; A recebeu somente status ARCHIVED, além de timestamps técnicos gerenciados pelo Prisma. A política de mudança editorial é a mesma usada pelo CMS. Nenhuma estrutura de banco foi alterada.

A decisão ARCHIVED usa o enum existente e preserva o registro, seu texto, histórico e slug. Não se usou DRAFT/REVIEW para um trabalho já aprovado, SCHEDULED que poderia republicar A, nem exclusão física. O redirect já implantado independe do status do registro. **Não foi alterado o middleware ou o redirect nesta etapa.**

A comparação dos fingerprints dos **outros 29 registros** confirmou ausência de alterações. Os snapshots antigos e locais continuam disponíveis como histórico, mas os arquivos com sufixo `-remota` são a referência desta execução real.

## Conteúdo, referências, links e CTA

O HTML público de B contém exatamente o conteúdo gerado do Markdown aprovado, sem alteração de prosa. O hash do arquivo aprovado permanece `7b40fe3b3071ed312a761e7f0f3035a542ae99bae5e88514cfa5f1ba5b1e1c77`. Pacote aplicado: [pacote-aplicacao.json](pacote-aplicacao.json).

Foram aplicadas as **sete referências aprovadas**, estruturadas em contentBlocks e renderizadas no HTML: Hall/Kahan; NIDDK; Singh et al.; Guia Alimentar; OMS; Tasali et al.; NIMH. Autor/instituição, título, ano, publicação e DOI/URL foram comparados com o pacote. Nenhuma fonte foi adicionada. Os três DOIs resolveram com 302 e os quatro endereços institucionais retornaram 200; uma indisponibilidade transitória inicial da OMS foi resolvida na repetição. Evidência: [referencias-remotas-verificadas.json](referencias-remotas-verificadas.json). Suporte e limitações das afirmações seguem em [referencias-consolidadas.md](referencias-consolidadas.md).

Quatro links contextuais e um CTA de contato foram mantidos conforme a aprovação. Prato equilibrado, fomes, exercícios, relação com a comida e contato retornaram HTTP 200. A imagem original foi preservada e retornou **200, image/jpeg**. A conferência foi de HTML/HTTP/MIME, sem nova auditoria visual de composição da foto.

A nova auditoria dos 31 registros antes da aplicação e dos publicados após o arquivamento encontrou **zero links contextuais para A**. Portanto, **zero alterações em outros artigos**. Os links externos não foram editados e não houve tentativa de modificar backlinks. Os cards permanecem automáticos; não foi criada curadoria manual.

## Metadata e JSON-LD realmente publicados

**Meta description conferida em B:**

> Entenda o emagrecimento sustentável e como começar com alimentação, movimento, pequenas metas e uma rotina possível, sem promessas de resultado.

**Excerpt conferido em B e no feed:**

> Um guia para organizar alimentação, movimento e rotina, com pequenas metas e espaço para ajustes, sem depender apenas de motivação.

Um único H1 no template. O corpo preserva os parágrafos de abertura aprovados e seu primeiro heading é H2, seguido por hierarquia H2/H3 sem H1 interno. Não se inventou um heading adicional ou uma nova introdução.

BlogPosting conferido na página pública:

- datePublished: `2026-06-22T22:17:05.717Z`.
- dateModified: `2026-11-08T13:45:29.480Z`, igual ao editorialUpdatedAt remoto.
- author.name: **Weverlyn da Cruz Alves Torres**.
- author.url: https://www.nutricaoemovimento.com/pt/autora/weverlyn-alves
- mainEntityOfPage: URL canônica de B com www.
- headline: título original de B, preservado.

Autoria profissional e perfil foram preservados; a relação técnica continua com a conta Administrador. A resposta de A é 301, não uma página com BlogPosting independente. A query `?utm_source=test` foi preservada no Location e o arquivamento não interferiu no redirect. Evidência completa: [validacao-remota.json](validacao-remota.json).

## Superfícies públicas e cache pendente aceito

| Superfície verificada | Estado após aplicação |
| --- | --- |
| A | **301 direto para B**, sem Article/BlogPosting renderizado |
| B | **200, conteúdo aprovado exato**, metadata, excerpt e JSON-LD atualizados |
| Home /pt | A ausente; B e excerpt novo presentes |
| Feed /feed.xml | **A ausente, B presente**, excerpt novo |
| Cinco conjuntos antigos de cards | **A ausente** nas páginas verificadas; seleção automática |
| /pt/artigos | Cache ainda contém A e excerpt anterior de B |
| /pt/artigos?categoria=emagrecimento-sustentavel | Mesmo estado estático desatualizado da listagem |
| Perfil da autora | Cache ainda contém a ligação para A; B pode ficar fora do limite dos 12 itens recentes |
| /sitemap.xml | **Cache ainda contém A**; B permanece, mas a atualização de lastmod não foi confirmada nessa saída estática |

As consultas atuais de publicados não elegem mais A; a diferença das páginas estáticas é compatível com o cache da aplicação, não com falha no arquivamento. Não se aplicou purga improvisada, novo endpoint, alteração de cabeçalhos, segredo ou novo deploy.

O usuário escolheu explicitamente **“Registrar cache como pendente”** após a explicação e a solicitação de um salvamento normal de B pelo CMS. Por isso, **não se declara sitemap/listagem/perfil sincronizados**. Essa pendência permanece no fechamento da entrega e pode ser resolvida pelo fluxo normal autenticado do CMS, com posterior conferência pública. Um salvamento sem mudança foi validado na fase local como preservando editorialUpdatedAt e invalidando essas saídas.

O controle de computador foi encerrado pela própria ferramenta por não conseguir determinar com segurança a URL atual do navegador. Nenhuma ação foi enviada ao CMS pela interface. Foi seguida a orientação “stop issuing app input” da [skill Computer Use](<C:/Users/Diego Torres/.codex/plugins/cache/openai-bundled/computer-use/26.1103.32239/skills/computer-use/SKILL.md>); a interrupção veio da ferramenta, não de uma nova exigência de aprovação do conteúdo. Não houve tentativa de contornar esse bloqueio ou fabricar uma sessão de produção.

## Reauditoria final do conteúdo publicado

**B: 83/100 — classe B.** A nota permanece igual à estimativa, agora com renderização, fontes, links, metadata e datas conferidos no artigo realmente publicado.

| Dimensão | Máximo | Nota final |
| --- | ---: | ---: |
| Utilidade/intenção | 25 | 23 |
| Profundidade/clareza | 20 | 17 |
| Originalidade | 15 | 10 |
| E-E-A-T | 15 | 12 |
| Referências | 10 | 8 |
| Leitura/estrutura | 5 | 5 |
| Links internos | 5 | 4 |
| SEO on-page | 5 | 4 |
| **Total** | **100** | **83** |

O guia atende à intenção ampla de B e absorve motivação, ambiente e continuidade de A com aplicação prática. As fontes são rastreáveis e os limites estão explícitos. Permanecem limites de originalidade/contribuição empírica, orientação geral em vez de individualização clínica e manutenção editorial de alguns destinos antigos. A aprovação humana foi informada pelo usuário; o timestamp da aplicação não representa uma revisão clínica independente adicional. Não se elevou a nota por ter publicado. Registro: [reauditoria-final-remota.json](reauditoria-final-remota.json).

A deixou de existir como conteúdo independente servido/indexável e B é a URL principal. **A sobreposição editorial entre os dois corpos foi eliminada pela consolidação.** Ainda há links de descoberta em saídas estáticas antigas, que já levam ao 301. Sem Search Console, queries, impressões e cliques, não se afirma melhora de ranking nem resolução de competição orgânica comprovada.

## Testes, arquivos e estado final

Esta etapa alterou somente registros autorizados e documentação/evidências. **Nenhum arquivo de aplicação ou script foi alterado**, portanto não se repetiu o build. O build completo 37/37, lint, TypeScript e 11 testes da etapa anterior já haviam passado; o usuário ativou o redirect antes deste pedido. Nesta execução foram feitas conferências de banco, guard HTTP antes/depois, corpo exato, metadados/schema, sete referências, cinco links, imagem, cards, feed e demais superfícies. Todas as checagens críticas de dados, B e 301 passaram.

Criados nesta etapa:

- `antes-aplicacao-remota.json` e `depois-aplicacao-remota.json`.
- `guard-antes-aplicacao-remota.json`, `autorizacao-remota.json`.
- `validacao-remota.json`, `referencias-remotas-verificadas.json`.
- `reauditoria-final-remota.json`.
- `antes-aplicacao-final.json`, gerado pelo aplicador imediatamente antes da transação.

Atualizados: este relatório; os avisos de estado em `analise.md` e `plano-consolidacao.md`; `depois-aplicacao.json`, pelo aplicador, agora com estado APPLIED_REMOTE. Os registros de execução local e documentos aprovados não foram reescritos como nova versão.

**Escrita remota concluída: B consolidado; A ARCHIVED; 301 preservado; históricos e contadores preservados; nenhum outro artigo alterado. Pendência residual aceita: cache de sitemap, listagem/filtro e perfil da autora. Nenhum commit, push ou novo deploy executado nesta etapa.**
