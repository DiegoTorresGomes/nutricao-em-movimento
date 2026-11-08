// Read-only resumption check. Never refreshes or overwrites the original snapshot.
import fs from "node:fs";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
import assert from "node:assert/strict";
import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const root = "docs/editorial/revisao-lote-2/";
  const snapshot = JSON.parse(fs.readFileSync(root + "antes-aplicacao.json", "utf8"));
  const authorization = JSON.parse(fs.readFileSync(root + "autorizacao-aplicacao.json", "utf8"));
  const hash = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
  for (const [file, digest] of Object.entries(authorization.approvedFilesSha256)) {
    assert.equal(hash(fs.readFileSync("docs/editorial/lote-2/" + file)), digest, "Approved file changed: " + file);
  }
  const target = hash(JSON.stringify([process.env.DB_HOST?.toLowerCase(), process.env.DB_PORT || "3306", process.env.DB_NAME]));
  assert.equal(target, authorization.targetSha256, "Configured target changed");
  assert.equal(target, snapshot.targetSha256);
  assert.deepEqual(snapshot.articles.map((a: { id: string }) => a.id), authorization.allowedIds);
  const database = await prisma.$queryRaw<{ selectedDatabase: string }[]>`SELECT DATABASE() AS selectedDatabase`;
  assert.equal(database[0].selectedDatabase, process.env.DB_NAME);
  const rows = JSON.parse(JSON.stringify(await prisma.post.findMany({ orderBy: { id: "asc" } }))) as Record<string, unknown>[];
  const originals = [...snapshot.articles, ...snapshot.outsideBatch] as Record<string, unknown>[];
  const changes = rows.flatMap(row => {
    const before = originals.find(a => a.id === row.id);
    if (!before) return [{ id: row.id, fields: ["ADDED_RECORD"], inBatch: authorization.allowedIds.includes(row.id) }];
    const fields = Object.keys(row).filter(key => !isDeepStrictEqual(row[key], before[key]));
    return fields.length ? [{ id: row.id, number: before.number, title: row.title, fields,
      values: Object.fromEntries(fields.map(key => [key, {
        before: typeof before[key] === "string" && String(before[key]).length > 300 ? { sha256: hash(String(before[key])) } : before[key],
        current: typeof row[key] === "string" && String(row[key]).length > 300 ? { sha256: hash(String(row[key])) } : row[key],
      }])), inBatch: authorization.allowedIds.includes(row.id) }] : [];
  });
  const removed = originals.filter(before => !rows.some(row => row.id === before.id)).map(before => before.id);
  const state = changes.length || removed.length ? "INTERRUPTED_SNAPSHOT_DIVERGENCE" : "PREFLIGHT_MATCHES_ORIGINAL_SNAPSHOT";
  const report = { state, checkedAt: new Date().toISOString(), snapshotCapturedAt: snapshot.capturedAt, approvedFilesUnchanged: true, targetConfirmed: true, allowedIds: authorization.allowedIds, totalRecords: rows.length, changes, removed, writeCount: 0 };
  fs.writeFileSync(root + "preflight-retomada.json", JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(report, null, 2));
  if (changes.length || removed.length) process.exitCode = 2;
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
