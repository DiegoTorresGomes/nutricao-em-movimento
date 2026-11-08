# Correção do checklist editorial do CMS

**Atualização após aplicação do Lote 2:** a aprovação visual humana de ambos os artigos nas cinco larguras foi informada expressamente pelo usuário. Foi registrada na aplicação transacional de 08/11/2026 às 19:37:59 UTC, sem inventar o horário histórico de inspeção. Os seis registros publicados passam no validador. Os resultados 4/6 e pendências abaixo descrevem a etapa de preparação, não o estado atual. Evidências finais: [relatório do Lote 2](../revisao-lote-2/relatorio.md), [integridade](../revisao-lote-2/integridade-final.json) e [aprovação recebida](../revisao-lote-2/aprovacao-visual-retomada.json). As prévias/manifesto e o JSON offline desta pasta permanecem como histórico da geração e do snapshot anterior; não substituem o resultado final.



Data: 08/11/2026. Atualizado após a auditoria da palavra-chave e preparação da revisão manual. Escopo: código, testes e documentação locais. Lote 2 não aplicado.

Resultado atual: 4/6 propostas integralmente liberadas; #2 e #1 têm **somente as três revisões visuais pendentes**. Focus keyword passou a recomendação interna; nenhum valor foi inserido nos artigos ou no pacote aprovado. As seis não têm bloqueios artificiais de keyword, biografia no corpo ou CTA comercial. Prévia e roteiro: [revisao-manual.md](revisao-manual.md).

## Causa e auditoria das regras anteriores

O checklist não representava o modelo editorial público. Exigia uma nota de autora no corpo, embora o template já mostre Weverlyn Alves, CRN 24101524 e o perfil canônico. No HTML, até a palavra “nutricionista” satisfazia essa exigência sem comprovar autoria. Exigia também CTA comercial universal; palavras como “consulta”, inclusive em avisos, bastavam para reconhecê-lo. Link interno e relacionado eram bloqueantes quando havia outros artigos publicados.

| Regra anterior | Tipo e funcionamento |
| --- | --- |
| Título, categoria, resumo, H2 e parágrafo | Automática, bloqueante |
| Sobre a autora | Automática, bloqueante; bloco authorNote ou palavras no HTML |
| SEO title, SEO description, palavra-chave, alt da capa e das imagens | Automática, bloqueante |
| Link interno / artigo relacionado | Automática, bloqueante com outros artigos publicados |
| CTA newsletter ou consulta | Automática, bloqueante |
| FAQ | Automática, recomendação |
| desktopReviewed, tabletReviewed, mobileReviewed | Confirmações manuais, bloqueantes |
| Tabelas e cards responsivos | Informativas, sempre aprovadas por expressões `|| true` |

Pontos de entrada: `src/lib/editor/validate-post.ts`, `analyze-html-content.ts`, os formulários de criação/edição e `EditorialChecklist.tsx`. Os formulários desabilitam a submissão de PUBLISHED/SCHEDULED quando `canPublish` é falso. Rascunhos continuam permitidos. O checklist não é uma barreira de segurança do servidor: as server actions não chamavam esse validador e continuam sem chamá-lo; esta correção não introduz uma alegação de proteção que não existia.

## Regras novas

**Autoria continua bloqueante.** O formulário de edição fornece o `authorId` real do registro; a criação obtém a conta ADMIN pelo mesmo critério usado pela action de criação. O validador exige associação em `nutritionistConfig.publishingAccountIds`, nome público não vazio, CRN preenchido no formato esperado e perfil `/pt/autora/weverlyn-alves`. Essa configuração é a mesma renderizada pelo template público junto ao título e no perfil da autora. Um texto no corpo ou um bloco authorNote sozinho não substitui essa associação. Conta desconhecida ou CRN ausente continuam pendentes. Nenhum bloco duplicado é exigido ou inserido.

**CTA é recomendação.** Uma âncora com destino sintaticamente aceito e ação identificável pode atender o item: artigo, contato, newsletter, consulta ou outra ação editorial. Blocos são analisados após sua renderização, pelo mesmo critério do HTML. Menção solta a “consulta” ou link bibliográfico isolado não satisfazem CTA. Destinos vazios, malformados e protocolos como javascript/data não contam como CTA válido. Ausência é aviso para avaliação editorial; não há inserção automática nem campo de aprovação inventado. A justificativa de ausência pertence à revisão humana da proposta.

