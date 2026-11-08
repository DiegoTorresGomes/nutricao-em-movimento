# Análise de consolidação — emagrecimento sustentável

**Atualização de 08/11/2026:** a aprovação de Weverlyn foi recebida. Código e consolidação em banco descartável foram validados, incluindo build completo e 301. **A aplicação no banco remoto está pendente:** A ainda responde 200 no site hospedado, e deploy permanece proibido. O estado atual, snapshots, testes e impedimento estão em [relatorio-final.md](relatorio-final.md). As seções de proposta/análise abaixo registram as etapas anteriores; não significam publicação concluída.

**RECOMENDAÇÃO: consolidar A em B, em uma fase futura autorizada.**

**CONFIANÇA: Média.**

**MOTIVO PRINCIPAL:** os dois artigos entregam um guia geral de emagrecimento sustentável com praticamente os mesmos eixos. O guia B oferece mais decisões práticas e já recebe ligações contextuais; as contribuições específicas de A cabem em uma seção sobre ambiente e constância em B. A conclusão é editorial: faltam dados de desempenho e backlinks externos para estimar o risco orgânico de descontinuar A.

Análise em 7 de novembro de 2026. Captura atual em `evidencias.json`, com horário UTC. **Nenhuma consolidação foi executada.**

## Identificação e método

