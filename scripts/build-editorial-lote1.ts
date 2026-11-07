// Offline review package. No Prisma import, network access or database writes.
// --write regenerates review artifacts; default mode checks they are current.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { renderBlocksToHtml } from "../src/lib/editor/render-blocks-to-html";
import type { EditorBlock } from "../src/lib/editor/blocks";
import type { ScientificReference } from "../src/lib/editor/references";
import { articleBody } from "../src/lib/editor/article-body";
import { nutritionistConfig } from "../src/config/nutritionist";

const root = "docs/editorial/lote-1";
type Element = { h2: string } | { h3: string } | { p: string } | { ul: string[] }
  | { table: { caption: string; headers: string[]; rows: string[][] } }
  | { related: number; reason: string }
  | { cta: { title: string; text: string; href: string; buttonText: string } };
type Draft = { number: number; description: string; references: string[]; suggestedRelated: number[]; elements: Element[] };
type Source = ScientificReference & { supports: string; limitations: string };
type Original = {
  number: number; id: string; title: string; slug: string; publishedAt: string;
  editorialUpdatedAt: string | null; authorId: string; categoryId: string;
  category: { name: string }; seoTitle: string | null; contentHash: string;
  content: string; coverImage: string | null; coverImageAlt: string | null;
  public: { canonical: string; related: string[]; status: number };
};
const read = (name: string) => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const baseline = read("baseline.json") as { articles: Original[] };
const drafts = read("conteudos.json") as { status: string; articles: Draft[] };
const sources = (read("fontes.json") as { sources: Record<string, Source> }).sources;
const corpus = JSON.parse(fs.readFileSync("docs/editorial/auditoria-artigos/dados.json", "utf8")) as { articles: { number: number; title: string; slug: string; id: string }[] };
const write = process.argv.includes("--write");
const expected = [31, 3, 26, 6, 10];
assert.deepEqual(drafts.articles.map(post => post.number), expected);
assert.deepEqual(baseline.articles.map(post => post.number), expected);

