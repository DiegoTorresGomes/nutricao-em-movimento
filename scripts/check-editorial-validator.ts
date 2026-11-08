// Offline verification only: reads saved evidence and writes this audit report.
// No Prisma, CMS requests, database access or application entry point.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { validatePostBeforePublish, type ValidatePostInput } from "../src/lib/editor/validate-post";

const directory = "docs/editorial/revisao-lote-2/";
const snapshot = JSON.parse(readFileSync(directory + "antes-aplicacao.json", "utf8")) as {
  capturedAt: string;
  approvedFilesSha256: Record<string, string>;
  articles: (ValidatePostInput & { id: string; number: number; lastPreviewAt: string | null })[];
};
const prepared = JSON.parse(readFileSync(directory + "pacote-aplicacao.json", "utf8")) as {
  articles: (ValidatePostInput & { id: string; number: number; contentSha256: string })[];
};
const sha256 = (data: string | Buffer) => createHash("sha256").update(data).digest("hex");
for (const [file, hash] of Object.entries(snapshot.approvedFilesSha256)) {
  assert.equal(sha256(readFileSync("docs/editorial/lote-2/" + file)), hash, file);
}
const results = prepared.articles.map(proposal => {
  const saved = snapshot.articles.find(article => article.id === proposal.id);
  assert.ok(saved);
  assert.equal(sha256(proposal.content || ""), proposal.contentSha256);
  const input = { ...saved, ...proposal, blocks: [], useLegacyHtml: true, hasOtherPublishedPosts: true };
  const before = JSON.stringify(input);
  const result = validatePostBeforePublish(input);
  assert.equal(JSON.stringify(input), before);
  return {
    number: proposal.number, title: proposal.title, ...result,
    preservedVisualState: {
      desktopReviewed: saved.desktopReviewed, tabletReviewed: saved.tabletReviewed,
      mobileReviewed: saved.mobileReviewed, lastPreviewAt: saved.lastPreviewAt,
    },
  };
});
const guard = JSON.parse(readFileSync(directory + "interrupcao.json", "utf8"));
assert.equal(guard.writeCount, 0);
const output = {
  checkedAt: new Date().toISOString(), mode: "OFFLINE_VALIDATION_ONLY",
  snapshotCapturedAt: snapshot.capturedAt, approvedFilesUnchanged: true,
  preparedBodiesUnchanged: true, writeCount: 0, applicationGuardPreserved: true,
  passed: results.filter(result => result.canPublish).length, total: results.length, results,
};
mkdirSync("docs/editorial/validacao-cms", { recursive: true });
writeFileSync("docs/editorial/validacao-cms/lote-2.json", JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify({ passed: output.passed, total: output.total, pending: results.filter(r => !r.canPublish).map(r => ({ number: r.number, missing: r.missingRequired })) }, null, 2));
