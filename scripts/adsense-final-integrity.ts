import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { assertBaselineCompatible } from "./editorial-lote2-guards";

const root = "docs/monetizacao/auditoria-final-adsense/";
function files(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? files(file) : [file];
  });
}
async function main() {
  const functional = [...files("src"), ...files("public"), "package.json", "package-lock.json", "next.config.mjs", "prisma/schema.prisma"];
  const hashes = Object.fromEntries(functional.sort().map(file => [file.replaceAll("\\", "/"), createHash("sha256").update(fs.readFileSync(file)).digest("hex")]));
  const records = JSON.parse(JSON.stringify(await prisma.post.findMany({ orderBy: { id: "asc" } }))) as Record<string, unknown>[];
  const beforeMode = process.argv.includes("--before");
  const baselinePath = root + "integridade-antes.json";
  if (!beforeMode) {
    const before = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
    assert.deepEqual(hashes, before.functionalFileHashes, "Functional source/policies/dependencies changed during audit");
    assert.equal(records.length, before.records.length);
    for (const row of records) {
      const previous = before.records.find((r: { id: string }) => r.id === row.id);
      assert.ok(previous);
      assertBaselineCompatible(row, previous);
    }
  } else assert.ok(!fs.existsSync(baselinePath), "Never overwrite the audit baseline");
  fs.mkdirSync(root, { recursive: true });
  const result = { capturedAt: new Date().toISOString(), readOnly: true, databaseWrites: 0, totalRecords: records.length, functionalFileHashes: hashes, records };
  fs.writeFileSync(beforeMode ? baselinePath : root + "integridade-final.json", JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify({ capturedAt: result.capturedAt, records: records.length, functionalFiles: functional.length, mode: beforeMode ? "BASELINE_READ_ONLY" : "UNCHANGED_EXCEPT_POSSIBLE_MONOTONIC_VIEWS" }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
