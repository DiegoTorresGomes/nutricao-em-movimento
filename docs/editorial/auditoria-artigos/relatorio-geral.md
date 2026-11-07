# Auditoria integral dos artigos — Nutrição & Movimento

**Data:** 7 de novembro de 2026, America/Sao_Paulo. **Escopo:** auditoria, sem correção. **Universo:** 31 registros PUBLISHED, todos em português, conferidos na base efetivamente configurada no projeto e nas respectivas URLs públicas. Não se presumiu que a base era produção: sua correspondência foi confirmada pelo conteúdo HTML integral em 31/31 respostas.

## Resultado principal

Há sinais concretos de baixo valor percebido em parte do conjunto: rastreabilidade científica insuficiente, recorrência do mesmo argumento sem contribuição nova, falhas de revisão de cópia e navegação pouco específica. **Não é um blog sem conteúdo útil**, nem a quantidade de 31 peças explica por si só uma reprovação. Os guias práticos têm valor; o gargalo é tornar a evidência conferível e fazer cada URL cumprir um papel próprio. A causa exata da decisão anterior do AdSense não é conhecida.

| Classe | Quantidade | Interpretação |
| --- | ---: | --- |
| A | 2 | Fortes; manter núcleo sem intervenção relevante |
| B | 13 | Úteis; melhorias específicas |
| C | 15 | Revisão prioritária |
| D | 1 | Candidato a consolidação |

