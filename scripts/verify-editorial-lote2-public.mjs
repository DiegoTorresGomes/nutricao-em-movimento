// HTTP GET/HEAD evidence only: does not execute page JS, forms or counters.
import fs from "node:fs";
const root = "docs/editorial/revisao-lote-2/";
const applied = JSON.parse(fs.readFileSync(root + "depois-aplicacao.json"));
if (applied.state !== "APPLIED_ALL_SIX") throw Error("Batch has not been applied");
const pack = JSON.parse(fs.readFileSync(root + "pacote-aplicacao.json"));
const site = "https://www.nutricaoemovimento.com";
const decode = text => String(text).replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const text = html => decode(html.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const attr = (html, name) => decode(html.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"))?.[1] || "");
const tag = (html, name, test) => (html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) || []).find(test) || "";
async function get(path, method = "GET") {
  const url = new URL(path, site).href;
  const response = await fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(30000) });
  return { requested: url, finalUrl: response.url, status: response.status, redirected: response.redirected, contentType: response.headers.get("content-type"), cache: Object.fromEntries(["age", "cache-control", "x-nextjs-cache", "x-cache"].map(key => [key, response.headers.get(key)])), body: method === "HEAD" ? "" : await response.text() };
}
const settled = await Promise.allSettled(applied.articles.map(async article => {
  const page = await get("/pt/artigos/" + article.slug);
  const proposal = pack.articles.find(a => a.id === article.id);
  const body = page.body.match(/<div class="article-content[^"]*"[^>]*>([\s\S]*?)<\/div>/)?.[1] || "";
  const schemas = Array.from(page.body.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g), m => JSON.parse(m[1]));
  const posting = schemas.flatMap(s => s["@graph"] || s).find(s => s["@type"] === "BlogPosting");
  const canonical = attr(tag(page.body, "link", t => /rel="canonical"/.test(t)), "href");
  const internalLinks = Array.from(body.matchAll(/<a\b[^>]*href="(\/pt\/artigos\/[^"#?]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/g), m => ({ href: decode(m[1]), anchor: text(m[2]) }));
  const h1 = Array.from(page.body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g), m => text(m[1]));
  const headings = Array.from(body.matchAll(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/g), m => ({ level: Number(m[1]), text: text(m[2]) }));
  const description = attr(tag(page.body, "meta", t => /name="description"/.test(t)), "content");
  const { body: ignored, ...http } = page; void ignored;
  return { number: article.number, id: article.id, ...http, canonical, title: text(page.body.match(/<title>([\s\S]*?)<\/title>/)?.[1] || ""), h1, headings,
    exactApprovedBody: body.trim() === proposal.content.trim(), bodyPresent: Boolean(body), bodyTextLength: text(body).length,
    internalLinks, referenceEntryCount: (body.split(/<h2>Referências<\/h2>/)[1]?.match(/<li>/g) || []).length,
    expectedReferenceEntries: proposal.references.length, hasBold: /<strong>/.test(body), hasBodyH1: /<h1\b/.test(body), hasLocalhost: /localhost|127\.0\.0\.1/.test(body),
    canonicalCorrect: canonical === site + "/pt/artigos/" + article.slug,
    h1Correct: h1.length === 1 && h1[0] === article.title,
    coverImagePresent: page.body.includes(article.coverImage),
    authorDisplayPresent: page.body.includes("Weverlyn Alves"), crnPresent: page.body.includes("24101524"), authorProfilePresent: page.body.includes("/pt/autora/weverlyn-alves"),
    schema: posting || null, schemaChecks: { published: posting?.datePublished === article.publishedAt, modified: posting?.dateModified === article.editorialUpdatedAt, authorName: posting?.author?.name === "Weverlyn da Cruz Alves Torres", authorUrl: posting?.author?.url === site + "/pt/autora/weverlyn-alves", headline: posting?.headline === article.title, mainEntity: (posting?.mainEntityOfPage?.["@id"] || posting?.mainEntityOfPage) === canonical },
    description, approvedExcerptRendered: description === article.description,
    seoFieldsStoredButTemplateUsesTitleAndDescription: true,
    related: Array.from((page.body.split("Artigos relacionados")[1]?.split("</section>")[0] || "").matchAll(/href="(\/pt\/artigos\/[^"#?]+)"/g), m => m[1]).filter((v, i, a) => a.indexOf(v) === i),
    // Retain the observed body for an auditable full-text review, not a sample.
    observedBody: body,
  };
}));
const articles = settled.map((r, i) => r.status === "fulfilled" ? r.value : { number: applied.articles[i].number, error: String(r.reason) });
const links = [...new Set(articles.flatMap(a => a.internalLinks?.map(l => l.href) || []))];
const linkResults = await Promise.allSettled(links.map(async path => { const { body, ...response } = await get(path); void body; return response; }));
const images = await Promise.allSettled(applied.articles.map(async a => { const { body, ...response } = await get(a.coverImage, "HEAD"); void body; return { number: a.number, ...response }; }));
const paths = ["/pt", "/pt/artigos", "/pt/autora/weverlyn-alves", "/pt/politica-editorial", "/sitemap.xml", "/feed.xml", "/login", "/administracao", ...applied.articles.map(a => "/administracao/artigos/" + a.id + "/editar")];
const routes = await Promise.allSettled(paths.map(async path => {
  const response = await get(path);
  if (path === "/sitemap.xml" || path === "/feed.xml") fs.writeFileSync(root + (path === "/sitemap.xml" ? "sitemap-publico.xml" : "feed-publico.xml"), response.body);
  const { body, ...http } = response;
  return { path, ...http, ...(path.startsWith("/administracao") ? { authenticatedEditorTested: false, loginRedirect: new URL(http.finalUrl).pathname.startsWith("/login") } : {}),
    batchPresence: ["/sitemap.xml", "/feed.xml", "/pt/artigos", "/pt/autora/weverlyn-alves"].includes(path) ? applied.articles.map(a => ({ number: a.number, present: body.includes(a.slug), excerptPresent: body.includes(a.description) || body.includes(a.description.replaceAll("&", "&amp;")) })) : undefined };
}));
const unwrap = (values, keys) => values.map((r, i) => r.status === "fulfilled" ? r.value : { target: keys[i], error: String(r.reason) });
const sitemap = fs.readFileSync(root + "sitemap-publico.xml", "utf8");
const feed = fs.readFileSync(root + "feed-publico.xml", "utf8");
const items = Array.from(feed.matchAll(/<item>([\s\S]*?)<\/item>/g), m => m[1]);
const feedLinks = items.map(item => decode(item.match(/<guid[^>]*>([^<]+)<\/guid>/)?.[1] || ""));
const archived = applied.allRecordsAfter.filter(a => a.status === "ARCHIVED");
const output = { checkedAt: new Date().toISOString(), mode: "GET_HEAD_ONLY_NO_PAGE_JAVASCRIPT", articles,
  internalLinks: unwrap(linkResults, links), images: unwrap(images, applied.articles.map(a => a.coverImage)), routes: unwrap(routes, paths),
  sitemap: { allSixPresent: applied.articles.every(a => sitemap.includes(site + "/pt/artigos/" + a.slug)), archivedAbsent: archived.every(a => !sitemap.includes("/pt/artigos/" + a.slug)), dates: applied.articles.map(a => { const entry = Array.from(sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g), m => m[1]).find(entry => entry.includes("/pt/artigos/" + a.slug)); return { number: a.number, lastmod: entry?.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1], expected: a.editorialUpdatedAt, current: entry?.includes(a.editorialUpdatedAt) || false }; }) },
  feed: { itemCount: items.length, uniqueIdentities: new Set(feedLinks).size === feedLinks.length, archivedAbsent: archived.every(a => !feed.includes("/pt/artigos/" + a.slug)), batch: applied.articles.map(a => { const item = items.find(i => i.includes("/pt/artigos/" + a.slug)); return { number: a.number, present: Boolean(item), originalPubDate: decode(item?.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1] || "") === new Date(a.publishedAt).toUTCString(), titleCorrect: decode(item?.match(/<title>([^<]+)<\/title>/)?.[1] || "") === a.title }; }) },
};
fs.writeFileSync(root + "verificacao-publica-final.json", JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify({ articles: articles.map(a => ({ number: a.number, status: a.status, exactBody: a.exactApprovedBody, schema: a.schemaChecks, error: a.error })), links: output.internalLinks.map(l => ({ status: l.status, redirected: l.redirected, error: l.error })), sitemap: output.sitemap, feed: output.feed, routes: output.routes.map(r => ({ path: r.path, status: r.status, loginRedirect: r.loginRedirect, error: r.error })) }, null, 2));
