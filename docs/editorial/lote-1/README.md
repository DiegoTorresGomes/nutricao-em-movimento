# Lote 1 — propostas de revisão editorial

**Situação atual:** as cinco propostas foram aprovadas por Weverlyn e aplicadas em 7 de novembro de 2026, mantendo os cards automáticos como exceção autorizada. Consulte o [relatório de aplicação e reauditoria](../revisao-lote-1/relatorio.md). O texto abaixo e os rótulos dos rascunhos registram a etapa anterior de preparação; a redação aprovada e seu pacote foram preservados sem nova versão.

**Entrega para revisão de Weverlyn, ainda não publicada.** Destino confirmado pelo usuário: arquivos revisáveis no projeto. Foram preparados somente os cinco artigos solicitados. Nenhum registro no banco foi atualizado, nem houve commit, push, deploy, alteração de slug, redirect ou revisão de artigos fora do lote.

Preparação em 7 de novembro de 2026, America/Sao_Paulo. A política editorial mantém a revisão humana e a responsabilidade final de Weverlyn da Cruz Alves Torres, nome profissional Weverlyn Alves, nutricionista, CRN 24101524. A pesquisa e a redação deste pacote não são apresentadas como revisão clínica concluída por ela.

## Textos para ler

| Artigo | Texto revisável | Prévia de apresentação | Principal ganho proposto |
| --- | --- | --- | --- |
| Fome emocional ou fome física? | [Markdown](artigos/01-fomes.md) | [HTML](previas/01-fomes.html) | Comparação com limites, coexistência dos sinais e escala ilustrativa sem regra para poder comer. |
| Relação saudável com a comida | [Markdown](artigos/02-relacao-com-a-comida.md) | [HTML](previas/02-relacao-com-a-comida.html) | Exemplos concretos de flexibilidade, culpa, vida social e compensação; menos repetição de outros guias. |
| Nutrição e movimento | [Markdown](artigos/03-nutricao-e-movimento.md) | [HTML](previas/03-nutricao-e-movimento.html) | Coordenação entre refeições, atividade e recuperação em situações reais; deixa protocolos nos guias de treino. |
| Vontade de doce todo dia | [Markdown](artigos/04-vontade-de-doce.md) | [HTML](previas/04-vontade-de-doce.html) | Distingue preferência, pistas ambientais, privação, fome e cansaço, sem uma lista determinista de causas. |
| Carboidrato à noite engorda? | [Markdown](artigos/05-carboidrato-a-noite.md) | [HTML](previas/05-carboidrato-a-noite.html) | Resposta precoce, balanço energético contextualizado e leitura cuidadosa dos estudos de horário. |

Os títulos originais foram mantidos. O H1 dos arquivos de leitura representa o título do template; o conteúdo para o CMS começa em H2. Nas prévias há somente um H1. A numeração entre colchetes remete à bibliografia de cada texto. A página real já fornece autora, perfil, CRN e disclaimer; os corpos novos não repetem uma biografia extensa nem alegam experiência clínica inventada.

## Auditoria que antecedeu a redação

Consultados relatório geral, matriz, plano de prioridades e canibalização da auditoria, além do relatório de correções estruturais e documentação em `estrutura-editorial`. O [plano editorial](plano-editorial.md) foi registrado antes de escrever os novos textos: intenção principal, query provável, pergunta central, resposta esperada e fronteiras de cada URL. Queries são hipóteses editoriais, sem volume ou posição orgânica medidos.

A conferência no banco foi somente de leitura. Os cinco registros exatos, conteúdo integral, blocos, metadata, bibliografia, links, CTAs e categorias estão em [baseline.json](baseline.json). Todos os cinco corpos coincidiam com a captura da auditoria. As cinco URLs públicas responderam 200; foram conferidos canonical, metadata, BlogPosting, autoria e relacionados no HTML sem executar JavaScript/contador.

