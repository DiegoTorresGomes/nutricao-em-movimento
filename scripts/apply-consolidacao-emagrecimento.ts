// Explicitly gated, transactional application. Importing does not connect.
import fs from "node:fs";
import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { PrismaClient, Prisma } from "@prisma/client";
import { buildConsolidation, consolidationRoot, sha256 } from "./build-consolidacao-emagrecimento";
import { weightConsolidation as spec, consolidationSourcePath, consolidationTargetUrl } from "../src/lib/editorial-consolidation";
import { hasEditorialChanges } from "../src/lib/editorial-dates";

export function requireDisposable() {
  assert.equal(process.env.DB_HOST, "127.0.0.1");
  assert.equal(process.env.DB_PORT, "33317");
  assert.equal(process.env.DB_NAME, "nutricao_consolidacao_disposable");
  const url = new URL(process.env.DATABASE_URL!);
  assert.equal(url.hostname, "127.0.0.1");
  assert.equal(url.port, "33317");
  assert.equal(url.pathname, "/nutricao_consolidacao_disposable");
}

export async function requireLiveRedirect() {
  // No remote mutation is possible while the deployed site still renders A.
  for (const origin of [spec.origin, "https://nutricaoemovimento.com"]) {
    const url = `${origin}${consolidationSourcePath}?utm_source=consolidacao-check`;
    const response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 301, `Public redirect is not active at ${origin}; no database writes permitted`);
    assert.equal(response.headers.get("location"), `${consolidationTargetUrl}?utm_source=consolidacao-check`);
    await response.body?.cancel();
  }
}

export async function consolidate(prisma: PrismaClient, local: boolean) {
  if (local) requireDisposable();
  else await requireLiveRedirect();
  const pack = buildConsolidation();
  const before = await prisma.post.findMany({ orderBy: { id: "asc" } });
  const a = before.find(p => p.id === spec.sourceId);
  const b = before.find(p => p.id === spec.targetId);
  assert.ok(a && b);
  assert.equal(a.slug, spec.sourceSlug);
  assert.equal(b.slug, spec.targetSlug);
  assert.equal(b.title, pack.title);
  assert.equal(b.publishedAt?.toISOString(), "2026-06-22T22:17:05.717Z");
  if (a.status === "ARCHIVED" && b.content === pack.content && b.description === pack.description && b.seoDescription === pack.seoDescription) return { state: "ALREADY_APPLIED", writes: 0, articles: [a, b] };
  assert.equal(a.status, "PUBLISHED");
  assert.equal(b.status, "PUBLISHED");
  const baseline = JSON.parse(fs.readFileSync(`${consolidationRoot}/antes-aplicacao.json`, "utf8")).articles;
  for (const current of [a, b]) {
    const original = baseline.find((p: { id: string }) => p.id === current.id);
    assert.ok(original);
    for (const key of ["title", "slug", "content", "description", "seoDescription", "authorId", "categoryId"] as const) assert.deepEqual(current[key], original[key], `New editorial change since approval in ${current.id}.${key}; stop`);
  }
  // New incoming content links require individual review, never blind replace.
  const incoming = before.filter(p => p.id !== a.id && p.content.includes(`/pt/artigos/${spec.sourceSlug}`));
  assert.equal(incoming.length, 0, "Unexpected contextual links to A; stop before mutation and review");
  const snapshotName = local ? "antes-aplicacao-local.json" : "antes-aplicacao-final.json";
  const snapshotPath = `${consolidationRoot}/${snapshotName}`;
  assert.ok(!fs.existsSync(snapshotPath), `Snapshot already exists: ${snapshotName}; verify instead of rerunning`);
  fs.writeFileSync(snapshotPath, JSON.stringify({ capturedAt: new Date().toISOString(), local, sourceHash: pack.approvedSourceHash, articles: [a, b] }, null, 2) + "\n");
  const fields = { content: pack.content, description: pack.description, seoDescription: pack.seoDescription };
  assert.ok(hasEditorialChanges(b, fields));
  const revision = new Date();
  // Same editorial-change policy used by the CMS, in one transaction with
  // archiving. Counters, original publication, author and schedules are omitted.
  const after = await prisma.$transaction(async tx => {
    const edited = await tx.post.updateMany({ where: { id: b.id, updatedAt: b.updatedAt, views: b.views, publishedAt: b.publishedAt, content: b.content, status: "PUBLISHED" }, data: { ...fields, contentBlocks: pack.contentBlocks as unknown as Prisma.InputJsonValue, editorialUpdatedAt: revision } });
    assert.equal(edited.count, 1, "Concurrent change to B; transaction aborted");
    const archived = await tx.post.updateMany({ where: { id: a.id, updatedAt: a.updatedAt, views: a.views, content: a.content, status: "PUBLISHED" }, data: { status: "ARCHIVED" } });
    assert.equal(archived.count, 1, "Concurrent change to A; transaction aborted");
    const current = await tx.post.findMany({ orderBy: { id: "asc" } });
    for (const previous of before) {
      const next = current.find(p => p.id === previous.id)!;
      const allowed: string[] = previous.id === a.id ? ["status", "updatedAt"] : previous.id === b.id ? ["content", "contentBlocks", "description", "seoDescription", "editorialUpdatedAt", "updatedAt"] : [];
      for (const key of Object.keys(previous) as (keyof typeof previous)[]) if (!allowed.includes(key)) assert.deepEqual(next[key], previous[key], `Unexpected change in ${previous.id}.${key}`);
    }
    return current.filter(p => p.id === a.id || p.id === b.id);
  }, { timeout: 30000 });
  const result = { state: local ? "APPLIED_LOCAL_ONLY" : "APPLIED_REMOTE", writes: 2, local, editorialUpdatedAt: revision, sourceHash: pack.approvedSourceHash, contentHash: sha256(pack.content), outsidePairUnchanged: true, articles: after };
  fs.writeFileSync(`${consolidationRoot}/${local ? "depois-aplicacao-local" : "depois-aplicacao"}.json`, JSON.stringify(result, null, 2) + "\n");
  return result;
}

async function main() {
  await import("dotenv/config");
  const local = process.argv.includes("--apply-local");
  if (local) requireDisposable();
  else {
    assert.ok(process.argv.includes("--apply-remote"), "Explicit --apply-local or --apply-remote required");
    const index = process.argv.indexOf("--expected-target");
    const target = sha256(JSON.stringify([process.env.DB_HOST, process.env.DB_PORT || "3306", process.env.DB_NAME]));
    assert.ok(index > 0 && process.argv[index + 1] === target, "Configured target fingerprint must be explicitly pinned");
    await requireLiveRedirect();
  }
  const { prisma } = await import("../src/lib/prisma");
  try { const result = await consolidate(prisma, local); console.log(result.state, "writes:", result.writes); }
  finally { await prisma.$disconnect(); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
