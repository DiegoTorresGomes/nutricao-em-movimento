// Browser E2E for GA4 + consent by purpose (docs/analytics/implementacao-final).
// Runs against a local `next start` build. Never against production:
// - every GA hit (/g/collect) gets a synthetic 204 and never reaches the GA4 property;
// - real ad requests and the real Funding Choices script are blocked (no ad impressions);
// - the Google CMP is a deterministic stub of the documented Privacy & Messaging API and IAB TCF
//   events, plus two declared hypotheses: H1 the CMP calls gtag('consent','update') for its own
//   purposes after a choice; H2 with the panel's analytics purpose ON that update includes
//   analytics_storage. Real-CMP behaviour must still be confirmed in a real EEA session.
// Requires playwright-core outside this project:
//   PLAYWRIGHT_CORE=/abs/node_modules/playwright-core/index.mjs AUDIT_BASE_URL=http://127.0.0.1:3107 node scripts/ga4-browser.e2e.mjs
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const BASE = process.env.AUDIT_BASE_URL || "http://127.0.0.1:3107";
const OUT = process.env.GA4_E2E_OUT || "ga4-browser-e2e.json";
const pw = process.env.PLAYWRIGHT_CORE;
if (!pw) throw new Error("Set PLAYWRIGHT_CORE to playwright-core's index.mjs (not a project dependency).");
const { chromium } = await import(pathToFileURL(pw).href);
const CHROME = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const GTAG_BATCH_MS = 7_500; // gtag batches hits (~6 s) unless the page unloads
const GA_ID = "HDJ55H8QR6";

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const results = [];
const allGa = []; const routed = new WeakSet(); let current = "";

/**
 * cmp: null = no Google CMP (Brazil today / unavailable / blocked);
 *      { analyticsPurpose: boolean, delay: ms } = applicable Google CMP (EEA) stub.
 * block: extra URL patterns to block (ad/tracker blockers).
 */
