// Explicitly authorized baseline refresh: SELECT only; approved files immutable.
import fs from "node:fs";
import assert from "node:assert/strict";
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { buildLote2Package, sha256, revisionRoot } from "./apply-editorial-lote2";
import { assertBaselineCompatible } from "./editorial-lote2-guards";

async function main() {
  const root = revisionRoot + "/";
  const snapshot = JSON.parse(fs.readFileSync(root + "antes-aplicacao.json", "utf8"));
  const resume = JSON.parse(fs.readFileSync(root + "autorizacao-retomada-final.json", "utf8"));
  const pack = buildLote2Package();
  assert.equal(resume.allowMonotonicViews, true);
  assert.equal(resume.approvedPackageSha256, pack.approvedPackageSha256);
  const target = sha256(JSON.stringify([process.env.DB_HOST?.toLowerCase(), process.env.DB_PORT || "3306", process.env.DB_NAME]));
  assert.equal(target, snapshot.targetSha256);
  const db = await prisma.$queryRaw<{ selectedDatabase: string }[]>`SELECT DATABASE() AS selectedDatabase`;
  assert.equal(db[0].selectedDatabase, process.env.DB_NAME);
  const rows = JSON.parse(JSON.stringify(await prisma.post.findMany({ orderBy: { id: "asc" } }))) as Record<string, unknown>[];
  const original = [...snapshot.articles, ...snapshot.outsideBatch] as Record<string, unknown>[];
  assert.equal(rows.length, original.length);
  for (const row of rows) {
    const before = original.find(a => a.id === row.id);
    assert.ok(before);
    assertBaselineCompatible(row, before);
  }
  assert.deepEqual(pack.articles.map((a: { id: string }) => a.id), resume.allowedIds);
  const deficit = rows.find(row => row.id === resume.allowedIds[2]);
  assert.ok(deficit && Number(deficit.views) >= 23, "Never restore views to 22");
  const oldPath = root + "antes-aplicacao-original.json";
  if (!fs.existsSync(oldPath)) fs.writeFileSync(oldPath, fs.readFileSync(root + "antes-aplicacao.json"), { flag: "wx" });
  const next = {
    ...snapshot, capturedAt: new Date().toISOString(),
    mode: "Authorized refreshed baseline: only monotonic view increments accepted; all other fields compared exactly",
    originalSnapshotCapturedAt: JSON.parse(fs.readFileSync(oldPath, "utf8")).capturedAt,
    articles: snapshot.articles.map((before: Record<string, unknown>) => ({ ...before, ...rows.find(row => row.id === before.id) })),
    outsideBatch: rows.filter(row => !resume.allowedIds.includes(row.id)),
    dynamicViewChanges: rows.filter(row => row.views !== original.find(a => a.id === row.id)?.views).map(row => ({ id: row.id, before: original.find(a => a.id === row.id)?.views, current: row.views })),
  };
  fs.writeFileSync(root + "antes-aplicacao.json", JSON.stringify(next, null, 2) + "\n");
  console.log(JSON.stringify({ state: "NEW_BASELINE_CAPTURED", count: rows.length, capturedAt: next.capturedAt, dynamicViewChanges: next.dynamicViewChanges, editorialAndProtectedFieldsIdentical: true, approvedFilesIdentical: true, databaseWrites: 0 }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
