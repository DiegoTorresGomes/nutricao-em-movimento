// Real HTTP + MariaDB checks, exclusively against the disposable localhost DB.
// Run via editorial-local-env.mjs; no remote configuration is accepted.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawn, execFileSync } from "node:child_process";
import { createServer } from "node:net";
import bcrypt from "bcryptjs";
import mariadb from "mariadb";

const database = "nutricao_editorial_disposable";
const base = "http://127.0.0.1:33117";
const primaryId = "editorial-local-primary";
const slug = "relacao-saudavel-com-a-comida-o-que-e-e-como-construi-la-no-dia-a-dia";
const target = "/pt/artigos/fome-emocional-ou-fome-fisica-aprenda-a-identificar-a-diferenca";
const publication = new Date("2026-01-15T12:00:00.000Z");
const logRoot = path.join(os.tmpdir(), "nutricao-editorial-mariadb-11.4.13");
const output = "docs/editorial/correcoes-estruturais/evidencias-local.json";
const initialContent = `<h1>Teste Editorial Local</h1><h2>Seção mantida</h2><h3>Detalhe mantido</h3><p>Texto fictício preservado.</p><p>Se você ainda não leu nosso conteúdo completo sobre esse tema, vale conferir:</p><a href="https://nutricaoemovimento.com${target}">Ler artigo sobre Escala da Fome e Saciedade</a><a href="https://nutricaoemovimento.com${target}">Escala da Fome e Saciedade: Como Aprender a Ouvir Seu Corpo</a>`;

