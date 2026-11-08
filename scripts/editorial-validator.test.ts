import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { validatePostBeforePublish, type ValidatePostInput } from "../src/lib/editor/validate-post";
import { analyzeHtmlContent } from "../src/components/editor/analyze-html-content";
import { nutritionistConfig } from "../src/config/nutritionist";

const complete: ValidatePostInput = {
  authorId: nutritionistConfig.publishingAccountIds[0],
  title: "Artigo completo", description: "Resumo", categoryId: "categoria",
  seoTitle: "Título SEO", seoDescription: "Descrição SEO", focusKeyword: "alimentação",
  coverImageAlt: "Alimentos", blocks: [], useLegacyHtml: true,
  content: `<h2>Orientações</h2><p>${"Conteúdo educativo com orientações. ".repeat(5)}</p>`,
  desktopReviewed: true, tabletReviewed: true, mobileReviewed: true,
  hasOtherPublishedPosts: true,
};
const items = (input: ValidatePostInput) => validatePostBeforePublish(input).groups.flatMap(g => g.items);

test("A: canonical template author satisfies authorship without a body biography", () => {
  assert.equal(validatePostBeforePublish(complete).canPublish, true);
  assert.equal(items(complete).find(i => i.label === "Autoria canônica no template")?.ok, true);
  // Contract with the actual template, not a caller-supplied approval flag.
  const template = readFileSync("src/app/pt/artigos/[slug]/page.tsx", "utf8");
  assert.match(template, /href=\{nutritionistConfig.authorPath\}/);
  assert.match(template, /nutritionistConfig.displayName.*nutritionistConfig.credential/);
});

test("body words cannot replace an identified canonical author", () => {
  for (const authorId of [null, "unknown-account"]) {
    const result = validatePostBeforePublish({ ...complete, authorId, content: complete.content + "<p>Sobre a autora: nutricionista</p>" });
    assert.ok(result.missingRequired.includes("Autoria canônica no template"));
  }
  const original = nutritionistConfig.credential;
  try {
    nutritionistConfig.credential = "";
    assert.ok(validatePostBeforePublish(complete).missingRequired.includes("Autoria canônica no template"));
  } finally { nutritionistConfig.credential = original; }
});

test("B: absent commercial CTA and related links are recommendations, not blockers", () => {
  const result = validatePostBeforePublish(complete);
  assert.equal(result.canPublish, true);
  for (const label of ["CTA editorial", "Artigo relacionado", "Link interno"]) {
    const item = result.groups.flatMap(g => g.items).find(i => i.label === label);
    assert.equal(item?.required, false);
    assert.equal(item?.ok, false);
  }
  assert.equal(analyzeHtmlContent("<p>Não substitui consulta ou newsletter.</p>").hasCta, false);
});

test("C: editorial links and valid CTA blocks are recognized without inserting content", () => {
  for (const href of ["/pt/artigos/exemplo", "/pt/contato", "mailto:contato@example.com", "https://wa.me/5521979762589"]) {
    assert.equal(analyzeHtmlContent(`<a href="${href}">Leia ou entre em contato</a>`).hasCta, true);
  }
  for (const href of ["", "javascript:alert(1)", "https://", "data:text/html,unsafe"]) {
    assert.equal(analyzeHtmlContent(`<a href="${href}">Leia mais</a>`).hasCta, false);
  }
  assert.equal(analyzeHtmlContent('<a href="https://doi.org/10.1234/example">Fonte científica</a>').hasCta, false);
  const blocks = [{ id: "cta", type: "cta" as const, data: { href: "/pt/contato", buttonText: "Contato" } }];
  assert.equal(items({ ...complete, useLegacyHtml: false, blocks }).find(i => i.label === "CTA editorial")?.ok, true);
  assert.equal(items({ ...complete, useLegacyHtml: false, blocks: [{ ...blocks[0], data: {} }] }).find(i => i.label === "CTA editorial")?.ok, false);
});

test("D: visual review and preview timestamps remain real, unmodified inputs", () => {
  const input = { ...complete, desktopReviewed: false, tabletReviewed: false, mobileReviewed: false, lastPreviewAt: null };
  const before = structuredClone(input);
  const result = validatePostBeforePublish(input);
  assert.deepEqual(result.missingRequired, ["Preview Desktop revisado", "Preview Tablet revisado", "Preview Mobile revisado"]);
  assert.deepEqual(input, before);
  assert.equal(validatePostBeforePublish({ ...input, content: complete.content + "<table></table>" }).groups.at(-1)?.items.find(i => i.label === "Tabelas responsivas")?.ok, false);
});

test("E: missing real content, author, category and metadata still block", () => {
  for (const key of ["title", "description", "categoryId", "seoTitle", "seoDescription", "coverImageAlt", "content"] as const) {
    assert.equal(validatePostBeforePublish({ ...complete, [key]: "" }).canPublish, false, key);
  }
  assert.ok(validatePostBeforePublish({ ...complete, content: "<p>Texto</p>" }).missingRequired.includes("Pelo menos 1 H2"));
  assert.ok(validatePostBeforePublish({ ...complete, content: complete.content + '<img src="/image.jpg">' }).missingRequired.includes("Alt das imagens internas"));
});

test("focus keyword is optional internal guidance and never rewrites title, slug or body", () => {
  const input = { ...complete, focusKeyword: null, slug: "slug-existente" };
  const before = structuredClone(input);
  const absent = validatePostBeforePublish(input);
  assert.equal(absent.canPublish, true);
  const item = absent.groups.flatMap(g => g.items).find(i => i.label === "Palavra-chave principal");
  assert.equal(item?.ok, false);
  assert.equal(item?.required, false);
  for (const focusKeyword of ["comer por emoção", "alimentação consciente", "termo ausente do texto"]) {
    const supplied = { ...input, focusKeyword };
    const original = structuredClone(supplied);
    const result = validatePostBeforePublish(supplied);
    assert.equal(result.canPublish, true);
    assert.equal(result.groups.flatMap(g => g.items).find(i => i.label === "Palavra-chave principal")?.ok, true);
    assert.deepEqual(supplied, original);
  }
  assert.deepEqual(input, before);
});

test("six approved Lote 2 proposals: four pass, two keep only visual blockers; no mutation", () => {
  const base = "docs/editorial/revisao-lote-2/";
  const snapshot = JSON.parse(readFileSync(base + "antes-aplicacao.json", "utf8"));
  const prepared = JSON.parse(readFileSync(base + "pacote-aplicacao.json", "utf8"));
  const fingerprint = () => readdirSync("docs/editorial/lote-2").sort().map(file => createHash("sha256").update(readFileSync("docs/editorial/lote-2/" + file)).digest("hex"));
  const before = fingerprint();
  const original = JSON.stringify({ snapshot, prepared });
  for (const proposal of prepared.articles) {
    const saved = snapshot.articles.find((a: { id: string }) => a.id === proposal.id);
    const result = validatePostBeforePublish({ ...saved, ...proposal, blocks: [], useLegacyHtml: true, hasOtherPublishedPosts: true });
    assert.equal(result.canPublish, ![1, 2].includes(proposal.number), `#${proposal.number}`);
    assert.deepEqual(result.missingRequired, [1, 2].includes(proposal.number)
      ? ["Preview Desktop revisado", "Preview Tablet revisado", "Preview Mobile revisado"] : []);
  }
  assert.deepEqual(fingerprint(), before);
  assert.equal(JSON.stringify({ snapshot, prepared }), original);
  assert.equal(JSON.parse(readFileSync(base + "interrupcao.json", "utf8")).writeCount, 0);
});
