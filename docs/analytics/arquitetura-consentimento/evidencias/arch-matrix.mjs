/* eslint-disable */
// Consent-architecture matrix (Alternative A prototype, scratch worktree). Never against production.
// GA hits: synthetic 204. Ad requests and real Funding Choices: blocked. Google CMP: stub of the documented
// Privacy & Messaging API + IAB TCF events, plus two declared HYPOTHESES:
//   H1 after a user choice the Google CMP itself calls gtag('consent','update') for its purposes;
//   H2 with the panel's analytics purpose ON, that update includes analytics_storage.
import { chromium } from "playwright-core";
import { writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const BASE = process.env.BASE || "http://127.0.0.1:3108";
const OUT = process.env.OUT || "arch-matrix.json";
const BATCH = 7500;
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const results = []; const collect = { emitted: 0, intercepted: 0, failedBeforeNetwork: 0, reachedNetwork: 0 }; const routed = new WeakSet(); const allGa = []; let currentScenario = "";

/** cmp: null (no Google CMP: Brazil today / unavailable) or { analyticsPurpose, delay } (EEA). */
async function session(cmp) {
  const ctx = await browser.newContext({ locale: "pt-BR", viewport: { width: 1280, height: 900 } });
  const hits = [], req = [];
  await ctx.route("**/*", (route) => {
    const r = route.request(); const url = r.url();
    if (/\/g\/collect/.test(url)) {
      collect.intercepted++; routed.add(r);
      const shared = Object.fromEntries(new URL(url).searchParams);
      const lines = (r.postData() || "").split(/\r?\n/).filter(Boolean);
      for (const line of lines.length ? lines : [""]) { const p = { ...shared, ...Object.fromEntries(new URLSearchParams(line)) }; hits.push({ en: p.en, dl: p.dl && new URL(p.dl).pathname, cid: p.cid, gcs: p.gcs }); }
      return route.fulfill({ status: 204, body: "" });
    }
    if (/fundingchoicesmessages\.google\.com/.test(url)) return route.abort();
    if (/googleads\.g\.doubleclick\.net\/pagead\/ads|pagead2\.googlesyndication\.com\/pagead\/ads\?|securepubads|tpc\.googlesyndication/.test(url)) return route.abort();
    if (/googletagmanager\.com\/gtag\/js/.test(url)) req.push("gtag");
    if (/adsbygoogle\.js/.test(url)) req.push("adsense");
    return route.continue();
  });
  const isGa = (r) => /google-analytics\.com|analytics\.google\.com/.test(r.url()) && /collect/.test(r.url());
  ctx.on("request", (r) => { if (isGa(r)) { collect.emitted++; allGa.push({ r, scenario: currentScenario, t: Date.now() }); } });
  ctx.on("requestfailed", (r) => { if (isGa(r) && !routed.has(r)) collect.failedBeforeNetwork++; });
  ctx.on("requestfinished", (r) => { if (isGa(r) && !routed.has(r)) collect.reachedNetwork++; });
  await ctx.addInitScript((cfg) => {
    if (window.top !== window) return;
    try { if (sessionStorage.getItem("e2e-418") === "1") { sessionStorage.removeItem("e2e-418"); const o = new MutationObserver(() => { const p = document.querySelector("main p, main h1"); if (p && !document.getElementById("e2e-ad")) { const i = document.createElement("ins"); i.id = "e2e-ad"; p.parentNode.insertBefore(i, p); o.disconnect(); } }); o.observe(document, { childList: true, subtree: true }); } } catch {}
    if (!cfg) return;
    const KEY = "e2e-google-decision";
    let listeners = [], ready = false, status = cfg.analyticsPurpose ? 0 : 4; const pending = [];
    const stored = () => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; } };
    const emit = (eventStatus) => listeners.forEach((cb) => cb({ eventStatus, gdprApplies: true, cmpStatus: "loaded" }, true));
    const run = (e) => { e.CONSENT_API_READY?.(); if (status !== 0) e.CONSENT_MODE_DATA_READY?.(); else if (e.CONSENT_MODE_DATA_READY) pending.push({ CONSENT_MODE_DATA_READY: e.CONSENT_MODE_DATA_READY }); };
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
    window.__tcfapi = (cmd, _v, cb) => { if (cmd === "addEventListener") { listeners.push(cb); const d = stored(); cb({ eventStatus: d ? "tcloaded" : "cmpuishown", gdprApplies: true, cmpStatus: "loaded" }, true); } };
    window.__e2eGoogleDecide = (d) => { localStorage.setItem(KEY, JSON.stringify(d)); apply(d); emit("useractioncomplete"); const q = pending.splice(0); q.forEach(run); };
    setTimeout(() => { const d = stored(); if (d) apply(d); ready = true; const q = pending.splice(0); q.forEach(run); }, cfg.delay ?? 500);
  }, cmp);
  const page = await ctx.newPage(); const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 70)));
  const consent = () => page.evaluate(() => {
    const s = {};
    for (const e of window.dataLayer || []) if (e && e[0] === "consent" && (e[1] === "default" || e[1] === "update")) Object.assign(s, e[2]);
    return { ad_storage: s.ad_storage, analytics_storage: s.analytics_storage, ad_user_data: s.ad_user_data, ad_personalization: s.ad_personalization };
  });
  const state = async () => ({ consent: await consent(), ...(await page.evaluate(() => ({
    ga: document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]').length,
    adsense: document.querySelectorAll('script[src*="adsbygoogle.js"]').length,
    banner: !!document.querySelector("#cookie-consent-title"),
    footer: [...document.querySelectorAll("footer button")].map((b) => b.textContent).join(" | "),
    stored: (() => { try { return JSON.parse(localStorage.getItem("nem-consent-v3") || "null")?.analytics ?? null; } catch { return null; } })(),
    css: document.styleSheets.length,
  }))), _ga: (await ctx.cookies()).some((c) => c.name === "_ga"), page_views: hits.filter((h) => h.en === "page_view").length });
  return { ctx, page, hits, req, errors, state, flush: () => page.waitForTimeout(BATCH) };
}
async function scenario(id, title, expected, fn) {
  const rec = { id, title, expected, ok: true, notes: [] }; currentScenario = id;
  try { rec.observed = await fn(rec); } catch (e) { rec.ok = false; rec.error = String(e.message || e).slice(0, 300); }
  results.push(rec); console.log(`${rec.ok ? "PASS" : "FAIL"} ${id} ${title}${rec.error ? "\n   " + rec.error : ""}`);
  if (rec.observed) console.log("   " + JSON.stringify(rec.observed));
  rec.notes.forEach((n) => console.log("   · " + n));
}
const D = "denied", G = "granted";
const C = (ad, an) => ({ ad_storage: ad, analytics_storage: an, ad_user_data: ad, ad_personalization: ad });
const accept = (p) => p.getByRole("button", { name: "Aceitar opcionais" }).click();
const refuse = (p) => p.getByRole("button", { name: "Recusar opcionais" }).click();
const click = async (p, href) => { await p.locator(`a[href="${href}"]`).first().click(); await p.waitForURL((u) => u.pathname === href.split("?")[0], { timeout: 15000 }); };
const EEA_OFF = { analyticsPurpose: false, delay: 600 }, EEA_ON = { analyticsPurpose: true, delay: 600 };

