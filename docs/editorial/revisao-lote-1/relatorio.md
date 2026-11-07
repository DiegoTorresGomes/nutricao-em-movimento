# Lote 1 — aplicação concluída

**Cinco revisões aprovadas por Weverlyn foram aplicadas ao banco configurado e conferidas nas URLs públicas.** Cards relacionados automáticos foram mantidos como exceção explicitamente autorizada pelo usuário. Não houve nova redação, alteração de artigo fora do lote, schema, slug, ID, conta administrativa, commit, push ou deploy.

Data: 7 de novembro de 2026, America/Sao_Paulo. Publicações e atualizações nas tabelas estão em UTC.

## Resultado editorial

| Artigo | Antes: nota / classe | Depois: nota / classe |
| --- | --- | --- |
| Fomes | 58 / C | 84 / B |
| Relação com a comida | 63 / C | 85 / B |
| Nutrição e movimento | 66 / C | 82 / B |
| Vontade de doce | 70 / C | 85 / B |
| Carboidrato à noite | 70 / C | 88 / A |

A reauditoria manual usa os oito critérios originais; fundamentos por dimensão, limites, metadata, links e cards por artigo estão em [comparativo.md](comparativo.md) e [avaliacoes.json](avaliacoes.json). Nenhuma nota foi elevada apenas porque houve revisão. Há quatro B e um A, com ganhos concretos de utilidade, foco, rastreabilidade e edição; não é garantia de aprovação no AdSense, tráfego ou efeito clínico.

## Histórico preservado

| Artigo | publishedAt antes | publishedAt depois | editorialUpdatedAt antes → depois | Views antes → depois |
| --- | --- | --- | --- | --- |
| Fomes | 2026-09-21T23:56:37.573Z | 2026-09-21T23:56:37.573Z | null → 2026-11-07T19:45:07.267Z | 201 → 201 |
| Relação com a comida | 2026-06-20T01:39:50.167Z | 2026-06-20T01:39:50.167Z | null → 2026-11-07T19:45:08.499Z | 71 → 71 |
| Nutrição e movimento | 2026-08-12T07:00:02.819Z | 2026-08-12T07:00:02.819Z | null → 2026-11-07T19:45:09.825Z | 10 → 10 |
| Vontade de doce | 2026-06-26T07:30:03.435Z | 2026-06-26T07:30:03.435Z | null → 2026-11-07T19:51:23.851Z | 48 → 48 |
| Carboidrato à noite | 2026-07-06T07:00:02.382Z | 2026-07-06T07:00:02.382Z | null → 2026-11-07T19:51:24.819Z | 29 → 29 |

IDs, slugs, títulos, categorias, authorId técnico, título SEO, capa/alt, status, tempo de leitura e demais campos fora do pacote permaneceram iguais ao snapshot. Atualizações editoriais vieram da action existente de edição; updatedAt mudou tecnicamente. Para o #26, a restauração técnica do agendamento fez updatedAt ficar posterior à revisão editorial, e o JSON-LD continuou usando editorialUpdatedAt corretamente. Nenhuma data histórica foi preenchida com o updatedAt antigo.

O agendamento histórico scheduledAt foi preservado/restaurado nos #26, #6 e #10. A action normal limpa esse campo quando o status é PUBLISHED; uma conferência estrita interrompeu a sequência ao encontrar essa limpeza no terceiro artigo. O valor anterior foi restaurado com updateMany guardado por ID, conteúdo e timestamps, sem regravar texto, publicação, contador ou revisão editorial. Na retomada, os três textos já salvos foram apenas conferidos; os dois restantes receberam um salvamento editorial cada, com a mesma proteção. O comportamento geral do CMS não foi modificado nesta etapa.

## Aplicação controlada

- Snapshot inicial: [antes-aplicacao.json](antes-aplicacao.json). Snapshot imediatamente anterior às escritas e fingerprints dos demais artigos: [antes-aplicacao-final.json](antes-aplicacao-final.json). Nenhum inclui senha ou token.
- O SHA-256 do pacote foi mantido: `a12ba6c9f6ac4d5eda7829be76febc8f42db3f418711e4326cb0c0eb6db9f4d4`. Fonte, Markdown, HTML aprovado e propostas não foram regenerados para modificar a redação após a aprovação.
- Autorização do pedido atual e exceção dos cards: [autorizacao-aplicacao.json](autorizacao-aplicacao.json). A primeira tentativa foi recusada pela revisão automática por interpretar a restrição remota anterior como ainda vigente; nenhuma escrita começou nessa tentativa. Após comprovar o novo escopo e acrescentar pins de destino/pacote e whitelist de IDs, a execução foi admitida.
- Usadas as Server Actions reais do CMS em instância própria vinculada a 127.0.0.1:33118, com sessão efêmera válida apenas nesse processo. Nenhum token local foi enviado ao site público; não se modificou usuário, senha, 2FA ou segredo de produção.
- Um bloqueio EBUSY nos artefatos gerados do Windows foi resolvido isolando o output local em .next/editorial-cms. O helper fica em scripts/run-editorial-cms.mjs, sem mudar next.config ou scripts do site. O processo local foi encerrado.
- Não foi acessado o endpoint de views. O script confere todo campo fora de content/contentBlocks/description/seoDescription/editorialUpdatedAt/updatedAt, além dos hashes dos artigos não incluídos.
- [aplicacao.json](aplicacao.json) registra cada POST, hashes e antes/depois; [integridade-final.json](integridade-final.json) confirma cinco textos exatos e **26 outros artigos sem alteração editorial/cadastral**. Os fingerprints dos demais excluem apenas contador e timestamp técnico, que podem variar por acessos independentes. A tarefa não escreveu nesses artigos.

