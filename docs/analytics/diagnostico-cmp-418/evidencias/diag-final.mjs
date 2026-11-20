/* eslint-disable -- evidence script for diagnosis, not application code */
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
// Read-only production diagnosis. GA hits fulfilled locally (204); real ad requests blocked (no automated impressions).
const ORIGIN = process.env.ORIGIN || "https://www.nutricaoemovimento.com";
const CLIENT = "ca-pub-3638053236344020";
const OUT = process.env.OUT || "diag-final.json";
const AD_REQ = /googleads\.g\.doubleclick\.net\/pagead\/ads|pagead2\.googlesyndication\.com\/pagead\/ads\?|securepubads|\/pagead\/adview|\/pagead\/conversion/;
const MIN_HTML = (predefFc) => `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>probe</title>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});</script>
${predefFc ? "<script>window.googlefc=window.googlefc||{};window.googlefc.callbackQueue=window.googlefc.callbackQueue||[];</script>" : ""}
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}" crossorigin="anonymous"></script>
</head><body><p>probe</p></body></html>`;

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });

async function run(name, path, { blockAdsense = false, synthetic = null } = {}) {
  const ctx = await browser.newContext({ locale: "pt-BR", timezoneId: "America/Sao_Paulo" });
  const t0 = Date.now();
  const reqs = [], fails = [], consoleMsgs = [], pageErrors = [];
  await ctx.route("**/*", (route) => {
    const r = route.request(); const url = r.url();
    if (synthetic && url.startsWith(ORIGIN + "/__nem_probe")) return route.fulfill({ status: 200, contentType: "text/html; charset=utf-8", body: MIN_HTML(synthetic === "predef") });
    if (/\/g\/collect/.test(url)) { reqs.push(`${Date.now() - t0}ms FULFILLED-204 ${url.slice(0, 120)}`); return route.fulfill({ status: 204, body: "" }); }
    if (AD_REQ.test(url)) { reqs.push(`${Date.now() - t0}ms BLOCKED-AD ${url.slice(0, 160)}`); return route.abort(); }
    if (blockAdsense && /adsbygoogle\.js/.test(url)) { reqs.push(`${Date.now() - t0}ms BLOCKED-ADSENSE ${url.slice(0, 120)}`); return route.abort(); }
    return route.continue();
  });
  ctx.on("requestfinished", async (r) => { const u = r.url(); if (!u.startsWith(ORIGIN) || /\.(js|css|woff2?)/.test(u) === false) { const resp = await r.response().catch(() => null); reqs.push(`${Date.now() - t0}ms ${resp?.status() ?? "?"} ${r.resourceType()} ${u.slice(0, 160)}`); } });
  ctx.on("requestfailed", (r) => fails.push(`${r.url().slice(0, 140)} :: ${r.failure()?.errorText}`));
  await ctx.addInitScript(() => {
    if (window.top !== window) return;
    const log = (window.__nemDiag = { inserts: [], commits: [], t0: performance.now() });
    // React DevTools hook stub: records commit times (first commit = hydration commit).
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, renderers: new Map(), inject() { return 1; }, onScheduleFiberRoot() {}, onCommitFiberUnmount() {}, onPostCommitFiberRoot() {}, checkDCE() {},
      onCommitFiberRoot() { log.commits.push(Math.round(performance.now())); } };
    const describe = (n) => n && n.nodeType === 1 ? `${n.tagName.toLowerCase()}${n.id ? "#" + n.id : ""}${n.getAttribute("name") ? "[name=" + n.getAttribute("name") + "]" : ""}${n.src ? " src=" + String(n.src).slice(0, 90) : ""}${n.className && typeof n.className === "string" ? "." + n.className.slice(0, 40) : ""}` : String(n?.nodeName);
    const origin = () => { const s = (new Error().stack || "").split("\n").slice(2).map((l) => (l.match(/https?:\/\/[^\s)]+/) || [""])[0]).filter(Boolean); return (s.find((u) => !/_next\/static/.test(u)) && s[0]) ? s.find((u) => !u.includes("/_next/")) || s[0] : s[0] || "inline/unknown"; };
    for (const m of ["appendChild", "insertBefore", "prepend", "append", "replaceChild"]) {
      const orig = (m === "prepend" || m === "append" ? Element.prototype : Node.prototype)[m];
      const proto = m === "prepend" || m === "append" ? Element.prototype : Node.prototype;
      proto[m] = function (...args) {
        try { const node = args[0]; const parent = this; if (parent === document.body || parent === document.head || parent === document.documentElement) {
          const by = origin(); if (!by.includes("/_next/")) log.inserts.push({ t: Math.round(performance.now()), parent: parent.tagName.toLowerCase(), node: describe(node), by: by.slice(0, 120), beforeFirstCommit: log.commits.length === 0 }); } } catch {}
        return orig.apply(this, args);
      };
    }
  });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (["error", "warning"].includes(m.type())) consoleMsgs.push(`${m.type()}: ${m.text().slice(0, 300)}`); });
  page.on("pageerror", (e) => pageErrors.push(String(e.message).slice(0, 300)));
  const resp = await page.goto(ORIGIN + path, { waitUntil: "load" });
  const headers = resp.headers();
  const html = await resp.text().catch(() => "");
  await page.waitForTimeout(15000);
  const state = await page.evaluate(() => ({
    href: location.href,
    googlefcKeys: window.googlefc ? Object.keys(window.googlefc) : null,
    getGCMV: typeof window.googlefc?.getGoogleConsentModeValues,
    tcfapi: typeof window.__tcfapi, gpp: typeof window.__gpp,
    tcfLocator: !!window.frames["__tcfapiLocator"], fcPresentIframe: !!document.querySelector('iframe[name="googlefcPresent"]'),
    fcScripts: [...document.scripts].map((s) => s.src).filter((s) => /fundingchoices|googlefc/.test(s)),
    adsbygoogleLoaded: window.adsbygoogle?.loaded ?? null, adsbygoogleType: Array.isArray(window.adsbygoogle) ? "array" : typeof window.adsbygoogle,
    googleAdsenseScripts: [...document.scripts].map((s) => s.src).filter((s) => /googlesyndication|adtrafficquality/.test(s)),
    nemCmp: window.__nemCmp ?? null, banner: !!document.querySelector("#cookie-consent-title"),
    stylesheets: document.styleSheets.length, bodyBg: getComputedStyle(document.body).backgroundColor,
    diag: window.__nemDiag,
  }));
  const headTag = (html.match(/<head>[\s\S]{0,1200}/) || [""])[0].replace(/<style[\s\S]*?<\/style>/g, "<style…>");
  await ctx.close();
  return { name, path, blockAdsense, synthetic, status: resp.status(), csp: headers["content-security-policy"] || null, cspRO: headers["content-security-policy-report-only"] || null,
    xfo: headers["x-frame-options"] || null, permissionsPolicy: headers["permissions-policy"] || null, server: headers["server"] || null,
    adsTagInHtml: (html.match(/<script[^>]*adsbygoogle\.js[^>]*>/) || [null])[0], adsTagIndexInHead: html.indexOf("adsbygoogle.js"), consentIndex: html.indexOf("'consent','default'") >= 0 ? html.indexOf("'consent','default'") : html.indexOf('"consent","default"'),
    headStart: headTag.slice(0, 900), state, consoleMsgs, pageErrors, fails, reqs: reqs.filter((r) => /google|doubleclick|gstatic|adtraffic|fundingchoices|BLOCKED|FULFILLED/.test(r)) };
}