await scenario("A", "Brasileiro novo (CMP Google não carrega)", { consent: C(D, D), banner: true, ga: 0, _ga: false, page_views: 0, adsense: 1 }, async () => {
  const s = await session(null); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(2500); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(D, D)); assert.equal(st.banner, true); assert.equal(st.ga, 0); assert.equal(st._ga, false); assert.equal(st.page_views, 0); assert.equal(st.adsense, 1); assert.doesNotMatch(st.footer, /Google/);
  await s.ctx.close(); return st;
});
await scenario("B", "Brasileiro aceita estatísticas", { consent: C(D, G), ga: 1, _ga: true, page_views: 1, stored: true }, async () => {
  const s = await session(null); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(2000); await accept(s.page); await s.page.waitForTimeout(2500); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(D, G)); assert.equal(st.ga, 1); assert.equal(st._ga, true); assert.equal(st.page_views, 1); assert.equal(st.stored, true); assert.equal(st.banner, false);
  assert.ok(s.hits.every((h) => h.gcs === "G101"), "gcs=G101 (ad denied, analytics granted)");
  await s.ctx.close(); return st;
});
await scenario("C", "Brasileiro recusa estatísticas", { consent: C(D, D), ga: 0, _ga: false, page_views: 0, stored: false }, async () => {
  const s = await session(null); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(2000); await refuse(s.page);
  await s.page.reload(); await s.page.waitForTimeout(2500); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(D, D)); assert.equal(st.ga, 0); assert.equal(st.page_views, 0); assert.equal(st.stored, false); assert.equal(st.banner, false);
  await s.ctx.close(); return st;
});
for (const [variant, cfg] of [["OFF", EEA_OFF], ["ON", EEA_ON]]) {
  await scenario(`D-${variant}`, `Europeu com CMP ativa (propósito análise ${variant}): mensagem Google na tela`, { consent: C(D, D), banner: false, ga: 0, page_views: 0 }, async (r) => {
    const s = await session(cfg); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(2500); await s.flush();
    const st = await s.state(); assert.deepEqual(st.consent, C(D, D)); assert.equal(st.banner, false, "local banner yields while Google message is on screen"); assert.equal(st.ga, 0); assert.equal(st.page_views, 0);
    await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: true, analytics: true })); await s.page.waitForTimeout(1500);
    const after = await s.state(); r.notes.push("após decisão Google (ads+analytics sim): " + JSON.stringify({ consent: after.consent, banner: after.banner, ga: after.ga }));
    assert.equal(after.banner, true, "site banner then asks for statistics"); assert.equal(after.consent.analytics_storage, D, "Google never grants statistics alone"); assert.equal(after.ga, 0);
    assert.match(after.footer, /Google/);
    await s.ctx.close(); return st;
  });
}
await scenario("E", "Europeu aceita publicidade e recusa estatísticas (OFF)", { consent: C(G, D), ga: 0, page_views: 0 }, async () => {
  const s = await session(EEA_OFF); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(1500);
  await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: true, analytics: false })); await s.page.waitForTimeout(1000); await refuse(s.page); await s.page.waitForTimeout(1500); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(G, D)); assert.equal(st.ga, 0); assert.equal(st.page_views, 0);
  await s.ctx.close(); return st;
});
await scenario("F-OFF", "Europeu recusa publicidade e aceita estatísticas (OFF)", { consent: C(D, G), ga: 1, page_views: 1 }, async () => {
  const s = await session(EEA_OFF); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(1500);
  await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: false, analytics: false })); await s.page.waitForTimeout(1000); await accept(s.page); await s.page.waitForTimeout(2500); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(D, G)); assert.equal(st.ga, 1); assert.equal(st.page_views, 1); assert.ok(s.hits.every((h) => h.gcs === "G101"));
  await s.ctx.close(); return st;
});
await scenario("F-ON-contraditório", "Europeu: Google recusa análise, site aceita (ON) → vence a recusa", { consent: C(D, D), ga: 0, page_views: 0 }, async (r) => {
  const s = await session(EEA_ON); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(1500);
  await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: false, analytics: false })); await s.page.waitForTimeout(1000); await accept(s.page); await s.page.waitForTimeout(2500); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(D, D)); assert.equal(st.ga, 0); assert.equal(st.page_views, 0);
  r.notes.push("o banner local registra 'aceito', mas a recusa Google prevalece: duas respostas para a mesma finalidade");
  await s.ctx.close(); return st;
});
await scenario("F-ON-coerente", "Europeu: Google aceita análise e site aceita (ON)", { consent: C(D, G), ga: 1, page_views: 1 }, async (r) => {
  const s = await session(EEA_ON); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(1500);
  await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: false, analytics: true })); await s.page.waitForTimeout(1000);
  const mid = await s.state(); r.notes.push("após Google conceder análise, antes do site: analytics_storage=" + mid.consent.analytics_storage + " ga=" + mid.ga);
  assert.equal(mid.consent.analytics_storage, D, "Google grant is overridden until the site banner says yes"); assert.equal(mid.ga, 0);
  await accept(s.page); await s.page.waitForTimeout(2500); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(D, G)); assert.equal(st.ga, 1); assert.equal(st.page_views, 1);
  await s.ctx.close(); return st;
});
await scenario("G", "CMP Google indisponível", { consent: C(D, D), banner: true, ga: 0, page_views: 0 }, async (r) => {
  const s = await session(null); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(12000); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(D, D)); assert.equal(st.banner, true); assert.equal(st.ga, 0); assert.equal(st.page_views, 0);
  r.notes.push("indistinguível do cenário A: o site não precisa distinguir para pedir estatísticas");
  await s.ctx.close(); return st;
});
for (const [variant, cfg] of [["OFF", { analyticsPurpose: false, delay: 9000 }], ["ON", { analyticsPurpose: true, delay: 9000 }]]) {
  await scenario(`H-${variant}`, `CMP Google tardia (9 s), site já aceito (${variant})`, { consent_final: C(G, G), reloads: 0 }, async (r) => {
    const s = await session(cfg); await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(1500); await accept(s.page); await s.page.waitForTimeout(2000);
    const early = await s.state(); r.notes.push("antes da CMP: " + JSON.stringify({ consent: early.consent, ga: early.ga }));
    assert.equal(early.consent.analytics_storage, G); assert.equal(early.ga, 1);
    let loads = 0; s.page.on("load", () => loads++);
    await s.page.waitForTimeout(8000);
    const shown = await s.state(); r.notes.push("CMP apareceu: " + JSON.stringify({ consent: shown.consent, ga: shown.ga, banner: shown.banner, recargas: loads }));
    await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: true, analytics: true })); await s.page.waitForTimeout(3000); await s.flush();
    const st = await s.state(); r.notes.push("após decisão Google: " + JSON.stringify({ consent: st.consent, ga: st.ga, recargas: loads, page_views: st.page_views }));
    assert.deepEqual(st.consent, C(G, G));
    assert.equal(loads, 0, "late CMP never reloads a page with explicit local consent"); assert.equal(shown.consent.analytics_storage, G);
    await s.ctx.close(); return { early: early.consent, cmpShown: shown.consent, final: st.consent, reloads: loads, page_views: st.page_views };
  });
}

