import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";

// GA4 audit harness. GA hits (/g/collect) and ad-serving requests are ABORTED after capture,
// so nothing reaches the GA4 property or AdSense. Script loaders (gtag.js, adsbygoogle.js, CMP) are allowed.
const BASE = process.argv[2] || "https://www.nutricaoemovimento.com";
const OUT = process.argv[3] || "ga-audit.json";
const SIM = process.argv[4] === "simulate-local-cmp";
const CMP_DELAY = Number(process.argv[5] || 1500);
const exe = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const AD_BLOCK = /googleads\.g\.doubleclick\.net|securepubads|pagead2\.googlesyndication\.com\/pagead\/(ads|adview|conversion|sodar|ping)|tpc\.googlesyndication\.com|adtrafficquality\.google|pagead\/managed\/js\/adsense\/.*\/(reactive|show_ads)_library/;
const GA_HIT = /google-analytics\.com\/(g|j)\/collect|analytics\.google\.com\/g\/collect|googletagmanager\.com\/.*\/collect|\/g\/collect\?/;

const report = { base: BASE, startedAt: new Date().toISOString(), scenarios: [] };
let log;
const t0 = Date.now();

function parseHit(url, body) {
  const u = new URL(url);
  const shared = Object.fromEntries(u.searchParams);
  const lines = body ? body.split(/\r?\n/).filter(Boolean) : [null];
  return lines.map((line) => {
    const p = { ...shared, ...(line ? Object.fromEntries(new URLSearchParams(line)) : {}) };
    return { s: p._s, en: p.en, dl: p.dl && p.dl.replace(BASE, ""), dt: p.dt, tid: p.tid, cid: p.cid, sid: p.sid, sct: p.sct, _fv: p._fv, _ss: p._ss, _nsi: p._nsi, seg: p.seg, _et: p._et, gcs: p.gcs, gcd: p.gcd, dbg: p._dbg || p.ep_debug_mode, dr: p.dr && p.dr.replace(BASE, "") };
  });
}

async function newContext(browser) {
  const ctx = await browser.newContext({ locale: "pt-BR", timezoneId: "America/Sao_Paulo" });
  // Diagnostic stub: emulates Funding Choices answering NOT_APPLICABLE (3) after CMP_DELAY ms.
  if (SIM) await ctx.addInitScript((delay) => {
    window.googlefc = { callbackQueue: { push(entry) { if (entry.CONSENT_MODE_DATA_READY) setTimeout(entry.CONSENT_MODE_DATA_READY, delay); } },
      getGoogleConsentModeValues: () => ({ analyticsStoragePurposeConsentStatus: 3 }) };
  }, CMP_DELAY);
  await ctx.route("**/*", async (route) => {
    const req = route.request();
    const url = req.url();
    if (GA_HIT.test(url)) {
      for (const h of parseHit(url, req.postData())) log.hits.push({ t: Date.now() - t0, transport: req.resourceType(), ...h });
      // Synthetic 204: gtag sees success (no transport retry) and nothing reaches GA4.
      return route.fulfill({ status: 204, body: "" });
    }
    if (AD_BLOCK.test(url)) { log.adBlocked++; return route.abort(); }
    if (/googletagmanager\.com\/gtag\/js/.test(url)) log.loaders.push({ t: Date.now() - t0, gtag: url.split("?")[1] });
    if (/googletagmanager\.com\/gtm\.js/.test(url)) log.loaders.push({ t: Date.now() - t0, gtm: url });
    if (/fundingchoicesmessages\.google\.com/.test(url)) log.cmpRequests++;
    if (/adsbygoogle\.js/.test(url)) log.loaders.push({ t: Date.now() - t0, adsense: true });
    return route.continue();
  });
  return ctx;
}

async function snapshot(page, label) {
  const s = await page.evaluate(() => ({
    url: location.pathname + location.search,
    cmp: window.__nemCmp ?? null,
    gaLoaded: !!window.__nemAnalyticsLoaded,
    gaScripts: document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length,
    gaDisable: window["ga-disable-G-HDJ55H8QR6"],
    banner: !!document.querySelector("#cookie-consent-title"),
    prefButton: [...document.querySelectorAll("footer button")].map((b) => b.textContent + (b.disabled ? " (disabled)" : "")).join(" | "),
    consentCmds: (window.dataLayer || []).filter((a) => a && a[0] === "consent").map((a) => `${a[1]}:${JSON.stringify(a[2])}`),
    storage: localStorage.getItem("nem-consent-v2"),
  }));
  const cookies = (await page.context().cookies()).filter((c) => /^_ga|^nem-consent|^FCCDCF|^FCNEC/.test(c.name)).map((c) => `${c.name}=${c.value.slice(0, 40)}`);
  log.steps.push({ label, t: Date.now() - t0, ...s, cookies, hitsSoFar: log.hits.length });
}