**Link interno e relacionado são recomendações.** Categoria permanece obrigatória em Conteúdo; foi removida apenas sua duplicação no grupo Crescimento. FAQ permanece recomendação. Os itens estão identificados na interface como “Obrigatório” ou “Recomendação”; o grupo visual está explicitamente identificado como manual. A porcentagem representa atendimento do checklist, não nota de qualidade científica ou aprovação profissional.

**Revisão visual continua bloqueante e manual.** Nenhum setter, checkbox, inicialização de revisão ou action de persistência foi alterado. `desktopReviewed`, `tabletReviewed`, `mobileReviewed` e `lastPreviewAt` não recebem valores automáticos. Tabelas/cards presentes dependem das três confirmações visuais para o item informativo, substituindo o `|| true`. Esse vínculo não equivale a teste automatizado de layout.

Continuam bloqueantes no checklist: título, categoria, resumo, H2, parágrafo, autoria canônica, SEO title/description, alt da capa/imagens e as três revisões visuais. Palavra-chave passou a recomendação após a auditoria descrita abaixo. Conteúdo HTML preserva o critério anterior de parágrafo com mais de 80 caracteres de texto total.

## Auditoria da palavra-chave e decisão

O campo é **Post.focusKeyword**, tipo Prisma **String?**, portanto nullable. É uma única string de foco, não uma lista de meta keywords.

| Camada | Uso real encontrado |
| --- | --- |
| Modelo | `prisma/schema.prisma:75`, coluna opcional focusKeyword |
| Entrada | CreatePostForm.tsx e EditPostForm.tsx, input name=focusKeyword e estado de formulário |
| Escrita | novo/actions.ts lê FormData, aplica trim e salva string ou null em prisma.post.create; [id]/editar/actions.ts faz o mesmo em prisma.post.update |
| Leitura editorial | Edição inicia estado a partir de post.focusKeyword; os dois formulários enviam o valor ao checklist |
| Checklist anterior | validate-post.ts apenas verificava presença por hasText(input.focusKeyword); não calculava pertinência, densidade ou correspondência com texto |
| Renderização pública | Nenhum consumo semântico encontrado em src fora dos formulários/actions/validador; consultas de Post podem carregar a coluna junto com o registro, mas o template não a renderiza |
| Metadata/HTML | generateMetadata do artigo usa article.title e consolidationDescription(article); não usa focusKeyword. Layout global também não declara keywords derivadas desse campo. Não gera meta keywords, JSON-LD, texto visível, slug, title ou description |
| Scripts | Auditorias e pacotes históricos podem transportar/copiar o campo, mas não acrescentam função de publicação ou otimização automática |

**Decisão: remover o bloqueio e manter a anotação opcional como recomendação.** O nome é de focus keyword real do CMS, mas a exigência de presença é um requisito legado: não há recurso de análise, planejamento, geração de metadata ou outro mecanismo que dependa de seu preenchimento. O editor pode usar uma anotação para orientar intenção; isso não é condição estrutural de publicação. A decisão corresponde à opção B para requisito sem função técnica/editorial que justifique bloqueio, e não à hipótese de que este campo gere meta keywords. Não foi tomada apenas para liberar artigos: a auditoria encontrou ausência de consumo funcional além da própria exigência. Schema e persistência permanecem intactos.

O item continua visível como recomendação; campo preenchido atende a recomendação e campo vazio não impede publicação. Os inputs agora dizem “Palavra-chave de foco (opcional)”. Não há exigência de repetição, contagem, slug ou título correspondentes. Não foi adicionada análise de SEO nem recurso novo para justificar uma regra antiga.

### Intenções aprovadas e termos naturais

A fonte é lote-2/propostas.json, lida sem alteração. São inferências editoriais da intenção aprovada, sem alegação de pesquisa de volume ou ranking.

| Artigo | Intenção aprovada | Query provável aprovada | Termo principal natural, opcional |
| --- | --- | --- | --- |
| #2 Comer por emoção é normal? | Explicar influência emocional cotidiana e quando frequência/impacto, sofrimento, culpa ou perda de controle merecem atenção | comer por emoção é normal ou preciso de ajuda? | comer por emoção |
| #1 Alimentação consciente | Definir a prática, seus limites e como experimentá-la sem dieta ou controle rígido | o que é alimentação consciente e como praticar? | alimentação consciente |