async function session(cmp, { block = [], delayChunksMs = 0 } = {}) {
  const ctx = await browser.newContext({ locale: "pt-BR", viewport: { width: 1280, height: 900 } });
  const hits = [], req = [], errors = [];
  await ctx.route("**/*", async (route) => {
    const r = route.request(); const url = r.url();
    if (block.some((re) => re.test(url))) return route.abort();
    if (/\/g\/collect/.test(url)) {
      routed.add(r);
      const shared = Object.fromEntries(new URL(url).searchParams);
      const lines = (r.postData() || "").split(/\r?\n/).filter(Boolean);
      for (const line of lines.length ? lines : [""]) {
        const p = { ...shared, ...Object.fromEntries(new URLSearchParams(line)) };
        hits.push({ en: p.en, dl: p.dl && new URL(p.dl).pathname + new URL(p.dl).search, cid: p.cid, sid: p.sid, fv: p._fv === "1", ss: p._ss === "1", gcs: p.gcs, tid: p.tid, et: Number(p._et || 0), seg: p.seg });
      }
      return route.fulfill({ status: 204, body: "" });
    }
    if (/fundingchoicesmessages\.google\.com/.test(url)) return route.abort();
    if (/googleads\.g\.doubleclick\.net\/pagead\/ads|pagead2\.googlesyndication\.com\/pagead\/ads\?|securepubads|tpc\.googlesyndication/.test(url)) return route.abort();
    if (/googletagmanager\.com\/gtag\/js/.test(url)) req.push("gtag");
    if (/adsbygoogle\.js/.test(url)) req.push("adsense");
    if (delayChunksMs && /\/_next\/static\/chunks\/.*\.js/.test(url)) await new Promise((res) => setTimeout(res, delayChunksMs));
    return route.continue();
  });
  ctx.on("request", (r) => { if (/google-analytics\.com|analytics\.google\.com/.test(r.url()) && /collect/.test(r.url())) allGa.push({ r, scenario: current }); });
  await ctx.addInitScript((cfg) => {
    if (window.top !== window) return;
    try {
      if (sessionStorage.getItem("e2e-418") === "1") {
        sessionStorage.removeItem("e2e-418");
        const o = new MutationObserver(() => { const p = document.querySelector("main p, main h1"); if (p && !document.getElementById("e2e-ad")) { const i = document.createElement("ins"); i.id = "e2e-ad"; p.parentNode.insertBefore(i, p); o.disconnect(); } });
        o.observe(document, { childList: true, subtree: true });
      }
    } catch { /* storage unavailable */ }
    if (!cfg) return;
    const KEY = "e2e-google-decision";
    const listeners = []; let ready = false; let status = cfg.analyticsPurpose ? 0 : 4; const pending = [];
    const stored = () => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; } };
    const emit = (eventStatus) => listeners.forEach((cb) => cb({ eventStatus, gdprApplies: true, cmpStatus: "loaded" }, true));
    const run = (e) => { e.CONSENT_API_READY?.(); if (e.CONSENT_MODE_DATA_READY) { if (status !== 0) e.CONSENT_MODE_DATA_READY(); else pending.push({ CONSENT_MODE_DATA_READY: e.CONSENT_MODE_DATA_READY }); } };
    const apply = (d) => {
      const v = (b) => (b ? "granted" : "denied");
      const update = { ad_storage: v(d.ads), ad_user_data: v(d.ads), ad_personalization: v(d.ads) };
      if (cfg.analyticsPurpose) update.analytics_storage = v(d.analytics); // H2
      window.gtag?.("consent", "update", update); // H1
      status = cfg.analyticsPurpose ? (d.analytics ? 1 : 2) : 4;
    };
    window.googlefc = {
      callbackQueue: { push: (e) => { if (ready) run(e); else pending.push(e); } },
      getGoogleConsentModeValues: () => ({ analyticsStoragePurposeConsentStatus: status }),
      showRevocationMessage: () => { window.__e2eRevocations = (window.__e2eRevocations || 0) + 1; emit("cmpuishown"); },
    };
    window.__tcfapi = (cmd, _v, cb) => { if (cmd === "addEventListener") { listeners.push(cb); if (ready) cb({ eventStatus: stored() ? "tcloaded" : "cmpuishown", gdprApplies: true, cmpStatus: "loaded" }, true); } };
    window.__e2eGoogleDecide = (d) => { localStorage.setItem(KEY, JSON.stringify(d)); apply(d); emit("useractioncomplete"); pending.splice(0).forEach(run); };
    setTimeout(() => {
      const d = stored(); if (d) apply(d); ready = true;
      pending.splice(0).forEach(run);
      listeners.forEach((cb) => cb({ eventStatus: d ? "tcloaded" : "cmpuishown", gdprApplies: true, cmpStatus: "loaded" }, true));
    }, cfg.delay ?? 500);
  }, cmp);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 90)));
  const consent = () => page.evaluate(() => {
    const s = {};
    for (const e of window.dataLayer || []) if (e && e[0] === "consent" && (e[1] === "default" || e[1] === "update")) Object.assign(s, e[2]);
    return { ad_storage: s.ad_storage, analytics_storage: s.analytics_storage, ad_user_data: s.ad_user_data, ad_personalization: s.ad_personalization };
  });
  const state = async () => ({
    consent: await consent(),
    ...(await page.evaluate(() => ({
      ga: document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length,
      adsense: document.querySelectorAll('script[src*="adsbygoogle.js"]').length,
      adsenseNscript: document.querySelectorAll('script[src*="adsbygoogle.js"][data-nscript]').length,
      banner: !!document.querySelector("#cookie-consent-title"),
      footer: [...document.querySelectorAll("footer button")].map((b) => b.textContent).join(" | "),
      stored: (() => { try { return JSON.parse(localStorage.getItem("nem-consent-v3") || "null")?.analytics ?? null; } catch { return null; } })(),
      css: document.styleSheets.length,
      header: (() => { const h = document.querySelector("header"); return h ? getComputedStyle(h).position : null; })(),
      consentBeforeAds: (() => { const s = [...document.head.querySelectorAll("script")]; const c = s.findIndex((x) => /'consent', 'default'/.test(x.textContent || "")); const a = s.findIndex((x) => /adsbygoogle\.js/.test(x.src)); return a < 0 || (c >= 0 && c < a); })(),
    }))),
    _ga: (await ctx.cookies()).some((c) => c.name === "_ga"),
    page_views: hits.filter((h) => h.en === "page_view").length,
  });
  const pv = () => hits.filter((h) => h.en === "page_view");
  return { ctx, page, hits, req, errors, state, pv, flush: () => page.waitForTimeout(GTAG_BATCH_MS) };
}

