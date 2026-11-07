// Applies only the five human-approved packages through the existing local CMS
// Server Actions. No deployed code changes, direct SQL writes or user creation.
// Explicit mutation flag required; --verify performs SELECT/GET only.
import "dotenv/config";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash, randomBytes } from "node:crypto";
import { createServer } from "node:net";
import { spawn, execFileSync } from "node:child_process";
import { SignJWT } from "jose";
import { prisma } from "../src/lib/prisma";
import { renderBlocksToHtml } from "../src/lib/editor/render-blocks-to-html";
import { articleBody } from "../src/lib/editor/article-body";
import type { EditorBlock } from "../src/lib/editor/blocks";

const root = "docs/editorial/revisao-lote-1";
const packageFile = "docs/editorial/lote-1/propostas.json";
type Post = Awaited<ReturnType<typeof prisma.post.findUniqueOrThrow>>;
type Proposal = {
  number: number; baselineContentHash: string;
  preserve: { id: string; slug: string; title: string; publishedAt: string; authorId: string; categoryId: string; url: string };
  proposedChanges: { content: string; contentBlocks: EditorBlock[]; description: string; seoDescription: string };
};
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
function save(name: string, value: unknown, exclusive = false) {
  fs.mkdirSync(root, { recursive: true });
  fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + "\n", { flag: exclusive ? "wx" : "w" });
}
const decode = (value: string) => value.replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");

