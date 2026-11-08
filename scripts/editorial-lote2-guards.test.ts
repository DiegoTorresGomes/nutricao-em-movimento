import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import "dotenv/config";
import type { PrismaClient } from "@prisma/client";
import { assertBaselineCompatible } from "./editorial-lote2-guards";
import { buildLote2Package, executeLote2Transaction } from "./apply-editorial-lote2";

test("only monotonic views are dynamic; every other field and decreases abort", () => {
  const baseline = { id: "article", views: 23, content: "approved", updatedAt: "same", scheduledAt: null, slug: "same", publishedAt: "original", status: "PUBLISHED" };
  assert.doesNotThrow(() => assertBaselineCompatible({ ...baseline, views: 24 }, baseline));
  for (const views of [22, -1, 23.5, "24"]) assert.throws(() => assertBaselineCompatible({ ...baseline, views }, baseline));
  for (const key of ["content", "updatedAt", "scheduledAt", "slug", "publishedAt", "status"]) {
    assert.throws(() => assertBaselineCompatible({ ...baseline, views: 24, [key]: "changed" }, baseline));
  }
  assert.equal(baseline.views, 23);
});

test("scheduledAt corruption rolls back the transaction; no protected field is supplied to update", async () => {
  const root = "docs/editorial/revisao-lote-2/";
  const snapshot = JSON.parse(fs.readFileSync(root + "antes-aplicacao.json", "utf8"));
  const auth = JSON.parse(fs.readFileSync(root + "autorizacao-aplicacao.json", "utf8"));
  const dateKeys = ["publishedAt", "editorialUpdatedAt", "createdAt", "updatedAt", "scheduledAt", "lastPreviewAt"];
  const original = [...snapshot.articles, ...snapshot.outsideBatch].map((row: Record<string, unknown>) => {
    const scalar = { ...row };
    for (const key of ["number", "category", "relatedObserved", "originalReferences"]) delete scalar[key];
    for (const key of dateKeys) if (scalar[key]) scalar[key] = new Date(String(scalar[key]));
    return scalar;
  });
  const originalDigest = JSON.stringify(original);
  let committed = false, writesAttempted = 0;
  const fake = {
    $queryRaw: async () => [{ selectedDatabase: process.env.DB_NAME }],
    post: { findMany: async () => structuredClone(original) },
    $transaction: async (callback: (tx: unknown) => Promise<unknown>) => {
      const working = structuredClone(original);
      const tx = {
        $queryRaw: async () => [],
        post: {
          findMany: async () => structuredClone(working),
          findUniqueOrThrow: async ({ where }: { where: { id: string } }) => structuredClone(working.find(row => row.id === where.id)),
          updateMany: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
            for (const key of ["views", "scheduledAt", "publishedAt", "slug", "status", "id", "authorId", "focusKeyword"]) assert.ok(!(key in data), key);
            const row = working.find(row => row.id === where.id)!;
            Object.assign(row, data, { scheduledAt: new Date("2000-01-01T00:00:00Z") });
            writesAttempted++;
            return { count: 1 };
          },
        },
      };
      const result = await callback(tx);
      committed = true;
      return result;
    },
  } as unknown as PrismaClient;
    await assert.rejects(executeLote2Transaction(fake, buildLote2Package(), snapshot, auth, { humanVisualApprovalNumbers: [2, 1] }), /Protected field changed: scheduledAt/);
    assert.equal(writesAttempted, 1);
    assert.equal(committed, false);
    assert.equal(JSON.stringify(original), originalDigest);
});
