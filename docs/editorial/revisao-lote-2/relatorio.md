# Lote 2 — relatório final de aplicação controlada

08/11/2026. **APPLIED_ALL_SIX: 6/6 artigos aplicados no banco configurado e conferidos nas seis URLs canônicas.** Transação concluída às 2026-11-08T19:37:59.734Z. Somente os seis registros aprovados foram atualizados editorialmente. Nenhum commit, push ou deploy.

## Aprovação, baseline e integridade

A aprovação editorial das seis propostas, a aprovação visual humana de #2/#1 e a autorização de retomada com views dinâmicas estão documentadas em autorizacao-aplicacao.json, aprovacao-visual-retomada.json e autorizacao-retomada-final.json. O aumento 22 → 23 do #18 foi aceito expressamente pelo usuário. O novo baseline foi capturado às 2026-11-08T19:34:50.588Z; o snapshot anterior permanece em antes-aplicacao-original.json. Nenhum conteúdo, metadata, ID ou outro campo estrutural divergiu; os hashes de todos os arquivos aprovados continuam iguais. Evidências anteriores de interrupção foram preservadas, inclusive depois-antes-retomada-final.json e historico-interrupcao-inicial.json. interrupcao.json é histórico: sua causa foi resolvida pelas correções locais, aprovação visual real e autorização explícita de retomada. A aplicação exige flags de retomada e se recusa a reaplicar um lote já concluído.

O script usa uma transação serializável e bloqueio dos 31 registros de Post durante a conferência/escrita curta. Revalida todos os campos antes da primeira escrita e os campos protegidos antes do commit. Views é aceito somente como inteiro não decrescente, nunca incluído no data do update. Qualquer divergência editorial/estrutural, diminuição de views ou mudança em outro campo protegido aborta. scheduledAt também é omitido da escrita, evitando o comportamento destrutivo da action normal do CMS. O teste com corrupção de scheduledAt comprova a rejeição antes de confirmar a transação.

Foram escritos somente title, description/excerpt, seoTitle, seoDescription, content HTML, contentBlocks vazio e editorialUpdatedAt (updatedAt técnico acompanha a escrita). Os títulos aprovados coincidem com os anteriores. A representação HTML já suportada pelo CMS preserva negritos, listas, âncoras e referências; não houve adaptação editorial, redução de texto ou bloco duplicado de autora. subtitle, readTime, capa/alt, categoria e autoria técnica foram preservados. focusKeyword foi preservado, inclusive valores vazios.

Nos dois artigos #2/#1, e somente neles, desktopReviewed, tabletReviewed e mobileReviewed passaram a true com lastPreviewAt igual ao momento real da aplicação daquele registro. Esse horário registra a aprovação recebida, sem inventar hora histórica da revisão humana. Os quatro restantes conservaram seus valores anteriores de revisão, inclusive lastPreviewAt null.

| Artigo | publishedAt preservado | scheduledAt preservado | views baseline → commit | editorialUpdatedAt real |
| --- | --- | --- | --- | --- |
| #30 | 2026-09-19T07:30:15.392Z | 2026-09-19T07:30:00.000Z | 19 → 19 | 2026-11-08T19:37:59.466Z |
| #22 | 2026-08-03T07:00:02.325Z | 2026-08-03T07:00:00.000Z | 8 → 8 | 2026-11-08T19:37:59.520Z |
| #18 | 2026-07-27T07:00:02.388Z | 2026-07-27T07:00:00.000Z | 23 → 23 | 2026-11-08T19:37:59.556Z |
| #9 | 2026-07-03T07:00:02.794Z | 2026-07-03T07:00:00.000Z | 241 → 241 | 2026-11-08T19:37:59.592Z |
| #2 | 2026-06-17T15:00:40.719Z | null | 88 → 88 | 2026-11-08T19:37:59.628Z |
| #1 | 2026-06-15T23:44:55.526Z | null | 87 → 87 | 2026-11-08T19:37:59.665Z |

O #18 permaneceu com **views = 23**. Não foi restaurado para 22. A checagem posterior às 2026-11-08T19:41:34.653Z confirmou exatamente seis alterações editoriais, 25 registros externos intactos e todos os campos protegidos. Nesta observação posterior não houve novos incrementos de views. Depois-aplicacao.json contém todas as linhas antes/dentro/depois da transação; integridade-final.json e verificacao-banco-final.json contêm a conferência posterior. IDs, slugs, status, publishedAt e scheduledAt foram preservados exatamente.

## Resultado editorial real

