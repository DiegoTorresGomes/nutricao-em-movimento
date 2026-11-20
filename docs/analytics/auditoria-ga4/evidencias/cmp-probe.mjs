import { chromium } from "playwright-core";
// Scenario A only: logs every Google request; blocks only GA hits and actual ad-request endpoints.
const BASE = process.argv[2] || "https://www.nutricaoemovimento.com";
const blockAds = process.argv[3] !== "noblock";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const ctx = await browser.newContext({ locale: "pt-BR", timezoneId: "America/Sao_Paulo" });
const seen = [];
await ctx.route("**/*", (route) => {
  const url = route.request().url();
  if (/google|doubleclick|gstatic/.test(url)) {
    const blocked = /\/g\/collect/.test(url) || (blockAds && /googleads\.g\.doubleclick\.net\/pagead\/ads|pagead2\.googlesyndication\.com\/pagead\/ads\?/.test(url));
    seen.push((blocked ? "BLOCKED " : "") + url.slice(0, 150));
    if (blocked) return route.abort();
  }
  return route.continue();
});
const page = await ctx.newPage();
if (process.argv[5] === "hidefc") await page.addInitScript(() => { let v, first = true; Object.defineProperty(window, "googlefc", { configurable: true, get() { return v; }, set(x) { if (first && x && Array.isArray(x.callbackQueue) && !v) { first = false; window.__siteFcSwallowed = true; return; } v = x; } }); });
await page.goto(BASE + (process.argv[4] || "/pt"), { waitUntil: "load" });
await page.waitForTimeout(12000);
const state = await page.evaluate(() => ({
  cmp: window.__nemCmp ?? null, cmpStarted: !!window.__nemCmpStarted,
  googlefcKeys: window.googlefc ? Object.keys(window.googlefc) : null,
  tcfapi: typeof window.__tcfapi, adsbygoogle: Array.isArray(window.adsbygoogle) ? "array" : typeof window.adsbygoogle,
  adsLoaded: window.adsbygoogle && window.adsbygoogle.loaded,
  fcIframe: !!document.querySelector('iframe[name="googlefcPresent"]'),
  swallowed: !!window.__siteFcSwallowed, banner: !!document.querySelector("#cookie-consent-title"),
}));
console.log(state);
console.log(seen.join("\n"));
await browser.close();