| Nº da auditoria | ID | Slug preservado | publishedAt original, UTC | editorialUpdatedAt |
| --- | --- | --- | --- | --- |
| 31 | `cmqa1a7130001ee2r4imybzf1` | `fome-emocional-ou-fome-fisica-aprenda-a-identificar-a-diferenca` | 2026-09-21T23:56:37.573Z | null |
| 3 | `cmqlko9pe0000992rtm9c5ane` | `relacao-saudavel-com-a-comida-o-que-e-e-como-construi-la-no-dia-a-dia` | 2026-06-20T01:39:50.167Z | null |
| 26 | `cmr6j3k410000jg2rjxc2qlbm` | `nutricao-e-movimento-como-cuidar-do-corpo-com-equilibrio-consciencia-e-constancia` | 2026-08-12T07:00:02.819Z | null |
| 6 | `cmqtxvrx20000xc2ruyxxz3pm` | `vontade-de-doce-todo-dia-o-que-pode-estar-acontecendo` | 2026-06-26T07:30:03.435Z | null |
| 10 | `cmqzsbfaf0000fy2r5ka03ipm` | `carboidrato-a-noite-engorda-entenda-sem-terrorismo-nutricional` | 2026-07-06T07:00:02.382Z | null |

Datas foram confirmadas com o mesmo Prisma/adapter da aplicação e com o JSON-LD público, evitando conversão de fuso do driver bruto. Categorias, conta técnica de autoria, capas e alts permanecem como identidade preservada em `propostas.json`. Na consulta atual, a coluna editorial já existia, e as cinco páginas públicas usavam publicação como `dateModified` por terem revisão nula. Isso registra o estado observado, sem atribuir a esta tarefa a implantação anterior.

