import { chromium } from "playwright-core";
// Which pre-hydration AdSense node triggers #418? AdSense impl blocked, ad requests blocked, Next chunks delayed 2.5s.
const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
async function run(exp) {
  const ctx = await browser.newContext({ locale: "pt-BR" });
  await ctx.route("**/*", async (route) => { const u = route.request().url();
    if (/\/g\/collect|pagead\/ads\?|doubleclick\.net\/pagead\/ads|show_ads_impl/.test(u)) return route.abort();
    if (/\/_next\/static\/chunks\/.*\.js/.test(u)) await new Promise((r) => setTimeout(r, 2500));
    return route.continue(); });
  await ctx.addInitScript((exp) => {
    if (window.top !== window) return;
    const st = (window.__s = { commits: 0, removed: [], errors: [] });
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, renderers: new Map(), inject() { return 1; }, onScheduleFiberRoot() {}, onCommitFiberUnmount() {}, onPostCommitFiberRoot() {}, checkDCE() {}, onCommitFiberRoot() { st.commits++; } };
    window.addEventListener("error", (e) => st.errors.push(String(e.message).slice(0, 90)));
    new MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) {
      if (n.nodeType !== 1 || st.commits) continue;
      if (exp === "ins" && n.tagName === "INS") { n.remove(); st.removed.push("ins"); }
      if (exp === "script" && n.tagName === "SCRIPT" && /show_ads_impl/.test(n.src)) { n.remove(); st.removed.push("impl-script"); }
      if (exp === "all" && document.body && document.body.querySelector("div") && (n.tagName === "INS" || (n.tagName === "META" && m.target === document.head) || (n.tagName === "SCRIPT" && /show_ads_impl/.test(n.src)))) { n.remove(); st.removed.push(n.tagName); continue; }
      if (exp === "meta" && n.tagName === "META" && m.target === document.head && document.body && document.body.querySelector("div")) { n.remove(); st.removed.push("meta"); }
    } }).observe(document, { childList: true, subtree: true });
    st.attrs = []; new MutationObserver((ms) => { for (const m of ms) if (!st.commits && [document.documentElement, document.head, document.body].includes(m.target)) st.attrs.push(m.target.tagName + "@" + m.attributeName + "=" + String(m.target.getAttribute(m.attributeName)).slice(0, 80)); }).observe(document, { attributes: true, subtree: true });
  }, exp);
  const page = await ctx.newPage();
  await page.goto("https://www.nutricaoemovimento.com/pt/sobre", { waitUntil: "load" });
  await page.waitForTimeout(6000);
  const s = await page.evaluate(() => window.__s);
  await ctx.close();
  return { exp, ...s, has418: s.errors.some((e) => /418/.test(e)) };
}
for (const exp of ["none", "script", "none", "script"]) console.log(JSON.stringify(await run(exp)));
await browser.close();
