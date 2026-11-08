import fs from "node:fs";
const root = "docs/monetizacao/auditoria-final-adsense/";
const evidence = JSON.parse(fs.readFileSync(root + "evidencias-publicas.json"));
const site = "https://www.nutricaoemovimento.com";
const attr = (tag, key) => tag.match(new RegExp(`\\b${key}=["']([^"']*)["']`, "i"))?.[1]?.replaceAll("&amp;", "&") || "";
async function batch(values, fn) {
  const out = [];
  for (let i = 0; i < values.length; i += 4) {
    const r = await Promise.allSettled(values.slice(i, i + 4).map(fn));
    out.push(...r.map((x, n) => x.status === "fulfilled" ? x.value : { target: values[i + n], error: String(x.reason) }));
  }
  return out;
}
const supplements = await batch([...evidence.articles, ...evidence.pages.filter(p => ["/pt", "/login"].includes(p.path))], async page => {
  const r = await fetch(page.url, { signal: AbortSignal.timeout(15000) }); const html = await r.text();
  const scripts = Array.from(html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi), m => m[1]);
  const consentDefaults = scripts.find(s => s.includes("analytics_storage") && s.includes("ad_storage") && s.includes("default"));
  return { url: page.url, id: page.id, path: page.path, status: r.status, consentDefaultsInline: consentDefaults || null,
    allImages: (html.match(/<img\b[^>]*>/gi) || []).map(tag => Object.fromEntries(["src", "alt", "width", "height", "loading", "sizes"].map(k => [k, attr(tag, k)]))),
    cookiePreferencesMarkup: html.includes("Preferências de cookies"), newsletterPrompts: ["Receba conteúdos para construir constância.", "Você poderá sair da lista quando quiser."].filter(s => html.includes(s)),
  };
});
const urls = [...new Set(supplements.flatMap(p => p.allImages || []).map(i => new URL(i.src, site).href))];
const images = await batch(urls, async url => { const r = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(15000) }); return { url, status: r.status, mime: r.headers.get("content-type") }; });
const jsUrls = [...new Set(evidence.pages.filter(p => ["/pt", "/login"].includes(p.path)).flatMap(p => p.scripts || []).map(s => s.src).filter(s => s.startsWith("/_next/")).map(s => site + s))];
const bundles = await batch(jsUrls, async url => {
  const r = await fetch(url, { signal: AbortSignal.timeout(15000) }); const code = await r.text();
  return { url, status: r.status, bytes: Buffer.byteLength(code), gaIdentifiers: [...new Set(code.match(/\bG-[A-Z0-9]{5,}\b/g) || [])],
    consentTokens: ["nem-consent-v2", "Recusar opcionais", "Aceitar opcionais", "Preferências", "nem-google-analytics", "ad_personalization", "denied", "gtag/js", "adsbygoogle", "googletagmanager.com/gtm.js", "clarity.ms"].filter(s => code.includes(s)) };
});
const incoming = Object.fromEntries(evidence.articles.map(a => [new URL(a.url).pathname, []]));
for (const p of [...evidence.articles, ...evidence.pages.filter(p => p.path?.startsWith("/pt"))]) for (const link of p.navigationLinks || []) {
  let target; try { target = new URL(link.href, p.url); } catch { continue; }
  if (target.hostname === "www.nutricaoemovimento.com" && incoming[target.pathname] && target.pathname !== new URL(p.url).pathname) incoming[target.pathname].push(new URL(p.url).pathname);
}
const result = { checkedAt: new Date().toISOString(), method: "HTTP_AND_SHIPPED_STATIC_JS_INSPECTION_NOT_BROWSER_RUNTIME", supplements, images, bundles,
  noIncomingFromAuditedPages: Object.entries(incoming).filter(([, links]) => !links.length).map(([url]) => url),
  note: "Fragment-only links resolve in the current page. The main evidence runner's root/#explorar redirect is an audit resolution artefact, not a demonstrated broken link. Image relation/overflow and consent clicks remain unverified without browser." };
fs.writeFileSync(root + "evidencias-suplementares.json", JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify({ sampledPages: supplements.length, imageUrls: images.length, brokenImages: images.filter(i => i.status !== 200), orphans: result.noIncomingFromAuditedPages, publicDefaults: supplements.filter(p => p.path).map(p => ({ path: p.path, defaults: Boolean(p.consentDefaultsInline), cookiePreferences: p.cookiePreferencesMarkup })), gaIds: [...new Set(bundles.flatMap(b => b.gaIdentifiers || []))] }, null, 2));