**Média:** 74,7/100. **P1 crítica:** 0; **primeira fila P2:** 16 (15 C e 1 D); **P3:** 13; **P4:** 2. Os dois A podem permanecer sem alteração editorial relevante; manutenção pequena não equivale a reprovar o artigo. Não há recomendação de remoção pura e simples. Há uma proposta de consolidação editorial (#20 com #4), condicionada a validação antes de executar.

## Método e limites

1. Consulta Prisma/MariaDB somente de leitura: todos os registros PUBLISHED, sem limitar à home, cards ou trechos. Foram capturados ID, títulos, slugs, categorias, status, datas, views, description, conteúdo HTML completo, blocos existentes, SEO salvo, palavra-chave, imagens e autoria técnica. Credenciais e dados privados de contas não foram exportados.
2. Leitura integral dos 31 corpos: 604.102 caracteres de texto extraído, além do HTML, headings, links e bibliografia. Texto e blocos foram analisados a partir do campo content, que é o conteúdo renderizado; os blocos não substituíram a peça publicada.
3. GET das 31 URLs oficiais sem navegador/JavaScript: 31 HTTP 200, 31 canonicals iguais às URLs com www e 31 corpos HTML coincidentes com o banco. Não foram chamadas rotas POST de contagem, formulários, newsletter ou publicação. HTML/schema foram lidos; aparência visual de todas as imagens e funcionamento dos CTAs não foram testados.
4. Notas manuais após leitura, nos pesos pedidos: utilidade/intenção 25, profundidade/clareza 20, originalidade 15, E-E-A-T 15, referências 10, leitura 5, links 5 e SEO 5. Vetores estão nas fichas e em avaliacoes.json. Nenhuma regra de palavras, quantidade de headings, links ou DOI foi usada como corte universal.
5. Comparação de intenções no corpus e triagem lexical de todos os 465 pares. Não há Search Console, demanda medida, impressões, posições, backlinks ou análise sistemática de concorrentes. Intenção, potencial de busca e canibalização são inferências editoriais. Originalidade significa contribuição observável, não certificação de ineditismo/plágio externo.
6. Conferência dirigida de fontes primárias (abaixo), sem afirmar revisão sistemática de toda a literatura ou validação clínica de cada frase. Esta auditoria identifica o que a nutricionista deve verificar; não substitui revisão científica pela autora.

O parâmetro A/B/C/D descreve o tipo de intervenção, não uma faixa matemática rígida. Por exemplo, #1 tem bom guia prático, mas precisa resolver uma ausência bibliográfica relevante; #14 pode ser mantido apesar de oportunidades opcionais de navegação. A nota sintetiza julgamento, com incerteza — não é score do Google, garantia de desempenho ou predição de aprovação.

## Referências científicas: principal problema

| Classificação | Artigos |
| --- | ---: |
| FORTE | 2 |
| RAZOÁVEL | 23 |
| FRACA | 4 |
| AUSENTE | 2 |

Os artigos 1 e 3 não têm seção bibliográfica identificável (o 3 cita o Guia no corpo). Os demais têm graus variados de precisão. **Nenhum dos 31 contém link externo para fonte científica/documento de evidência no corpo publicado.** Os poucos externos são PDFs complementares na Cloudinary; instituições mencionadas sem hyperlink não viram links por estarem na bibliografia. Isso dificulta conferência, mas não é uma violação automática nem torna uma fonte falsa.

- Fracas: #2 lista OMS/OPAS/ABESO/PubMed/Appetite sem documentos; #22 fala em ‘Estudos’ e ‘Revisões’ sem identificá-los; #27 cita uma plataforma como autora de revisão; #31 menciona livros incompletos e instituições sem documentos.
- Razoáveis: boa parte identifica Guia Alimentar, Healthy Eating Plate, diretrizes ou um título de revisão, mas mistura essas referências com alusões vagas. Ano e DOI são úteis quando disponíveis; sua ausência não invalida por si só documento inequivocamente identificado.
- Fortes: #14 oferece autores/título/periódico/ano de posicionamentos; #19 identifica revisão e modelo conceitual com dados bibliográficos. A classificação forte da bibliografia não exige que cada item esteja perfeito.
- Código de ética pode apoiar a comunicação profissional, mas não é evidência para mecanismos de fome, metabolismo, redução de ansiedade ou resposta ao treino. A repetição do CFN em quase todos os temas não resolve as lacunas científicas.

### Conferências dirigidas, sem substituir referências

- **#5:** [Reichenberger et al., 2020](https://pubmed.ncbi.nlm.nih.gov/32398186/) é localizável, mas o título no blog é parafraseado. O trabalho discute controvérsias do próprio conceito, uma nuance pouco refletida nas tabelas binárias. Não se concluiu que a referência é inventada.
- **#9:** [Hall e Kahan](https://pubmed.ncbi.nlm.nih.gov/29156185/) é uma referência real sobre manutenção do peso. O corpo do artigo precisa integrar melhor fatores biológicos, comportamentais e ambientais, sem confundir toda restrição com fracasso inevitável.
- **#10/#14/#15/#23:** o [position stand de nutrient timing de 2017](https://pubmed.ncbi.nlm.nih.gov/28919842/) tem Kerksick como primeiro autor; VanDusseldorp é coautora. No #10, a citação inicial está imprecisa. O documento não prova que horário nunca importe.
- **#10/#22:** [Vujović et al., 2022](https://pubmed.ncbi.nlm.nih.gov/36198293/) é exemplo identificável de estudo de alimentação tardia. Investiga mecanismos em população e condições específicas; não autoriza regra universal de cortar carboidrato à noite. A oportunidade é interpretar o estudo, não trocar um slogan por outro.
- **#13:** [Aucoin et al., 2021](https://pubmed.ncbi.nlm.nih.gov/34959972/) é revisão de escopo real. A cautela do artigo sobre lacunas/associações é um mérito; revisão de escopo não deve ser apresentada como prova de cura.
- **#14:** [Thomas, Erdman e Burke, 2016](https://pubmed.ncbi.nlm.nih.gov/26920240/) é o posicionamento efetivamente identificado. Para iniciante, o mérito do texto está em adaptar princípios sem copiar protocolo de atleta como regra universal.
- **#17:** a [revisão de Hensley-Hackett et al.](https://pubmed.ncbi.nlm.nih.gov/36274010/) é localizável, mas o blog traz título abreviado e sem autoria/data. O estudo sobre moralização também tem [título próprio](https://www.sciencedirect.com/science/article/pii/S0195666323025333); ‘ScienceDirect/Appetite’ não basta como referência. Não demonstramos fabricação das fontes.
- **#19:** [Robinson et al., 2013](https://pubmed.ncbi.nlm.nih.gov/23446890/) é identificável. Existe [revisão mais recente sobre distração, de 2026](https://pubmed.ncbi.nlm.nih.gov/41999952/), candidata a comparação na manutenção, sem invalidar automaticamente a de 2013. Fung está duplicado no blog.
- **#28:** o [documento NCCIH](https://www.nccih.nih.gov/health/detoxes-and-cleanses-what-you-need-to-know) sustenta cautela com promessas de detox; seria útil torná-lo acessível e delimitar a alegação.
- **#16/#24:** a [cartilha da Anvisa](https://bibliotecadigital.anvisa.gov.br/jspui/handle/anvisa/225) oferece base para tratar transporte/conservação, hoje pouco explicados nos exemplos de lanche. Não foi prescrita temperatura universal a partir de uma recomendação genérica.
- **#18:** a vigência exata da norma CFN 856/2026 merece conferência. Os endereços oficiais [856](https://sisnormas.cfn.org.br/viewPage.html?id=856) e [858](https://sisnormas.cfn.org.br/viewPage.html?id=858) retornaram 403 ao serviço de leitura. Não concluímos, com base apenas em resumos de terceiros, qual texto está vigente; a pendência é verificar na fonte primária antes de sustentar a afirmação normativa do artigo.

As conferências acima são achados de auditoria. Não foram inseridos links, DOIs ou novas fontes nos artigos.

## E-E-A-T estrutural versus evidência de revisão

31/31 páginas públicas têm link ao perfil canônico, CRN, bloco da autora e BlogPosting. As URLs e o nome completo da autora no schema estão consistentes. Há disclaimer educativo. Os corpos antigos ainda trazem notas genéricas de autora e, em alguns casos, link à página Sobre; isso não cria outra pessoa, mas não demonstra uma revisão científica individual datada.

A confirmação anterior do usuário de que Weverlyn revisa antes de publicar é contexto operacional; não foi convertida em prova de revisão específica de todos os trechos. O modelo não registra responsável/data de revisão científica independentes. Isso é uma oportunidade legítima de transparência, não um campo obrigatório imposto pelo Google.

## Datas: achado técnico que afeta confiança editorial

Os artigos foram publicados entre junho e setembro de 2026. Essa idade, isoladamente, não exige revisão. Há referências antigas ainda pertinentes; priorizar por tema, novas evidências e falta de identificação, não pela idade pura.

No código consultado, Post.updatedAt tem @updatedAt; a rota POST de views usa prisma.post.updateMany para incrementar views; Article/OG/sitemap usam updatedAt para modificação. A [documentação Prisma 7](https://www.prisma.io/docs/orm/v7/prisma-schema/data-model/models) descreve esse comportamento de atualização automática. **Inferência técnica forte:** uma visualização registrada pode atualizar a data de modificação, mesmo sem revisão editorial. Não reproduzimos uma escrita para provar isso em produção e não atribuímos a causa de cada timestamp capturado.

Consequência: updatedAt recente não é prova de atualização científica. Além de alteração substancial, uma data técnica também pode refletir pequenas edições; a política de datas deve separar esses eventos. Futura tarefa deve avaliar data editorial própria e o vínculo com schemas/sitemap; nada foi alterado nesta fase.

## Links internos e relacionados

Foram encontradas **45 ocorrências de links para artigos nos corpos**, sem contar autora/newsletter/menu/cards. No #3, dois links apontam ao mesmo destino com promessa imprecisa de escala. A maioria das peças tem apenas um ou dois destinos contextuais, mas não é a quantidade o problema: faltam ligações naturais como **pré ↔ pós-treino**, **doces/beliscos ↔ lanche** e **prato ↔ alimentação fora de casa**.

17 artigos não recebem link contextual do corpo de outro artigo neste corpus: #5, #7, #12, #15, #16, #17, #18, #19, #20, #21, #22, #23, #24, #25, #28, #29, #30. Não são ‘órfãos do site’: listagem, sitemap e cards podem descobri-los. A distinção é falta de conexão editorial entre textos, não ausência de indexabilidade.

Os relacionados são escolhidos por categoria/data com fallback de recentes, conforme src/lib/posts.ts. Isso explica pré/pós-treino e lanche exibirem detox entre os cards, e #2 recomendar prato/pão/carboidrato em vez de gatilhos/ansiedade. Há afinidade ampla, mas oportunidade de relevância mais fina. As fichas registram os três cards reais de cada página e alternativas concretas.

## SEO on-page e apresentação textual

- Canonical www e BlogPosting presentes em 31/31; não se observou problema sistêmico de canonical.
- #3 tem dois H1 no HTML público: um do template e outro no corpo. #31 põe quase todas as seções em H3 sob um H2 que repete o título; #4 põe subitens de prato no mesmo nível de seções principais. Isso prejudica organização, sem ser prova isolada de reprovação.
- Há 29 artigos com seoTitle/seoDescription preenchidos, mas generateMetadata usa article.title e article.description. A divergência é confirmada pelo HTML público, não só pelo banco. Não é um pedido para mudar o template nesta fase.
- O seoTitle do #24 está duplicado no banco; **não aparece duplicado no title público atual**. O #31 tem description terminada em ‘e com’, defeito do texto salvo, não truncamento automático do Google.
- Alts existem nas capas e nas imagens de corpo coletadas; alguns são promocionais ou incompletos (#1, #4, #8, #29, #31). Não avaliamos correspondência visual de cada foto. Ausência de imagem no corpo de muitos artigos não é problema por si só.
- Slugs são descritivos embora longos em vários casos. Nenhuma mudança de slug ou remoção de URL foi recomendada só por tamanho. Title/H1 claros não compensam bibliografia vaga nem falta de contribuição própria.

## Grupos derivados do conteúdo real

Os grupos abaixo são leitura temática, não alterações das categorias do banco nem criação de clusters/páginas-pilar.

- **Atenção e relação com a comida:** #1, #3, #17, #19.
- **Emoções e gatilhos:** #2, #5, #6, #7, #13, #22, #31.
- **Manejo do peso e constância:** #4, #8, #9, #18, #20, #27.
- **Horários e alimentos isolados:** #10, #11.
- **Refeições e cotidiano:** #12, #16, #24, #25.
- **Alimentação em torno do exercício:** #14, #15, #23.
- **Movimento e início da prática:** #21, #26, #29.
- **Detox e promessas de limpeza:** #28.
- **Saúde mental e alimentação:** #30.

Possibilidades futuras, condicionadas à revisão: guia conceitual de atenção (#1) com aplicação (#19); guia de manejo do peso (#4) com apoio de saciedade/déficit/retomada; par pré/pós (#14/#15) com disposição como recorte próprio; refeições práticas conectadas ao prato (#12). Detox e saúde mental não devem ser forçados a uma categoria de emagrecimento. Nenhuma dessas páginas novas foi criada.

## Diagnóstico geral — respostas diretas

1. **Há sinais de baixo valor?** Sim, em parte do corpus; há também peças úteis e aplicáveis.
2. **Problema principal:** rastreabilidade e adequação das evidências, seguidas por diferenciação e revisão de cópia. Organização/linkagem e uma consolidação provável são secundárias. Quantidade não foi identificada como causa. Autoridade estrutural melhorou, mas não substitui evidência por artigo.
3. **A:** 2. 4. **B:** 13. 5. **C:** 15. 6. **D:** 1.
7. **Revisão imediata:** 16 na primeira fila editorial P2; 0 P1 crítico identificado neste escopo.
8. **Podem permanecer sem intervenção relevante:** 2 (14 e 19).
9. **Remover?** Nenhum artigo tem base suficiente para recomendar remoção pura. Não confundir revisão prioritária com conteúdo descartável.
10. **Consolidar?** Preferência editorial por #20 com #4, sem execução e sem determinar redirect antes de dados de busca/links.

## Impacto potencial no AdSense

Esta é uma avaliação de percepção editorial, não uma leitura do processo interno do Google. As [políticas de inventário do Google](https://support.google.com/adsense/answer/10502938?hl=en) vedam anúncios em telas sem conteúdo do editor ou com conteúdo de baixo valor. Isso não estabelece meta de artigos, palavras, DOI ou links. A [orientação people-first do Search](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) valoriza utilidade e confiança, com maior atenção a saúde; não é uma fórmula de aprovação do AdSense.

**ALTO IMPACTO potencial:** evidências vagas em saúde; prometer ‘baseado em ciência’ sem permitir identificar documentos; respostas que repetem guias existentes sem nova utilidade; cópia incompleta/duplicada que sugere revisão insuficiente.

**MÉDIO IMPACTO potencial:** navegação contextual fraca, relacionados amplos, âncoras enganosas da escala, dataModified possivelmente técnico e falta de delimitação clara entre conteúdos próximos. Não são violações automaticamente demonstradas.

**BAIXO IMPACTO isolado:** pequenos erros de grafia, caixa alta, títulos longos, tamanho do texto, ausência de CTA comercial ou um mesmo disclaimer em várias páginas. H1/metadata/alt merecem revisão, mas corrigi-los sozinhos não resolve o valor editorial.

Não prometemos aprovação, prazo ou aumento de tráfego; não atribuímos plágio, penalidade ou conteúdo produzido por IA com base em estilo. Não foi aberta nova solicitação de AdSense.

## Entregas e integridade

- [Matriz e 31 fichas individuais](./matriz-artigos.md).
- [Comparação de sobreposição e canibalização](./canibalizacao.md).
- [Top 10, Top 5 e plano de prioridades](./plano-prioridades.md).
- [Snapshot integral e indicadores](./dados.json): apenas conteúdo publicado e metadados necessários; hashes SHA-256 permitem comparar a captura sem chamar contadores.
- [Julgamentos editoriais explícitos](./avaliacoes.json): 31 avaliações manuais e vetores de nota.
- Scripts reutilizáveis: scripts/audit-published-articles.mjs (inventário de leitura, opção --verify-live) e scripts/render-article-audit.mjs (formatação dos relatórios e validação das somas). Nenhum script foi criado em .next. Reexportar dados.json substitui a captura; guardar a captura aprovada antes de nova auditoria.

**Nenhum artigo, título, slug, dado no banco, schema, metadata, componente, CSS, rota, imagem, redirect, sitemap ou configuração foi alterado.** Só foram criados relatórios neste diretório e dois scripts de apoio em scripts/. Não foram executados build da aplicação, migração, seed, commit, push, publicação ou deploy. As recomendações permanecem não executadas.
