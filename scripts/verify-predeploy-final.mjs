// GET only against a local production build; no page JS, counters or forms.
import fs from "node:fs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
const root = "docs/monetizacao/pre-deploy-final/";
const baseline = JSON.parse(fs.readFileSync(root + "antes-banco.json"));
const applied = JSON.parse(fs.readFileSync("docs/editorial/revisao-lote-2/depois-aplicacao.json"));
const origin = "http://127.0.0.1:4183";
const paths = ["/feed.xml", "/sitemap.xml", "/pt", "/pt/artigos", "/pt/autora/weverlyn-alves"];
const result = await Promise.allSettled(paths.map(async path => {
  const r = await fetch(origin + path, { signal: AbortSignal.timeout(30000) });
  const body = await r.text();
  assert.equal(r.status, 200, path);
  if (path.endsWith(".xml")) fs.writeFileSync(root + (path === "/feed.xml" ? "feed-local.xml" : "sitemap-local.xml"), body);
  return { path, status: r.status, contentType: r.headers.get("content-type"), cacheControl: r.headers.get("cache-control"), nextCache: r.headers.get("x-nextjs-cache"), sha256: createHash("sha256").update(body).digest("hex"),
    batch: applied.articles.map(a => ({ number: a.number, slugPresent: body.includes(a.slug), approvedExcerptPresent: body.includes(a.description) || body.includes(a.description.replaceAll("&", "&amp;")) })) };
}));
for (const r of result) if (r.status === "rejected") throw r.reason;
const responses = result.map(r => r.value);
const listing = responses.find(r => r.path === "/pt/artigos");
assert.ok(listing.batch.every(a => a.slugPresent && a.approvedExcerptPresent));
const profile = responses.find(r => r.path.includes("/autora/"));
assert.ok(profile.batch.filter(a => [30, 22].includes(a.number)).every(a => a.slugPresent && a.approvedExcerptPresent));
const published = baseline.records.filter(a => a.status === "PUBLISHED");
const expected = { channelTitle: "Nutrição & Movimento", published: published.map(a => ({ url: "https://www.nutricaoemovimento.com/pt/artigos/" + a.slug, title: a.title, description: a.description, pubDate: new Date(a.publishedAt).toUTCString(), lastmod: a.editorialUpdatedAt || a.publishedAt })), archived: baseline.records.filter(a => a.status === "ARCHIVED").map(a => "https://www.nutricaoemovimento.com/pt/artigos/" + a.slug) };
fs.writeFileSync(root + "xml-esperado.json", JSON.stringify(expected, null, 2) + "\n");
const manifest = JSON.parse(fs.readFileSync(".next/prerender-manifest.json"));
const cache = Object.fromEntries(["/sitemap.xml", "/pt/artigos", "/pt/autora/weverlyn-alves", "/feed.xml"].map(path => [path, manifest.routes[path] || null]));
fs.writeFileSync(root + "verificacao-local.json", JSON.stringify({ checkedAt: new Date().toISOString(), productionBuild: true, responses, compiledRouteCache: cache }, null, 2) + "\n");
console.log(JSON.stringify({ responses, compiledRevalidate: Object.fromEntries(Object.entries(cache).map(([path, entry]) => [path, entry?.initialRevalidateSeconds ?? "dynamic"])) }, null, 2));
