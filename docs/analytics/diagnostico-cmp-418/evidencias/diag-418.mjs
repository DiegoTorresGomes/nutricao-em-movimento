/* eslint-disable -- evidence script for diagnosis, not application code */
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
// React #418 reproduction on production build: AdSense allowed vs blocked, with/without delayed Next chunks.
// GA hits fulfilled locally; real ad requests blocked.
const ORIGIN = process.env.ORIGIN || "https://www.nutricaoemovimento.com";
const PATH = process.env.P || "/pt/sobre";
const AD_REQ = /googleads\.g\.doubleclick\.net\/pagead\/ads|pagead2\.googlesyndication\.com\/pagead\/ads\?|securepubads|\/pagead\/adview/;
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });

async function run(name, { blockAdsense, delayChunksMs }) {
  const ctx = await browser.newContext({ locale: "pt-BR" });
  await ctx.route("**/*", async (route) => {
    const url = route.request().url();
    if (/\/g\/collect/.test(url)) return route.fulfill({ status: 204, body: "" });
    if (AD_REQ.test(url)) return route.abort();
    if (blockAdsense && /adsbygoogle\.js/.test(url)) return route.abort();
    if (delayChunksMs && /\/_next\/static\/chunks\/.*\.js/.test(url)) await new Promise((r) => setTimeout(r, delayChunksMs));
    return route.continue();
  });
  await ctx.addInitScript(() => {
    if (window.top !== window) return;
    const log = (window.__d = { inserts: [], commits: [], errors: [] });
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, renderers: new Map(), inject() { return 1; }, onScheduleFiberRoot() {}, onCommitFiberUnmount() {}, onPostCommitFiberRoot() {}, checkDCE() {}, onCommitFiberRoot() { log.commits.push(Math.round(performance.now())); } };
    window.addEventListener("error", (e) => log.errors.push({ t: Math.round(performance.now()), msg: String(e.message || e.error).slice(0, 260) }));
    const mo = new MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) { if (n.nodeType !== 1) continue; const p = m.target; if (![document.head, document.body, document.documentElement].includes(p)) continue;
      log.inserts.push({ t: Math.round(performance.now()), parent: p.tagName.toLowerCase(), node: n.tagName.toLowerCase() + (n.id ? "#" + n.id : "") + (n.className && typeof n.className === "string" ? "." + n.className.split(" ")[0] : "") + (n.src ? " " + String(n.src).replace(/\?.*/, "").slice(-60) : ""), beforeHydration: log.commits.length === 0 }); }
      for (const m of ms) for (const n of m.removedNodes) { if (n.nodeType !== 1) continue; if (![document.head, document.body, document.documentElement].includes(m.target)) continue; log.inserts.push({ t: Math.round(performance.now()), REMOVED: true, parent: m.target.tagName.toLowerCase(), node: n.tagName.toLowerCase() + (n.id ? "#" + n.id : "") + (n.className && typeof n.className === "string" ? "." + n.className.split(" ")[0] : ""), beforeHydration: log.commits.length === 0 }); } });
    mo.observe(document, { childList: true, subtree: true });
  });
  const page = await ctx.newPage();
  const consoleErr = [];
  page.on("console", (m) => { if (m.type() === "error") consoleErr.push(m.text().slice(0, 260)); });
  page.on("pageerror", (e) => consoleErr.push("PAGEERROR " + String(e.message).slice(0, 260)));
  const resp = await page.goto(ORIGIN + PATH, { waitUntil: "load" });
  const ssrHtml = await resp.text();
  await page.waitForTimeout(9000);
  const s = await page.evaluate(() => ({ d: window.__d, sheets: document.styleSheets.length, styleLinks: document.querySelectorAll('link[rel="stylesheet"]').length,
    bodyFont: getComputedStyle(document.body).fontFamily.slice(0, 50), headerPos: (() => { const h = document.querySelector("header"); return h ? getComputedStyle(h).position + "/" + getComputedStyle(h).display : null; })(),
    bodyChildren: [...document.body.children].map((c) => c.tagName.toLowerCase() + (c.id ? "#" + c.id : "") + (c.className && typeof c.className === "string" ? "." + c.className.split(" ")[0] : "")),
    headChildren: [...document.head.children].map((c) => c.tagName.toLowerCase() + (c.getAttribute("rel") ? "[" + c.getAttribute("rel") + "]" : "") + (c.src ? " " + c.src.replace(/\?.*/, "").slice(-40) : "")).slice(0, 40) }));
  const ssrBodyChildren = (() => { const m = ssrHtml.match(/<body[^>]*>([\s\S]*)<\/body>/); return m ? (m[1].match(/^<[a-z]+[^>]*>|(?<=<\/[a-z]+>)<[a-z]+[^>]*>/g) || []).length : -1; })();
  await ctx.close();
  return { name, blockAdsense, delayChunksMs, ssrStylesheetLinks: (ssrHtml.match(/<link[^>]+rel="stylesheet"/g) || []).length, ...s, consoleErr };
}
const out = [];
for (const cfg of [
  ["A-adsense-on-normal", { blockAdsense: false, delayChunksMs: 0 }],
  ["B-adsense-on-delayedHydration", { blockAdsense: false, delayChunksMs: 2500 }],
  ["C-adsense-blocked-delayedHydration", { blockAdsense: true, delayChunksMs: 2500 }],
  ["D-adsense-on-delayedHydration-repeat", { blockAdsense: false, delayChunksMs: 2500 }],
  ["E-adsense-blocked-normal", { blockAdsense: true, delayChunksMs: 0 }],
]) out.push(await run(...cfg));
writeFileSync(process.env.OUT || "diag-418.json", JSON.stringify(out, null, 2));
for (const r of out) {
  const has418 = [...r.consoleErr, ...r.d.errors.map((e) => e.msg)].some((m) => /418|Hydration/i.test(m));
  console.log(`\n=== ${r.name}  #418=${has418}  firstCommit=${r.d.commits[0]}ms  sheets=${r.sheets} styleLinks=${r.styleLinks}/${r.ssrStylesheetLinks}ssr  header=${r.headerPos} font=${r.bodyFont}`);
  console.log(" errors:", JSON.stringify(r.d.errors), "\n console:", JSON.stringify(r.consoleErr));
  console.log(" foreign DOM ops on html/head/body:", JSON.stringify(r.d.inserts.filter((i) => !/^script .*_next|^link|^style|^meta$/.test(i.node) || i.REMOVED).slice(0, 30)));
  console.log(" bodyChildren:", JSON.stringify(r.bodyChildren));
}
await browser.close();