function escape(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function related(number: number) {
  const post = corpus.articles.find(post => post.number === number);
  assert.ok(post, `Unknown related article ${number}`);
  return { id: post.id, title: post.title, href: `/pt/artigos/${post.slug}` };
}
function citation(source: ScientificReference) {
  const url = source.doi ? `https://doi.org/${source.doi}` : source.url;
  return `${[source.author, source.title, source.publication, source.year].filter(Boolean).join(". ")}. [${source.doi ? "DOI" : "Fonte"}](${url}).`;
}
function emit(relative: string, content: string) {
  const filename = path.join(root, relative);
  if (write) { fs.mkdirSync(path.dirname(filename), { recursive: true }); fs.writeFileSync(filename, content); }
  else assert.equal(fs.readFileSync(filename, "utf8"), content, `Stale artifact: ${filename}`);
}

const packages = drafts.articles.map((draft, index) => {
  const original = baseline.articles.find(post => post.number === draft.number)!;
  assert.ok(original);
  assert.equal(original.id, corpus.articles.find(post => post.number === draft.number)!.id);
  assert.equal(createHash("sha256").update(original.content).digest("hex"), original.contentHash);
  assert.equal(original.public.canonical, `https://www.nutricaoemovimento.com/pt/artigos/${original.slug}`);
  assert.equal(original.public.status, 200);
  assert.ok("h2" in draft.elements[0]);
  assert.ok(draft.description.trim().endsWith("."));
  const seenCitations = new Set<number>();
  for (const match of JSON.stringify(draft.elements).matchAll(/\[(\d+(?:,\s*\d+)*)\]/g)) {
    for (const n of match[1].split(",").map(Number)) {
      assert.ok(n >= 1 && n <= draft.references.length, `Invalid citation ${n} in ${draft.number}`);
      seenCitations.add(n);
    }
  }
  assert.equal(seenCitations.size, draft.references.length, `Unused source in ${draft.number}`);
  const refs = draft.references.map(key => {
    assert.ok(sources[key], `Unknown source ${key}`);
    const { author, title, publication, year, doi, url, sourceType } = sources[key];
    assert.ok(author && title && year && url);
    assert.equal(new URL(url!).protocol, "https:");
    return { author, title, publication, year, doi, url, sourceType };
  });
  let hasH2 = false;
  const blocks: EditorBlock[] = draft.elements.map((element, i) => {
    const id = `lote1-${draft.number}-${i + 1}`;
    if ("h2" in element) { hasH2 = true; return { id, type: "heading", data: { level: 2, text: element.h2 } }; }
    if ("h3" in element) { assert.ok(hasH2); return { id, type: "heading", data: { level: 3, text: element.h3 } }; }
    if ("p" in element) return { id, type: "paragraph", data: { text: element.p } };
    if ("ul" in element) return { id, type: "unorderedList", data: { items: element.ul } };
    if ("table" in element) return { id, type: "table", data: element.table };
    if ("related" in element) {
      const target = related(element.related);
      assert.notEqual(element.related, draft.number);
      return { id, type: "relatedArticle", data: { title: "Para continuar a leitura", text: element.reason, href: target.href, linkText: target.title } };
    }
    return { id, type: "cta", data: element.cta };
  });
  blocks.push({ id: `lote1-${draft.number}-references`, type: "references", data: { items: refs } });
  const content = articleBody(renderBlocksToHtml(blocks), original.slug).trim();
  assert.doesNotMatch(content, /<h1\b|https?:\/\/nutricaoemovimento\.com\//i);
  assert.doesNotMatch(content, /nofollow|\[object Object\]/);
  assert.equal(articleBody(content, original.slug), content);
  const bodyLinks = [...content.matchAll(/href="(\/pt\/artigos\/[^"#?]+)"/g)].map(match => match[1]);
  assert.ok(new Set(bodyLinks).size >= 1 && new Set(bodyLinks).size <= 3);
  for (const href of bodyLinks) assert.ok(corpus.articles.some(post => href === `/pt/artigos/${post.slug}`));

  const markdownBody = draft.elements.map(element => {
    if ("h2" in element) return `## ${element.h2}`;
    if ("h3" in element) return `### ${element.h3}`;
    if ("p" in element) return element.p;
    if ("ul" in element) return element.ul.map(item => `- ${item}`).join("\n");
    if ("related" in element) { const target = related(element.related); return `${element.reason}\n\n[${target.title}](https://www.nutricaoemovimento.com${target.href})`; }
    if ("cta" in element) return `## ${element.cta.title}\n\n${element.cta.text}\n\n[${element.cta.buttonText}](https://www.nutricaoemovimento.com${element.cta.href})`;
    const table = element.table;
    return `${table.caption}\n\n| ${table.headers.join(" | ")} |\n| ${table.headers.map(() => "---").join(" | ")} |\n${table.rows.map(row => `| ${row.join(" | ")} |`).join("\n")}`;
  }).join("\n\n") + "\n\n## Referências científicas\n\n" + refs.map((ref, i) => `${i + 1}. ${citation(ref)}`).join("\n");
  const fileBase = `${String(index + 1).padStart(2, "0")}-${["fomes", "relacao-com-a-comida", "nutricao-e-movimento", "vontade-de-doce", "carboidrato-a-noite"][index]}`;
  const identity = { id: original.id, title: original.title, slug: original.slug, url: original.public.canonical, publishedAt: original.publishedAt, editorialUpdatedAtAtCapture: original.editorialUpdatedAt, authorId: original.authorId, categoryId: original.categoryId, seoTitle: original.seoTitle, coverImage: original.coverImage, coverImageAlt: original.coverImageAlt };
  const markdown = `# ${original.title}\n\n**Proposta para revisão humana — não publicada.**\n\nAutora editorial: [${nutritionistConfig.displayName}](${nutritionistConfig.authorPath}), ${nutritionistConfig.role}, ${nutritionistConfig.crn}. Responsabilidade final de ${nutritionistConfig.name}; revisão desta proposta ainda pendente.\n\n- URL preservada: ${identity.url}\n- ID: \`${identity.id}\`\n- Publicação original UTC: \`${identity.publishedAt}\`\n- Categoria preservada: ${original.category.name}\n- Descrição proposta: ${draft.description}\n\nO H1 acima representa o título do template; o corpo abaixo começa em H2. Autoria e disclaimer completos são fornecidos pelo template existente, sem repetir uma biografia no corpo. Os números entre colchetes remetem às fontes listadas no final.\n\n<!-- BEGIN ARTICLE BODY -->\n\n${markdownBody}\n\n<!-- END ARTICLE BODY -->\n`;
  emit(`artigos/${fileBase}.md`, markdown.replace(`](${nutritionistConfig.authorPath})`, `](${nutritionistConfig.authorUrl})`));
  const preview = `<!doctype html>\n<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><base href="https://www.nutricaoemovimento.com"><title>PROPOSTA — ${escape(original.title)}</title><style>body{font:18px/1.8 system-ui,sans-serif;color:#222;background:#faf8f4;margin:0}main{max-width:860px;margin:auto;padding:32px 20px}h1{font-size:2rem;line-height:1.3}h2{font-size:1.5rem;line-height:1.4;margin-top:2.5rem}h3{font-size:1.2rem;line-height:1.5}a{color:#465a28}p,li{overflow-wrap:anywhere}.notice{padding:16px;background:#fff1c7;border-radius:12px}footer{margin-top:32px;border-top:1px solid #bbb;font-size:.9rem}</style></head><body><main><p class="notice">Proposta editorial para avaliação de Weverlyn. Não publicada; não comprova revisão humana concluída.</p><article><header><h1>${escape(original.title)}</h1><p>Por <a href="${nutritionistConfig.authorPath}">${nutritionistConfig.displayName}</a> — ${nutritionistConfig.crn}</p><p>Publicação original: <time datetime="${original.publishedAt}">${new Date(original.publishedAt).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}</time>. Atualização editorial: pendente de aprovação e aplicação.</p></header><div class="article-content">${content}</div><footer>Conteúdo educativo. Não substitui avaliação individualizada. Autoria e responsabilidade editorial final: ${nutritionistConfig.name}.</footer></article></main></body></html>\n`;
  assert.equal((preview.match(/<h1\b/g) || []).length, 1);
  emit(`previas/${fileBase}.html`, preview);
  return { number: draft.number, status: "AGUARDANDO_REVISAO_DE_WEVERLYN", baselineContentHash: original.contentHash, preserve: identity, proposedChanges: { description: draft.description, seoDescription: draft.description, content, contentBlocks: blocks }, currentAutomaticRelated: original.public.related, suggestedRelated: draft.suggestedRelated.map(related), sources: draft.references, files: { markdown: `artigos/${fileBase}.md`, preview: `previas/${fileBase}.html` } };
});
emit("propostas.json", JSON.stringify({ status: drafts.status, writesToDatabase: false, editorialDatePolicy: "Não atribuir data de revisão no rascunho; somente no salvamento editorial aprovado.", articles: packages }, null, 2) + "\n");
console.log(`${write ? "Generated" : "Checked"} five review packages: identity, dates, headings, citations, known internal destinations and reference rendering. No database access.`);
