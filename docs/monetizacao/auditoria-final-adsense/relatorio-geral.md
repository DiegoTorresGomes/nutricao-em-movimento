# Auditoria final de prontidão para reenvio ao AdSense

## Atualização: correção local de B1

**GO PARA SEARCH CONSOLE após implantação autorizada e conferência pública desta correção.** A newsletter foi temporariamente desabilitada na interface e no servidor, mantendo arquitetura e cadastros. Promessas, formulário, estados falsos e cards promocionais deixam de ser exibidos no build corrigido; Privacidade e Termos refletem a pausa. Artigos salvos e banco editorial preservados. Detalhes, inventário anterior às alterações, evidências e limites em [newsletter-correcao.md](newsletter-correcao.md).

**B1: resolvido localmente; publicação pendente.** Não houve commit, push ou deploy. A produção continua sujeita à observação da auditoria anterior até a publicação e revalidação. O score histórico **82/100, AMARELO** permanece sem recálculo. As seções abaixo registram a auditoria original e seus critérios; sua decisão NO-GO descreve aquele estado de produção, não uma falha remanescente do código corrigido.

---

08/11/2026. Site auditado: **https://www.nutricaoemovimento.com**. Estado editorial e técnico observado em produção, com evidências capturadas nesta execução.

**82/100 — AMARELO — NO-GO temporário.** A liberação desta etapa fica retida pela inconsistência da newsletter: a interface oferece entrega e afirma envio de confirmação, enquanto as políticas públicas negam a integração e o adaptador local é no-op. É um critério de confiança desta auditoria, não uma regra Google de que newsletter seja obrigatória. A entrega real em caixa postal não foi testada. Critério de saída em [bloqueadores.md](bloqueadores.md).

**Os quatro C não impedem isoladamente o reenvio.** Não é necessário corrigir todos os artigos, criar Lote 3 ou atingir perfeição. O motivo anterior “conteúdo de baixo valor” foi materialmente mitigado; o acervo atual não parece predominantemente superficial ou repetitivo. A decisão sobre o site ainda não equivale a aprovação Google, nem substitui Search Console e a conferência humana da conta.

## 1. Método, baseline e limites

Foram catalogados os 36 Markdown dos nove diretórios indicados pelo usuário, com caminhos, cabeçalhos e hashes em [baseline-documental.json](baseline-documental.json). Relatórios de resultado, critérios, comparativos e avaliações foram usados como baseline; observações antigas não foram automaticamente tratadas como fatos atuais.

A auditoria pública fez GET/HEAD dos **30 artigos publicados**, páginas institucionais, saídas técnicas, destinos internos, imagens e bundles. Não executou JavaScript de artigos, contador, formulários, newsletter ou cron. Os 30 corpos públicos coincidem integralmente com os registros atuais após a normalização já usada pelo template. A amostragem editorial abrange introduções, hierarquia, contextos clínicos e referências dos 30; os quatro C foram lidos integralmente. Isso não é nova revisão clínica independente, revisão sistemática da literatura, teste externo de plágio ou reavaliação numérica integral dos 30.