**A — Emagrecimento sustentável: hábitos que importam mais que força de vontade** (#20 da auditoria).

https://www.nutricaoemovimento.com/pt/artigos/emagrecimento-sustentavel-habitos-que-importam-mais-que-forca-de-vontade

**B — Emagrecimento sustentável: como cuidar do corpo com equilíbrio, nutrição e movimento** (#4 da auditoria).

https://www.nutricaoemovimento.com/pt/artigos/emagrecimento-sustentavel-como-cuidar-do-corpo-com-equilibrio-nutricao-e-movimento

O título abreviado do pedido corresponde exatamente a A; não se encontrou outro artigo com o título abreviado. B é o destino nominal citado em `auditoria-artigos/canibalizacao.md`. IDs, datas, contadores, categoria, excerpt, SEO salvo/publicado, referências, links, CTA e relacionados estão no [comparativo](comparativo.md). Os corpos integrais estão nas cópias de análise [A](artigo-a-conteudo.html) e [B](artigo-b-conteudo.html), acompanhadas das leituras em texto simples. Não se analisaram apenas excerpts.

Foram consultados os quatro relatórios obrigatórios da auditoria — relatório geral, matriz (inventário e fichas dos dois artigos), canibalização e prioridades — e os documentos da revisão do Lote 1. A análise atual compara os textos completos, e não herda automaticamente a classe D. Consulta Prisma somente `findMany`: inventário dos 31 publicados, dados completos dos dois e links dos corpos. HTTP GET de todos os 31 artigos, sitemap, feed, robots, home, listagem, filtro de categoria e perfil da autora. Sem execução de JavaScript, contador de views, submissão de formulário ou autenticação no CMS.

Os dois corpos armazenados permanecem iguais aos da auditoria. Os dois HTML públicos contêm o corpo integral após a normalização de hyperlinks internos que o template já executa (`src/lib/editor/article-body.ts`): URLs absolutas do próprio domínio viram caminhos relativos. O teste de igualdade bruta é falso por essa transformação; o teste com essa normalização é verdadeiro em ambos. Isso não é divergência editorial nem edição feita nesta fase. As duas leituras finais de banco coincidem com as iniciais, inclusive views e timestamps.

O padrão do Lote 1 informa o plano futuro: hierarquia H2/H3, referências identificáveis ligadas à alegação, limites das afirmações de saúde, autoria profissional, CTA proporcional e separação entre publicação e revisão. **Esse padrão não foi aplicado silenciosamente a A ou B.** Os cards continuam automáticos; não se presume suporte a curadoria manual.

## Intenção de busca e jornada

| Aspecto | A | B |
| --- | --- | --- |
| Intenção principal observada | Entender como emagrecer de forma sustentável por hábitos, sem depender só de motivação | Entender emagrecimento sustentável e começar com alimentação, movimento e rotina |
| Query provável, não medida | emagrecimento sustentável hábitos; emagrecer sem força de vontade | emagrecimento sustentável; como emagrecer com equilíbrio |
| Problema do leitor | Começa mudanças, cansa e acredita que lhe falta disciplina | Quer iniciar um cuidado possível, sem restrições extremas |
| Resposta entregue | Sete eixos de hábitos: refeições, flexibilidade, ambiente, sinais, movimento, sono e metas | Guia geral com prato, primeiros passos, comportamento, movimento, acompanhamento e sinais de evolução |
| Jornada | Descoberta/consideração; início da mudança | Descoberta/consideração; primeiros passos |

**Relação: C — forte sobreposição.** A promessa de A admite uma busca comportamental distinta, por isso não se escolhe D (essencialmente a mesma intenção) sem ressalva. Porém, a maior parte do corpo volta à mesma tarefa do guia B. A não apresenta um método próprio de formação de hábitos com gatilho, ação mínima, barreira, acompanhamento e ajuste; suas metas são exemplos gerais já semelhantes aos de B.

## Sobreposição semântica: ALTA

O [comparativo seção por seção](comparativo.md) mostra definições, restrição/tudo ou nada, prato brasileiro, consciência alimentar, movimento sem punição, sono/estresse, metas pequenas e conclusão compartilhados. A repetição é de raciocínio, exemplos e decisão oferecida. Não se calculou um percentual de redundância a partir de palavras iguais, nem se atribuiu plágio.

Arroz/feijão/proteína/vegetais, caminhadas curtas, preparar alimentos, água visível, flexibilidade social e retomada sem culpa reaparecem. As conclusões reiteram alimentação, movimento, sono, individualização e constância. O FAQ retoma as mesmas perguntas sobre definição, carboidratos, doces, exercício e rigidez. Referências coincidem em Guia Alimentar e Código de Ética; documentos de atividade física da OMS têm finalidade próxima, mas títulos diferentes. Os destinos contextuais dos corpos são distintos: **zero links para artigos duplicados entre A e B**. O CTA `/pt#newsletter` é comum, assim como os cards de retomada (#27) e déficit (#18). Esse boilerplate legítimo não fundamenta a decisão de consolidar.

## Valor único: o que cada um acrescenta

**A oferece a B:** uma explicação mais direta de por que motivação oscila; uma seção dedicada a organizar o ambiente; sequência explícita de pequenas metas; ressalva clara de que dormir melhor não emagrece automaticamente. O ganho real é de enquadramento e organização: B já menciona preparações prévias, compras, água próxima, começar pequeno e força de vontade. Não há em A estudo de caso próprio, ferramenta de hábito ou decisão exclusiva suficiente para sustentar hoje outro guia geral. **O valor único atual é insuficiente para manter duas URLs com esse escopo.** Isso não significa que A seja inútil ou deva ser apagado sem preservação.

**B oferece a A:** composição de refeições mais detalhada, exemplos da primeira refeição, lanches, hidratação, relação com a balança, sinais de progresso além do peso, situações de individualização e material complementar em PDF. Há mais profundidade e decisões práticas, embora nem todas sejam originais no restante do site. O PDF é um recurso exclusivo linkado nesta dupla; seu conteúdo interno não foi auditado e não se presume valor clínico por existir.

**Diferenças de redação:** “hábitos possíveis” versus “constância”, “movimento sem punição” versus autocuidado, conclusões de acolhimento. Não criam por si só uma tarefa nova. **Diferenças de abordagem:** A organiza em sete hábitos e motivação; B organiza um panorama de cuidado. **Diferenças de profundidade:** B desenvolve prato e acompanhamento; A destaca ambiente, mas com exemplos parcialmente já presentes em B.

## Qualidade atual e escolha da URL

Reavaliação atual: **A 69/100; B 73/100**, com fundamentos e pesos no comparativo. Converge com a auditoria anterior porque os textos permanecem iguais e os problemas centrais persistem; a classificação D não foi usada como desconto automático. Consolidar não é consequência de nota baixa: dois artigos bons também poderiam cumprir uma tarefa repetida.

B é o destino editorial preferível porque abrange a intenção de ambos, tem mais instrumentos práticos, recebe quatro links contextuais distintos e já funciona como guia geral. Seu título e slug descrevem esse papel, apesar de longos. A tem slug igualmente válido, mas centrado em uma abordagem comportamental que o conteúdo atual não desenvolve suficientemente. B foi publicado antes (22/06, contra 29/07) e tem 388 views contra 11; são indícios auxiliares de histórico de uso. Antiguidade e contador não equivalem a autoridade, demanda ou tráfego orgânico. Não se propõe encurtar slug nem zerar/transferir views.

## Verificação pública, indexação e Search Console

As 31 páginas consultadas responderam 200. Para A e B: canonical autorreferente com www, meta robots `index, follow`, nenhum X-Robots-Tag restritivo observado; robots.txt permite as rotas públicas. Ambos constam no sitemap e no feed. BlogPosting aponta para Weverlyn da Cruz Alves Torres e perfil canônico; dataModified usa a publicação original enquanto editorialUpdatedAt é null. Não se usa updatedAt técnico como prova de revisão humana.

A busca pública pelos slugs devolveu os dois artigos, incluindo uma variante sem www para A. Isso demonstra presença no índice do serviço de busca consultado, **não confirma cobertura atual do Google, posição ou tráfego**. A URL oficial preservada no plano é com www; não se infere erro de canonical pela variante do resultado. Consultas registradas em [busca-publica.json](busca-publica.json).

**Sem dados de queries/impressões/cliques, competição orgânica permanece hipótese.** Não houve acesso ao Search Console, inspeção de URL do Google, analytics segmentado, logs de busca ou inventário de backlinks externos. Há redundância/canibalização editorial observável; não há canibalização orgânica comprovada. Um plano de consolidação faz sentido pela arquitetura e utilidade mesmo sem promessa de ganho de ranking. Antes de executar, conferir se A atende queries ou recebe links externos de intenção específica que devam mudar o escopo do destino.

## Quatro cenários revalidados

| Cenário | Ajustes necessários e ganho | Riscos / julgamento |
| --- | --- | --- |
| A — manter os dois | B ficaria como guia; A precisaria excluir a recapitulação de prato/movimento/sono e responder à dificuldade de manter um hábito, com ferramentas próprias. Vantagem: preserva uma busca comportamental potencial e duas URLs. | Manter como estão conserva a redundância. Diferenciá-los de verdade demanda nova revisão e validação científica; equivale na prática ao cenário D. Não recomendado no estado atual. |
| B — consolidar A em B | Incorporar enquadramento de motivação, organização do ambiente, metas e limites em B; deduplicar o restante. A receberia 301 para B numa fase futura. | Melhor custo editorial e guia mais claro. Risco de diluir a pergunta comportamental e de oscilações orgânicas; manter essa resposta visível no destino e verificar dados antes. **Recomendado.** |
| C — consolidar B em A | Levar de B o prato, exemplos, sinais de evolução, cautelas e PDF a A; B receberia 301 para A. | Sem impedimento semântico absoluto, mas A viraria um guia amplo sob título/slug de hábitos, substituiria a URL que recebe quatro ligações contextuais e não há evidência externa de vantagem. Mais trabalho e perda de clareza sem ganho demonstrado. |
| D — reposicionar A | Criar recorte “como manter mudanças na rotina quando a motivação cai”: reconhecer barreira, escolher ação mínima e contexto, revisar execução e retomar após imprevistos; encaminhar a B para emagrecimento geral. | Faz sentido como supporting article comportamental, se Weverlyn quiser produzir essa contribuição e fontes específicas. Hoje seria quase uma nova peça; também deve diferir de #27, já dedicado à retomada. Alternativa legítima, porém menos econômica que aproveitar os trechos úteis em B. |

## Cluster e riscos

No futuro cluster **Emagrecimento sustentável**, B é candidato a **pillar/guia introdutório prático**; não é chamado de pillar já implantado. A hoje é outro guia geral redundante, com enquadramento comportamental. Na recomendação, seu valor entra na seção comportamental de B e A deixa de ser um nó publicado. Só no cenário D A seria um supporting article de formação de hábitos.

Papéis possíveis dos vizinhos: #8 saciedade; #9 restrição; #18 déficit; #21 movimento além da queima calórica; #27 retomada. O guia B deve resumir e encaminhar a esses recortes, sem reproduzi-los integralmente. #26, revisado no Lote 1, integra alimentação e movimento para saúde geral; não deve ser convertido em sinônimo de emagrecimento ou incorporado por afinidade temática.

O 301 A → B seria semanticamente coerente **após** B incorporar a resposta sobre motivação e ambiente. Sem isso, o usuário que busca força de vontade pode não reconhecer sua necessidade no destino. O risco técnico inclui redirecionamento temporário por engano, cadeias, autorreferência nos cards, A ainda publicado em listagens/feed/sitemap e cache remoto antigo. O risco editorial inclui guia inflado, perda da pergunta comportamental e bibliografia transferida sem conferir pertinência. O risco orgânico é de magnitude desconhecida: não se promete manutenção imediata de posição ou aumento de cliques.

O [plano de consolidação](plano-consolidacao.md) cobre preservação e descarte justificado de cada conjunto, headings, links, referências, CTA, cards, 301, canonical, sitemap, feed, schema e histórico. **É somente um plano.**

## Entregas e integridade

Criados neste diretório: este relatório, comparativo.md, plano-consolidacao.md, evidencias.json, busca-publica.json, duas cópias HTML integrais e duas leituras TXT. Scripts: `scripts/analyze-consolidacao-emagrecimento.mjs` (captura somente leitura) e `scripts/report-consolidacao-emagrecimento.mjs` (formatação offline do anexo). As cópias são documentação de análise, não novas versões propostas para publicação.

Nenhum artigo, banco, slug, metadata, link, redirect, sitemap, feed, schema ou configuração foi alterado. Nenhuma publicação, commit, push ou deploy. Não se executou build/testes da aplicação porque não houve alteração de aplicação. Foram conferidos hashes, leituras finais, normalização pública dos corpos, inventário de ligações e consistência dos documentos. Nenhum script foi colocado em `.next`.

Base técnica do plano futuro: [Google Search Central — mudanças de URL](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes), consultada em 07/11/2026; orienta mapear destinos relevantes, atualizar ligações/canonicals e acompanhar a migração. A recomendação editorial específica desta dupla resulta da leitura do projeto.

## Versão consolidada preparada para revisão humana

**Nova etapa documental em 07/11/2026:** criada a [versão consolidada de B](versao-consolidada.md), preservando seu título e slug como destino futuro. É uma redação coesa, ainda **não aprovada por Weverlyn e não publicada**, com metadata apenas sugerida. A decisão anterior de consolidar A em B foi mantida como orientação editorial, sem executar o plano técnico.

O corpo proposto tem **1.636 palavras, sem a bibliografia**, com uma definição, uma conclusão e sem FAQ repetindo as respostas do corpo. Não é a soma dos textos originais. A profundidade vem da explicação de manutenção/balanço dinâmico, de uma meta com contexto/alternativa/avaliação e da distinção entre viabilidade de rotina e resultado clínico, sem oferecer cardápio ou treino individual.

**Conteúdo absorvido de A:** motivação variável; ambiente como apoio ou obstáculo; metas específicas e pequenas; repetição contextualizada; adaptação a imprevistos e limite da afirmação sobre sono. Tudo se mantém subordinado ao guia geral de alimentação, movimento e acompanhamento de B. A presença de restrição alimentar, emoção e fome foi reescrita sem testes binários ou causalidade universal.

**Conteúdo removido ou substituído na proposta:** introduções, definições, conclusões e FAQs equivalentes; listas repetidas de alimentos/modalidades; frases genéricas sobre perfeição; explicação simplificada de sono e desejo por doces; fontes de ética/antes e depois e PNAN sem papel específico no corpo final. Não se declarou essas fontes inválidas. Relatos genéricos em primeira pessoa sobre consultório não foram atribuídos à autora. Os originais continuam preservados integralmente.

O PDF de B e a promessa de newsletter semanal ficaram fora desta proposta por falta de revisão de conteúdo/adequação e de confirmação operacional, respectivamente; não foram retirados do site. O [mapeamento](mapeamento-consolidacao.md) informa o destino de todos os conjuntos úteis de A e B, inclusive o recurso complementar que permanece como decisão explícita para a revisora.

### Reauditoria estimada da proposta

| Versão | Nota |
| --- | ---: |
| A atual, sem alteração | 69/100 |
| B atual, sem alteração | 73/100 |
| Proposta consolidada, não publicada | **83/100 estimados** |

Mesmos oito pesos da auditoria; profundidade/clareza agrupadas, estrutura avaliada em leitura. As notas abaixo são julgamentos manuais documentados, sem fórmula de palavras/fontes ou garantia de desempenho.

| Dimensão | Máximo | Proposta | Fundamentação e limite |
| --- | ---: | ---: | --- |
| Utilidade/intenção | 25 | 23 | Responde à visão geral e à pergunta de A; oferece começo e avaliação do ajuste. Não individualiza indicação de emagrecimento nem tratamento. |
| Profundidade/clareza | 20 | 17 | Inclui balanço dinâmico, manutenção, ambiente, meta testável e encaminhamento. Não pretende esgotar manejo clínico, sono ou comportamento. |
| Originalidade | 15 | 10 | A contribuição é o percurso de decisão coeso e o exemplo de adaptar o almoço; não há pesquisa própria, caso clínico ou ineditismo externo demonstrado. |
| E-E-A-T | 15 | 12 | Autoria prevista, limites e fontes rastreáveis; **a nova revisão humana ainda está pendente**, sem falsa assinatura de aprovação ou experiência pessoal inventada. |
| Referências | 10 | 8 | Sete fontes identificadas, com suporte/limites; inclui revisão sistemática, diretriz, documentos oficiais e ensaio. Ainda há revisão narrativa e extrapolação educativa dos exemplos, que exigem avaliação profissional. |
| Leitura/estrutura | 5 | 5 | Um H1 documental, corpo sem H1, H2/H3 coerentes, conclusão única; sem duplicar FAQ e síntese. Nota da estrutura Markdown, não de layout validado no site. |
| Links internos | 5 | 4 | Quatro leituras específicas e um CTA; não há sequência excessiva de links. Alguns destinos antigos ainda têm pendências editoriais e cards não são controlados pela proposta. |
| SEO on-page | 5 | 4 | Título/intenção/slug preservados, metadata coerente e semântica alinhada. Ainda não aplicado nem renderizado: não comprova resultado real de canonical, imagens, schema ou snippet. |
| **Total** | **100** | **83** | **Estimativa editorial de manuscrito, não nota de uma página implantada.** |

O ganho de dez pontos sobre B decorre principalmente de referências verificáveis, hierarquia mais clara, percurso de leitura e diferenciação/integração do conteúdo. A nota não chega a A por presunção de qualidade: restam revisão científica humana, limites da evidência comportamental, ausência de contribuição empírica própria e validação futura da página. Nenhuma nota de A/B foi alterada para ampliar artificialmente a diferença.

### Referências, links e metadata propostos

**Sete referências:** Hall/Kahan (2018), NIDDK (revisão 2023), Singh et al. (2024), Guia Alimentar (2014), OMS (2020), Tasali et al. (2022) e NIMH (revisão 2024). Bibliografia completa, correspondência com afirmações e limites em [referencias-consolidadas.md](referencias-consolidadas.md). Não se vende mecanismo de hábito como garantia de peso nem um ensaio curto de sono como resultado sustentado.

Quatro links contextuais sugeridos: prato equilibrado (#12), fomes (#31), papel dos exercícios (#21) e relação com a comida (#3); **um CTA de contato**. Déficit é explicado de forma introdutória no texto, sem encaminhamento automático ao #18 ainda pendente de revisão. Não se acrescentaram todos os destinos tematicamente próximos para atingir quantidade. Relacionados sugeridos: saciedade (#8), retomada (#27) e déficit (#18, condicionado à revisão). São sugestões editoriais; CMS/card publicado não foi alterado.

- Meta description sugerida, 144 caracteres: “Entenda o emagrecimento sustentável e como começar com alimentação, movimento, pequenas metas e uma rotina possível, sem promessas de resultado.”
- Excerpt sugerido, 131 caracteres: “Um guia para organizar alimentação, movimento e rotina, com pequenas metas e espaço para ajustes, sem depender apenas de motivação.”

**Adequação futura do 301: SIM, semanticamente.** O usuário que buscava A encontra as respostas úteis sobre força de vontade, ambiente e continuidade, sem perder a tarefa geral de B. Essa confirmação se refere à proposta completa após revisão e futura publicação, não ao guia B atual, que ainda não recebeu o novo texto. Não é prova de transferência de tráfego ou competição orgânica; Search Console/backlinks seguem ausentes.

### Riscos, validação e estado da entrega

Weverlyn precisa revisar a precisão científica, a indicação de manejo do peso ao público do blog, os exemplos e o CTA. O PDF original pede decisão explícita; relacionados antigos podem precisar de revisão; uma implementação futura deve conferir cache hospedado, datas, cards e preservação do histórico. A revisão anterior do Lote 1 não aprova automaticamente esta nova redação.

Conferência apenas documental e HTTP GET: identidade dos originais/cópias, sete referências numeradas e citadas, hierarquia, quantidade de links, metadata e URLs. Evidência em [verificacao-proposta.json](verificacao-proposta.json), que distingue acesso direto de verificação do conteúdo científico. Não foi necessário executar build, testes de aplicação, actions, migração ou conexão ao banco nesta etapa.

Criados nesta etapa: `versao-consolidada.md`, `mapeamento-consolidacao.md`, `referencias-consolidadas.md` e `verificacao-proposta.json`. Atualizado apenas este relatório para registrar a proposta. Os dois scripts da fase anterior não foram alterados ou executados nesta fase.

**Nenhum artigo publicado, banco, status, metadata real, slug, link, related, redirect, sitemap, feed, schema ou data foi alterado. Nenhum commit, push ou deploy.** A entrega termina na documentação pronta para avaliação humana; não executar a etapa posterior automaticamente.