async function scenario(id, title, expected, fn) {
  current = id;
  const rec = { id, title, expected, ok: true, notes: [] };
  try { rec.observed = await fn(rec); } catch (e) { rec.ok = false; rec.error = String(e.message || e).slice(0, 400); }
  results.push(rec);
  console.log(`${rec.ok ? "PASS" : "FAIL"} ${id} ${title}${rec.error ? "\n     " + rec.error : ""}`);
  if (rec.observed) console.log("     " + JSON.stringify(rec.observed).slice(0, 600));
  rec.notes.forEach((n) => console.log("     · " + n));
}
const D = "denied", G = "granted";
const C = (ad, an) => ({ ad_storage: ad, analytics_storage: an, ad_user_data: ad, ad_personalization: ad });
const accept = (p) => p.getByRole("button", { name: "Aceitar estatísticas" }).click();
const refuse = (p) => p.getByRole("button", { name: "Recusar estatísticas" }).click();
const setStats = async (p, on) => {
  await p.getByRole("button", { name: "Preferências de cookies" }).click();
  const box = p.getByRole("checkbox", { name: /Estatísticas/ });
  if (on) await box.check(); else await box.uncheck();
  await p.getByRole("button", { name: "Salvar preferências" }).click();
};
const click = async (p, href) => { await p.locator(`a[href="${href}"]`).first().click(); await p.waitForURL((u) => u.pathname + u.search === href, { timeout: 15000 }); };
const OFF = { analyticsPurpose: false, delay: 600 }, ON = { analyticsPurpose: true, delay: 600 };

