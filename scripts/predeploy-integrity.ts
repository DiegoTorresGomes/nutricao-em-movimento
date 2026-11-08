// This task never imports a writer or invokes a mutation. Snapshot and compare
// every Post scalar field; accepted dynamic views increments are reported.
import fs from "node:fs";
import assert from "node:assert/strict";
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { assertBaselineCompatible } from "./editorial-lote2-guards";

async function main() {
  const dir = "docs/monetizacao/pre-deploy-final/";
  const applied = JSON.parse(fs.readFileSync("docs/editorial/revisao-lote-2/depois-aplicacao.json", "utf8"));
  assert.equal(applied.state, "APPLIED_ALL_SIX");
  const rows = JSON.parse(JSON.stringify(await prisma.post.findMany({ orderBy: { id: "asc" } }))) as Record<string, unknown>[];
  const initial = process.argv.includes("--capture-before");
  const path = dir + "antes-banco.json";
  const baseline = initial ? applied.allRecordsAfter : JSON.parse(fs.readFileSync(path, "utf8")).records;
  assert.equal(rows.length, 31);
  assert.equal(rows.length, baseline.length);
  const increments = [];
  for (const row of rows) {
    const before = baseline.find((a: { id: string }) => a.id === row.id);
    assert.ok(before);
    assertBaselineCompatible(row, before);
    if (row.views !== before.views) increments.push({ id: row.id, before: before.views, after: row.views });
  }
  const result = { capturedAt: new Date().toISOString(), mode: "SELECT_ONLY", total: rows.length, sixBatchRowsUnchanged: true, other25RowsUnchanged: true, allNonViewFieldsIdentical: true, databaseWritesByTask: 0, dynamicViewIncrements: increments, records: rows };
  if (initial) assert.ok(!fs.existsSync(path), "Never overwrite the task baseline");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(initial ? path : dir + "integridade-final.json", JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify({ ...result, records: undefined }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