“Alimentação consciente” é o termo em português que inicia o título e define o assunto; mindful eating é o equivalente complementar. O formato esperado, se a pessoa editora desejar anotar, é texto simples em focusKeyword, sem vírgulas obrigatórias ou sintaxe especial. **Nenhum desses valores foi inserido no pacote ou banco**, pois a decisão foi manter o campo opcional. Corpo, slug, título, description, SEO e todos os hashes aprovados permanecem intactos.

## Controles preservados e limites encontrados

Nenhuma server action, schema, migração, normalização de corpo, template público, referência, publicação ou rotina de datas foi alterada. Permanecem: geração/verificação de unicidade de slug na criação, preservação de slug na edição, normalização que remove H1 do corpo (H1 público pertence ao template), exigência de data ao agendar nas actions, enum de status no banco e tratamento existente de datas editoriais/publicação. O renderer de referências continua usando `referenceUrl`, que aceita DOI válido ou URL HTTP(S) sem credenciais e não produz hiperlink inseguro.

Limites preexistentes registrados, sem declarar controles inexistentes:

- `status` e `scheduledAt` eram campos de entrada não utilizados pelo checklist. Validação de persistência permanece nas camadas existentes; presença de data não equivale a validação completa de calendário.
- Não havia verificação de slug, contagem de H1, disponibilidade HTTP de links, exigência contextual de referências ou validade científica de fontes neste checklist. A detecção de CTA não é uma auditoria de links quebrados nem um sanitizador HTML.
- Autoria é verificada pela associação configurada e contrato do template em código, sem consulta HTTP em cada digitação. O teste confere que o template mantém o link e o nome/CRN. Não houve inspeção visual autenticada nesta etapa.
- O comportamento da action de edição que limpa `scheduledAt` ao salvar um artigo publicado permanece fora desta alteração. A interrupção e a trava do pacote de aplicação continuam intactas.

## Testes e evidências

`scripts/editorial-validator.test.ts` cobre A–E: autora canônica sem biografia no corpo; ausência de CTA comercial; ações válidas/inválidas em HTML e blocos; revisão visual pendente com entrada/timestamp intactos; requisitos estruturais/metadata/alt ausentes continuam bloqueados. Também cobre conta desconhecida, CRN ausente, contrato do template e as seis propostas reais, sem mutação dos arquivos aprovados. O teste novo da keyword cobre campo vazio não bloqueante, termos preenchidos válidos, termo ausente do texto, e preservação de título, slug e corpo.

Comandos executados:

| Comando | Resultado final |
| --- | --- |
| `node --import tsx --test scripts/editorial-validator.test.ts scripts/editorial-lote2.test.ts scripts/editorial-preview.test.ts` | 15 testes aprovados: 8 do validador, 5 do adaptador/trava e 2 da prévia |
| `node --import tsx scripts/check-editorial-validator.ts` | Validação offline, 4/6 liberados; hashes aprovados e corpos preparados íntegros |
| `npm run lint` | Sem erros; dois avisos preexistentes |
| `npx tsc --noEmit` | Aprovado |
| `npm run build` | Aprovado; Next 15.5.29, Prisma Client gerado, 37 páginas geradas |

Avisos preexistentes: `<img>` em `src/app/administracao/seguranca/page.tsx:100` e `destroySession` não utilizado em `src/components/admin/AdminLayout.tsx:3`. 