async function main() {
  const url = new URL(process.env.DATABASE_URL || "");
  assert.equal(process.env.DB_HOST, "127.0.0.1");
  assert.equal(process.env.DB_PORT, "33317");
  assert.equal(process.env.DB_NAME, database);
  assert.equal(url.hostname, "127.0.0.1");
  assert.equal(url.port, "33317");
  assert.equal(url.pathname, `/${database}`);
  const mode = process.argv[2];
  if (mode === "prepare" || mode === "stop") {
    const connection = await mariadb.createConnection({ host: "127.0.0.1", port: 33317, user: process.env.DB_USER, password: process.env.DB_PASSWORD });
    try {
      if (mode === "stop") {
        await connection.query("SHUTDOWN");
        console.log("Stopped disposable localhost MariaDB.");
      } else {
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log("Created/verified disposable localhost database", (await connection.query("SELECT VERSION() AS version"))[0].version);
      }
    } finally { await connection.end(); }
    return;
  }
  const { prisma } = await import("../src/lib/prisma");
  try {
    if (mode === "seed") {
      const admin = await prisma.user.upsert({ where: { id: "editorial-local-admin" }, create: { id: "editorial-local-admin", name: "Administrador Fictício Local", email: "editorial-local@example.invalid", passwordHash: await bcrypt.hash(process.env.AUTH_SECRET!, 10) }, update: {} });
      await prisma.category.upsert({ where: { id: "editorial-local-category" }, create: { id: "editorial-local-category", name: "Bem-Estar Nutricional", slug: "bem-estar-nutricional" }, update: {} });
      const data = { title: "Teste Editorial Local", description: "Artigo fictício exclusivo para testes locais.", content: initialContent, status: "PUBLISHED" as const, publishedAt: publication, editorialUpdatedAt: null, views: 0, contentBlocks: undefined, authorId: admin.id, categoryId: "editorial-local-category", desktopReviewed: true, tabletReviewed: true, mobileReviewed: true };
      await prisma.post.upsert({ where: { id: primaryId }, create: { id: primaryId, slug, ...data }, update: data });
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.writeFileSync(path.join(logRoot, "before-db-push.json"), JSON.stringify(await prisma.post.findUniqueOrThrow({ where: { id: primaryId } })));
      console.log("Seeded one fictitious article, category and admin; timestamps recorded outside repository.");
      return;
    }
    if (mode === "verify-push") {
      const before = JSON.parse(fs.readFileSync(path.join(logRoot, "before-db-push.json"), "utf8"));
      const after = await prisma.post.findUniqueOrThrow({ where: { id: primaryId } });
      assert.equal(after.publishedAt!.toISOString(), before.publishedAt);
      assert.equal(after.updatedAt.toISOString(), before.updatedAt);
      assert.equal(after.editorialUpdatedAt, null);
      assert.equal(after.views, before.views);
      console.log("Second db push retained fixture, views and both original timestamps.");
      return;
    }
    assert.equal(mode, "run", "Expected prepare, seed, verify-push, run or stop");
    const runTag = Date.now().toString(36);
    const evidence: Record<string, unknown> = { testedAt: new Date().toISOString(), host: "127.0.0.1", port: 33317, database, results: {} };
    const results = evidence.results as Record<string, unknown>;
    const version = await prisma.$queryRaw<{ version: string }[]>`SELECT VERSION() AS version`;
    evidence.mariadbVersion = version[0].version;
    evidence.column = await prisma.$queryRaw`SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Post' AND COLUMN_NAME IN ('publishedAt', 'editorialUpdatedAt', 'updatedAt', 'views')`;
    // Never send writes to an already-running, possibly differently configured app.
    await new Promise<void>((resolve, reject) => {
      const probe = createServer();
      probe.once("error", reject);
      probe.listen({ host: "127.0.0.1", port: 33117, exclusive: true }, () => {
        probe.close(error => error ? reject(error) : resolve());
      });
    });
    const log = fs.openSync(path.join(logRoot, "next-dev.log"), "w");
    const npmCli = process.env.npm_execpath || path.join(path.dirname(process.execPath), "node_modules/npm/bin/npm-cli.js");
    assert.ok(fs.existsSync(npmCli), "Set npm_execpath to your npm-cli.js");
    const server = spawn(process.execPath, [npmCli, "run", "dev", "--", "--hostname", "127.0.0.1", "--port", "33117"], { env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" }, stdio: ["ignore", log, log], windowsHide: true });
    let cookie = "";
    const read = () => prisma.post.findUniqueOrThrow({ where: { id: primaryId } });
    async function request(route: string, init: RequestInit = {}) {
      assert.ok(route.startsWith("/") && !route.startsWith("//"));
      return fetch(base + route, { ...init, redirect: "manual", headers: { Cookie: cookie, Origin: base, ...init.headers }, signal: AbortSignal.timeout(120000) });
    }
    async function html(route: string) {
      const response = await request(route);
      assert.equal(response.status, 200, route);
      return response.text();
    }
    const decode = (value: string) => value.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
    function hiddenActions(page: string) {
      const data = new FormData();
      for (const match of page.matchAll(/<input\b[^>]*>/g)) {
        const name = match[0].match(/\bname="([^"]*)"/)?.[1];
        if (name?.startsWith("$ACTION_")) data.append(decode(name), decode(match[0].match(/\bvalue="([^"]*)"/)?.[1] || ""));
      }
      assert.ok([...data.keys()].some(key => key.startsWith("$ACTION_")), "Real Server Action marker missing");
      return data;
    }
    async function submit(route: string, fields: Record<string, string>) {
      const data = hiddenActions(await html(route));
      for (const [key, value] of Object.entries(fields)) data.set(key, value);
      const response = await request(route, { method: "POST", body: data });
      const responseBody = await response.text();
      assert.equal(response.status, 303, `${route}: ${response.status}: ${responseBody.slice(0, 180)}`);
      const setCookie = response.headers.get("set-cookie");
      if (setCookie) cookie = setCookie.split(";", 1)[0];
      return response;
    }
    function schema(page: string) {
      const all = [...page.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
      const article = all.find(item => item["@type"] === "BlogPosting");
      assert.ok(article, "BlogPosting missing");
      return article;
    }
    function fields(post: Awaited<ReturnType<typeof read>>) {
      return { title: post.title, description: post.description, content: post.content, contentBlocks: Array.isArray(post.contentBlocks) ? JSON.stringify(post.contentBlocks) : "[]", categoryId: post.categoryId, status: post.status, coverImage: post.coverImage || "", coverImageAlt: post.coverImageAlt || "", seoTitle: post.seoTitle || "", seoDescription: post.seoDescription || "", focusKeyword: post.focusKeyword || "", readTime: post.readTime || "", scheduledAt: post.scheduledAt?.toISOString() || "", desktopReviewed: "on", tabletReviewed: "on", mobileReviewed: "on" };
    }
    const edit = (post: Awaited<ReturnType<typeof read>>, changes: Record<string, string> = {}) => submit(`/administracao/artigos/${post.id}/editar`, { ...fields(post), ...changes });
    try {
      for (let attempt = 0; attempt < 90; attempt++) {
        if (server.exitCode !== null) throw new Error("Local Next server exited; inspect temporary next-dev.log");
        try { if ((await request("/login")).status === 200) break; } catch { /* Startup. */ }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      const before = await read();
      assert.equal(before.views, 0);
      assert.equal(before.editorialUpdatedAt, null);
      const originalHtml = await html(`/pt/artigos/${slug}`);
      assert.equal((originalHtml.match(/<h1\b/g) || []).length, 1);
      assert.match(originalHtml, /<h2>Teste Editorial Local<\/h2>/);
      assert.match(originalHtml, /<h2>Seção mantida<\/h2><h3>Detalhe mantido<\/h3><p>Texto fictício preservado\.<\/p>/);
      assert.match(originalHtml, /Ler artigo sobre fome emocional e fome física/);
      assert.match(originalHtml, /Fome emocional ou fome física\? Aprenda a identificar a diferença/);
      assert.equal((originalHtml.match(new RegExp(`href="${target}"`, "g")) || []).length, 2);
      results.headingsAndAnchors = { singleH1: true, h2h3AndTextPreserved: true, twoCorrectedAnchors: true, destination: `https://www.nutricaoemovimento.com${target}` };

      assert.equal((await request(`/api/posts/${primaryId}/view`, { method: "POST" })).status, 200);
      const afterView = await read();
      assert.equal(afterView.views, 1);
      assert.equal(afterView.publishedAt!.toISOString(), publication.toISOString());
      assert.equal(afterView.editorialUpdatedAt, null);
      assert.equal(afterView.updatedAt.toISOString(), before.updatedAt.toISOString());
      const afterViewSchema = schema(await html(`/pt/artigos/${slug}`));
      assert.equal(afterViewSchema.datePublished, publication.toISOString());
      assert.equal(afterViewSchema.dateModified, publication.toISOString());
      results.view = { before, after: afterView, datePublished: afterViewSchema.datePublished, dateModified: afterViewSchema.dateModified };

      await submit("/login", { email: "editorial-local@example.invalid", password: process.env.AUTH_SECRET! });
      assert.ok(cookie.startsWith("admin_session="));
      await html(`/administracao/artigos/${primaryId}/editar`);
      assert.equal((await read()).editorialUpdatedAt, null);
      await edit(await read());
      assert.equal((await read()).editorialUpdatedAt, null);
      results.openAndNoopSave = "editorialUpdatedAt remains null";
      await edit(await read(), { content: (await read()).content + "<p>Edição local 1.</p>" });
      const firstEdit = await read();
      assert.ok(firstEdit.editorialUpdatedAt);
      assert.equal(firstEdit.publishedAt!.toISOString(), publication.toISOString());
      assert.equal(schema(await html(`/pt/artigos/${slug}`)).dateModified, firstEdit.editorialUpdatedAt.toISOString());
      await edit(firstEdit);
      assert.equal((await read()).editorialUpdatedAt!.toISOString(), firstEdit.editorialUpdatedAt.toISOString());
      await edit(await read(), { content: (await read()).content + "<p>Edição local 2.</p>" });
      const secondEdit = await read();
      assert.equal(secondEdit.publishedAt!.toISOString(), publication.toISOString());
      assert.ok(secondEdit.editorialUpdatedAt!.getTime() >= firstEdit.editorialUpdatedAt.getTime());
      results.editorialEdits = { first: firstEdit.editorialUpdatedAt, second: secondEdit.editorialUpdatedAt, originalPublicationPreserved: secondEdit.publishedAt, noopRetainsReview: true };

      const createFields = { title: `Teste Novo Local ${runTag}`, description: "Documento fictício para validação local.", content: "<h1>Título interno</h1><h2>Seção</h2><h3>Detalhe</h3><p>Somente teste.</p>", contentBlocks: "[]", categoryId: "editorial-local-category", status: "DRAFT", desktopReviewed: "on", tabletReviewed: "on", mobileReviewed: "on" };
      await submit("/administracao/artigos/novo", createFields);
      const newPost = await prisma.post.findUniqueOrThrow({ where: { slug: `teste-novo-local-${runTag}` } });
      assert.equal(newPost.publishedAt, null);
      assert.doesNotMatch(newPost.content, /<h1\b/);
      await edit(newPost, { status: "PUBLISHED" });
      const published = await prisma.post.findUniqueOrThrow({ where: { id: newPost.id } });
      assert.ok(published.publishedAt);
      assert.equal(published.editorialUpdatedAt, null);
      results.newArticle = { h1NormalizedAtCreation: true, publishedAt: published.publishedAt, editorialUpdatedAt: published.editorialUpdatedAt };

      const referenceBlocks = [{ id: "heading", type: "heading", data: { level: 2, text: "Referências de teste" } }, { id: "references", type: "references", data: { items: ["Referência legada fictícia em texto.", { author: "Instituição Fictícia Local", title: "Documento fictício, não é evidência científica", publication: "Publicação de teste", year: "2024", doi: "10.1234/exemplo-local", url: "https://example.org/alternativa", sourceType: "Teste controlado" }, { author: "Autor Fictício", title: "Documento local por URL", publication: "Publicação local", year: "2025", url: "https://example.org/referencia-local" }] } }];
      await submit("/administracao/artigos/novo", { ...createFields, title: `Teste Referencias Local ${runTag}`, status: "PUBLISHED", contentBlocks: JSON.stringify(referenceBlocks) });
      const references = await html(`/pt/artigos/teste-referencias-local-${runTag}`);
      for (const text of ["Referência legada fictícia em texto.", "Instituição Fictícia Local", "Publicação de teste", "2024", "Teste controlado"]) assert.ok(references.includes(text));
      assert.match(references, /href="https:\/\/doi.org\/10.1234\/exemplo-local" target="_blank" rel="noopener noreferrer"/);
      assert.match(references, /href="https:\/\/example.org\/referencia-local" target="_blank" rel="noopener noreferrer"/);
      results.references = { structuredFields: true, doiAndUrl: true, legacyText: true, safeExternalAttributes: true };

      const past = new Date(Date.now() - 120000).toISOString();
      const future = new Date(Date.now() + 86400000).toISOString();
      await submit("/administracao/artigos/novo", { ...createFields, title: `Teste Agendado Local ${runTag}`, status: "SCHEDULED", scheduledAt: past });
      await submit("/administracao/artigos/novo", { ...createFields, title: `Teste Futuro Local ${runTag}`, status: "SCHEDULED", scheduledAt: future });
      const cron = async () => {
        const response = await request("/api/cron/publish-scheduled-posts", { headers: { "x-cron-secret": process.env.CRON_SECRET! } });
        assert.equal(response.status, 200);
        return response.json();
      };
      assert.equal((await cron()).published, 1);
      const scheduled = await prisma.post.findUniqueOrThrow({ where: { slug: `teste-agendado-local-${runTag}` } });
      assert.equal(scheduled.status, "PUBLISHED");
      assert.equal(scheduled.scheduledAt!.toISOString(), past);
      assert.ok(scheduled.publishedAt);
      assert.equal(scheduled.editorialUpdatedAt, null);
      await edit(scheduled, { content: scheduled.content + "<p>Revisão depois de publicar.</p>" });
      const revisedScheduled = await prisma.post.findUniqueOrThrow({ where: { id: scheduled.id } });
      assert.equal(revisedScheduled.publishedAt!.toISOString(), scheduled.publishedAt.toISOString());
      assert.ok(revisedScheduled.editorialUpdatedAt);
      const currentPrimary = await read();
      await edit(currentPrimary, { status: "SCHEDULED", scheduledAt: past });
      assert.equal((await cron()).published, 1);
      const republished = await read();
      assert.equal(republished.publishedAt!.toISOString(), publication.toISOString());
      assert.equal(republished.editorialUpdatedAt!.toISOString(), currentPrimary.editorialUpdatedAt!.toISOString());
      assert.equal((await cron()).published, 0);
      const futurePost = await prisma.post.findUniqueOrThrow({ where: { slug: `teste-futuro-local-${runTag}` } });
      assert.equal(futurePost.status, "SCHEDULED");
      assert.equal(futurePost.scheduledAt!.toISOString(), future);
      assert.equal(futurePost.publishedAt, null);
      results.scheduled = { firstPublishedAt: scheduled.publishedAt, scheduledAtRetained: scheduled.scheduledAt, editRetainsPublication: revisedScheduled.publishedAt, editorialReview: revisedScheduled.editorialUpdatedAt, republicationRetainsP1: republished.publishedAt, futureRetained: futurePost.scheduledAt, repeatedCronPublishesZero: true };

      const routes = ["/pt", "/pt/artigos", `/pt/artigos/${slug}`, "/administracao", `/administracao/artigos/${primaryId}/editar`, "/sitemap.xml", "/feed.xml"];
      for (const route of routes) await html(route);
      const finalSchema = schema(await html(`/pt/artigos/${slug}`));
      assert.equal(finalSchema.datePublished, publication.toISOString());
      assert.equal(finalSchema.dateModified, republished.editorialUpdatedAt!.toISOString());
      assert.equal(finalSchema.author.name, "Weverlyn da Cruz Alves Torres");
      results.routes = routes.map(route => ({ route, status: 200 }));
      results.finalJsonLd = finalSchema;
      fs.writeFileSync(output, JSON.stringify(evidence, null, 2) + "\n");
      console.log("PASS: real local HTTP actions, login, views, editorial/no-op edits, publication, cron, references, H1, anchors, JSON-LD and routes.");
    } finally {
      try {
        if (server.pid && server.exitCode === null) {
          if (process.platform === "win32") execFileSync("taskkill.exe", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore" });
          else server.kill("SIGTERM");
        }
      } finally { server.unref(); fs.closeSync(log); }
    }
  } finally { await prisma.$disconnect(); }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