Leitura integral dos seis corpos efetivamente publicados, confrontados byte a byte com o pacote aprovado; mesmos oito pesos da auditoria inicial. Julgamento editorial do agente, com incerteza; não score do Google, validação clínica independente ou previsão de AdSense. Estimativas pré-aplicação não foram usadas como notas finais.

| Artigo | Antes | Final | Classe antes | Classe final | Principal melhoria |
| --- | ---: | ---: | --- | --- | --- |
| Setembro Amarelo: alimentação e exercícios como parte do cuidado com a saúde mental | 72 | 85 | C | B | Evidência com limites e apoio possível em dias difíceis, sem promessa terapêutica ou captação comercial. |
| Comer à noite é falta de controle? Entenda o que pode estar por trás | 71 | 86 | C | B | Cenários úteis e distinção entre alimentação tardia, sofrimento e síndromes, com estudos identificados. |
| Como criar um déficit calórico sem cortar calorias obsessivamente | 71 | 84 | C | B | Separa qualidade alimentar de déficit e explicita limites das estimativas, sem meta universal. |
| Por que dietas muito restritivas costumam falhar? | 71 | 84 | C | B | Distingue tipos de restrição e manutenção, evitando generalizações sobre dietas e reganho. |
| Comer por emoção é normal? | 71 | 85 | C | B | Normalidade e necessidade de cuidado avaliadas por impacto, sem confundir comer emocional e transtorno. |
| Alimentação Consciente: O Que É, Benefícios e Como Praticar o Mindful Eating | 74 | 87 | C | B | Bibliografia rastreável, limites dos benefícios e experiência prática sem regra de controle. |

A média dos seis foi de 71.67 para 85.17. As estimativas anteriores eram 84/85/84/85/84/86; não foram simplesmente copiadas. Cada dimensão tem justificativa individual em comparativo.md e avaliacoes.json. A revisão profissional e visual humana é a informada pelo usuário; a nota do agente não é revisão clínica independente. Não foi atribuída nota por volume de texto, presença de DOI ou quantidade de headings isoladamente.

## Conteúdo público, HTTP, autoria e schema

As seis páginas responderam HTTP 200, sem redirect, com **igualdade integral do corpo aprovado**, H2/H3 preservados, negritos, listas e as 22 entradas bibliográficas. Apenas um H1 pelo template em cada página e nenhum H1 no corpo. Capas originais presentes e seis respostas HEAD 200 com MIME image. Esta inspeção de HTML/MIME não representa uma nova revisão visual automática da imagem.

Weverlyn Alves, CRN 24101524 e /pt/autora/weverlyn-alves estão presentes. BlogPosting/Person usa Weverlyn da Cruz Alves Torres e o URL canônico da autora. Em 6/6: datePublished coincide exatamente com publishedAt original, dateModified com editorialUpdatedAt real, headline com o título aprovado e mainEntityOfPage com o canonical preservado. Não se usou updatedAt técnico como modificação editorial.

Description/excerpt aprovado está no banco e na meta description renderizada dos seis artigos. seoTitle/seoDescription aprovados também foram salvos, mas o template público existente continua utilizando article.title e description. Essa limitação já documentada não foi corrigida com mudança de template/deploy nesta etapa.

Referências: **22 entradas, 19 fontes e 12 DOIs únicos aprovados**, distribuídos em 4/4/3/3/3/5 por artigo, sem inclusão/exclusão. Links contextuais: **17 ocorrências, 12 destinos distintos, todos 200 sem redirect**. Âncoras, ordem e destinos aprovados foram conservados. CTA segue somente a proposta; nenhuma consulta/newsletter foi inserida por exigência artificial. Detalhes em referencias.md e verificacao-publica-final.json.

Os três cards de cada artigo continuam automáticos por categoria/recência. Não foram implementados relacionados manuais. As sugestões de cards dos documentos editoriais não foram apresentadas como curadoria implantada.