Foi consultada a orientação oficial sobre [prontidão AdSense](https://support.google.com/adsense/answer/12176698?hl=en), [valor do conteúdo](https://support.google.com/publisherpolicies/answer/11112688?hl=en), [conteúdo confiável/YMYL](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [conexão do site](https://support.google.com/adsense/answer/7584263?hl=en) e [CMP regional](https://support.google.com/adsense/answer/13554116?hl=en). As notas A/B/C/D e o scorecard são instrumentos internos, não classificações do Google.

O browser access host está indisponível. Não houve inspeção visual ou teste interativo atual de consentimento. PageSpeed mobile e desktop retornaram 429 por quota: LCP, INP e CLS permanecem **não medidos**, sem nota de Lighthouse inventada. Foram examinados HTML/bundles publicados e código, e os 16 testes locais de consentimento com mocks passaram; isso não comprova cliques/cookies/requisições reais em produção.

## 2. Resultado editorial e motivo anterior da reprovação

Distribuição atual: **30 publicados — 3 A, 23 B, 4 C, 0 D; 1 arquivado.** A média editorial comparável permanece **81,2/100**, calculada anteriormente com os mesmos pesos e as últimas avaliações conhecidas; ela não foi confundida com este scorecard de prontidão.

| Artigo do Lote 2 | Nota/classe vigente |
| --- | --- |
| Saúde mental / Setembro Amarelo | 85/B |
| Comer à noite | 86/B |
| Déficit calórico | 84/B |
| Dietas restritivas | 84/B |
| Comer por emoção | 85/B |
| Alimentação consciente | 87/B |

As revisões publicadas melhoraram perguntas de leitura, exemplos, limites, distinção entre associação e intervenção, encaminhamento profissional e rastreabilidade. O conjunto oferece guias práticos diferentes e conteúdos substanciais em comportamento alimentar, refeições/rotina, manejo de peso e exercício. O volume de 30 URLs, sozinho, não determina elegibilidade; tampouco se exige conteúdo extenso por contagem de palavras.

A comparação de parágrafos normalizados com pelo menos 120 caracteres encontrou somente dois textos repetidos literalmente entre artigos: nota genérica da autora e aviso educativo. Não foram encontrados corpos inteiros duplicados. Isso não prova originalidade externa nem elimina repetição semântica: vários legados ainda repetem linguagem de acolhimento, FAQ, introduções e conselhos gerais.

**Leitura como reviewer:** o site parece um projeto editorial real de uma profissional identificada, com propósito, acervo e navegação visíveis. Não parece uma sequência de telas vazias construída apenas para encaixar anúncios. Há linguagem genérica de marca e captação por newsletter, mas a publicidade está pausada e não domina o conteúdo. O problema de confiança da newsletter precisa de tratamento proporcional; não invalida o ganho editorial dos lotes.

## 3. Avaliação integral dos quatro C

As notas anteriores foram mantidas após a releitura, porque os corpos e as limitações centrais permanecem iguais. As classes indicam necessidade de manutenção, não infração.

| Artigo | Nota | Valor próprio | Evidências | YMYL | Raso | Sobreposição | AdSense |
| --- | ---: | --- | --- | --- | --- | --- | --- |
| #17 Alimentos bons ou ruins | 74/C | Exemplos de linguagem e distinção entre composição nutricional e valor moral | Guia/OMS identificáveis; pesquisas parafraseadas e referências incompletas | MÉDIO | MÉDIO | MÉDIO | MÉDIO |
| #23 Disposição para treinar | 73/C | Energia, hidratação, conforto digestivo, sono e sinais para avaliação | ISSN real; identificação incompleta e generalização para rotina recreativa | BAIXO | MÉDIO | ALTO | MÉDIO |
| #27 Recaídas no emagrecimento | 74/C | Retomada, refeições âncora, metas e desestímulo à compensação | Revisão real sobre reganho, citada como ScienceDirect; faltam autores/ano/DOI | MÉDIO | MÉDIO | MÉDIO | MÉDIO |
| #7 Beliscar o dia todo | 75/C | Observação de contexto, lanche planejado e organização de refeições/ambiente | Guia identificável; instituições genéricas não sustentam cada alegação comportamental | MÉDIO | BAIXO | MÉDIO | BAIXO |

**#17:** a relação entre proibição, culpa e comportamento aparece com causalidade excessivamente simplificada. As categorias “base/complemento/eventuais” são uma adaptação sem fundamentação explícita. A referência sobre moralização é localizável como [Jackson et al., Appetite, 2023](https://pubmed.ncbi.nlm.nih.gov/37788734/), um estudo exploratório, não prova universal de que determinada linguagem cause sintomas. Não foi demonstrado que a fonte seja inventada.

**#23:** a referência a [Kerksick et al., ISSN 2017](https://pmc.ncbi.nlm.nih.gov/articles/PMC5596471/) é real. O texto perde diferenciação ao repetir o que comer antes e depois do treino, assuntos de #14/#15. Ao mesmo tempo, não impõe jejum, suplemento ou número universal; reconhece sintomas e condições que exigem avaliação. O risco principal é contribuição própria, não uma prescrição arriscada identificada.

**#27:** a fonte citada sem autoria é localizável: [Machado et al., 2022, DOI 10.1016/j.clnesp.2022.03.020](https://pubmed.ncbi.nlm.nih.gov/35623805/). Ela trata de reganho após intervenção; isso não valida automaticamente todas as explicações sobre um lapso cotidiano. A frase que associa fracasso a desistir do cuidado contradiz o tom acolhedor. O corpo oferece ferramentas úteis e encaminha sofrimento, sem garantia de perda de peso. A atualidade de referências normativas genéricas CFN/ABESO não foi certificada.

**#7:** mantém duplicação literal de frase, subtítulo ausente na sequência de nutrientes e uso pouco delimitado de “compulsão”. O registro de fome/emoção não é instrumento validado e merece melhor contextualização. Há valor prático, não se exige comer a cada três horas, a FAQ diz que água não deve substituir alimento quando há fome e existe encaminhamento quando há sofrimento.

**Resposta objetiva: NÃO, MAS… os quatro C não impedem isoladamente o reenvio.** Merecem manutenção, com prioridade para referências/recorte de #17/#23/#27. Não há evidência de risco alto de AdSense em todo o conjunto decorrente dessas quatro URLs. Não foram removidos, editados ou reunidos em novo lote. Detalhes: [quatro-c.json](quatro-c.json).

## 4. YMYL, referências e canibalização

A amostragem dos 30 encontrou orientação educativa, ressalvas e encaminhamento; não identificou um padrão material de cura alimentar, suspensão de tratamento, dosagem universal ou diagnóstico pela leitura. Há absolutismos locais e terminologia clínica pouco delimitada nos legados, por exemplo “compulsão”, que continuam como manutenção. Isso não é atestado de segurança clínica de cada frase.

As referências dos lotes e da consolidação são mais rastreáveis; parte dos B legados e dos C ainda usa instituições, plataformas ou títulos parafraseados. Não se pode declarar que todas as citações do acervo estejam completas ou perfeitamente correspondentes a cada alegação. As fontes específicas investigadas nos C são reais, mas fonte vaga não é evidência suficiente para causalidade. Não houve comprovação de referência fabricada nesses quatro; também não se certifica ausência absoluta de erro em toda a bibliografia.

| Cluster | Separação observada | Limite residual |
| --- | --- | --- |
| Fome física/emocional, comer por emoção, ansiedade, gatilhos, beliscos, atenção plena | Comparação de sinais; normalidade/impacto; relação com ansiedade; estímulos recorrentes; rotina de pequenos episódios; prática de atenção | #5/#7 e alguns legados ainda compartilham tabelas e dicas; não são seis versões idênticas da mesma resposta |
| Emagrecimento, déficit, restrição, recaídas | Guia amplo; mecanismo e limites de estimativa; tipos de restrição/manutenção; retomada após lapsos | #27 mistura lapso/reganho e #8 mantém sobreposição com o guia amplo |
| Comer à noite e carboidrato à noite | Contexto de horário/sofrimento/sono versus dúvida específica sobre carboidratos e balanço energético | Conceitos comuns são esperados e os links podem orientar continuidade |
| Exercício | Guias de pré, pós e disposição têm perguntas próprias | #23 ainda é a maior sobreposição relativa com #14/#15 |

São inferências de conteúdo, sem dados de queries/posições do Search Console. Não se afirmou competição orgânica comprovada ou eliminação de canibalização. Nenhuma fusão ou redirect foi criado nesta auditoria.

## 5. Home, navegação, artigos e páginas institucionais

A home explica o tema nos primeiros blocos e mostra acervo, categorias, autora/CRN e links de leitura. O perfil profissional não exige procurar apenas em uma política. Listagem com artigos, temas, filtros, busca própria e paginação permite descoberta; o código trata `q` e `categoria` no cliente. Os filtros/paginação não foram clicados em produção nesta execução.

Sobre, Contato, autora, Privacidade, Cookies, Termos, Disclaimer e Editorial retornaram 200 com conteúdo próprio. Sobre/perfil apresentam Nutrição e Biomedicina e pós-graduações em Engenharia de Alimentos/Estética, conforme confirmação do usuário; não houve consulta independente ao conselho ou instituições nem invenção de título de especialista. Contato publica e-mail, WhatsApp e Instagram, sem placeholder evidente. Não foram enviados formulários ou mensagens a terceiros.

A Política Editorial identifica Weverlyn, revisão antes da publicação, responsabilidade humana final, uso auxiliar de IA e limites de revisão externa. Autoria profissional visível, CRN 24101524 e nome legal no schema são consistentes. **E-E-A-T/YMYL: 13/15**, com ressalvas de qualidade de fontes legadas e de não haver validação independente de cada credencial.

Não foram identificadas páginas públicas importantes vazias/placeholder na amostra. Páginas legais curtas cumprem propósito e não foram classificadas como baixo valor apenas por tamanho. `/preview`, `/debug`, `/dev`, `/test`, `/fixtures` e `/pt/newsletter` retornaram 404; não são páginas editoriais vazias em 200. A rota de newsletter é uma action, não uma página de conteúdo.

Um levantamento de links SSR não encontrou entrada para #16 “Alimentação saudável fora de casa”. O artigo está no sitemap e nos dados do explorador/paginação; isso não comprova orfandade. É recomendável confirmar a descoberta após hidratação e melhorar sua ligação contextual. As páginas institucionais principais estão ligadas na navegação/footer.

O botão de busca do header não tem ação no código; a busca do explorador é diferente e tem implementação. É recomendação de UX. Não torna o acervo inteiro inacessível.

## 6. Indexabilidade, canonical, redirects e links

**30/30 artigos: HTTP 200, um canonical próprio HTTPS/www, index/follow, sem noindex ou autenticação pública e BlogPosting consistente.** Amostra institucional inclui home, artigos, autora e todas as políticas; canonicals próprios corretos.

`robots.txt` retorna 200, permite `/`, aponta o sitemap oficial e exclui admin/login/API. Isso é controle de rastreamento, não substitui autenticação ou prova de indexação. Admin sem sessão redireciona para login. Login ainda mostra index/follow e canonical da home; é recomendação de metadata operacional, sem prova de que já esteja indexado. As respostas 404 incluem noindex; há metadata herdada redundante, mas o status e a diretiva restritiva impedem tratá-las como páginas editoriais indexáveis úteis.

| Entrada | Caminho observado |
| --- | --- |
| HTTP www /pt | 301 para HTTPS www, depois 200 |
| HTTPS sem www /pt | 308 para HTTPS www, depois 200 |
| HTTP sem www /pt | 301 para HTTPS sem www, depois 308 para www e 200; duas etapas, recomendação de simplificação |
| URL arquivada da consolidação, com e sem www | 301 direto para a consolidada www, depois 200 |

Foram checados **49 destinos HTTP internos distintos**, sem erro ou redirect desnecessário no conteúdo observado. Não há localhost no corpo público amostrado. Âncoras contextuais dos lotes correspondem aos destinos; relacionados automáticos podem ser amplos, sem se apresentarem como curadoria manual. Fragmentos locais foram separados: uma resolução inicial do coletor para `/#explorar-por-tema` foi corrigida como artefato da auditoria, não falha do site.

Indexável não significa indexado. O dado anterior “sitemap processado, 39 páginas encontradas” é histórico fornecido pelo usuário; nenhuma contagem atual de indexação ou ação manual foi inventada.

## 7. Feed e sitemap em produção

**Os dois passaram no parser real `System.Xml.XmlDocument` nesta auditoria pública.** Não se inferiu implantação a partir do código local e não foi feito deploy por esta tarefa.

- Feed: 200, RSS 2.0, 30 itens, GUIDs únicos, URLs canônicas, publicações originais e resumos atuais iguais aos registros; arquivado ausente. O título retorna corretamente após parse, sem ampersand inválido ou escape duplo.
- Sitemap: 200, XML válido, 40 URLs únicas HTTPS/www, 30 artigos presentes, seis do Lote 2 incluídos e arquivado ausente. **Zero divergências de lastmod** contra `editorialUpdatedAt ?? publishedAt` nos 30 artigos.
- A regra editorial não usa updatedAt técnico. Não foram escritas datas.

As pendências antigas de XML/cache não foram repetidas como problemas atuais. Listagem/perfil atuais exibem os dados novos visíveis; o perfil mantém limite de 12 recentes. Evidência: [validacao-xml-publica.json](validacao-xml-publica.json) e respostas públicas coletadas.

## 8. ads.txt, AdSense e consentimento

`/ads.txt`: **200, text/plain**, uma linha exata, sem HTML ou duplicidade conflitante:

```text
google.com, pub-3638053236344020, DIRECT, f08c47fec0942fa0
```

O ID coincide com a metadata `google-adsense-account=ca-pub-3638053236344020` nas páginas públicas. Essa coerência técnica não comprova acesso/titularidade na conta. O estado “Requer atenção” é o informado pelo usuário; não houve acesso ao painel. Um eventual “Não encontrado” antigo para ads.txt é **AGUARDANDO CRAWL / CONFERÊNCIA HUMANA** enquanto o arquivo público estiver correto.

Não há loader AdSense no HTML inicial público/login ou unidade publicitária montada no código atual. Publicidade está pausada, coerente com as políticas; metadata não é um anúncio. A [documentação de conexão](https://support.google.com/adsense/answer/7584263?hl=en) prevê código, ads.txt e meta tag como modalidades. Não se exige anúncio visível antes de aprovação nem se recomenda habilitar Auto Ads apenas para produzir uma evidência visual.

| Verificação | Nível de comprovação |
| --- | --- |
| Quatro sinais default denied | Confirmados em script inline público atual; fila local, não requisição Google |
| Banner próprio, recusar/aceitar/preferências e reabertura | Controles e chave v2 encontrados nos bundles/publicação e no footer; implementação e 16 testes locais com mocks aprovados |
| Persistência, recusa, mudança e revogação | Previstas no código; não exercitadas com navegador/rede reais nesta execução |
| Analytics | ID G-HDJ55H8QR6 presente no bundle. Não há loader no HTML inicial. Código condiciona o carregamento à autorização; requisição efetiva após aceitar não foi observada |
| GTM / Clarity | Sem loaders iniciais ou montagem atual; componentes/variáveis disponíveis não foram confundidos com carga efetiva |
| Login/admin | Sem loaders opcionais iniciais; defaults locais denied são inofensivos. Sessão administrativa autenticada e transição SPA com GA já carregado não foram testadas |
| CMP Google/TCF | Banner próprio não é CMP certificada; certificação, mensagem publicada, regiões e TC String não comprovadas. AÇÃO HUMANA |

A [exigência regional de CMP](https://support.google.com/adsense/answer/13554116?hl=en) deve ser conferida antes da veiculação aplicável. A ausência dessa evidência, com publicidade pausada, não foi tratada como falha fatal de conteúdo/revisão do site. Configurar o painel não comprova, sozinho, que a integração esteja tecnicamente ativa.

## 9. Políticas e newsletter

Privacidade, Cookies, Termos, Disclaimer e Editorial estão acessíveis e ligados. Os textos atuais explicam Analytics opcional, publicidade pausada, ausência de GTM/Clarity, armazenamento de escolha e revisão humana/IA. Não se emite parecer de conformidade legal integral.

**Inconsistência B1:** a UI convida a receber conteúdo e promete saída da lista; o estado público `?newsletter=confirmar` diz que o e-mail foi enviado. Privacidade e Termos declaram que a confirmação/envio ainda não estão integrados; o adaptador local termina sem envio. O GET desse estado não envia e-mail nem demonstra a entrega real. A inconsistência entre mensagens públicas já é suficiente para pedir adequação proporcional antes de liberar este processo. Não foi criado assinante, chamado endpoint de confirmação ou enviada mensagem.

O encerramento pode ser simples: apresentar uma oferta e estados honestos para a capacidade atual, em fase autorizada, ou comprovar a integração real. Não se exige implementar uma plataforma completa de e-mail. Não foi alterada política ou interface nesta auditoria.

## 10. Performance, mobile, imagens e erros

PageSpeed mobile e desktop: **429 RESOURCE_EXHAUSTED**. Sem métricas atuais de LCP/INP/CLS, sem nota de desempenho fabricada e sem transformar duração de GET em Web Vital.

O browser host estava indisponível; 320 px, 375 px, tablet e desktop não foram inspecionados visualmente nesta rodada. A aprovação humana anterior de dois artigos nas cinco larguras é evidência histórica limitada, não teste atual de home/menu/banner e todo o site. O CSS contém adaptações, mas overflow oculto não comprova ausência de corte; cards com min-width 300 px merecem conferência em 320 px.

Foram verificados **32 URLs de imagens**, todos HEAD 200 e MIME de imagem. Nas 32 páginas suplementares (30 artigos + home/login), há 164 elementos img e nenhum alt vazio. Os 30 covers de artigos não trazem width/height explícitos; isso é risco potencial de estabilidade, não prova de CLS alto. Um alt ainda diz “Benefícios Comprovados” em alimentação consciente e merece manutenção. Correspondência visual da imagem com o assunto e cortes de imagem não foram certificados apenas pelo alt/MIME.

Dez bundles JavaScript amostrados responderam 200. Não houve 500 ou 404 importante nos destinos editoriais/institucionais testados. Não se observou console/hidratação porque o navegador não estava disponível; portanto, não se afirma ausência desses erros. APIs de contato/newsletter/cron não foram acionadas para evitar escrita ou comunicação; isso não foi apresentado como teste funcional completo de back-end.

## 11. Segurança

| Recorte npm | Críticos | Altos | Moderados | Baixos |
| --- | ---: | ---: | ---: | ---: |
| Árvore completa | 0 | 1 | 8 | 0 |
| `--omit=dev` | 0 | 1 | 1 | 0 |

São contagens de pacotes reportados, não nove falhas independentes: há propagação por dependências. Next local é 15.5.29 e seu PostCSS interno 8.4.31. A maior parte dos moderados completos está na cadeia ESLint/minimatch. O recorte de produção inclui PostCSS alto e Next moderado transitivo.

Os avisos [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q) e [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849) envolvem CSS influenciado por atacante e carregamento de source maps. Não foi encontrada nem explorada uma entrada pública que processe CSS não confiável. Isso não prova ausência de exposição em todos os fluxos, nem autoriza descartar o alerta.

O npm audit é do workspace/lockfile, não inventário autenticado do runtime hospedado. A prioridade é triagem técnica e confirmação do host em etapa autorizada; **não há bloqueador remoto de reenvio demonstrado apenas pela contagem**, mas tampouco se declara segurança resolvida. Nenhuma dependência foi atualizada e nenhum exploit, upload ou teste invasivo foi executado.

## 12. Campos SEO e recomendações

`description`/excerpt é consumido pelo template, cards, listagem, perfil e RSS. `seoTitle` não tem consumo público geral; `seoDescription` só é preferido na exceção da consolidação. Os títulos e descrições públicos atuais cumprem seu propósito e canonicals estão corretos. O consumo incompleto é **RECOMENDAÇÃO**, não bloqueador material do reenvio.

Não há implementação geral pronta que um deploy sozinho passe a ativar. Não foi iniciada refatoração nem alterada metadata de artigos. As melhorias dos quatro C, links a #16, alt categórico, relacionados e simplificação do redirect HTTP sem www são manutenção proporcional.

## 13. Decisão e ações seguintes

**NO-GO temporário nesta recomendação de prontidão.** Há um projeto editorial útil e a maior parte dos achados antigos foi encerrada em produção. O item que retém a liberação é B1, a promessa pública da newsletter, não a existência dos quatro C. O score de 82 não remove esse critério de confiança.

Após resolver ou esclarecer B1 em etapa autorizada e revalidar a interface publicada, atualizar a decisão sem presumir necessidade de Lote 3. O checklist de conta, consentimento real e mobile deve ser concluído antes de solicitar revisão. Search Console permanece a próxima etapa do plano, ainda não executada; sitemap técnico válido não prova processamento/indexação no Google.

Documentos de decisão: [scorecard.md](scorecard.md), [bloqueadores.md](bloqueadores.md) e [checklist-humano.md](checklist-humano.md). O histórico “Requer atenção”, ads.txt no painel e 39 páginas encontradas não foi sobrescrito por suposição.

## 14. Integridade e arquivos

Antes/depois: 31 registros Post e hashes de 142 arquivos funcionais em src/public/configuração/dependências. **Todos os 31 registros permaneceram exatamente iguais**, inclusive os seis do Lote 2, os outros 25, views e datas. Nenhum artigo, banco, política, código funcional, schema ou dependência foi alterado.

Somente arquivos de auditoria foram criados: os quatro Markdown pedidos, JSON/XML de evidência e scripts `adsense-final-integrity.ts`, `audit-final-adsense.mjs`, `audit-final-supplement.mjs` e `audit-final-xml.ps1`. Os scripts permanecem em scripts/, não em .next/. Não houve envio de mensagens, cadastros, formulários ou arquivos a terceiros, alteração de cookies/consentimento ou configuração de contas Google. As requisições públicas GET/HEAD de auditoria estão registradas nas evidências. Os 16 testes com mocks não tocaram produção.

Evidências principais: [evidencias-publicas.json](evidencias-publicas.json), [evidencias-suplementares.json](evidencias-suplementares.json), [amostragem-editorial.json](amostragem-editorial.json), [validacao-xml-publica.json](validacao-xml-publica.json), [newsletter-evidencia.json](newsletter-evidencia.json), [performance-limitacoes.json](performance-limitacoes.json), npm-audit.json/npm-audit-producao.json e [encerramento.json](encerramento.json).

**Sem correções automáticas, sem commit, sem push e sem deploy.**
