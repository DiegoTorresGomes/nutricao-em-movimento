import { chromium } from "playwright-core";
// Accepted consent + forced hydration mismatch (simulated ad node in <main>): count page_view per document.
const BASE = process.argv[2] || "https://www.nutricaoemovimento.com";
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const ctx = await browser.newContext({ locale: "pt-BR" });
const hits = [];
await ctx.route("**/*", (route) => {
  const req = route.request(); const url = req.url();
  if (/\/g\/collect/.test(url)) {
    const shared = Object.fromEntries(new URL(url).searchParams);
    for (const line of (req.postData() || "").split(/\r?\n/).filter(Boolean).concat(req.postData() ? [] : [""])) {
      const p = { ...shared, ...Object.fromEntries(new URLSearchParams(line)) };
      hits.push(`${p.en} ${p.dl?.replace(BASE, "")} _s=${p._s}`);
    }
    return route.fulfill({ status: 204, body: "" });
  }
  if (/googleads\.g\.doubleclick\.net\/pagead\/ads|pagead2\.googlesyndication\.com\/pagead\/ads\?/.test(url)) return route.abort();
  return route.continue();
});
await ctx.addInitScript(() => {
  window.googlefc = { callbackQueue: { push(e) { if (e.CONSENT_MODE_DATA_READY) setTimeout(e.CONSENT_MODE_DATA_READY, 1500); } }, getGoogleConsentModeValues: () => ({ analyticsStoragePurposeConsentStatus: 3 }) };
  if (sessionStorage.getItem("inject") === "1") {
    const obs = new MutationObserver(() => {
      const p = document.querySelector("main p, main h1");
      if (p && !document.getElementById("fake-ad")) { const i = document.createElement("ins"); i.id = "fake-ad"; p.parentNode.insertBefore(i, p); obs.disconnect(); }
    });
    obs.observe(document, { childList: true, subtree: true });
  }
});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 40)));
await page.goto(BASE + "/pt", { waitUntil: "load" });
await page.waitForTimeout(3000);
await page.getByRole("button", { name: "Aceitar opcionais" }).click();
await page.waitForTimeout(4000);
console.log("após aceite:", hits.splice(0));
await page.evaluate(() => sessionStorage.setItem("inject", "1"));
await page.goto(BASE + "/pt/sobre", { waitUntil: "load" });
await page.waitForTimeout(7000);
console.log("documento com #418:", hits.splice(0), "erros:", errors);
await browser.close();