// ── Brazil (no Google CMP on the page) ───────────────────────────────────────────────
await scenario("1/22", "Brasileiro novo em janela limpa", { consent: C(D, D), banner: true, ga: 0, _ga: false, page_views: 0, adsense: 1 }, async () => {
  const s = await session(null); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(2500); await s.flush();
  const st = await s.state();
  assert.deepEqual(st.consent, C(D, D)); assert.equal(st.banner, true); assert.equal(st.ga, 0); assert.equal(st._ga, false);
  assert.equal(s.hits.length, 0, "zero GA hits before consent"); assert.equal(st.adsense, 1); assert.equal(st.adsenseNscript, 0); assert.ok(st.consentBeforeAds);
  assert.equal(st.footer, "Preferências de cookies", "statistics control available; no Google control without a Google CMP");
  await s.ctx.close(); return st;
});
let brCid;
const br = await session(null);
await scenario("2", "Brasileiro aceita estatísticas (sem CMP europeia)", { consent: C(D, G), ga: 1, page_views: 1, first: "_fv=1 _ss=1 gcs=G101" }, async () => {
  await br.page.goto(BASE + "/pt"); await br.page.waitForTimeout(2000); await accept(br.page); await br.page.waitForTimeout(2500); await br.flush();
  const st = await br.state(); const first = br.pv()[0];
  assert.deepEqual(st.consent, C(D, G)); assert.equal(st.ga, 1); assert.equal(st._ga, true); assert.equal(st.page_views, 1); assert.equal(st.stored, true); assert.equal(st.banner, false);
  assert.ok(first.fv && first.ss, "first_visit and session_start flags on the first page_view"); assert.equal(first.gcs, "G101"); assert.equal(first.tid, "G-" + GA_ID);
  brCid = first.cid; return { ...st, first };
});
await scenario("17", "Cinco navegações internas", { added: 5, sameCid: true, singleSession: true }, async (r) => {
  const start = br.pv().length;
  await click(br.page, "/pt/artigos");
  const article = await br.page.locator('main a[href^="/pt/artigos/"]').first().getAttribute("href");
  const route = ["/pt/artigos", article, "/pt/sobre", "/pt/contato", "/pt"];
  for (const href of route.slice(1)) { await br.page.waitForTimeout(1500); await click(br.page, href); }
  await br.page.waitForTimeout(1500); await br.flush();
  const pv = br.pv().slice(start); r.notes.push(pv.map((h) => h.dl).join(" → "));
  const engagementEvents = br.hits.filter((h) => h.en === "user_engagement").length;
  const focused = await br.page.evaluate(() => document.hasFocus());
  r.notes.push(`engajamento por página (_et ms): ${pv.map((h) => h.et).join(", ")}; seg: ${pv.map((h) => h.seg).join(",")}; eventos user_engagement: ${engagementEvents}; foco=${focused}`);
  assert.deepEqual(pv.map((h) => h.dl), route, "exactly one page_view per navigation, in order");
  assert.ok(pv.every((h) => h.cid === brCid && !h.fv), "same visitor, no repeated first_visit");
  assert.equal(new Set(pv.map((h) => h.sid)).size, 1, "single session");
  // Real gtag reports engagement as _et (ms since the previous hit) and seg=1 (engaged session) on the
  // following page_view; a separate user_engagement event is only sent when the page is hidden/unloaded.
  // gtag only accrues engagement while the page has focus, so this is asserted only with focus.
  if (focused) { assert.ok(pv.every((h) => h.et > 0), "engagement time measured between navigations"); assert.ok(pv.every((h) => h.seg === "1"), "engaged session"); }
  else r.notes.push("sem foco no headless: engajamento não verificável aqui → DebugView (checklist)");
  return { added: pv.length, engagementMs: pv.map((h) => h.et), engagementEvents, focused };
});
await scenario("18", "Navegação com query string (e só hash)", { query: 1, focus: 0, hashOnly: 0 }, async (r) => {
  await br.page.goto(BASE + "/pt/artigos"); await br.flush(); const start = br.pv().length;
  await br.page.evaluate(() => window.next.router.push("/pt/artigos?q=sono")); await br.page.waitForURL((u) => u.search === "?q=sono"); await br.page.waitForTimeout(2000);
  await br.page.evaluate(() => window.dispatchEvent(new Event("focus"))); await br.flush();
  const afterQuery = br.pv().slice(start);
  await br.page.evaluate(() => history.pushState(null, "", "/pt/artigos?q=sono#todos-os-artigos")); await br.page.waitForTimeout(1500); await br.flush();
  const afterHash = br.pv().slice(start + afterQuery.length);
  r.notes.push(`query: ${JSON.stringify(afterQuery.map((h) => h.dl))}; hash: ${afterHash.length}`);
  assert.deepEqual(afterQuery.map((h) => h.dl), ["/pt/artigos?q=sono"]); assert.equal(afterHash.length, 0);
  return { query: afterQuery.length, hashOnly: afterHash.length };
});
await scenario("5/23", "Brasileiro retorna: recarga, nova aba e nova sessão", { sameCid: true, newSession: "_ss=1 _fv=0" }, async (r) => {
  const start = br.pv().length;
  await br.page.goto(BASE + "/pt/sobre"); await br.flush(); await br.page.reload(); await br.flush();
  const tab = await br.ctx.newPage(); await tab.goto(BASE + "/pt/contato"); await tab.waitForTimeout(GTAG_BATCH_MS); await tab.close();
  const same = br.pv().slice(start);
  assert.deepEqual(same.map((h) => h.dl), ["/pt/sobre", "/pt/sobre", "/pt/contato"]);
  assert.ok(same.every((h) => h.cid === brCid && !h.fv && !h.ss), "same visitor and session");
  await br.page.goto("about:blank"); // the old document rewrites the session cookie on pagehide
  const sess = (await br.ctx.cookies()).find((c) => c.name === "_ga_" + GA_ID);
  await br.ctx.addCookies([{ ...sess, value: sess.value.replace(/\$t(\d+)/, (_m, t) => "$t" + (Number(t) - 31 * 60)) }]); // 31 min inactivity
  const s2 = br.pv().length; await br.page.goto(BASE + "/pt"); await br.page.waitForTimeout(3000); await br.flush();
  const next = br.pv().slice(s2); r.notes.push(JSON.stringify(next.map((h) => [h.dl, h.cid === brCid, h.fv, h.ss])));
  assert.equal(next.length, 1); assert.equal(next[0].cid, brCid); assert.ok(next[0].ss && !next[0].fv, "new session, same visitor");
  return { reloadAndTab: same.length, newSession: next[0] };
});
await scenario("25", "Sem scripts duplicados", { ga: 1, adsense: 1, nscript: 0 }, async () => {
  for (let i = 0; i < 3; i++) await br.page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await click(br.page, "/pt/sobre"); await br.page.waitForTimeout(1500);
  const st = await br.state(); assert.equal(st.ga, 1); assert.equal(st.adsense, 1); assert.equal(st.adsenseNscript, 0);
  return { ga: st.ga, adsense: st.adsense, gtagRequestsThisDocument: br.req.filter((x) => x === "gtag").length };
});
await scenario("19", "Layouts raiz /pt → /login → /pt", { login: { ga: 0, adsense: 0 }, back: 1 }, async () => {
  const start = br.pv().length; const adsBefore = br.req.filter((x) => x === "adsense").length;
  await br.page.goto(BASE + "/login"); await br.page.waitForTimeout(2000); const login = await br.state();
  assert.equal(login.ga, 0); assert.equal(login.adsense, 0); assert.equal(br.req.filter((x) => x === "adsense").length, adsBefore); assert.ok(login.css > 0);
  await br.page.goto(BASE + "/pt"); await br.page.waitForTimeout(2500); await br.flush();
  const pv = br.pv().slice(start); assert.equal(pv.length, 1); assert.equal(pv[0].cid, brCid);
  return { login: { ga: login.ga, adsense: login.adsense, css: login.css }, back: pv.length };
});
await scenario("21a", "React #418 (mismatch sintético no conteúdo): recuperação sem perda", { page_views: 1, css: ">0" }, async (r) => {
  const start = br.pv().length; br.errors.length = 0;
  await br.page.evaluate(() => sessionStorage.setItem("e2e-418", "1")); await br.page.goto(BASE + "/pt/sobre"); await br.page.waitForTimeout(3500); await br.flush();
  const st = await br.state(); r.notes.push("erros: " + JSON.stringify(br.errors));
  assert.ok(br.errors.some((e) => e.includes("418")), "synthetic mismatch reproduced"); assert.equal(br.pv().length - start, 1); assert.ok(st.css > 0); assert.equal(st.header, "sticky");
  return { page_views: br.pv().length - start, css: st.css };
});
await scenario("4/15", "Brasileiro altera a decisão: revoga e volta a aceitar pelo rodapé", { revoke: { _ga: false, hits: 0 }, reaccept: { page_views: 1 } }, async (r) => {
  await br.page.goto(BASE + "/pt"); await br.page.waitForTimeout(2000);
  const reload = br.page.waitForEvent("load"); await setStats(br.page, false); await reload; await br.page.waitForTimeout(1500); await br.flush();
  const start = br.hits.length; await click(br.page, "/pt/artigos"); await br.page.waitForTimeout(1500); await br.page.reload(); await br.page.waitForTimeout(2500); await br.flush();
  const off = await br.state();
  assert.deepEqual(off.consent, C(D, D)); assert.equal(off.ga, 0); assert.equal(off._ga, false); assert.equal(br.hits.length, start, "no hits after revocation"); assert.equal(off.stored, false); assert.equal(off.banner, false);
  const p0 = br.pv().length; await setStats(br.page, true); await br.page.waitForTimeout(2500); await br.flush();
  const on = await br.state(); r.notes.push(`reaceite: ${JSON.stringify(br.pv().slice(p0).map((h) => [h.dl, h.fv]))}`);
  assert.deepEqual(on.consent, C(D, G)); assert.equal(on.ga, 1); assert.equal(br.pv().length - p0, 1);
  return { revoked: { consent: off.consent, _ga: off._ga }, reaccepted: { consent: on.consent, page_views: br.pv().length - p0 } };
});
await br.ctx.close();
await scenario("3", "Brasileiro recusa estatísticas", { consent: C(D, D), ga: 0, hits: 0, stored: false }, async () => {
  const s = await session(null); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(2000); await refuse(s.page);
  await click(s.page, "/pt/artigos"); await s.page.waitForTimeout(1500); await s.page.reload(); await s.page.waitForTimeout(2500); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(D, D)); assert.equal(st.ga, 0); assert.equal(s.hits.length, 0); assert.equal(st.stored, false); assert.equal(st.banner, false); assert.ok(!s.req.includes("gtag"));
  await s.ctx.close(); return st;
});

