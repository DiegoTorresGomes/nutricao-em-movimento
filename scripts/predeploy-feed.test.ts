import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { buildRss } from "../src/lib/rss";
import { articleModifiedAt } from "../src/lib/editorial-dates";

function parseRss(xml: string) {
  // A real XML parser validates the whole document, including attributes.
  const command = `[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false); [Console]::InputEncoding = New-Object System.Text.UTF8Encoding($false); $ErrorActionPreference='Stop'; $doc=New-Object System.Xml.XmlDocument; $doc.LoadXml([Console]::In.ReadToEnd()); $items=@($doc.SelectNodes('/rss/channel/item') | ForEach-Object { @{ title=$_.SelectSingleNode('title').InnerText; description=$_.SelectSingleNode('description').InnerText; category=$_.SelectSingleNode('category').InnerText; link=$_.SelectSingleNode('link').InnerText; guid=$_.SelectSingleNode('guid').InnerText; pubDate=$_.SelectSingleNode('pubDate').InnerText } }); @{ title=$doc.SelectSingleNode('/rss/channel/title').InnerText; description=$doc.SelectSingleNode('/rss/channel/description').InnerText; lastBuildDate=$doc.SelectSingleNode('/rss/channel/lastBuildDate').InnerText; items=$items } | ConvertTo-Json -Depth 5 -Compress`;
  return JSON.parse(execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", command], { input: xml, encoding: "utf8", windowsHide: true }));
}

test("RSS round-trips raw special characters once across channel, items and URLs", () => {
  const raw = `Nutrição & Movimento <exemplo> "aspas" 'ação'`;
  const posts = [{ title: raw, description: raw, slug: "exemplo?origem=a&destino=b", category: { name: raw }, publishedAt: new Date("2020-01-02T03:04:05Z"), editorialUpdatedAt: new Date("2026-11-08T19:37:59Z") }];
  const snapshot = structuredClone(posts);
  const xml = buildRss(posts, { title: raw, description: raw, url: "https://www.nutricaoemovimento.com" });
  assert.match(xml, /Nutrição &amp; Movimento &lt;exemplo&gt; &quot;aspas&quot; &apos;ação&apos;/);
  assert.doesNotMatch(xml, /&amp;amp;|&amp;lt;|&amp;quot;/);
  const parsed = parseRss(xml);
  assert.equal(parsed.title, raw);
  assert.equal(parsed.description, raw);
  assert.equal(parsed.items.length, 1);
  for (const key of ["title", "description", "category"]) assert.equal(parsed.items[0][key], raw);
  assert.equal(parsed.items[0].link, "https://www.nutricaoemovimento.com/pt/artigos/" + posts[0].slug);
  assert.equal(parsed.items[0].guid, parsed.items[0].link);
  assert.deepEqual(posts, snapshot);
});

test("RSS and sitemap dates retain editorial meaning and original publication", () => {
  const publishedAt = new Date("2020-01-02T03:04:05Z");
  const editorialUpdatedAt = new Date("2026-11-08T19:37:59Z");
  const posts = [{ title: "Exemplo", description: "Resumo", slug: "exemplo", category: { name: "Categoria" }, publishedAt, editorialUpdatedAt, updatedAt: new Date("2050-01-01T00:00:00Z") }];
  const parsed = parseRss(buildRss(posts, { title: "Nutrição & Movimento", description: "Descrição", url: "https://www.nutricaoemovimento.com" }));
  assert.equal(parsed.items[0].pubDate, publishedAt.toUTCString());
  assert.equal(parsed.lastBuildDate, editorialUpdatedAt.toUTCString());
  assert.equal(articleModifiedAt(posts[0]), editorialUpdatedAt);
  assert.equal(articleModifiedAt({ ...posts[0], editorialUpdatedAt: null }), publishedAt);
  assert.equal(articleModifiedAt({ ...posts[0], editorialUpdatedAt: null, publishedAt: null }), undefined);
});