async function verify(proposals: Proposal[]) {
  const articles = [];
  const destinations = new Set<string>();
  for (const proposal of proposals) {
    const current = await prisma.post.findUniqueOrThrow({ where: { id: proposal.preserve.id } });
    assert.equal(current.content, proposal.proposedChanges.content);
    assert.deepEqual(current.contentBlocks, proposal.proposedChanges.contentBlocks);
    assert.equal(current.description, proposal.proposedChanges.description);
    assert.equal(current.seoDescription, proposal.proposedChanges.seoDescription);
    assert.equal(current.publishedAt!.toISOString(), proposal.preserve.publishedAt);
    assert.ok(current.editorialUpdatedAt);
    const checkUrl = new URL(proposal.preserve.url);
    checkUrl.searchParams.set("_lote1_check", String(Date.now()));
    const response = await fetch(checkUrl, { headers: { "Cache-Control": "no-cache" }, signal: AbortSignal.timeout(45000) });
    const html = await response.text();
    assert.equal(response.status, 200);
    assert.ok(html.includes(current.content), `Public HTML not yet current: ${proposal.number}`);
    assert.equal((html.match(/<h1\b/gi) || []).length, 1);
    assert.match(current.content, /^<h2\b/);
    const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1]));
    const schema = schemas.find(item => item["@type"] === "BlogPosting");
    assert.ok(schema);
    assert.equal(schema.datePublished, current.publishedAt!.toISOString());
    assert.equal(schema.dateModified, current.editorialUpdatedAt.toISOString());
    assert.equal(schema.author.name, "Weverlyn da Cruz Alves Torres");
    assert.equal(schema.author.url, "https://www.nutricaoemovimento.com/pt/autora/weverlyn-alves");
    assert.ok(html.includes("Weverlyn Alves") && html.includes("24101524"));
    assert.ok(html.includes('href="/pt/autora/weverlyn-alves"'));
    const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
    assert.equal(canonical, proposal.preserve.url);
    const description = decode(html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]*)"/i)?.[1] || "");
    assert.equal(description, current.description);
    assert.ok(current.coverImage && html.includes(current.coverImage));
    const image = await fetch(current.coverImage, { signal: AbortSignal.timeout(45000) });
    await image.arrayBuffer();
    assert.equal(image.status, 200);
    assert.match(image.headers.get("content-type") || "", /^image\//);
    const references = proposal.proposedChanges.contentBlocks.find(block => block.type === "references");
    assert.ok(references && Array.isArray(references.data.items));
    assert.doesNotMatch(current.content, /localhost|127\.0\.0\.1|https?:\/\/nutricaoemovimento\.com\//i);
    for (const match of current.content.matchAll(/href="(\/pt\/[^"#]*)/g)) destinations.add("https://www.nutricaoemovimento.com" + match[1]);
    const tail = html.slice(html.indexOf("Continue lendo"));
    const related = [...new Set([...tail.matchAll(/href="(\/pt\/artigos\/[^"#?]+)"/g)].map(match => match[1]))].filter(href => href !== `/pt/artigos/${current.slug}`).slice(0, 3);
    assert.equal(related.length, 3);
    assert.equal(new Set(related).size, related.length);
    articles.push({ number: proposal.number, id: current.id, url: proposal.preserve.url, checkedUrl: checkUrl.href, status: response.status, canonical, metadataDescription: description, exactApprovedBody: true, h1Count: 1, referenceCount: references.data.items.length, image: { url: current.coverImage, status: image.status, contentType: image.headers.get("content-type") }, jsonLd: schema, related, relatedException: "Automatic cards retained by explicit user authorization", cache: { age: response.headers.get("age"), vercel: response.headers.get("x-vercel-cache"), cloudflare: response.headers.get("cf-cache-status") } });
    console.log(`Verified article ${proposal.number}: HTTP 200, exact approved content, dates/schema, author, image and references.`);
  }
  const links = [];
  for (const url of destinations) {
    const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
    await response.arrayBuffer();
    assert.equal(response.status, 200, url);
    links.push({ url, status: response.status });
  }
  save("verificacao-http.json", { checkedAt: new Date().toISOString(), method: "GET without browser JavaScript; no views endpoint called", articles, internalLinks: links });
}

async function apply(proposals: Proposal[], packageHash: string) {
  const resume = process.argv.includes("--resume-approved-keep-auto-related");
  const authorization = JSON.parse(fs.readFileSync(path.join(root, "autorizacao-aplicacao.json"), "utf8"));
  const targetHash = hash(JSON.stringify({ host: process.env.DB_HOST!.toLowerCase(), port: Number(process.env.DB_PORT || 3306), database: process.env.DB_NAME }));
  assert.ok(process.argv.includes(`--target-sha256=${targetHash}`), "Explicit configured-target fingerprint required");
  assert.ok(process.argv.includes(`--package-sha256=${packageHash}`), "Explicit approved-package fingerprint required");
  assert.equal(targetHash, authorization.targetSha256);
  assert.equal(packageHash, authorization.approvedPackageSha256);
  assert.deepEqual(proposals.map(proposal => proposal.preserve.id), authorization.allowedIds);
  const actual = await prisma.$queryRaw<{ selectedDatabase: string }[]>`SELECT DATABASE() AS selectedDatabase`;
  assert.equal(actual[0].selectedDatabase, process.env.DB_NAME, "Database target mismatch");
  const firstSnapshot = JSON.parse(fs.readFileSync(path.join(root, "antes-aplicacao.json"), "utf8"));
  assert.equal(packageHash, firstSnapshot.approvedPackageSha256, "Approved package changed");
  const live = await prisma.post.findMany({ orderBy: { id: "asc" } });
  const checkpoint = resume ? JSON.parse(fs.readFileSync(path.join(root, "aplicacao.json"), "utf8")) : null;
  if (checkpoint) assert.notEqual(checkpoint.status, "APPLIED_ALL_FIVE", "Application is complete; use read-only --verify, never reapply");
  const priorSnapshot = resume ? JSON.parse(fs.readFileSync(path.join(root, "antes-aplicacao-final.json"), "utf8"), (key, value) => ["publishedAt", "editorialUpdatedAt", "createdAt", "updatedAt", "scheduledAt", "lastPreviewAt"].includes(key) && typeof value === "string" ? new Date(value) : value) : null;
  const before: Post[] = resume ? live.map(post => (priorSnapshot.articles as Post[]).find(original => original.id === post.id) || post) : live;
  async function preserveSchedule(previous: Post, after: Post) {
    if (previous.scheduledAt?.getTime() === after.scheduledAt?.getTime()) return after;
    assert.ok(previous.scheduledAt && after.scheduledAt === null && after.status === "PUBLISHED", "Unexpected schedule change");
    // The normal action clears schedules for PUBLISHED posts. Restore only the
    // historical value, with compare-and-swap guards; never alter manuscript,
    // publication, views or the editorial timestamp during this technical repair.
    const restored = await prisma.post.updateMany({
      where: { id: after.id, content: after.content, editorialUpdatedAt: after.editorialUpdatedAt, scheduledAt: null, updatedAt: after.updatedAt },
      data: { scheduledAt: previous.scheduledAt },
    });
    assert.equal(restored.count, 1, "Concurrent edit during schedule restoration");
    const current = await prisma.post.findUniqueOrThrow({ where: { id: after.id } });
    assert.equal(current.editorialUpdatedAt?.toISOString(), after.editorialUpdatedAt?.toISOString());
    assert.equal(current.content, after.content);
    assert.equal(current.views, after.views);
    assert.equal(current.scheduledAt!.toISOString(), previous.scheduledAt.toISOString());
    return current;
  }
  const completedIds = new Set<string>();
  const ids = proposals.map(proposal => proposal.preserve.id);
  for (const proposal of proposals) {
    const current = before.find(post => post.id === proposal.preserve.id)!;
    assert.ok(current);
    for (const key of ["id", "title", "slug", "authorId", "categoryId"] as const) assert.equal(current[key], proposal.preserve[key]);
    assert.equal(current.publishedAt!.toISOString(), proposal.preserve.publishedAt);
    if (resume && checkpoint.applied.some((item: { id: string }) => item.id === current.id)) {
      let applied = live.find(post => post.id === current.id)!;
      assert.equal(applied.content, proposal.proposedChanges.content);
      assert.deepEqual(applied.contentBlocks, proposal.proposedChanges.contentBlocks);
      assert.equal(applied.description, proposal.proposedChanges.description);
      assert.equal(applied.seoDescription, proposal.proposedChanges.seoDescription);
      assert.equal(applied.publishedAt!.toISOString(), proposal.preserve.publishedAt);
      assert.ok(applied.editorialUpdatedAt);
      const scheduleWasCleared = !!current.scheduledAt && !applied.scheduledAt;
      applied = await preserveSchedule(current, applied);
      const entry = checkpoint.applied.find((item: { id: string }) => item.id === current.id);
      Object.assign(entry, { scheduledAtBefore: current.scheduledAt, scheduledAtAfter: applied.scheduledAt, historicalScheduleRestored: scheduleWasCleared, updatedAtAfter: applied.updatedAt });
      save("aplicacao.json", checkpoint);
      completedIds.add(current.id);
      console.log(`Confirmed previously applied ${proposal.number}; historical schedule preserved/restored without rewriting content.`);
      continue;
    }
    assert.equal(current.editorialUpdatedAt, null, "Previously revised source requires a fresh review");
    assert.equal(hash(current.content), proposal.baselineContentHash, "Source body changed");
    assert.equal(current.status, "PUBLISHED");
    // Avoid the action's article-of-week demotion branch touching another row.
    assert.equal(current.isArticleOfWeek, false);
    assert.ok(current.readTime !== null, "Do not normalize an unapproved nullable field");
    assert.equal(articleBody(renderBlocksToHtml(proposal.proposedChanges.contentBlocks), current.slug).trim(), proposal.proposedChanges.content);
  }
  const untouchedHash = (post: Post) => hash(JSON.stringify(Object.fromEntries(Object.entries(post).filter(([key]) => !["views", "updatedAt"].includes(key)))));
  if (!resume) save("antes-aplicacao-final.json", { capturedAt: new Date().toISOString(), approvedPackageSha256: packageHash, approvedException: "Keep automatic related cards", articles: before.filter(post => ids.includes(post.id)), otherArticleFingerprints: before.filter(post => !ids.includes(post.id)).map(post => ({ id: post.id, sha256: untouchedHash(post) })) }, true);
  await new Promise<void>((resolve, reject) => { const probe = createServer(); probe.once("error", reject); probe.listen({ host: "127.0.0.1", port: 33118, exclusive: true }, () => probe.close(error => error ? reject(error) : resolve())); });
  const secret = randomBytes(48).toString("hex");
  const account = await prisma.user.findUniqueOrThrow({ where: { id: proposals[0].preserve.authorId }, select: { id: true, role: true } });
  assert.equal(account.role, "ADMIN");
  // Session belongs only to this loopback process using an ephemeral local key.
  // It is never sent to the public site; production auth secrets are not used.
  const token = await new SignJWT({ userId: account.id, email: "aplicacao-local@example.invalid", role: account.role }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("30m").sign(new TextEncoder().encode(secret));
  const base = "http://127.0.0.1:33118";
  const logPath = path.join(os.tmpdir(), "nutricao-apply-lote1-next.log");
  const log = fs.openSync(logPath, "w");
  const server = spawn(process.execPath, ["scripts/run-editorial-cms.mjs"], { env: { ...process.env, AUTH_SECRET: secret, NEXT_TELEMETRY_DISABLED: "1" }, windowsHide: true, stdio: ["ignore", log, log] });
  const result: { applied: Record<string, unknown>[]; startedAt: string; status: string; exception: string; outsideBatchUnchanged?: boolean } = checkpoint || { startedAt: new Date().toISOString(), status: "IN_PROGRESS", exception: "Keep automatic related cards, explicitly authorized by user", applied: [] };
  save("aplicacao.json", result, !resume);
  try {
    for (let attempt = 0; attempt < 90; attempt++) {
      if (server.exitCode !== null) throw new Error("Local CMS process exited");
      try { if ((await fetch(base + "/login", { signal: AbortSignal.timeout(10000) })).status === 200) break; } catch { /* Startup only. */ }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    for (const proposal of proposals) {
      if (completedIds.has(proposal.preserve.id)) continue;
      const route = `/administracao/artigos/${proposal.preserve.id}/editar`;
      const headers = { Cookie: `admin_session=${token}`, Origin: base };
      const editor = await fetch(base + route, { headers, redirect: "manual", signal: AbortSignal.timeout(120000) });
      assert.equal(editor.status, 200);
      const html = await editor.text();
      const form = [...html.matchAll(/<form\b[^>]*>([\s\S]*?)<\/form>/g)].find(match => match[1].includes('name="title"'))?.[1];
      assert.ok(form, "Edit form missing");
      const data = new FormData();
      for (const input of form.matchAll(/<input\b[^>]*>/g)) {
        const name = decode(input[0].match(/\bname="([^"]*)"/)?.[1] || "");
        if (name.startsWith("$ACTION_")) data.append(name, decode(input[0].match(/\bvalue="([^"]*)"/)?.[1] || ""));
      }
      assert.ok([...data.keys()].some(key => key.startsWith("$ACTION_")));
      const previous = await prisma.post.findUniqueOrThrow({ where: { id: proposal.preserve.id } });
      assert.equal(hash(previous.content), proposal.baselineContentHash);
      assert.equal(previous.editorialUpdatedAt, null);
      const fields = { title: previous.title, description: proposal.proposedChanges.description, content: proposal.proposedChanges.content, contentBlocks: JSON.stringify(proposal.proposedChanges.contentBlocks), seoTitle: previous.seoTitle || "", seoDescription: proposal.proposedChanges.seoDescription, focusKeyword: previous.focusKeyword || "", readTime: previous.readTime!, categoryId: previous.categoryId, status: previous.status, coverImage: previous.coverImage || "", coverImageAlt: previous.coverImageAlt || "", scheduledAt: previous.scheduledAt?.toISOString() || "" };
      for (const [key, value] of Object.entries(fields)) data.set(key, value);
      for (const key of ["desktopReviewed", "tabletReviewed", "mobileReviewed"] as const) if (previous[key]) data.set(key, "on");
      const response = await fetch(base + route, { method: "POST", headers, body: data, redirect: "manual", signal: AbortSignal.timeout(120000) });
      await response.text();
      let after = await prisma.post.findUniqueOrThrow({ where: { id: previous.id } });
      const scheduleWasCleared = !!previous.scheduledAt && !after.scheduledAt;
      after = await preserveSchedule(previous, after);
      result.applied.push({ number: proposal.number, id: after.id, slug: after.slug, publishedAtBefore: previous.publishedAt, publishedAtAfter: after.publishedAt, editorialUpdatedAtBefore: previous.editorialUpdatedAt, editorialUpdatedAtAfter: after.editorialUpdatedAt, updatedAtBefore: previous.updatedAt, updatedAtAfter: after.updatedAt, viewsBefore: previous.views, viewsAfter: after.views, scheduledAtBefore: previous.scheduledAt, scheduledAtAfter: after.scheduledAt, historicalScheduleRestored: scheduleWasCleared, responseStatus: response.status, approvedContentHash: hash(proposal.proposedChanges.content), storedContentHash: hash(after.content) });
      save("aplicacao.json", result);
      assert.equal(response.status, 303);
      for (const key of Object.keys(previous) as (keyof Post)[]) {
        if (!["content", "contentBlocks", "description", "seoDescription", "editorialUpdatedAt", "updatedAt"].includes(key)) assert.deepEqual(after[key], previous[key], `Unexpected field change: ${key}`);
      }
      assert.equal(after.content, proposal.proposedChanges.content);
      assert.deepEqual(after.contentBlocks, proposal.proposedChanges.contentBlocks);
      assert.equal(after.description, proposal.proposedChanges.description);
      assert.equal(after.seoDescription, proposal.proposedChanges.seoDescription);
      assert.ok(after.editorialUpdatedAt);
      console.log(`Applied ${proposal.number} via existing CMS action; publication/views and all unapproved fields preserved.`);
    }
    const finalPosts = await prisma.post.findMany({ orderBy: { id: "asc" } });
    assert.equal(finalPosts.length, before.length);
    for (const old of before.filter(post => !ids.includes(post.id))) assert.equal(untouchedHash(finalPosts.find(post => post.id === old.id)!), untouchedHash(old), "Article outside the approved batch changed");
    if (resume) for (const old of priorSnapshot.otherArticleFingerprints) assert.equal(untouchedHash(finalPosts.find(post => post.id === old.id)!), old.sha256, "Article outside batch differs from initial snapshot");
    result.outsideBatchUnchanged = true;
    result.status = "APPLIED_ALL_FIVE";
    save("aplicacao.json", result);
  } finally {
    try { if (server.pid && server.exitCode === null) execFileSync("taskkill.exe", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore" }); }
    finally { server.unref(); fs.closeSync(log); }
  }
}

async function main() {
  const proposals = (JSON.parse(fs.readFileSync(packageFile, "utf8")) as { articles: Proposal[] }).articles;
  assert.deepEqual(proposals.map(proposal => proposal.number), [31, 3, 26, 6, 10]);
  if (process.argv.includes("--apply-approved-keep-auto-related") || process.argv.includes("--resume-approved-keep-auto-related")) await apply(proposals, hash(fs.readFileSync(packageFile, "utf8")));
  else assert.ok(process.argv.includes("--verify"), "Use explicit --apply-approved-keep-auto-related or read-only --verify");
  await verify(proposals);
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
