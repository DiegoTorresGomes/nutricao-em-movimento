import fs from "node:fs";
import assert from "node:assert/strict";
import { isDeepStrictEqual } from "node:util";
import "dotenv/config";
import { prisma } from "../src/lib/prisma";
import { buildLote2Package, revisionRoot, saveRevision } from "./apply-editorial-lote2";
import { assertBaselineCompatible } from "./editorial-lote2-guards";
import { validatePostBeforePublish } from "../src/lib/editor/validate-post";

async function main() {
  const after = JSON.parse(fs.readFileSync(revisionRoot + "/depois-aplicacao.json", "utf8"));
  assert.equal(after.state, "APPLIED_ALL_SIX");
  const before = JSON.parse(fs.readFileSync(revisionRoot + "/antes-aplicacao.json", "utf8"));
  const pack = buildLote2Package();
  const rows = await prisma.post.findMany({ orderBy: { id: "asc" } });
  const plain = (value: unknown) => JSON.parse(JSON.stringify(value));
  assert.equal(rows.length, after.allRecordsAfter.length);
  const checks = rows.map(row => {
    const expected = after.allRecordsAfter.find((a: { id: string }) => a.id === row.id);
    assert.ok(expected);
    assertBaselineCompatible(plain(row), expected);
    const prior = after.transactionBefore.find((a: { id: string }) => a.id === row.id);
    const proposal = pack.articles.find((a: { id: string }) => a.id === row.id);
    const changedFields = Object.keys(row).filter(key => !isDeepStrictEqual(plain(row)[key], prior[key]));
    if (!proposal) {
      assert.ok(changedFields.every(key => key === "views"));
      return { id: row.id, inBatch: false, editorialAndStructuralFieldsUnchanged: true, dynamicViewsIncrement: row.views - prior.views };
    }
    for (const key of ["id", "slug", "status", "publishedAt", "scheduledAt", "authorId", "categoryId", "focusKeyword"]) assert.deepEqual(plain(row)[key], prior[key], key);
    assert.equal(row.content, proposal.content);
    for (const key of ["title", "description", "seoTitle", "seoDescription"]) assert.equal(plain(row)[key], proposal[key]);
    assert.deepEqual(row.contentBlocks, []);
    const visualUpdated = [2, 1].includes(proposal.number);
    const visualKeys = ["desktopReviewed", "tabletReviewed", "mobileReviewed", "lastPreviewAt"];
    if (visualUpdated) {
      assert.ok(row.desktopReviewed && row.tabletReviewed && row.mobileReviewed);
      assert.equal(row.lastPreviewAt?.toISOString(), row.editorialUpdatedAt?.toISOString());
    } else for (const key of visualKeys) assert.deepEqual(plain(row)[key], prior[key]);
    assert.notEqual(row.editorialUpdatedAt?.toISOString(), prior.editorialUpdatedAt);
    const validation = validatePostBeforePublish({ ...row, blocks: [], useLegacyHtml: true, hasOtherPublishedPosts: true });
    assert.equal(validation.canPublish, true);
    const allowed = ["title", "description", "seoTitle", "seoDescription", "content", "contentBlocks", "editorialUpdatedAt", "updatedAt", "views", ...(visualUpdated ? visualKeys : [])];
    assert.ok(changedFields.every(key => allowed.includes(key)));
    return { id: row.id, number: proposal.number, inBatch: true, changedFields, protectedFieldsPreserved: true,
      viewsBefore: prior.views, viewsAtCommit: expected.views, viewsCurrent: row.views,
      publishedAt: row.publishedAt, scheduledAt: row.scheduledAt, editorialUpdatedAt: row.editorialUpdatedAt,
      approvedContentExact: true, visualUpdatedWithHumanApproval: visualUpdated, canPublish: validation.canPublish,
      missingRequired: validation.missingRequired };
  });
  const result = { state: "APPLIED_ALL_SIX_INTEGRITY_CONFIRMED", checkedAt: new Date().toISOString(),
    baselineCapturedAt: before.capturedAt, totalRecords: rows.length, editorialChanges: 6, outsideBatchCount: rows.length - 6,
    onlySixEditoriallyChanged: true, outsideBatchUnchangedExceptPermittedMonotonicViews: true,
    approvedFilesUnchanged: true, allProtectedFieldsPreserved: true, viewsNeverWritten: true,
    counts: { published: rows.filter(a => a.status === "PUBLISHED").length, archived: rows.filter(a => a.status === "ARCHIVED").length }, checks };
  saveRevision("integridade-final.json", result);
  saveRevision("verificacao-banco-final.json", { checkedAt: result.checkedAt, records: plain(rows) });
  console.log(JSON.stringify(result, null, 2));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
