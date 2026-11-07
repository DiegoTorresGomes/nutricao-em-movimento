// Offline regression checks: reads the committed audit, never accesses a DB.
// Run: node --import tsx --test scripts/check-editorial-structure.test.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { articleBody, normalizeInternalLinks, withoutBodyH1 } from "../src/lib/editor/article-body";
import { articleModifiedAt, hasEditorialChanges, originalPublishedAt } from "../src/lib/editorial-dates";
import { renderBlocksToHtml } from "../src/lib/editor/render-blocks-to-html";
import { nutritionistConfig } from "../src/config/nutritionist";
import type { EditorBlock } from "../src/lib/editor/blocks";
import { isValidElement, type ReactNode } from "react";
import * as React from "react";

const audit = JSON.parse(readFileSync("docs/editorial/auditoria-artigos/dados.json", "utf8")) as {
  articles: { number: number; slug: string; content: string; contentBlocks: EditorBlock[] | null; publishedAt: string; authorId: string }[];
};

test("all 31 bodies retain their text except the three targeted corrections in #3", () => {
  assert.equal(audit.articles.length, 31);
  for (const article of audit.articles) {
    const html = articleBody(article.content, article.slug);
    assert.equal(articleBody(html, article.slug), html, "idempotent");
    assert.doesNotMatch(html, /<h1\b/i);
    assert.doesNotMatch(html, /<a\b[^>]*href=["']https?:\/\/(?:www\.)?nutricaoemovimento\.com\//i);
    if (article.number !== 3) assert.equal(html, normalizeInternalLinks(article.content));
    else {
      assert.match(article.content, /<h1\b/);
      assert.equal((html.match(/fome-emocional-ou-fome-fisica-aprenda-a-identificar-a-diferenca/g) || []).length, 2);
      assert.doesNotMatch(html, /Ler artigo sobre Escala|Escala da Fome e Saciedade: Como/);
      assert.match(html, /Para aprofundar a diferença entre fome emocional e fome física/);
      // Undo the three exact text edits and H1 conversion to prove there is no rewrite.
      const restored = html
        .replace("Ler artigo sobre fome emocional e fome física", "Ler artigo sobre Escala da Fome e Saciedade")
        .replace("Fome emocional ou fome física? Aprenda a identificar a diferença", "Escala da Fome e Saciedade: Como Aprender a Ouvir Seu Corpo")
        .replace("Para aprofundar a diferença entre fome emocional e fome física, vale conferir:", "Se você ainda não leu nosso conteúdo completo sobre esse tema, vale conferir:");
      assert.equal(restored, withoutBodyH1(normalizeInternalLinks(article.content)));
    }
    assert.ok(nutritionistConfig.publishingAccountIds.includes(article.authorId));
    const publishedAt = new Date(article.publishedAt);
    assert.equal(articleModifiedAt({ publishedAt, editorialUpdatedAt: null }), publishedAt);
  }
  assert.equal(nutritionistConfig.name, "Weverlyn da Cruz Alves Torres");
  assert.equal(nutritionistConfig.crn, "CRN 24101524");
});

test("only official anchor hosts are normalized; external assets, suffix hosts and fragments survive", () => {
  const html = '<a href="https://nutricaoemovimento.com/pt/x?q=1#s">A</a><a href="https://www.nutricaoemovimento.com/pt/y">B</a>';
  assert.equal(normalizeInternalLinks(html), '<a href="/pt/x?q=1#s">A</a><a href="/pt/y">B</a>');
  for (const url of ["https://nutricaoemovimento.com.evil.test/x", "https://res.cloudinary.com/pdf", "#section"]) {
    const anchor = `<a href="${url}">Texto</a>`;
    assert.equal(normalizeInternalLinks(anchor), anchor);
  }
  assert.equal(withoutBodyH1('<h1 class="title">Título</h1><h3>Seção</h3>'), '<h2 class="title">Título</h2><h3>Seção</h3>');
});

test("technical changes never supply a date; original publication survives archiving and republication", () => {
  const publication = new Date("2026-06-15T12:00:00Z");
  const review = new Date("2026-11-07T12:00:00Z");
  assert.equal(articleModifiedAt({ publishedAt: null, editorialUpdatedAt: null }), undefined);
  assert.equal(articleModifiedAt({ publishedAt: publication, editorialUpdatedAt: review }), review);
  for (const status of ["PUBLISHED", "DRAFT", "SCHEDULED", "ARCHIVED"]) {
    assert.equal(originalPublishedAt(publication, status, review), publication);
  }
  assert.equal(originalPublishedAt(null, "PUBLISHED", review), review);
  assert.equal(originalPublishedAt(null, "DRAFT", review), null);
  assert.equal(hasEditorialChanges({ title: "A", views: 50 }, { title: "A" }), false);
  assert.equal(hasEditorialChanges({ title: "A" }, { title: "B" }), true);
  assert.equal(hasEditorialChanges({ seoTitle: null }, { seoTitle: "" }), false);
});

test("saving the 31 existing bodies unchanged does not manufacture an editorial change", () => {
  for (const post of audit.articles) {
    const submitted = post.contentBlocks?.length ? renderBlocksToHtml(post.contentBlocks) : post.content.trim();
    const previous = { content: withoutBodyH1(articleBody(post.content.trim(), post.slug)) };
    const next = { content: withoutBodyH1(articleBody(submitted, post.slug)).trim() };
    assert.equal(hasEditorialChanges(previous, next), false, post.slug);
    assert.equal(hasEditorialChanges(previous, { content: next.content + "<p>Revisão editorial.</p>" }), true);
  }
});

test("references preserve legacy text, escape content, resolve DOI and reject unsafe links", () => {
  const html = renderBlocksToHtml([{ id: "refs", type: "references", data: { items: [
    "Referência legada", { author: "Autor <teste>", title: "Documento & teste", publication: "Publicação", year: "2024", doi: "10.1234/exemplo", sourceType: "Guideline" },
    { author: "Teste", title: "Sem link inseguro", url: "javascript:alert(1)" },
    { title: "URL alternativa", url: "https://example.org/documento" },
  ] } }]);
  assert.match(html, /Referência legada/);
  assert.match(html, /Autor &lt;teste&gt;\. Documento &amp; teste\. Publicação\. 2024/);
  assert.match(html, /href="https:\/\/doi.org\/10.1234\/exemplo" target="_blank" rel="noopener noreferrer"/);
  assert.match(html, /href="https:\/\/example.org\/documento"/);
  assert.doesNotMatch(html, /javascript:|nofollow|\[object Object\]/);
  assert.equal(renderBlocksToHtml([{ id: "empty", type: "references", data: { items: [] } }]), "");
});

test("view endpoint issues a parameterized counter-only update (mock DB, no connection)", async () => {
  const { prisma } = await import("../src/lib/prisma");
  const { POST } = await import("../src/app/api/posts/[id]/view/route");
  const calls: { sql: string; values: unknown[] }[] = [];
  const original = prisma.$executeRaw;
  prisma.$executeRaw = (async (strings: TemplateStringsArray, ...values: unknown[]) => {
    calls.push({ sql: strings.join("?"), values });
    return 1;
  }) as typeof prisma.$executeRaw;
  try {
    const id = "untrusted-' OR 1=1 --";
    const response = await POST(new Request("http://localhost/api/posts/test/view", { method: "POST" }), { params: Promise.resolve({ id }) });
    assert.deepEqual(await response.json(), { ok: true });
    assert.equal(calls.length, 1);
    assert.match(calls[0].sql, /SET views = views \+ 1 WHERE id = \? AND status = 'PUBLISHED'/);
    assert.doesNotMatch(calls[0].sql, /updatedAt|editorialUpdatedAt|publishedAt|OR 1=1/);
    assert.deepEqual(calls[0].values, [id]);
  } finally {
    prisma.$executeRaw = original;
    await prisma.$disconnect();
  }
});

test("actual article page metadata and BlogPosting use editorial dates and canonical authorship (31 mocked records)", async () => {
  // tsx uses classic JSX with this repo's jsx:preserve; Next's compiler uses
  // automatic JSX. Supply React only for this offline invocation and restore it.
  const globals = globalThis as typeof globalThis & { React?: typeof React };
  const previousReact = globals.React;
  globals.React = React;
  const { prisma } = await import("../src/lib/prisma");
  const { default: ArticlePage, generateMetadata } = await import("../src/app/pt/artigos/[slug]/page");
  const first = prisma.post.findFirst;
  const many = prisma.post.findMany;
  let current: unknown;
  prisma.post.findFirst = (async () => current) as typeof first;
  prisma.post.findMany = (async () => []) as unknown as typeof many;
  function schemas(node: ReactNode): Record<string, unknown>[] {
    if (Array.isArray(node)) return node.flatMap(schemas);
    if (!isValidElement(node)) return [];
    const props = node.props as { type?: string; children?: ReactNode; dangerouslySetInnerHTML?: { __html: string } };
    if (node.type === "script" && props.type === "application/ld+json") return [JSON.parse(props.dangerouslySetInnerHTML!.__html)];
    return schemas(props.children);
  }
  try {
    for (const post of audit.articles) {
      current = { ...post, publishedAt: new Date(post.publishedAt), editorialUpdatedAt: null, updatedAt: new Date("2099-01-01T00:00:00Z") };
      const props = { params: Promise.resolve({ slug: post.slug }) };
      const metadata = await generateMetadata(props);
      assert.equal(metadata.alternates?.canonical, `/pt/artigos/${post.slug}`);
      assert.equal((metadata.openGraph as { modifiedTime?: string }).modifiedTime, new Date(post.publishedAt).toISOString());
      const schema = schemas(await ArticlePage(props)).find(item => item["@type"] === "BlogPosting")!;
      assert.ok(schema);
      assert.equal(schema.datePublished, new Date(post.publishedAt).toISOString());
      assert.equal(schema.dateModified, schema.datePublished);
      assert.equal((schema.author as { name: string }).name, nutritionistConfig.name);
      assert.equal((schema.author as { url: string }).url, nutritionistConfig.authorUrl);
      assert.equal((schema.mainEntityOfPage as { "@id": string })["@id"], `https://www.nutricaoemovimento.com/pt/artigos/${post.slug}`);
    }
    const review = new Date("2026-11-07T12:00:00Z");
    current = { ...(current as object), editorialUpdatedAt: review };
    const props = { params: Promise.resolve({ slug: audit.articles[30].slug }) };
    const updatedSchema = schemas(await ArticlePage(props)).find(item => item["@type"] === "BlogPosting")!;
    assert.equal(updatedSchema.dateModified, review.toISOString());
  } finally {
    prisma.post.findFirst = first;
    prisma.post.findMany = many;
    if (previousReact) globals.React = previousReact;
    else Reflect.deleteProperty(globals, "React");
    await prisma.$disconnect();
  }
});

test("sitemap and feed serialize publication/review dates, including absent dates (mock DB)", async () => {
  const { prisma } = await import("../src/lib/prisma");
  const { default: sitemap } = await import("../src/app/sitemap");
  const { GET } = await import("../src/app/feed.xml/route");
  const original = prisma.post.findMany;
  let posts = audit.articles.map(post => ({ ...post, publishedAt: new Date(post.publishedAt) as Date | null, editorialUpdatedAt: null as Date | null, updatedAt: new Date("2099-01-01T00:00:00Z") }));
  prisma.post.findMany = (async () => posts) as unknown as typeof original;
  try {
    const entries = (await sitemap()).filter(item => item.url.includes("/pt/artigos/"));
    assert.equal(entries.length, 31);
    entries.forEach((entry, index) => assert.equal((entry.lastModified as Date).toISOString(), posts[index].publishedAt!.toISOString()));
    const xml = await (await GET()).text();
    assert.equal((xml.match(/<pubDate>/g) || []).length, 31);
    assert.doesNotMatch(xml, /2099/);
    posts[0].editorialUpdatedAt = new Date("2026-11-07T12:00:00Z");
    assert.match(await (await GET()).text(), /<lastBuildDate>Sat, 07 Nov 2026 12:00:00 GMT<\/lastBuildDate>/);
    posts = [{ ...posts[0], publishedAt: null, editorialUpdatedAt: null }];
    assert.doesNotMatch(await (await GET()).text(), /<pubDate>|<lastBuildDate>|2099|1970/);
    const missingDate = (await sitemap()).find(item => item.url.endsWith(`/pt/artigos/${posts[0].slug}`));
    assert.equal(missingDate?.lastModified, undefined);
  } finally {
    prisma.post.findMany = original;
    await prisma.$disconnect();
  }
});