O diretório de guias solicitado em AGENTS.md, `node_modules/next/dist/docs/`, não existe nesta instalação. Foi consultada a documentação oficial correspondente ao Next 15 sobre [componentes de servidor e cliente](https://nextjs.org/docs/15/app/getting-started/server-and-client-components); a página de servidor fornece somente o ID serializável ao formulário cliente.

## Impacto sobre as seis propostas do Lote 2

Validação offline de `revisao-lote-2/pacote-aplicacao.json`, combinada com os campos preservados do snapshot `antes-aplicacao.json`. Não houve leitura nova dos registros para esta simulação nem escrita no banco. Evidência detalhada: `lote-2.json`; gerador reproduzível: `scripts/check-editorial-validator.ts`, sem cliente de banco ou chamada ao CMS. Hashes de todos os arquivos aprovados são comparados ao snapshot, assim como os corpos HTML preparados.

| Artigo | Antes, com proposta aprovada | Depois, mesma proposta |
| --- | --- | --- |
| #30 Saúde mental | Bloqueado: autora no corpo e CTA | Liberado no checklist |
| #22 Comer à noite | Bloqueado: CTA | Liberado no checklist |
| #18 Déficit calórico | Bloqueado: autora no corpo e CTA | Liberado no checklist |
| #9 Dietas restritivas | Bloqueado: autora no corpo e CTA | Liberado no checklist |
| #2 Comer por emoção | Bloqueado: palavra-chave e três revisões visuais | Somente três revisões visuais |
| #1 Alimentação consciente | Bloqueado: autora, CTA, palavra-chave e três revisões visuais | Somente três revisões visuais |

As seis satisfazem autoria e não são bloqueadas por CTA ou keyword. **Não são seis artigos integralmente liberados: são quatro.** #2 e #1 precisam somente de revisão real em desktop, tablet e mobile. Nenhum desses campos foi preenchido para simular aprovação. Flags já verdadeiras nos outros quatro são os valores históricos do snapshot; esta execução não realizou nova revisão visual das propostas.

Os conteúdos aprovados não precisam de inserção de autoria ou CTA para atender às regras corrigidas. Isso não autoriza aplicação nem resolve automaticamente a revisão visual ou as limitações já registradas de cards automáticos e campos SEO sem consumo pelo template.

## Prévias e revisão manual pendente

Geradas duas fixtures HTML com corpos aprovados exatos após articleBody, classes principais do template público, CSS/fontes do build, capa, autoria e cards do snapshot. O manifesto de geração registra hashes, tabelas ausentes e **PENDING_HUMAN_REVIEW**. A primeira execução do gerador identificou que registros fora do lote não têm categoria aninhada no snapshot; foi corrigida para usar a categoria do artigo de origem nos cards relacionados da mesma categoria. A geração final passou.

Abra o roteiro [revisao-manual.md](revisao-manual.md). Com o build atual disponível:

```powershell
node --import tsx scripts/prepare-editorial-preview.ts
node scripts/serve-editorial-preview.mjs
```

Depois abra http://127.0.0.1:4182/ e selecione cada artigo e largura: **1440, 1023, 768, 375 e 320 px**. Total: dez combinações. Permanecem pendentes, em **cada um dos dois artigos**, desktopReviewed, tabletReviewed, mobileReviewed; lastPreviewAt permanece inalterado. O roteiro contém registro humano ainda vazio e checklist de título, capa, largura, headings, listas, negritos, links, referências, autora, CTA, overflow, tabelas (não presentes), cards e espaçamentos.

Os testes da prévia verificaram corpos aprovados preservados, H1 único, autoria, ausência de formulários/gravação/contagem, cinco larguras disponíveis e servidor local somente de leitura. Foram feitos GETs locais dos HTML/CSS; POST foi recusado com 405 e arquivos privados/rotas de banco com 404. O processo usado no teste foi encerrado. Isso **não é revisão visual humana**; nenhuma das dez combinações recebeu aprovação.

O servidor e o gerador não acessam banco. O build mantém suas leituras normais. As imagens remotas exigem rede. As fixtures não incluem header/footer global, newsletter, consentimento ou toda a interatividade do site; a âncora Instagram é simplificada. Cards são exemplos da seleção observada, não garantia de ordenação futura. O roteiro exige conferência posterior das partes omitidas quando influírem no resultado. Há atenção documentada à largura mínima de 300 px dos cards em uma seção com 32 px de padding no viewport de 320 px: é potencial corte a verificar, não correção ou aprovação realizada.

## Arquivos e escopo da entrega

Alterados: `src/lib/editor/validate-post.ts`, `src/components/editor/analyze-html-content.ts`, `src/components/editor/EditorialChecklist.tsx`, os formulários `CreatePostForm.tsx`/`EditPostForm.tsx` e a página de criação `novo/page.tsx`.

Criados nesta entrega e na correção anterior: scripts/editorial-validator.test.ts, scripts/check-editorial-validator.ts, scripts/prepare-editorial-preview.ts, scripts/serve-editorial-preview.mjs, scripts/editorial-preview.test.ts, este relatório, lote-2.json, revisao-manual.md e previas/{index.html,comer-por-emocao.html,alimentacao-consciente.html,manifesto.json}. As mudanças específicas desta etapa no código do CMS são somente a recomendação de keyword e os rótulos opcionais dos dois inputs.

Nenhum artigo, conteúdo aprovado ou banco editorial foi alterado. Nenhum script de aplicação foi executado; o teste da trava usa um cliente fictício que lança erro se acessado. O build executa as leituras normais de pré-renderização, sem acionamento das actions de escrita. A documentação histórica da interrupção permanece válida: aplicação 0/6. Sem commit, push ou deploy. Scripts permanecem em `scripts/`; `.next/` é ignorado e não contém arquivos rastreados pelo Git.
