import { chromium } from "playwright-core";
// DIAGNOSTIC ONLY: injects the standard Privacy & messaging tag in this headless browser to see whether
// Funding Choices resolves for this publisher. GA hits and ad requests are blocked.
const BASE = process.argv[2] || "https://www.nutricaoemovimento.com";
const path = process.argv[3] || "/pt";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const ctx = await browser.newContext({ locale: "pt-BR" });
const seen = [];
await ctx.route("**/*", (route) => {
  const url = route.request().url();
  if (/\/g\/collect/.test(url)) return route.fulfill({ status: 204, body: "" });
  if (/googleads\.g\.doubleclick\.net\/pagead\/ads|pagead2\.googlesyndication\.com\/pagead\/ads\?/.test(url)) return route.abort();
  if (/fundingchoices|googlefc|gen_204/.test(url)) seen.push(url.slice(0, 160));
  return route.continue();
});
await ctx.addInitScript(() => {
  if (window.top !== window) return; // top frame only
  window.__fcLog = [];
  window.googlefc = window.googlefc || {};
  window.googlefc.callbackQueue = window.googlefc.callbackQueue || [];
  const t0 = performance.now();
  for (const key of ["CONSENT_API_READY", "CONSENT_DATA_READY", "CONSENT_MODE_DATA_READY", "INITIAL_US_STATES_OPT_OUT_DATA_READY"]) {
    window.googlefc.callbackQueue.push({ [key]: () => {
      let extra = "";
      try { if (key === "CONSENT_MODE_DATA_READY") extra = JSON.stringify(window.googlefc.getGoogleConsentModeValues()); } catch (e) { extra = "err " + e; }
      window.__fcLog.push(`${Math.round(performance.now() - t0)}ms ${key} ${extra}`);
    } });
  }
  document.addEventListener("DOMContentLoaded", () => {
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://fundingchoicesmessages.google.com/i/pub-3638053236344020?ers=1";
    document.head.appendChild(s);
    const f = document.createElement("iframe");
    f.name = "googlefcPresent"; f.style.display = "none";
    document.body.appendChild(f);
  });
});
const page = await ctx.newPage();
await page.goto(BASE + path, { waitUntil: "load" });
await page.waitForTimeout(12000);
const state = await page.evaluate(() => ({
  fcLog: window.__fcLog, nemCmp: window.__nemCmp ?? null, tcfapi: typeof window.__tcfapi,
  tcf: null, banner: !!document.querySelector("#cookie-consent-title"),
  fcDialog: !!document.querySelector(".fc-consent-root, .fc-dialog-container"),
}));
if (state.tcfapi === "function") state.tcf = await page.evaluate(() => new Promise((r) => window.__tcfapi("addEventListener", 2.2, (d, ok) => r({ ok, gdprApplies: d && d.gdprApplies, eventStatus: d && d.eventStatus }))));
console.log(path, JSON.stringify(state, null, 1));
console.log(seen.join("\n"));
await browser.close();
