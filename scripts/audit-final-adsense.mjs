// Production audit: GET/HEAD only, no page JavaScript, counters, forms or cron.
import fs from "node:fs";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { articleBody } from "../src/lib/editor/article-body.ts";
const root = "docs/monetizacao/auditoria-final-adsense/";
fs.mkdirSync(root, { recursive: true });
const baseline = JSON.parse(fs.readFileSync(root + "integridade-antes.json"));
const site = "https://www.nutricaoemovimento.com";
const decode = s => String(s).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replaceAll("&quot;", '"').replaceAll("&apos;", "'").replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&nbsp;", " ").replaceAll("&amp;", "&");
const plain = html => decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "").replace(/<\/(?:p|h[1-6]|li|section)>/gi, "\n").replace(/<[^>]*>/g, " ")).replace(/[ \t]+/g, " ").replace(/\n\s*\n/g, "\n").trim();
const attribute = (tag, name) => decode(tag.match(new RegExp(`(?:^|\\s)${name}=["']([^"']*)["']`, "i"))?.[1] || "");
const linksOf = html => Array.from(html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi), m => ({ href: attribute(m[1], "href"), anchor: plain(m[2]) })).filter(a => a.href);
const normalize = href => { try { return new URL(href, site).href; } catch { return null; } };
function articleHtml(html) {
  const start = /<div\b[^>]*class="article-content[^"]*"[^>]*>/i.exec(html);
  if (!start) return "";
  const offset = start.index + start[0].length;
  let depth = 1;
  const divs = /<\/?div\b[^>]*>/gi;
  divs.lastIndex = offset;
  for (const match of html.matchAll(divs)) {
    depth += /^<\//.test(match[0]) ? -1 : 1;
    if (!depth) return html.slice(offset, match.index);
  }
  return "";
}
async function get(url, method = "GET", redirect = "follow") {
  const response = await fetch(normalize(url), { method, redirect, signal: AbortSignal.timeout(20000) });
  return { requested: normalize(url), url: response.url, status: response.status, redirected: response.redirected,
    headers: Object.fromEntries(["content-type", "cache-control", "x-nextjs-cache", "x-robots-tag", "location", "content-length"].map(key => [key, response.headers.get(key)])),
    body: method === "HEAD" ? "" : await response.text() };
}
async function batch(values, fn, size = 5) {
  const output = [];
  for (let i = 0; i < values.length; i += size) {
    const results = await Promise.allSettled(values.slice(i, i + size).map(fn));
    output.push(...results.map((r, j) => r.status === "fulfilled" ? r.value : { target: values[i + j], error: String(r.reason) }));
  }
  return output;
}
function summarize(page, isArticle = false) {
  const html = page.body;
  const metas = (html.match(/<meta\b[^>]*>/gi) || []).map(t => ({ name: attribute(t, "name") || attribute(t, "property"), content: attribute(t, "content") }));
  const canonical = (html.match(/<link\b[^>]*>/gi) || []).filter(t => attribute(t, "rel") === "canonical").map(t => attribute(t, "href"));
  const scripts = Array.from(html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi), m => ({ src: attribute(m[1], "src"), type: attribute(m[1], "type"), id: attribute(m[1], "id"), inlineLength: m[2].length }));
  const schemas = Array.from(html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi), m => { try { return JSON.parse(m[1]); } catch { return { invalid: true }; } });
  const body = isArticle ? articleHtml(html) : html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] || html;
  return { ...page, body: undefined, htmlSha256: createHash("sha256").update(html).digest("hex"), metas, canonical, scripts, schemas,
    h1: Array.from(html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi), m => plain(m[1])),
    headings: Array.from(body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi), m => ({ level: Number(m[1]), text: plain(m[2]) })),
    title: plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || ""), text: plain(body), bodyHtml: isArticle ? body : undefined,
    links: linksOf(body), navigationLinks: linksOf(html),
    images: (body.match(/<img\b[^>]*>/gi) || []).map(tag => Object.fromEntries(["src", "alt", "width", "height", "loading", "sizes"].map(k => [k, attribute(tag, k)]))),
    defaultConsentInline: Array.from(html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi), m => m[1]).find(s => s.trim().startsWith("window.dataLayer") && s.includes("analytics_storage") && s.includes("default")) || null,
    hasAdsenseId: html.includes("ca-pub-3638053236344020"), hasGtmMarkup: /googletagmanager\.com\/gtm\.js/.test(html), hasGaLoaderMarkup: /googletagmanager\.com\/gtag\/js/.test(html), hasAdsLoaderMarkup: /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/.test(html),
    publisherMetadata: metas.filter(m => m.name === "google-adsense-account"),
  };
}
const published = baseline.records.filter(a => a.status === "PUBLISHED");
const articles = await batch(published, async record => {
  const page = summarize(await get("/pt/artigos/" + record.slug), true);
  const posting = page.schemas.flatMap(s => s["@graph"] || s).find(s => s["@type"] === "BlogPosting");
  return { ...page, id: record.id, expectedPublication: record.publishedAt, expectedModification: record.editorialUpdatedAt || record.publishedAt,
    exactStoredBody: page.bodyHtml.trim() === articleBody(record.content, record.slug).trim(),
    schemaChecks: { headline: posting?.headline === record.title, datePublished: posting?.datePublished === record.publishedAt, dateModified: posting?.dateModified === (record.editorialUpdatedAt || record.publishedAt), author: posting?.author?.name === "Weverlyn da Cruz Alves Torres", authorUrl: posting?.author?.url === site + "/pt/autora/weverlyn-alves", canonical: (posting?.mainEntityOfPage?.["@id"] || posting?.mainEntityOfPage) === site + "/pt/artigos/" + record.slug },
  };
});
const paths = ["/", "/pt", "/pt/artigos", "/pt/sobre", "/pt/contato", "/pt/autora/weverlyn-alves", "/pt/politica-editorial", "/pt/politica-de-privacidade", "/pt/politica-de-cookies", "/pt/termos-de-uso", "/pt/disclaimer", "/login", "/administracao", "/preview", "/debug", "/dev", "/test", "/fixtures", "/pt/newsletter", "/ads.txt", "/robots.txt", "/feed.xml", "/sitemap.xml"];
const pages = await batch(paths, async p => {
  const raw = await get(p);
  if (["/ads.txt", "/robots.txt", "/feed.xml", "/sitemap.xml"].includes(p)) {
    fs.writeFileSync(root + p.slice(1), raw.body);
    return { path: p, ...raw, body: undefined, text: raw.body };
  }
  return { path: p, ...summarize(raw) };
});
const internal = [...new Set([...articles, ...pages.filter(p => p.status === 200 && p.path?.startsWith("/pt"))].flatMap(a => (a.links || []).filter(l => !l.href.startsWith("#")).map(l => new URL(l.href, a.url).href)).filter(url => new URL(url).hostname.endsWith("nutricaoemovimento.com")))].filter(url => !/\/(api|administracao|login)(\/|$)/.test(new URL(url).pathname));
const internalLinks = await batch(internal, async url => {
  const { body, ...result } = await get(url); void body;
  return result;
});
const images = [...new Set([...articles, ...pages.filter(p => p.path?.startsWith("/pt"))].flatMap(p => p.images || []).map(i => normalize(i.src)).filter(Boolean))];
const imageChecks = await batch(images, async url => { const { body, ...r } = await get(url, "HEAD"); void body; return r; }, 4);
const old = "/pt/artigos/emagrecimento-sustentavel-habitos-que-importam-mais-que-forca-de-vontade";
const redirectUrls = ["http://www.nutricaoemovimento.com/pt", "http://nutricaoemovimento.com/pt", "https://nutricaoemovimento.com/pt", site + old, "https://nutricaoemovimento.com" + old];
const redirects = await batch(redirectUrls, async start => {
  const steps = []; let url = start;
  for (let i = 0; i < 5; i++) { const { body, ...r } = await get(url, "GET", "manual"); void body; steps.push(r); if (!r.headers.location) break; url = new URL(r.headers.location, url).href; }
  return { start, steps };
});
const output = { checkedAt: new Date().toISOString(), method: "PUBLIC_GET_HEAD_NO_PAGE_JS_NO_FORMS_NO_WRITES", articles, pages, internalLinks, imageChecks, redirects };
fs.writeFileSync(root + "evidencias-publicas.json", JSON.stringify(output, null, 2) + "\n");
for (const [name, args] of [["npm-audit", ["audit", "--json"]], ["npm-audit-producao", ["audit", "--omit=dev", "--json"]]]) {
  const result = spawnSync(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", "npm " + args.join(" ")], { encoding: "utf8", windowsHide: true, maxBuffer: 10 * 1024 * 1024 });
  fs.writeFileSync(root + name + ".json", result.stdout);
}
console.log(JSON.stringify({ articles: articles.map(a => ({ title: a.h1?.[0], status: a.status, exact: a.exactStoredBody })), pages: pages.map(p => ({ path: p.path, status: p.status, error: p.error })), internalLinks: internalLinks.length, brokenInternal: internalLinks.filter(l => l.status !== 200), images: imageChecks.length, brokenImages: imageChecks.filter(i => i.status !== 200), redirects }, null, 2));