// I, J, K, L, M, O share one EEA (OFF) profile with Google ads granted and site statistics granted.
const s = await session(EEA_OFF); let cid;
await scenario("I", "Consentimento persistido (recarga e nova aba)", { consent: C(G, G), banner: false, sameCid: true }, async () => {
  await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(1500);
  await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: true, analytics: false })); await s.page.waitForTimeout(1000); await accept(s.page); await s.page.waitForTimeout(2500); await s.flush();
  cid = s.hits.find((h) => h.en === "page_view")?.cid;
  await s.page.reload(); await s.page.waitForTimeout(2500); await s.flush();
  const tab = await s.ctx.newPage(); await tab.goto(BASE + "/pt/sobre"); await tab.waitForTimeout(BATCH); await tab.close();
  const st = await s.state(); assert.deepEqual(st.consent, C(G, G)); assert.equal(st.banner, false); assert.equal(st.page_views, 3);
  assert.ok(s.hits.filter((h) => h.en === "page_view").every((h) => h.cid === cid), "same cid");
  return { ...st, cid };
});
await scenario("L", "Cinco navegações SPA", { page_views_added: 5 }, async (r) => {
  const start = s.hits.filter((h) => h.en === "page_view").length;
  await click(s.page, "/pt/artigos"); const art = await s.page.locator('main a[href^="/pt/artigos/"]').first().getAttribute("href");
  for (const h of [art, "/pt/sobre", "/pt/contato", "/pt"]) { await s.page.waitForTimeout(1500); await click(s.page, h); }
  await s.page.waitForTimeout(1500); await s.flush();
  const pv = s.hits.filter((h) => h.en === "page_view").slice(start); r.notes.push(pv.map((h) => h.dl).join(" → "));
  assert.equal(pv.length, 5); assert.ok(pv.every((h) => h.cid === cid)); return { page_views_added: pv.length };
});
await scenario("M", "Layouts raiz /pt → /login → /pt", { login: { ga: 0, adsense: 0 }, back_page_views: 1 }, async () => {
  const start = s.hits.filter((h) => h.en === "page_view").length;
  await s.page.goto(BASE + "/login"); await s.page.waitForTimeout(2000); const login = await s.state();
  assert.equal(login.ga, 0); assert.equal(login.adsense, 0);
  await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(2500); await s.flush();
  const pv = s.hits.filter((h) => h.en === "page_view").slice(start); assert.equal(pv.length, 1); assert.equal(pv[0].cid, cid);
  return { login: { ga: login.ga, adsense: login.adsense, consent: login.consent }, back_page_views: pv.length };
});
await scenario("O", "Erro React #418", { page_views: 1, css: ">0" }, async (r) => {
  const start = s.hits.filter((h) => h.en === "page_view").length; s.errors.length = 0;
  await s.page.evaluate(() => sessionStorage.setItem("e2e-418", "1")); await s.page.goto(BASE + "/pt/sobre"); await s.page.waitForTimeout(3500); await s.flush();
  const st = await s.state(); const pv = s.hits.filter((h) => h.en === "page_view").length - start;
  r.notes.push("erros: " + JSON.stringify(s.errors)); assert.ok(s.errors.some((e) => e.includes("418"))); assert.equal(pv, 1); assert.ok(st.css > 0);
  return { page_views: pv, css: st.css, consent: st.consent };
});
await scenario("K", "Revogação de publicidade (rodapé Google)", { consent: C(D, G), ga: 1 }, async (r) => {
  await s.page.goto(BASE + "/pt"); await s.page.waitForTimeout(2000);
  await s.page.getByRole("button", { name: "Privacidade e publicidade (Google)" }).click(); await s.page.waitForTimeout(500);
  const during = await s.state(); r.notes.push("mensagem Google reaberta: revogações=" + (await s.page.evaluate(() => window.__e2eRevocations)) + " banner local=" + during.banner);
  await s.page.evaluate(() => window.__e2eGoogleDecide({ ads: false, analytics: false })); await s.page.waitForTimeout(1500);
  const st = await s.state(); assert.deepEqual(st.consent, C(D, G)); assert.equal(st.ga, 1); assert.equal(st._ga, true); assert.equal(during.banner, false);
  return st;
});
await scenario("J", "Revogação de estatísticas (rodapé do site)", { consent: C(D, D), ga: 0, _ga: false, hits_after: 0 }, async () => {
  await s.page.getByRole("button", { name: "Preferências de cookies" }).click();
  await s.page.getByRole("checkbox", { name: /Estatísticas/ }).uncheck();
  const reload = s.page.waitForEvent("load"); await s.page.getByRole("button", { name: "Salvar preferências" }).click(); await reload;
  await s.page.waitForTimeout(1500); await s.flush(); const start = s.hits.length;
  await click(s.page, "/pt/artigos"); await s.page.waitForTimeout(1500); await s.flush();
  const st = await s.state(); assert.deepEqual(st.consent, C(D, D), "ad_* untouched (already denied in K), analytics denied"); assert.equal(st.ga, 0); assert.equal(st._ga, false); assert.equal(s.hits.length, start);
  return { ...st, hits_after: s.hits.length - start };
});
await s.ctx.close();
await scenario("J-ads", "Revogar estatísticas não altera publicidade concedida", { consent: C(G, D) }, async () => {
  const t = await session(EEA_OFF); await t.page.goto(BASE + "/pt"); await t.page.waitForTimeout(1500);
  await t.page.evaluate(() => window.__e2eGoogleDecide({ ads: true, analytics: false })); await t.page.waitForTimeout(800); await accept(t.page); await t.page.waitForTimeout(2000);
  await t.page.getByRole("button", { name: "Preferências de cookies" }).click(); await t.page.getByRole("checkbox", { name: /Estatísticas/ }).uncheck();
  const reload = t.page.waitForEvent("load"); await t.page.getByRole("button", { name: "Salvar preferências" }).click(); await reload; await t.page.waitForTimeout(2000);
  const st = await t.state(); assert.deepEqual(st.consent, C(G, D)); assert.equal(st.ga, 0);
  await t.ctx.close(); return st;
});
await scenario("N", "Login e administração", { ga: 0, adsense: 0, hits: 0 }, async (r) => {
  const n = await session(EEA_OFF); const out = [];
  for (const p of ["/login", "/login/2fa", "/administracao"]) { await n.page.goto(BASE + p); await n.page.waitForTimeout(1500); const st = await n.state(); out.push({ p, at: n.page.url().replace(BASE, ""), ga: st.ga, adsense: st.adsense, css: st.css }); assert.equal(st.ga, 0); assert.equal(st.adsense, 0); assert.ok(st.css > 0); }
  assert.equal(n.hits.length, 0); assert.equal(n.req.length, 0); await n.ctx.close(); return out;
});
const closeAt = Date.now();
await browser.close();
collect.unaccounted = allGa.filter((x) => !routed.has(x.r) && !x.r.failure()).map((x) => ({ scenario: x.scenario, url: x.r.url().split("?")[0], type: x.r.resourceType(), method: x.r.method(), msBeforeBrowserClose: closeAt - x.t, frameDetached: (() => { try { return x.r.frame().isDetached(); } catch { return "n/a"; } })() }));
collect.final = { intercepted: allGa.filter((x) => routed.has(x.r)).length, cancelledBeforeNetwork: allGa.filter((x) => !routed.has(x.r) && x.r.failure()).map((x) => ({ scenario: x.scenario, error: x.r.failure().errorText, msBeforeBrowserClose: closeAt - x.t })), other: collect.unaccounted.length };
console.log("FINAL", JSON.stringify(collect.final));
await scenario("—", "Nenhum hit GA saiu sem interceptação", { emitted_eq_intercepted: true }, async () => { assert.ok(collect.emitted > 0); assert.equal(collect.reachedNetwork, 0, "no GA hit completed outside interception"); assert.equal(collect.final.other, 0, "every GA hit was intercepted or cancelled before the network"); assert.equal(collect.final.intercepted + collect.final.cancelledBeforeNetwork.length, collect.emitted); return collect; });
writeFileSync(OUT, JSON.stringify({ base: BASE, ranAt: new Date().toISOString(), hypotheses: { H1: "Google CMP calls gtag consent update itself after a choice", H2: "with analytics purpose ON the update includes analytics_storage" }, collect, results }, null, 2));
const failed = results.filter((x) => !x.ok); console.log(`\n${results.length - failed.length}/${results.length} PASS → ${OUT}`);
process.exit(failed.length ? 1 : 0);