Foram lidos integralmente os cinco textos e as cinco referências editoriais: pré-treino (#14), atenção na rotina (#19), prato equilibrado (#12), pós-treino (#15) e ansiedade/alimentação (#13). Para o recorte de fome também foram lidos comer por emoção (#2), gatilhos (#5), beliscos (#7) e vontade de doce (#6). Os corpos desses contextos também coincidem com a auditoria; não se trabalhou apenas com excerpts. Clareza por contexto, exemplos brasileiros e limites das evidências foram usados como referência de qualidade, sem copiar sua redação.

## O que mudou nas propostas

### Fome emocional ou fome física?

Retirada a associação entre culpa e um tipo de fome; a tabela passa a oferecer pistas que podem se sobrepor. Adicionados exemplos de fome física com ansiedade e escolha por prazer. A escala é descrita como recurso ilustrativo, sem validação clínica alegada, ponto obrigatório para comer ou promessa de diagnóstico. Orientações para ajuda não dependem do peso corporal. Corrigida a descrição que terminava em “e com”. Duas leituras contextuais, sem CTA comercial.

Fontes: revisão de Reichenberger et al. para limites do construto; Guia Alimentar para a dimensão social; NIMH para sinais que merecem avaliação. Não se atribuiu à revisão a validação da tabela/escala editorial.

### Relação saudável com a comida

A definição ganha situações de almoço imprevisto, evento social, doce e variação de fome. Cinco ações têm exemplos, em vez de slogans. O texto distingue uma rotina organizada de rigidez com sofrimento e preserva restrições clinicamente necessárias. Reduzida a repetição da comparação das fomes e da técnica de atenção, com links para os guias próprios. Contato mantido como opção discreta, sem promessa comercial.

Fontes: Guia Alimentar; meta-análise de Linardon et al., explicitamente tratada como associação em estudos majoritariamente observacionais; NIMH para avaliação de sinais. Não há promessa de cura, emagrecimento ou efeito garantido da alimentação intuitiva.

### Nutrição e movimento

O diferencial é resolver conflitos de logística: trabalho/atividade, refeição próxima do fim do exercício e dia curto com cansaço. Energia, líquidos e recuperação aparecem de forma proporcional, sem repetir cardápios e tabelas de timing. Há um experimento de organização com critério de revisão, não um programa de treino. Recomendações populacionais são identificadas como referência para adultos, sem exigir cumprimento integral na primeira semana. Leituras sobre prato, pré e pós-treino substituem explicações extensas; sem novo CTA comercial.

Fontes: Guia Alimentar, Guia de Atividade Física, OMS 2020 e posicionamento Thomas/Erdman/Burke. O documento esportivo sustenta apenas princípios gerais; não se transportaram doses ou protocolos de atletas para leitores recreativos.

### Vontade de doce todo dia

Retirados resumo incompleto, benefícios genéricos repetidos e FAQ que retomava quase todo o corpo. O cenário do fim da tarde é preservado como exemplo, sem concluir que exista uma causa única. Diferenciadas privação seletiva e restrição energética: não se afirma que toda dieta aumenta desejos. A revisão de sono não é usada para provar desejo específico de açúcar; emoções podem mudar o apetite em diferentes direções. A menção hormonal não desenvolvida foi retirada, em vez de completada por especulação. Lanche/gatilhos são encaminhamentos contextuais, sem vender uma solução para eliminar a vontade.

Fontes: Meule, Boswell/Kober, Al Khatib et al., Reichenberger et al., NIMH e NIDDK. A última sustenta somente o limite do autodiagnóstico de diabetes, sem valores de exames, prescrição ou rastreamento individual. Não se afirma vício em açúcar nem deficiência de nutriente pelo desejo isolado.

### Carboidrato à noite engorda?

Resposta aparece na abertura. Removidos parágrafo duplicado, listas extensas e repetições entre resumo, conclusão e FAQ. O princípio energético inclui regulação biológica e contexto. Há diferença explícita entre um estudo fisiológico curto e demonstração de ganho de gordura de longo prazo. Revisões de horários, inclusive uma publicação de 2026, não são interpretadas como proibição de um nutriente ou indicação universal de jejum. Exemplos de jantar são possibilidades, sem porção prescrita. Três links correspondem a composição do prato, recuperação e comportamento noturno; sem CTA comercial forçado.

Fontes: Hall et al., OMS sobre carboidratos, Vujović et al., Liu et al. e Chen et al. A referência esportiva antes atribuída incorretamente a VanDusseldorp não foi reproduzida: a nova explicação não depende desse posicionamento. A conferência de Hall informa financiamento de ASN/ILSI no registro de fontes, sem usar o documento para promover produtos.

## Rastreabilidade científica

[fontes.json](fontes.json) registra **16 fontes únicas**, com autoria/instituição, título, publicação, ano, DOI/URL, tipo, afirmação apoiada e limites. São 3, 3, 4, 6 e 5 referências nas cinco propostas, respectivamente; todas aparecem vinculadas a afirmações no texto, não como lista decorativa. Documentos institucionais não foram apresentados como ensaios clínicos, e PubMed não aparece como “autor de estudo”.

A pesquisa foi dirigida, não uma nova revisão sistemática de toda a literatura. Efeitos de associação não viraram causalidade; cenários e sugestões cotidianos são construções editoriais, não intervenções testadas pelos papers. A fonte de cada afirmação central pode ser localizada pela numeração e pelo registro. Não foram inventados autores, resultados, DOIs, anos ou fontes.

As verificações HTTP estão em [links-verificados.json](links-verificados.json). Todos os destinos internos utilizados ou sugeridos, contato e perfil da autora responderam 200. Algumas respostas diretas do PubMed retornaram 203; isso foi preservado no registro, sem chamar de HTTP 200. Os dados bibliográficos e abstracts foram conferidos nos registros científicos acessados pela pesquisa web e/ou texto integral de PMC. Um status de transporte não é usado como prova da qualidade do estudo.

## Intenções e relacionados

As fronteiras do grupo de fome foram mantidas: #31 compara sinais; #2 discute normalidade do comer emocional; #5 mapeia gatilhos; #13 aborda ansiedade; #7 trata do padrão de beliscar; #6 investiga desejo por doces. Os últimos textos fora do lote foram lidos e usados como destinos, sem alteração. #3 continua uma explicação de relação com a comida; #17 aprofunda linguagem moral. #26 coordena cuidados cotidianos; #14/#15 resolvem momentos do exercício e #29 o início com caminhada. #10 trata do mito do nutriente; #22, do comportamento noturno.

| Artigo | Relacionados automáticos observados, nº da auditoria | Sugestão editorial | Motivo |
| --- | --- | --- | --- |
| Fomes (#31) | 17, 7, 5 | 2, 5, 19 | Normalidade, contexto dos gatilhos e observação na rotina. Os atuais não são todos inadequados; propõe-se uma sequência mais direta. |
| Relação com a comida (#3) | 12, 11, 10 | 17, 31, 19 | Linguagem/culpa, sinais e aplicação da atenção, mais próximos da pergunta comportamental. |
| Nutrição/movimento (#26) | 29, 28, 25 | 12, 14, 15 | Composição da refeição e dúvidas específicas de quem integra exercício à rotina; detox não é um próximo passo central. |
| Doces (#6) | 30, 22, 19 | 24, 5, 7 | Opção de lanche, identificação de pistas e padrão de beliscos. |
| Carboidrato (#10) | 12, 11, 3 | 12, 15, 22 | Jantar, recuperação após atividade e contexto do comer noturno. |

**As sugestões de cards não estão implantadas.** Estão separadas de `proposedChanges` no pacote, pois o site hoje escolhe cards por categoria/recência. Não se mudou o algoritmo global ou criou uma funcionalidade de seleção manual nesta fase. Os corpos propostos já têm de dois a três links contextuais reais; isso permite a curadoria editorial sem fingir que o módulo automático foi alterado. Não houve fusão ou redirect. O artigo de hábitos/força de vontade (#20), expressamente excluído, não foi revisado.

## Formatos, metadados e uso posterior

- `conteudos.json`: fonte editável das cinco redações, elementos e fontes escolhidas.
- `artigos/*.md`: leitura humana, com identidade, descrição proposta e bibliografia.
- `previas/*.html`: prévias estáticas sem script, uma por artigo. Seus links usam o domínio oficial; não representam páginas já publicadas.
- `propostas.json`: HTML e `EditorBlock[]` produzidos pelo renderizador existente, com bloco `references` estruturado. Identidade/campos a preservar ficam separados das mudanças propostas.
- `baseline.json`: captura anterior, somente dos cinco registros e das verificações públicas necessárias; nenhum segredo ou dado de conta privada foi exportado.
- `verificacao-final.json`: nova leitura confirmou os cinco registros intactos ao final da preparação.
- `plano-editorial.md`: recortes registrados antes da redação.

As únicas mudanças propostas de campos são corpo/blocos, descrição e descrição SEO. Títulos, slugs, URL, publicação, categoria, autoria técnica, título SEO e capas/alts ficam preservados. Não foram alterados campos SEO globalmente nem ativado uso de SEO title no template. As descrições propostas estão completas e alinhadas ao novo foco. O tempo de leitura pode ser ajustado quando a versão humana final estiver definida, sem usar extensão como critério de qualidade.

Não foram reutilizadas as ilustrações internas das escalas nos dois primeiros rascunhos: os limites e exemplos estão em texto/tabela, sem depender de uma imagem antiga que possa sugerir uma distinção rígida. Nenhum arquivo de imagem ou ativo Cloudinary foi apagado. Capas e seus metadados permanecem preservados no pacote; não foi feita nova auditoria visual delas.

Depois da revisão humana, a aplicação ao CMS deve ser uma ação separada, com nova conferência de IDs/hash/conteúdo atual. Não usar estas propostas para sobrescrever silenciosamente mudanças feitas depois da captura. Uma edição substantiva aprovada recebe `editorialUpdatedAt` no salvamento real; criar este rascunho não altera nem antecipa essa data. `publishedAt` deve permanecer o valor original. Não há script de aplicação/escrita em banco neste lote.

## Verificação e integridade

```powershell
node --import tsx scripts/build-editorial-lote1.ts --write
node --import tsx scripts/build-editorial-lote1.ts
node --import tsx --test scripts/check-editorial-structure.test.ts
node node_modules/typescript/bin/tsc --noEmit
npm run lint
```

O primeiro comando regenera arquivos de leitura/prévia/pacote a partir de `conteudos.json` e `fontes.json`; o segundo confere que não estão divergentes. Para manter as versões sincronizadas, levar mudanças aprovadas nos Markdown de volta à fonte antes de regenerar, pois `--write` substitui os derivados. O gerador não importa Prisma, não acessa rede e não escreve no banco.

Passaram a validação das cinco identidades/datas, início em H2, um H1 por prévia, H2/H3 coerentes, referências utilizadas e válidas por estrutura, destinos internos conhecidos, saída do bloco estruturado, oito testes offline, TypeScript e lint. Permanecem os dois avisos preexistentes de lint em segurança/AdminLayout. Não se reexecutou build com banco nesta entrega de arquivos: nenhum código da aplicação foi alterado, e o build completo foi validado na etapa estrutural anterior.

O Git começou limpo no commit `cd91051`. Nesta fase há somente arquivos novos em `docs/editorial/lote-1/` e `scripts/build-editorial-lote1.ts`. Nenhum arquivo em `src/`, schema, dependência ou conteúdo publicado foi modificado. `.next` não contém os scripts de apoio e continua ignorada. A conferência final por SELECT confirmou identidades, publicação, revisão editorial nula, corpos e descrições dos cinco registros sem mudança.

Resta a avaliação editorial/científica de Weverlyn antes de qualquer publicação. Não se atribuiu nova nota A/B/C/D, certificação de revisão ou promessa de aprovação no AdSense. As prévias e checagens de estrutura não substituem revisão clínica humana nem teste visual do site após uma futura aplicação autorizada.