// ── EEA (applicable Google CMP stub) ─────────────────────────────────────────────────
for (const [tag, cfg] of [["ON", ON], ["OFF", OFF]]) {
  await scenario(`6-${tag}`, `Europeu com CMP ativa (análise no painel ${tag})`, { whileGoogleOpen: { banner: false, consent: C(D, D) }, afterGoogleYes: { analytics: D, banner: true } }, async (r) => {
    const s = await session(cfg); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(2500);
    const open = await s.state(); assert.equal(open.banner, false, "site banner steps aside while the Google message is open"); assert.deepEqual(open.consent, C(D, D)); assert.match(open.footer, /Privacidade e publicidade \(Google\)/);
    await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: true, analytics: true })); await s.page.waitForTimeout(1500); await s.flush();
    const after = await s.state(); r.notes.push("após Google sim/sim: " + JSON.stringify(after.consent));
    assert.equal(after.consent.analytics_storage, D, "Google never authorizes statistics alone"); assert.equal(after.banner, true); assert.equal(after.ga, 0); assert.equal(s.hits.length, 0);
    await s.ctx.close(); return { open: open.consent, after: after.consent };
  });
}
await scenario("7", "Europeu aceita publicidade e recusa estatísticas", { consent: C(G, D), ga: 0 }, async () => {
  const s = await session(OFF); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(1500);
  await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: true, analytics: false })); await s.page.waitForTimeout(1000); await refuse(s.page); await s.page.waitForTimeout(1500); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(G, D)); assert.equal(st.ga, 0); assert.equal(s.hits.length, 0);
  await s.ctx.close(); return st;
});
await scenario("8", "Europeu recusa publicidade e aceita estatísticas", { consent: C(D, G), ga: 1, page_views: 1, gcs: "G101" }, async () => {
  const s = await session(OFF); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(1500);
  await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: false, analytics: false })); await s.page.waitForTimeout(1000); await accept(s.page); await s.page.waitForTimeout(2500); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(D, G)); assert.equal(st.ga, 1); assert.equal(st.page_views, 1); assert.ok(s.hits.every((h) => h.gcs === "G101"));
  await s.ctx.close(); return st;
});
await scenario("9", "Europeu recusa ambas", { consent: C(D, D), ga: 0, hits: 0 }, async () => {
  const s = await session(ON); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(1500);
  await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: false, analytics: false })); await s.page.waitForTimeout(1000); await refuse(s.page); await s.page.waitForTimeout(1500); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(D, D)); assert.equal(st.ga, 0); assert.equal(s.hits.length, 0);
  await s.ctx.close(); return st;
});
await scenario("12", "Google ainda controla análise (ON): recusa Google prevalece; concessão Google não basta", { contradictory: C(D, D), coherent: C(D, G) }, async (r) => {
  const a = await session(ON); await a.page.goto(BASE + "/pt"); await a.page.waitForTimeout(1500);
  await a.page.evaluate(() => window.__e2eGoogleDecide({ ads: false, analytics: false })); await a.page.waitForTimeout(1000); await accept(a.page); await a.page.waitForTimeout(2500); await a.flush();
  const contra = await a.state(); assert.deepEqual(contra.consent, C(D, D)); assert.equal(contra.ga, 0); assert.equal(a.hits.length, 0); await a.ctx.close();
  const b = await session(ON); await b.page.goto(BASE + "/pt"); await b.page.waitForTimeout(1500);
  await b.page.evaluate(() => window.__e2eGoogleDecide({ ads: false, analytics: true })); await b.page.waitForTimeout(1000);
  const mid = await b.state(); assert.equal(mid.consent.analytics_storage, D, "site re-asserts denied right after Google's grant"); assert.equal(mid.ga, 0);
  await accept(b.page); await b.page.waitForTimeout(2500); await b.flush();
  const coh = await b.state(); assert.deepEqual(coh.consent, C(D, G)); assert.equal(coh.ga, 1); assert.equal(coh.page_views, 1);
  r.notes.push("contraditório: site 'sim' + Google 'não' → bloqueado; coerente: GA só após o 'sim' do site"); await b.ctx.close();
  return { contradictory: contra.consent, googleGrantBeforeSite: mid.consent.analytics_storage, coherent: coh.consent };
});
await scenario("13", "Google deixa de controlar análise (OFF): somente o site decide, sem comandos concorrentes", { googleWritesAnalytics: false, consent: C(G, G) }, async () => {
  const s = await session(OFF); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(1500);
  await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: true, analytics: false })); await s.page.waitForTimeout(1000); await accept(s.page); await s.page.waitForTimeout(2500); await s.flush();
  const writers = await s.page.evaluate(() => (window.dataLayer || []).filter((e) => e && e[0] === "consent" && e[1] === "update" && "analytics_storage" in e[2]).map((e) => Object.keys(e[2]).join(",")));
  const st = await s.state(); assert.deepEqual(st.consent, C(G, G)); assert.equal(st.ga, 1);
  assert.ok(writers.every((k) => k === "analytics_storage"), "only the site's analytics-only updates touch analytics_storage");
  await s.ctx.close(); return { consent: st.consent, analyticsUpdates: writers };
});
await scenario("11-ON", "CMP tardia (ON) após aceite local: suspende sem recarga, retoma após decisão Google", { suspendedHits: 0, reloads: 0, resumed: true }, async (r) => {
  const s = await session({ analyticsPurpose: true, delay: 9000 }); let loads = 0; s.page.on("load", () => loads++);
  await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(1500); await accept(s.page); await s.page.waitForTimeout(2000); await s.flush();
  const early = await s.state(); const loadsAfterNav = loads; assert.equal(early.ga, 1); assert.equal(early.page_views, 1);
  await s.page.waitForTimeout(7500); // CMP arrives, applicable and undecided
  const h0 = s.hits.length; const suspended = await s.state();
  await click(s.page, "/pt/sobre"); await s.page.waitForTimeout(1500); await s.flush();
  const during = s.hits.length - h0; r.notes.push(`suspenso: analytics_storage=${suspended.consent.analytics_storage}, hits durante=${during}, _ga=${suspended._ga}`);
  assert.equal(suspended.consent.analytics_storage, D); assert.equal(during, 0, "no hits while the applicable Google CMP is undecided"); assert.equal(suspended._ga, true, "_ga preserved while suspended");
  await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: true, analytics: true })); await s.page.waitForTimeout(1500);
  const h1 = s.pv().length; await click(s.page, "/pt/contato"); await s.page.waitForTimeout(1500); await s.flush();
  const after = await s.state(); assert.deepEqual(after.consent, C(G, G)); assert.equal(s.pv().length - h1, 1, "measurement resumes after Google's decision"); assert.equal(loads, loadsAfterNav, "no reload");
  await s.ctx.close(); return { early: early.consent, suspended: suspended.consent, hitsWhileSuspended: during, final: after.consent, reloads: loads - loadsAfterNav };
});
await scenario("11-OFF", "CMP tardia (OFF) após aceite local: estatísticas mantidas", { reloads: 0, analytics: G }, async () => {
  const s = await session({ analyticsPurpose: false, delay: 9000 }); let loads = 0; s.page.on("load", () => loads++);
  await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(1500); await accept(s.page); await s.page.waitForTimeout(2000); const l0 = loads;
  await s.page.waitForTimeout(8000); const shown = await s.state();
  await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: true, analytics: false })); await s.page.waitForTimeout(2000); await s.flush();
  const st = await s.state(); assert.equal(shown.consent.analytics_storage, G); assert.equal(shown.banner, false); assert.deepEqual(st.consent, C(G, G)); assert.equal(loads, l0);
  await s.ctx.close(); return { cmpShown: shown.consent, final: st.consent, reloads: loads - l0 };
});
await scenario("10", "CMP indisponível", { consent: C(D, D), banner: true }, async (r) => {
  const s = await session(null); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(12000);
  const st = await s.state(); assert.equal(st.banner, true); assert.deepEqual(st.consent, C(D, D)); assert.equal(s.hits.length, 0);
  r.notes.push("igual ao visitante brasileiro: o site pede estatísticas sem precisar distinguir os casos"); await s.ctx.close(); return st;
});
const eu = await session(OFF);
await scenario("14", "Preferências persistidas (Europa)", { consent: C(G, G), banner: false, page_views: 2 }, async () => {
  await eu.page.goto(BASE + "/pt"); await eu.page.waitForTimeout(1500);
  await eu.page.evaluate(() => window.__e2eGoogleDecide({ ads: true, analytics: false })); await eu.page.waitForTimeout(800); await accept(eu.page); await eu.page.waitForTimeout(2500); await eu.flush();
  await eu.page.reload(); await eu.page.waitForTimeout(2500); await eu.flush();
  const st = await eu.state(); assert.deepEqual(st.consent, C(G, G)); assert.equal(st.banner, false); assert.equal(st.page_views, 2);
  assert.equal(new Set(eu.pv().map((h) => h.cid)).size, 1); return st;
});
await scenario("16", "Revogação de publicidade (rodapé Google) não altera estatísticas", { consent: C(D, G), ga: 1, _ga: true }, async (r) => {
  await eu.page.getByRole("button", { name: "Privacidade e publicidade (Google)" }).click(); await eu.page.waitForTimeout(500);
  const open = await eu.state(); r.notes.push(`mensagem reaberta: ${await eu.page.evaluate(() => window.__e2eRevocations)}; banner do site: ${open.banner}`);
  await eu.page.evaluate(() => window.__e2eGoogleDecide({ ads: false, analytics: false })); await eu.page.waitForTimeout(1500);
  const st = await eu.state(); assert.deepEqual(st.consent, C(D, G)); assert.equal(st.ga, 1); assert.equal(st._ga, true); assert.equal(open.banner, false);
  return st;
});
await scenario("15-ads", "Revogação de estatísticas não altera publicidade concedida", { consent: C(G, D) }, async () => {
  const t = await session(OFF); await t.page.goto(BASE + "/pt"); await t.page.waitForTimeout(1500);
  await t.page.evaluate(() => window.__e2eGoogleDecide({ ads: true, analytics: false })); await t.page.waitForTimeout(800); await accept(t.page); await t.page.waitForTimeout(2000);
  const reload = t.page.waitForEvent("load"); await setStats(t.page, false); await reload; await t.page.waitForTimeout(2000);
  const st = await t.state(); assert.deepEqual(st.consent, C(G, D)); assert.equal(st.ga, 0); assert.equal(st._ga, false);
  await t.ctx.close(); return st;
});
await eu.ctx.close();