Canibalização: os recortes agora distinguem rede de cuidado (#30), alimentação noturna (#22), mecanismo/limites do déficit (#18), tipos de restrição/manutenção (#9), normalidade e impacto emocional (#2) e prática/limites de atenção plena (#1). Os links remetem aos recortes vizinhos em vez de reproduzir suas funções. Persistem sobreposições conceituais leves; não há dados novos do Search Console para concluir eliminação de canibalização de ranking. Nenhuma consolidação ou redirect novo foi criado.

## Rotas, sitemap, feed e cache

HTTP 200: /pt, /pt/artigos, os seis artigos, /pt/autora/weverlyn-alves, /pt/politica-editorial, /sitemap.xml, /feed.xml e /login. A rota administrativa e os seis editores retornaram **307 para /login** sem sessão; o 200 final é da página de login, não prova de editor funcional autenticado.

Sitemap: XML bem formado (40 URLs), seis URLs presentes com slugs/canonicals originais; o artigo arquivado da consolidação permanece ausente. **Os seis lastmod ainda estão antigos no cache remoto.** Listagem continua com as seis descrições antigas; perfil mostra descrições antigas dos itens do lote incluídos em seus 12 mais recentes (#30/#22). Ausência dos outros quatro no perfil é compatível com esse limite, não exclusão do acervo. Cabeçalhos observados: x-nextjs-cache HIT. Não se promete prazo de sincronização do sitemap nem se confunde o build local com invalidação da instância hospedada. Não houve purge, endpoint improvisado ou regravação de artigos para forçar cache, pois a action normal poderia limpar scheduledAt.

Feed: 30 itens e identidades únicas, seis GUIDs/links originais presentes, datas de publicação originais e descrições novas, sem o arquivado. **A validação real com parser XML FALHOU:** Exceção ao chamar "LoadXml" com "1" argumento(s): "Erro durante a análise de EntityName. Linha 4, posição 22.". Causa identificada na linha 48 do arquivo src/app/feed.xml/route.ts: título fixo do canal contém ampersand sem escape, também presente na resposta pública. O arquivo não foi alterado neste lote, e o defeito é preexistente. Extração de itens por regex e HTTP 200 não equivalem a RSS válido. Corrigir essa linha e implantar pertence a etapa técnica posterior autorizada; não foi executado deploy nem alterado esse arquivo.

Evidências: verificacao-publica-final.json, sitemap-publico.xml, feed-publico.xml e validacao-xml.json. As verificações HTTP fizeram somente GET/HEAD, sem executar JavaScript/contador, newsletter ou contato.

## Revisão dos editores: limitação de execução

O controle de navegador dedicado estava indisponível. A alternativa com a skill [Computer Use](C:/Users/Diego%20Torres/.codex/plugins/cache/openai-bundled/computer-use/26.1103.32239/skills/computer-use/SKILL.md) foi interrompida automaticamente ao não conseguir determinar a URL atual do navegador Windows com segurança. Nenhuma interação adicional de UI foi feita. Os GETs sem sessão confirmaram proteção 307/login, e a leitura dos seis registros passou no validador local real, mas **não foi possível concluir a interação autenticada com os seis editores**. Não foi alegado teste de salvamento no CMS remoto. As correções locais de checklist ainda não foram implantadas; a versão hospedada do editor pode continuar usando regras anteriores até deploy autorizado.

## Distribuição do acervo e C restantes

**30 publicados: 3 A, 23 B, 4 C, 0 D; 1 arquivado.** A média ponderada comparável dos mesmos 30 IDs publicados passou de 78.50 para 81.20/100. A média combina as últimas avaliações conhecidas dos artigos não alterados com a reauditoria deste lote; não é uma nova auditoria integral dos 30. O arquivado foi excluído de ambas as médias. Inventário por ID/nota/classe em distribuicao-acervo.json.

| C remanescente | Nota/classe | Tratamento na auditoria final | Motivo |
| --- | --- | --- | --- |
| #7 Como parar de beliscar o dia todo sem entrar em dieta restritiva | 75/C | Manutenção futura de menor risco relativo | Ferramentas práticas já úteis; há duplicação de frase, seção sem título e uso de compulsão pouco delimitado. Não prova baixo valor de toda a página nem infração AdSense; precisão clínica ainda merece manutenção. |
| #17 Alimentos bons ou ruins: por que essa classificação pode atrapalhar sua relação com a comida | 74/C | Prioridade na auditoria final | Referências parafraseadas e categorias pouco justificadas deixam incerteza de fundamentação em tema de saúde. Risco editorial real de confiança/valor, sem afirmar infração ou reprovação automática. |
| #23 Como a alimentação influencia a disposição para treinar | 73/C | Prioridade na auditoria final | Baixa contribuição própria e provável sobreposição com os guias de pré/pós-treino enfraquecem a utilidade distinta. É o sinal mais direto de risco relativo de baixo valor entre os C restantes. |
| #27 Como lidar com recaídas no processo de emagrecimento sem desistir | 74/C | Prioridade na auditoria final | Referência ScienceDirect sem identificação e mistura entre lapso e reganho, somadas à frase moralizante, deixam lacunas de rastreabilidade e coerência. É risco editorial, não resultado de avaliação do Google. |

Os quatro corpos continuam idênticos à auditoria original; as limitações ainda se aplicam. #17, #23 e #27 merecem prioridade na auditoria final; #7 é manutenção futura de menor risco relativo, preservando a ressalva de precisão do termo clínico. Não foi criado novo lote nem alterado nenhum deles.

Essa separação é **inferência editorial de risco**, não identificação de infração/rejeição pelo Google. A [política oficial de valor do inventário](https://support.google.com/publisherpolicies/answer/11112688?hl=en), consultada nesta etapa, exige conteúdo com valor para o usuário, mas não define nossas classes A/B/C/D ou pontuações. Não há garantia de aprovação AdSense, nem evidência de que qualquer um desses quatro, isoladamente, cause reprovação. A decisão sobre novo trabalho permanece para a auditoria final solicitada pelo usuário.

## Testes técnicos após a aplicação

| Comando | Resultado |
| --- | --- |
| npx --no-install prisma validate | Aprovado (exit 0) |
| npx --no-install prisma generate | Aprovado (exit 0) |
| node --import tsx --test scripts/editorial-lote2.test.ts scripts/editorial-validator.test.ts scripts/editorial-preview.test.ts scripts/editorial-lote2-guards.test.ts | Aprovado (exit 0) |
| npm run lint | Aprovado (exit 0) |
| npx --no-install tsc --noEmit | Aprovado (exit 0) |
| npm run build | Aprovado (exit 0) |

**17 testes passaram:** adaptação exata/trava do pacote, validador e revisão manual, preview somente de leitura, incrementos de views e rejeição transacional de scheduledAt corrompido. O teste de preview passou a usar porta efêmera para não disputar a porta da revisão humana já aberta; não foi encerrado o servidor do usuário. Build Next 15.5.29 concluiu 37/37 páginas, lint, tipos, otimização e traces. Dois avisos preexistentes: img em administracao/seguranca/page.tsx:100 e destroySession não utilizado em AdminLayout.tsx:3. Prisma validate/generate passaram, sem db push/migração. git diff --check foi conferido na finalização. Os logs/testes-tecnicos.json desta pasta correspondem à execução pós-aplicação.

## Arquivos e pendências

Scripts de apoio ficam em scripts/: apply-editorial-lote2.ts e check-editorial-lote2.mjs foram atualizados; editorial-preview.test.ts e serve-editorial-preview.mjs receberam apenas ajuste para porta isolada de teste. Novos: editorial-lote2-guards.ts, editorial-lote2-guards.test.ts, refresh-editorial-lote2-baseline.ts, verify-editorial-lote2-integrity.ts, verify-editorial-lote2-public.mjs e report-editorial-lote2.mjs. preflight-editorial-lote2.ts é o verificador estrito da tentativa anterior, mantido como histórico; a retomada autorizada usa o novo verificador de baseline com views dinâmicas.

Nesta pasta foram atualizados antes-aplicacao.json, depois-aplicacao.json, integridade-final.json, relatorio.md, comparativo.md, referencias.md e logs técnicos. Criados: antes-aplicacao-original.json, depois-antes-retomada-final.json, autorizacao-retomada-final.json, verificacao-banco-final.json, verificacao-publica-final.json, verificacao-admin.json, validacao-xml.json, sitemap-publico.xml, feed-publico.xml, avaliacoes.json e distribuicao-acervo.json. Os documentos ../validacao-cms/relatorio.md e ../validacao-cms/revisao-manual.md receberam aviso de atualização apontando para o resultado aplicado, preservando os resultados offline antigos como histórico. Arquivos aprovados de ../lote-2/ permanecem integralmente intactos; evidências anteriores não foram apagadas. Não houve nova alteração de src, schema, dependências ou template nesta retomada. Existem alterações locais da etapa anterior do validador no Git; elas não foram confundidas com aplicação em produção.

Pendências concretas: (1) cache de sitemap/listagem/perfil; (2) feed XML inválido por defeito preexistente; (3) inspeção autenticada dos editores interrompida pelo controle de URL; (4) implantação futura das correções locais do checklist e eventual consumo dos campos SEO, somente quando autorizada. A revisão editorial/visual aprovada dos dois artigos foi registrada e **não permanece pendente no banco**.

Nenhum outro artigo foi alterado por esta tarefa. .next/ continua ignorado pelo Git. **Sem commit, push ou deploy.**