async function scenario(name, fn) {
  log = { name, hits: [], loaders: [], steps: [], adBlocked: 0, cmpRequests: 0, errors: [] };
  try { await fn(); } catch (e) { log.errors.push(String(e).slice(0, 300)); }
  report.scenarios.push(log);
  console.log(`\n=== ${name}`);
  for (const s of log.steps) console.log(` [${s.label}] url=${s.url} cmp=${JSON.stringify(s.cmp)} gaLoaded=${s.gaLoaded} gaScripts=${s.gaScripts} banner=${s.banner} hits=${s.hitsSoFar} cookies=${s.cookies.join(",")}`);
  console.log(" loaders:", JSON.stringify(log.loaders), "cmpReq:", log.cmpRequests, "adBlocked:", log.adBlocked);
  for (const h of log.hits) console.log(`  HIT t=${h.t} _s=${h.s} ${h.transport} en=${h.en} dl=${h.dl} cid=${h.cid} sid=${h.sid} sct=${h.sct} _fv=${h._fv ?? ""} _ss=${h._ss ?? ""} _nsi=${h._nsi ?? ""} gcs=${h.gcs} _et=${h._et ?? ""}`);
  if (log.errors.length) console.log(" ERRORS:", log.errors);
}

const wait = (p, ms) => p.waitForTimeout(ms);
async function clickLink(page, href) {
  const a = page.locator(`a[href="${href}"]`).first();
  await a.scrollIntoViewIfNeeded();
  await a.click();
  await page.waitForURL((u) => u.pathname === href.split("?")[0], { timeout: 15000 });
  await wait(page, 2500);
}

const browser = await chromium.launch({ executablePath: exe, headless: true });

// A + B + C + F + E share one profile (consent persists).
const ctx = await newContext(browser);
let page = await ctx.newPage();
page.on("pageerror", (e) => log.errors.push("pageerror " + e.message.slice(0, 120)));

await scenario("A - novo visitante sem decisão", async () => {
  await page.goto(BASE + "/pt", { waitUntil: "load" });
  await wait(page, 8000);
  await snapshot(page, "após 8s sem interação");
});

await scenario("B - aceitar estatísticas", async () => {
  const btn = page.getByRole("button", { name: "Aceitar opcionais" });
  if (!(await btn.count())) throw new Error("banner local não disponível (CMP não resolveu como 'local')");
  await btn.click();
  await wait(page, 6000);
  await snapshot(page, "após aceite");
});

let articleHref;
await scenario("C - navegação SPA após consentimento (5 páginas)", async () => {
  await clickLink(page, "/pt/artigos"); await snapshot(page, "1 artigos");
  articleHref = await page.locator('main a[href^="/pt/artigos/"]').first().getAttribute("href");
  await clickLink(page, articleHref); await snapshot(page, "2 artigo");
  await clickLink(page, "/pt/sobre"); await snapshot(page, "3 sobre");
  await clickLink(page, "/pt/contato"); await snapshot(page, "4 contato");
  await clickLink(page, "/pt"); await snapshot(page, "5 home");
  // query-string-only navigation on same pathname + window focus
  await page.evaluate(() => history.pushState(null, "", "/pt?teste=querystring"));
  await wait(page, 2500); await snapshot(page, "6 pushState só query (mesmo pathname)");
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await wait(page, 2500); await snapshot(page, "7 evento focus");
});

await scenario("F - novo documento com consentimento persistido", async () => {
  await page.close();
  page = await ctx.newPage();
  page.on("pageerror", (e) => log.errors.push("pageerror " + e.message.slice(0, 120)));
  log.steps.push({ label: "cookies do perfil antes", url: "-", cookies: (await ctx.cookies()).filter((c) => /^_ga/.test(c.name)).map((c) => `${c.name}=${c.value}`), hitsSoFar: 0 });
  await page.goto(BASE + "/pt/sobre", { waitUntil: "load" });
  await wait(page, 600); await snapshot(page, "documento novo /pt/sobre, antes da CMP responder");
  await wait(page, 6000); await snapshot(page, "documento novo /pt/sobre");
  await page.reload({ waitUntil: "load" });
  await wait(page, 6000); await snapshot(page, "reload /pt/sobre");
});

await scenario("E - revogar estatísticas pelo rodapé", async () => {
  await page.getByRole("button", { name: "Preferências de cookies" }).click();
  await wait(page, 800);
  await page.getByRole("checkbox", { name: /Estatísticas/ }).uncheck();
  const nav = page.waitForEvent("load", { timeout: 15000 }).catch(() => null);
  await page.getByRole("button", { name: "Salvar preferências" }).click();
  const reloaded = await nav;
  await wait(page, 5000); await snapshot(page, reloaded ? "após salvar (recarregou)" : "após salvar (sem reload)");
  await clickLink(page, "/pt/artigos"); await snapshot(page, "navegação após revogar");
});
await ctx.close();

await scenario("D - recusar estatísticas (perfil novo)", async () => {
  const c2 = await newContext(browser);
  const p2 = await c2.newPage();
  await p2.goto(BASE + "/pt", { waitUntil: "load" });
  await wait(p2, 8000);
  const btn = p2.getByRole("button", { name: "Recusar opcionais" });
  if (!(await btn.count())) throw new Error("banner local não disponível");
  await btn.click(); await wait(p2, 3000); await snapshot(p2, "após recusa");
  await clickLink(p2, "/pt/artigos"); await snapshot(p2, "navegação");
  await p2.reload({ waitUntil: "load" }); await wait(p2, 6000); await snapshot(p2, "reload");
  await c2.close();
});

await browser.close();
writeFileSync(OUT, JSON.stringify(report, null, 2));
console.log("\nsaved", OUT);