// ── Platform ─────────────────────────────────────────────────────────────────────────
await scenario("20", "Login, 2FA e administração", { ga: 0, adsense: 0, hits: 0 }, async () => {
  const n = await session(OFF); const out = [];
  for (const p of ["/login", "/login/2fa", "/administracao"]) {
    await n.page.goto(BASE + p); await n.page.waitForTimeout(1500); const st = await n.state();
    out.push({ p, at: n.page.url().replace(BASE, ""), ga: st.ga, adsense: st.adsense, css: st.css, banner: st.banner });
    assert.equal(st.ga, 0); assert.equal(st.adsense, 0); assert.ok(st.css > 0);
  }
  assert.equal(n.hits.length, 0); assert.equal(n.req.length, 0, "no gtag or adsbygoogle request"); await n.ctx.close(); return out;
});
await scenario("21b", "React #418 causado pelo AdSense real (hidratação atrasada): eliminado (F4)", { "#418": 0, css: 1, adsense: 1 }, async (r) => {
  const out = [];
  for (const path of ["/pt/sobre", "/pt", "/pt/artigos"]) {
    const s = await session(null, { delayChunksMs: 2500 }); await s.page.goto(BASE + path, { waitUntil: "load" }); await s.page.waitForTimeout(6000);
    const st = await s.state(); const impl = await s.page.evaluate(() => !!document.querySelector('script[src*="show_ads_impl"]'));
    out.push({ path, errors: s.errors, implInserted: impl, css: st.css, header: st.header, adsense: st.adsense });
    assert.ok(impl, "AdSense really ran before hydration (show_ads_impl inserted)"); assert.ok(!s.errors.some((e) => e.includes("418")), "no #418 at " + path);
    assert.ok(st.css > 0); assert.equal(st.header, "sticky"); assert.equal(st.adsense, 1);
    await s.ctx.close();
  }
  r.notes.push(JSON.stringify(out)); return out;
});
await scenario("24", "Bloqueadores: AdSense bloqueado; AdSense + GA bloqueados", { adBlocker: { banner: true, page_views: 1 }, fullBlocker: { banner: true, errors: 0 } }, async () => {
  const a = await session(null, { block: [/adsbygoogle\.js/, /googlesyndication/] }); await a.page.goto(BASE + "/pt"); await a.page.waitForTimeout(2000);
  const a0 = await a.state(); await accept(a.page); await a.page.waitForTimeout(2500); await a.flush(); const a1 = await a.state();
  assert.equal(a0.banner, true); assert.equal(a1.ga, 1); assert.equal(a1.page_views, 1); assert.equal(a.errors.length, 0); await a.ctx.close();
  const b = await session(null, { block: [/adsbygoogle\.js/, /googlesyndication/, /googletagmanager/, /google-analytics/] }); await b.page.goto(BASE + "/pt"); await b.page.waitForTimeout(2000);
  const b0 = await b.state(); await accept(b.page); await b.page.waitForTimeout(2500); await click(b.page, "/pt/sobre"); await b.page.waitForTimeout(1500);
  const b1 = await b.state(); assert.equal(b0.banner, true); assert.equal(b1.banner, false); assert.equal(b1.stored, true); assert.equal(b.errors.length, 0); assert.ok(b1.css > 0); assert.equal(b.hits.length, 0);
  await b.ctx.close(); return { adBlocker: { banner: a0.banner, page_views: a1.page_views }, fullBlocker: { banner: b0.banner, stored: b1.stored, errors: b.errors.length } };
});

const closeAt = Date.now();
await browser.close();
const final = {
  emitted: allGa.length,
  intercepted: allGa.filter((x) => routed.has(x.r)).length,
  cancelledBeforeNetwork: allGa.filter((x) => !routed.has(x.r) && x.r.failure()).map((x) => ({ scenario: x.scenario, error: x.r.failure().errorText })),
  unaccounted: allGa.filter((x) => !routed.has(x.r) && !x.r.failure()).map((x) => x.scenario),
};
await scenario("—", "Nenhum hit GA saiu sem interceptação", { unaccounted: 0 }, async () => {
  assert.ok(final.emitted > 0); assert.equal(final.unaccounted.length, 0, "every GA hit was intercepted or cancelled before the network");
  return { ...final, at: closeAt };
});
writeFileSync(OUT, JSON.stringify({ base: BASE, ranAt: new Date().toISOString(), hypotheses: { H1: "Google CMP calls gtag consent update itself after a choice", H2: "with the analytics purpose ON that update includes analytics_storage" }, results }, null, 2));
const failed = results.filter((x) => !x.ok);
console.log(`\n${results.length - failed.length}/${results.length} cenários PASS → ${OUT}`);
process.exit(failed.length ? 1 : 0);
