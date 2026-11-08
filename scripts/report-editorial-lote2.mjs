// Formats recorded evidence and the agent's independent editorial assessment.
// No database/network or content application.
import fs from "node:fs";
import assert from "node:assert/strict";
const dir = "docs/editorial/revisao-lote-2/";
const read = file => JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
const save = (file, content) => fs.writeFileSync(dir + file, content);
const application = read(dir + "depois-aplicacao.json");
const before = read(dir + "antes-aplicacao.json");
const pack = read(dir + "pacote-aplicacao.json");
const integrity = read(dir + "integridade-final.json");
const http = read(dir + "verificacao-publica-final.json");
const xml = read(dir + "validacao-xml.json");
const tech = read(dir + "testes-tecnicos.json");
const audit = read(dir + "avaliacoes.json");
const old = read("docs/editorial/auditoria-artigos/avaliacoes.json");
const original = read("docs/editorial/auditoria-artigos/dados.json").articles;
const lot1 = read("docs/editorial/revisao-lote-1/avaliacoes.json").articles;
const consolidation = read("docs/editorial/consolidacao-emagrecimento/reauditoria-final-remota.json");
const current = read(dir + "verificacao-banco-final.json").records;
assert.equal(application.state, "APPLIED_ALL_SIX");
assert.equal(integrity.onlySixEditoriallyChanged, true);
assert.ok(http.articles.every(a => a.exactApprovedBody && a.status === 200 && Object.values(a.schemaChecks).every(Boolean)));
assert.ok(tech.results.length === 6 && tech.results.every(r => r.exitCode === 0));
const sum = points => points.reduce((a, b) => a + b, 0);
for (const a of audit.articles) {
  assert.equal(a.points.length, 8);
  assert.ok(a.points.every((v, i) => v >= 0 && v <= audit.weights[i]));
  assert.equal(a.score, sum(a.points));
}
const priorScores = new Map(old.map(a => [a.n, { score: sum(a.pontos), class: a.classe, source: "auditoria original" }]));
for (const a of lot1) priorScores.set(a.number, { score: sum(a.points), class: a.class, source: "Lote 1 aplicado e reavaliado" });
priorScores.set(4, { score: consolidation.score, class: consolidation.classification, source: "consolidação aplicada" });
const finalScores = new Map(priorScores);
for (const a of audit.articles) finalScores.set(a.number, { score: a.score, class: a.class, source: "Lote 2 efetivamente publicado" });
const inventory = current.map(row => {
  const index = original.findIndex(a => a.id === row.id);
  assert.ok(index >= 0);
  const number = index + 1;
  const final = finalScores.get(number);
  assert.ok(final);
  return { number, id: row.id, title: row.title, slug: row.slug, status: row.status, ...final };
});
const published = inventory.filter(a => a.status === "PUBLISHED");
const counts = { A: 0, B: 0, C: 0, D: 0 };
for (const a of published) counts[a.class]++;
const baselineAverage = published.reduce((n, a) => n + priorScores.get(a.number).score, 0) / published.length;
const average = published.reduce((n, a) => n + a.score, 0) / published.length;
const risks = {
  7: { level: "Manutenção futura de menor risco relativo", rationale: "Ferramentas práticas já úteis; há duplicação de frase, seção sem título e uso de compulsão pouco delimitado. Não prova baixo valor de toda a página nem infração AdSense; precisão clínica ainda merece manutenção.", priorityBeforeFinalAudit: false },
  17: { level: "Prioridade na auditoria final", rationale: "Referências parafraseadas e categorias pouco justificadas deixam incerteza de fundamentação em tema de saúde. Risco editorial real de confiança/valor, sem afirmar infração ou reprovação automática.", priorityBeforeFinalAudit: true },
  23: { level: "Prioridade na auditoria final", rationale: "Baixa contribuição própria e provável sobreposição com os guias de pré/pós-treino enfraquecem a utilidade distinta. É o sinal mais direto de risco relativo de baixo valor entre os C restantes.", priorityBeforeFinalAudit: true },
  27: { level: "Prioridade na auditoria final", rationale: "Referência ScienceDirect sem identificação e mistura entre lapso e reganho, somadas à frase moralizante, deixam lacunas de rastreabilidade e coerência. É risco editorial, não resultado de avaliação do Google.", priorityBeforeFinalAudit: true },
};
const remainingC = published.filter(a => a.class === "C").map(a => ({ ...a, ...risks[a.number], originalAuditBodyStillIdentical: current.find(row => row.id === a.id).content === original[a.number - 1].content }));
assert.ok(remainingC.every(a => a.originalAuditBodyStillIdentical));
save("distribuicao-acervo.json", JSON.stringify({ evaluatedAt: new Date().toISOString(), method: "Distribuição recalculada sobre os 30 IDs atualmente publicados, combinando as últimas notas de auditoria original, Lote 1, consolidação e Lote 2. Não é nova reauditoria de todos os artigos.", counts, archived: inventory.filter(a => a.status === "ARCHIVED").length, published: published.length, baselineAverageSame30Ids: baselineAverage, finalAverageSame30Ids: average, batchBeforeAverage: audit.articles.reduce((n, a) => n + priorScores.get(a.number).score, 0) / 6, batchFinalAverage: audit.articles.reduce((n, a) => n + a.score, 0) / 6, remainingC, inventory }, null, 2) + "\n");
const table = audit.articles.map(a => {
  const article = application.articles.find(p => p.number === a.number);
  const prior = priorScores.get(a.number);
  return `| ${article.title} | ${prior.score} | ${a.score} | ${prior.class} | ${a.class} | ${a.improvement} |`;
}).join("\n");
let comparison = `# Lote 2 — comparativo após aplicação\n\n08/11/2026. **6/6 aplicados e conferidos integralmente no HTML público.** Mesmos pesos: ${audit.dimensions.map((d, i) => `${d} ${audit.weights[i]}`).join("; ")}. As notas finais são julgamento editorial do agente após leitura integral, não notas copiadas das estimativas, avaliação do Google ou revisão clínica independente. Classes descrevem necessidade de intervenção, sem corte matemático universal.\n\n| Artigo | Antes | Final | Classe antes | Classe final | Principal melhoria |\n| --- | ---: | ---: | --- | --- | --- |\n${table}\n\n`;
for (const a of audit.articles) {
  const article = application.articles.find(p => p.number === a.number);
  const previous = before.articles.find(p => p.id === article.id);
  const page = http.articles.find(p => p.id === article.id);
  comparison += `## ${article.title}\n\nID: \`${article.id}\`. URL: https://www.nutricaoemovimento.com/pt/artigos/${article.slug}\n\n| Dimensão | Antes | Final / peso | Fundamentação |\n| --- | ---: | ---: | --- |\n${a.points.map((p, i) => `| ${audit.dimensions[i]} | ${old.find(r => r.n === a.number).pontos[i]} | ${p}/${audit.weights[i]} | ${a.rationale[i]} |`).join("\n")}\n\n**Limites:** ${a.remaining}\n\n- publishedAt: ${previous.publishedAt} → ${article.publishedAt}.\n- scheduledAt: ${previous.scheduledAt ?? "null"} → ${article.scheduledAt ?? "null"}.\n- views: ${previous.views} → ${article.views}; nenhuma atribuição ao contador na escrita.\n- editorialUpdatedAt: ${previous.editorialUpdatedAt ?? "null"} → ${article.editorialUpdatedAt}.\n- Description/excerpt anterior: ${previous.description}\n- Description/excerpt aplicado: ${article.description}\n- SEO Title salvo: ${article.seoTitle}\n- SEO Description salva: ${article.seoDescription}\n- Title público: ${page.title}\n- Description pública: ${page.description}\n- Metadata pública usa title/description do template, não os campos SEO salvos.\n- Relacionados automáticos observados: ${page.related.join("; ")}.\n\n`;
}
save("comparativo.md", comparison);
const unique = new Map();
let references = "# Referências do Lote 2 efetivamente aplicadas\n\n**22 entradas, 19 fontes únicas e 12 DOIs únicos do pacote aprovado.** Nenhuma fonte adicionada ou excluída. As seis bibliografias e seus links foram conferidos integralmente no HTML público; os identificadores científicos já têm evidência de verificação no pacote original em ../lote-2/identificadores-verificados.json. Esta etapa não se apresenta como nova revisão sistemática ou nova revisão clínica.\n\n";
for (const a of pack.articles) {
  const page = http.articles.find(p => p.id === a.id);
  assert.equal(page.referenceEntryCount, a.references.length);
  references += `## ${a.title}\n\n${a.references.length} entradas no corpo aprovado e no HTML observado.\n\n`;
  a.references.forEach((r, i) => {
    unique.set(a.sourceKeys[i], r);
    references += `${i + 1}. ${r.author || r.authors || ""}. **${r.title}**. ${r.publication || ""}. ${r.year || "s.d."}.${r.doi ? ` DOI: [${r.doi}](https://doi.org/${r.doi}).` : ""}${r.url ? ` [Leitura](${r.url}).` : ""}\n\n`;
  });
}
assert.equal(unique.size, 19);
assert.equal(new Set([...unique.values()].map(r => r.doi).filter(Boolean)).size, 12);
references += "## Links internos e limites\n\n17 ocorrências contextuais aprovadas, distribuídas 2/3/3/3/3/3, levam a 12 destinos distintos. Todos responderam HTTP 200 sem redirect na checagem final. Âncoras e ordem coincidem com o pacote aprovado; não há localhost, URL interna com domínio antigo ou H1 dentro do corpo. Não foi adicionada newsletter ou consulta para satisfazer checklist.\n";
save("referencias.md", references);
const technical = tech.results.map(r => `| ${r.command} | Aprovado (exit ${r.exitCode}) |`).join("\n");
const dateTable = application.articles.map(a => {
  const b = before.articles.find(p => p.id === a.id);
  return `| #${a.number} | ${a.publishedAt} | ${a.scheduledAt ?? "null"} | ${b.views} → ${a.views} | ${a.editorialUpdatedAt} |`;
}).join("\n");
const cTable = remainingC.map(a => `| #${a.number} ${a.title} | ${a.score}/C | ${a.level} | ${a.rationale} |`).join("\n");
const report = `# Lote 2 — relatório final de aplicação controlada

08/11/2026. **APPLIED_ALL_SIX: 6/6 artigos aplicados no banco configurado e conferidos nas seis URLs canônicas.** Transação concluída às ${application.completedAt}. Somente os seis registros aprovados foram atualizados editorialmente. Nenhum commit, push ou deploy.

## Aprovação, baseline e integridade

A aprovação editorial das seis propostas, a aprovação visual humana de #2/#1 e a autorização de retomada com views dinâmicas estão documentadas em autorizacao-aplicacao.json, aprovacao-visual-retomada.json e autorizacao-retomada-final.json. O aumento 22 → 23 do #18 foi aceito expressamente pelo usuário. O novo baseline foi capturado às ${before.capturedAt}; o snapshot anterior permanece em antes-aplicacao-original.json. Nenhum conteúdo, metadata, ID ou outro campo estrutural divergiu; os hashes de todos os arquivos aprovados continuam iguais. Evidências anteriores de interrupção foram preservadas, inclusive depois-antes-retomada-final.json e historico-interrupcao-inicial.json. interrupcao.json é histórico: sua causa foi resolvida pelas correções locais, aprovação visual real e autorização explícita de retomada. A aplicação exige flags de retomada e se recusa a reaplicar um lote já concluído.

O script usa uma transação serializável e bloqueio dos 31 registros de Post durante a conferência/escrita curta. Revalida todos os campos antes da primeira escrita e os campos protegidos antes do commit. Views é aceito somente como inteiro não decrescente, nunca incluído no data do update. Qualquer divergência editorial/estrutural, diminuição de views ou mudança em outro campo protegido aborta. scheduledAt também é omitido da escrita, evitando o comportamento destrutivo da action normal do CMS. O teste com corrupção de scheduledAt comprova a rejeição antes de confirmar a transação.

Foram escritos somente title, description/excerpt, seoTitle, seoDescription, content HTML, contentBlocks vazio e editorialUpdatedAt (updatedAt técnico acompanha a escrita). Os títulos aprovados coincidem com os anteriores. A representação HTML já suportada pelo CMS preserva negritos, listas, âncoras e referências; não houve adaptação editorial, redução de texto ou bloco duplicado de autora. subtitle, readTime, capa/alt, categoria e autoria técnica foram preservados. focusKeyword foi preservado, inclusive valores vazios.

Nos dois artigos #2/#1, e somente neles, desktopReviewed, tabletReviewed e mobileReviewed passaram a true com lastPreviewAt igual ao momento real da aplicação daquele registro. Esse horário registra a aprovação recebida, sem inventar hora histórica da revisão humana. Os quatro restantes conservaram seus valores anteriores de revisão, inclusive lastPreviewAt null.

| Artigo | publishedAt preservado | scheduledAt preservado | views baseline → commit | editorialUpdatedAt real |
| --- | --- | --- | --- | --- |
${dateTable}

O #18 permaneceu com **views = 23**. Não foi restaurado para 22. A checagem posterior às ${integrity.checkedAt} confirmou exatamente seis alterações editoriais, 25 registros externos intactos e todos os campos protegidos. Nesta observação posterior não houve novos incrementos de views. Depois-aplicacao.json contém todas as linhas antes/dentro/depois da transação; integridade-final.json e verificacao-banco-final.json contêm a conferência posterior. IDs, slugs, status, publishedAt e scheduledAt foram preservados exatamente.

## Resultado editorial real

${audit.method}

| Artigo | Antes | Final | Classe antes | Classe final | Principal melhoria |
| --- | ---: | ---: | --- | --- | --- |
${table}

A média dos seis foi de ${(audit.articles.reduce((n, a) => n + priorScores.get(a.number).score, 0) / 6).toFixed(2)} para ${(audit.articles.reduce((n, a) => n + a.score, 0) / 6).toFixed(2)}. As estimativas anteriores eram 84/85/84/85/84/86; não foram simplesmente copiadas. Cada dimensão tem justificativa individual em comparativo.md e avaliacoes.json. A revisão profissional e visual humana é a informada pelo usuário; a nota do agente não é revisão clínica independente. Não foi atribuída nota por volume de texto, presença de DOI ou quantidade de headings isoladamente.

## Conteúdo público, HTTP, autoria e schema

As seis páginas responderam HTTP 200, sem redirect, com **igualdade integral do corpo aprovado**, H2/H3 preservados, negritos, listas e as 22 entradas bibliográficas. Apenas um H1 pelo template em cada página e nenhum H1 no corpo. Capas originais presentes e seis respostas HEAD 200 com MIME image. Esta inspeção de HTML/MIME não representa uma nova revisão visual automática da imagem.

Weverlyn Alves, CRN 24101524 e /pt/autora/weverlyn-alves estão presentes. BlogPosting/Person usa Weverlyn da Cruz Alves Torres e o URL canônico da autora. Em 6/6: datePublished coincide exatamente com publishedAt original, dateModified com editorialUpdatedAt real, headline com o título aprovado e mainEntityOfPage com o canonical preservado. Não se usou updatedAt técnico como modificação editorial.

Description/excerpt aprovado está no banco e na meta description renderizada dos seis artigos. seoTitle/seoDescription aprovados também foram salvos, mas o template público existente continua utilizando article.title e description. Essa limitação já documentada não foi corrigida com mudança de template/deploy nesta etapa.

Referências: **22 entradas, 19 fontes e 12 DOIs únicos aprovados**, distribuídos em 4/4/3/3/3/5 por artigo, sem inclusão/exclusão. Links contextuais: **17 ocorrências, 12 destinos distintos, todos 200 sem redirect**. Âncoras, ordem e destinos aprovados foram conservados. CTA segue somente a proposta; nenhuma consulta/newsletter foi inserida por exigência artificial. Detalhes em referencias.md e verificacao-publica-final.json.

Os três cards de cada artigo continuam automáticos por categoria/recência. Não foram implementados relacionados manuais. As sugestões de cards dos documentos editoriais não foram apresentadas como curadoria implantada.

Canibalização: os recortes agora distinguem rede de cuidado (#30), alimentação noturna (#22), mecanismo/limites do déficit (#18), tipos de restrição/manutenção (#9), normalidade e impacto emocional (#2) e prática/limites de atenção plena (#1). Os links remetem aos recortes vizinhos em vez de reproduzir suas funções. Persistem sobreposições conceituais leves; não há dados novos do Search Console para concluir eliminação de canibalização de ranking. Nenhuma consolidação ou redirect novo foi criado.

## Rotas, sitemap, feed e cache

HTTP 200: /pt, /pt/artigos, os seis artigos, /pt/autora/weverlyn-alves, /pt/politica-editorial, /sitemap.xml, /feed.xml e /login. A rota administrativa e os seis editores retornaram **307 para /login** sem sessão; o 200 final é da página de login, não prova de editor funcional autenticado.

Sitemap: XML bem formado (${xml.sitemap.count} URLs), seis URLs presentes com slugs/canonicals originais; o artigo arquivado da consolidação permanece ausente. **Os seis lastmod ainda estão antigos no cache remoto.** Listagem continua com as seis descrições antigas; perfil mostra descrições antigas dos itens do lote incluídos em seus 12 mais recentes (#30/#22). Ausência dos outros quatro no perfil é compatível com esse limite, não exclusão do acervo. Cabeçalhos observados: x-nextjs-cache HIT. Não se promete prazo de sincronização do sitemap nem se confunde o build local com invalidação da instância hospedada. Não houve purge, endpoint improvisado ou regravação de artigos para forçar cache, pois a action normal poderia limpar scheduledAt.

Feed: 30 itens e identidades únicas, seis GUIDs/links originais presentes, datas de publicação originais e descrições novas, sem o arquivado. **A validação real com parser XML FALHOU:** ${xml.feed.error}. Causa identificada na linha 48 do arquivo src/app/feed.xml/route.ts: título fixo do canal contém ampersand sem escape, também presente na resposta pública. O arquivo não foi alterado neste lote, e o defeito é preexistente. Extração de itens por regex e HTTP 200 não equivalem a RSS válido. Corrigir essa linha e implantar pertence a etapa técnica posterior autorizada; não foi executado deploy nem alterado esse arquivo.

Evidências: verificacao-publica-final.json, sitemap-publico.xml, feed-publico.xml e validacao-xml.json. As verificações HTTP fizeram somente GET/HEAD, sem executar JavaScript/contador, newsletter ou contato.

## Revisão dos editores: limitação de execução

O controle de navegador dedicado estava indisponível. A alternativa com a skill [Computer Use](C:/Users/Diego%20Torres/.codex/plugins/cache/openai-bundled/computer-use/26.1103.32239/skills/computer-use/SKILL.md) foi interrompida automaticamente ao não conseguir determinar a URL atual do navegador Windows com segurança. Nenhuma interação adicional de UI foi feita. Os GETs sem sessão confirmaram proteção 307/login, e a leitura dos seis registros passou no validador local real, mas **não foi possível concluir a interação autenticada com os seis editores**. Não foi alegado teste de salvamento no CMS remoto. As correções locais de checklist ainda não foram implantadas; a versão hospedada do editor pode continuar usando regras anteriores até deploy autorizado.

## Distribuição do acervo e C restantes

**30 publicados: ${counts.A} A, ${counts.B} B, ${counts.C} C, ${counts.D} D; ${inventory.filter(a => a.status === "ARCHIVED").length} arquivado.** A média ponderada comparável dos mesmos 30 IDs publicados passou de ${baselineAverage.toFixed(2)} para ${average.toFixed(2)}/100. A média combina as últimas avaliações conhecidas dos artigos não alterados com a reauditoria deste lote; não é uma nova auditoria integral dos 30. O arquivado foi excluído de ambas as médias. Inventário por ID/nota/classe em distribuicao-acervo.json.

| C remanescente | Nota/classe | Tratamento na auditoria final | Motivo |
| --- | --- | --- | --- |
${cTable}

Os quatro corpos continuam idênticos à auditoria original; as limitações ainda se aplicam. #17, #23 e #27 merecem prioridade na auditoria final; #7 é manutenção futura de menor risco relativo, preservando a ressalva de precisão do termo clínico. Não foi criado novo lote nem alterado nenhum deles.

Essa separação é **inferência editorial de risco**, não identificação de infração/rejeição pelo Google. A [política oficial de valor do inventário](https://support.google.com/publisherpolicies/answer/11112688?hl=en), consultada nesta etapa, exige conteúdo com valor para o usuário, mas não define nossas classes A/B/C/D ou pontuações. Não há garantia de aprovação AdSense, nem evidência de que qualquer um desses quatro, isoladamente, cause reprovação. A decisão sobre novo trabalho permanece para a auditoria final solicitada pelo usuário.

## Testes técnicos após a aplicação

| Comando | Resultado |
| --- | --- |
${technical}

**17 testes passaram:** adaptação exata/trava do pacote, validador e revisão manual, preview somente de leitura, incrementos de views e rejeição transacional de scheduledAt corrompido. O teste de preview passou a usar porta efêmera para não disputar a porta da revisão humana já aberta; não foi encerrado o servidor do usuário. Build Next 15.5.29 concluiu 37/37 páginas, lint, tipos, otimização e traces. Dois avisos preexistentes: img em administracao/seguranca/page.tsx:100 e destroySession não utilizado em AdminLayout.tsx:3. Prisma validate/generate passaram, sem db push/migração. git diff --check foi conferido na finalização. Os logs/testes-tecnicos.json desta pasta correspondem à execução pós-aplicação.

## Arquivos e pendências

Scripts de apoio ficam em scripts/: apply-editorial-lote2.ts e check-editorial-lote2.mjs foram atualizados; editorial-preview.test.ts e serve-editorial-preview.mjs receberam apenas ajuste para porta isolada de teste. Novos: editorial-lote2-guards.ts, editorial-lote2-guards.test.ts, refresh-editorial-lote2-baseline.ts, verify-editorial-lote2-integrity.ts, verify-editorial-lote2-public.mjs e report-editorial-lote2.mjs. preflight-editorial-lote2.ts é o verificador estrito da tentativa anterior, mantido como histórico; a retomada autorizada usa o novo verificador de baseline com views dinâmicas.

Nesta pasta foram atualizados antes-aplicacao.json, depois-aplicacao.json, integridade-final.json, relatorio.md, comparativo.md, referencias.md e logs técnicos. Criados: antes-aplicacao-original.json, depois-antes-retomada-final.json, autorizacao-retomada-final.json, verificacao-banco-final.json, verificacao-publica-final.json, verificacao-admin.json, validacao-xml.json, sitemap-publico.xml, feed-publico.xml, avaliacoes.json e distribuicao-acervo.json. Os documentos ../validacao-cms/relatorio.md e ../validacao-cms/revisao-manual.md receberam aviso de atualização apontando para o resultado aplicado, preservando os resultados offline antigos como histórico. Arquivos aprovados de ../lote-2/ permanecem integralmente intactos; evidências anteriores não foram apagadas. Não houve nova alteração de src, schema, dependências ou template nesta retomada. Existem alterações locais da etapa anterior do validador no Git; elas não foram confundidas com aplicação em produção.

Pendências concretas: (1) cache de sitemap/listagem/perfil; (2) feed XML inválido por defeito preexistente; (3) inspeção autenticada dos editores interrompida pelo controle de URL; (4) implantação futura das correções locais do checklist e eventual consumo dos campos SEO, somente quando autorizada. A revisão editorial/visual aprovada dos dois artigos foi registrada e **não permanece pendente no banco**.

Nenhum outro artigo foi alterado por esta tarefa. .next/ continua ignorado pelo Git. **Sem commit, push ou deploy.**
`;
save("relatorio.md", report);
console.log(JSON.stringify({ counts, archived: inventory.filter(a => a.status === "ARCHIVED").length, baselineAverage, average, remainingC: remainingC.map(a => a.number) }, null, 2));