const results = [];
results.push(await run("P1-prod-alwaysshow", "/pt?fc=alwaysshow&fctype=gdpr"));
results.push(await run("P2-prod-adsense-blocked", "/pt?fc=alwaysshow&fctype=gdpr", { blockAdsense: true }));
results.push(await run("P3-prod-sobre", "/pt/sobre?fc=alwaysshow&fctype=gdpr"));
results.push(await run("P4-synthetic-tag-only", "/__nem_probe?fc=alwaysshow&fctype=gdpr", { synthetic: "plain" }));
results.push(await run("P5-synthetic-tag+googlefc-stub", "/__nem_probe?fc=alwaysshow&fctype=gdpr", { synthetic: "predef" }));
results.push(await run("P6-synthetic-tag-only-no-fcparam", "/__nem_probe", { synthetic: "plain" }));
writeFileSync(OUT, JSON.stringify(results, null, 2));
for (const r of results) {
  console.log(`\n===== ${r.name} status=${r.status} csp=${!!r.csp} adsTagIdx=${r.adsTagIndexInHead} consentIdx=${r.consentIndex}`);
  console.log("STATE", JSON.stringify({ ...r.state, diag: undefined }));
  console.log("COMMITS", JSON.stringify(r.state.diag?.commits?.slice(0, 5)), "INSERTS(non-next)", JSON.stringify(r.state.diag?.inserts?.slice(0, 25)));
  console.log("CONSOLE", r.consoleMsgs.join("\n  "));
  console.log("PAGEERR", r.pageErrors.join("\n  "));
  console.log("FAILS", r.fails.join("\n  "));
  console.log("REQS\n  " + r.reqs.join("\n  "));
}
await browser.close();
