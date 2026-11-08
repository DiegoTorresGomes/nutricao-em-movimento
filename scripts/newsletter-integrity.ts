import fs from "node:fs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { prisma } from "../src/lib/prisma";
import { assertBaselineCompatible } from "./editorial-lote2-guards";

const root = "docs/monetizacao/auditoria-final-adsense/";
async function main() {
  const records = JSON.parse(JSON.stringify(await prisma.post.findMany({ orderBy: { id: "asc" } })));
  // Never persist subscriber addresses, confirmation tokens or other personal data.
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { id: "asc" } });
  const subscriberDigest = createHash("sha256").update(JSON.stringify(subscribers)).digest("hex");
  const result = { capturedAt: new Date().toISOString(), databaseWrites: 0, records, subscriberCount: subscribers.length, subscriberDigest };
  const file = root + "newsletter-integridade-antes.json";
  if (process.argv.includes("--before")) {
    assert.ok(!fs.existsSync(file));
    fs.writeFileSync(file, JSON.stringify(result, null, 2) + "\n");
  } else {
    const before = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(records.length, before.records.length);
    for (const row of records) assertBaselineCompatible(row, before.records.find((r: { id: string }) => r.id === row.id));
    assert.equal(result.subscriberCount, before.subscriberCount);
    assert.equal(result.subscriberDigest, before.subscriberDigest);
    fs.writeFileSync(root + "newsletter-integridade-final.json", JSON.stringify(result, null, 2) + "\n");
  }
  console.log(JSON.stringify({ records: records.length, subscriberCount: subscribers.length, databaseWrites: 0, verified: true }));
}
main().catch(error => { console.error(error.message); process.exitCode = 1; }).finally(() => prisma.$disconnect());