## HTTP, autoria e schema

As cinco URLs canônicas, sem parâmetro de teste, retornaram **HTTP 200 com o HTML aprovado exato**: [verificacao-url-canonica.json](verificacao-url-canonica.json). A checagem também foi feita com query de conferência para separar cache intermediário; nenhum JavaScript de contador foi executado.

Em todos: imagem principal preservada e HTTP 200 com MIME image; um único H1 no template; corpo começando em H2; referências no formato estruturado; links aprovados relativos, sem localhost ou domínio absoluto sem www; CTA de contato no #3 e leituras contextuais nos demais; autora Weverlyn Alves, CRN 24101524 e perfil /pt/autora/weverlyn-alves. Não se submeteu contato ou newsletter.

BlogPosting: datePublished igual à publicação original; dateModified igual a editorialUpdatedAt; author.name=Weverlyn da Cruz Alves Torres; author.url=https://www.nutricaoemovimento.com/pt/autora/weverlyn-alves. Canonical e conta administrativa técnica preservados. Há **11 destinos contextuais/contato verificados com HTTP 200**. Detalhes em [verificacao-http.json](verificacao-http.json).

As referências aplicadas são 3, 3, 4, 6 e 5 por artigo. Autor/instituição, título, publicação, ano e DOI/URL foram preservados. Os dez DOIs resolveram com 302; documentos institucionais retornaram 200. Ver [referencias.md](referencias.md). Não se acrescentaram fontes ou citation schema.

## Relacionados e canibalização

**Exceção autorizada:** não foram aplicadas as sugestões manuais de cards, pois o CMS não as armazena nem renderiza. Os três cards automáticos continuam por categoria/recência, sem duplicata ou auto-link nos cinco artigos. Algumas relações ainda são amplas, como detox no #26; isso está refletido na avaliação de linkagem e não foi disfarçado como curadoria implantada. Todos os links contextuais existentes no pacote aprovado foram aplicados.

Os recortes de #31 (comparar sinais) e #6 (desejo específico por doces) ficaram suficientemente distintos de normalidade do comer emocional, mapa de gatilhos, ansiedade e padrão de beliscos. Continua sobreposição conceitual leve nos vizinhos antigos, não alterados. A análise é de conteúdo, não comprovação de eliminação de canibalização de ranking; faltam novos dados de queries/desempenho. Nenhuma fusão/redirect e nenhuma intervenção no artigo #20.

## Testes técnicos

- prisma validate: passou.
- prisma generate: passou, client 7.10.1. Não foi executado db push ou migração.
- npm run lint: sem erros; dois avisos preexistentes em segurança/AdminLayout.
- tsc --noEmit: passou.
- Oito testes offline existentes: passaram. Verificador de identidade/estrutura do pacote: passou.
- **npm run build completo passou**, Next 15.5.29: geração do cliente, compilação, lint, tipos, dados, **37/37 páginas**, otimização e traces. Sem modo parcial e sem implantar os artefatos.
- git diff --check: conferido ao fechar a entrega.

Não houve teste visual em navegador; validações são de banco, HTML/HTTP, MIME da imagem, esquema e estrutura. A revisão científica humana foi a informada pelo usuário; a reauditoria editorial não se apresenta como revisão clínica independente.

## Cache público: limitação residual

As páginas individuais e o feed já mostram os dados novos. Entretanto, a conferência adicional encontrou o **sitemap remoto ainda com lastmod anterior**; a listagem e o perfil da autora também podem conservar descrições anteriores no cache estático. Evidência: [verificacao-cache-publico.json](verificacao-cache-publico.json). A invalidação da action executada localmente não equivale a invalidar os caches da instância hospedada.

Não se executou deploy, criou endpoint, alterou segredo ou contornou autenticação para purgar cache remoto. Para sincronizar essas saídas estáticas é necessária a invalidação pelos mecanismos autenticados da instância hospedada; as listagens com revalidação temporal podem atualizar no ciclo normal, mas não se promete isso para sitemap estático. O JSON-LD e o corpo dos cinco artigos canônicos já foram conferidos atualizados.

Outras manutenções fora do aprovado: tempo de leitura e alts/capas originais foram preservados; não há nova otimização silenciosa. A lógica do CMS que limpa scheduledAt em PUBLISHED continua existente; neste lote seu valor histórico foi restaurado por proteção técnica documentada.

## Arquivos e estado final

Criados nesta aplicação: scripts/apply-editorial-lote1.ts, scripts/run-editorial-cms.mjs, scripts/report-editorial-lote1.mjs e os snapshots/evidências/avaliacoes em docs/editorial/revisao-lote-1/. Os três documentos inicialmente de preflight foram atualizados para registrar o resultado real: relatorio.md, comparativo.md e referencias.md. O índice do pacote inicial recebeu somente um aviso de status/histórico; a redação aprovada e seu hash não mudaram.

O Git contém também o pacote docs/editorial/lote-1/ e scripts/build-editorial-lote1.ts, já não rastreados antes desta aplicação. Nenhum arquivo rastreado da aplicação, schema, dependência ou configuração foi alterado. Scripts de apoio ficam em scripts/, e .next permanece ignorada.

**Nenhum outro artigo alterado por esta tarefa. Nenhum commit, push ou deploy executado.** O banco configurado recebeu somente as cinco revisões autorizadas e as restaurações técnicas de agendamento nesses mesmos registros.
