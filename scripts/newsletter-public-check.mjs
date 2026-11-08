import fs from "node:fs";
import assert from "node:assert/strict";

const root = "docs/monetizacao/auditoria-final-adsense/";
const { records } = JSON.parse(fs.readFileSync(root + "newsletter-integridade-antes.json", "utf8"));
const base = "http://127.0.0.1:4183";
const routes = ["/pt", "/pt/artigos", "/pt/sobre", "/pt/contato", "/pt/politica-de-privacidade", "/pt/termos-de-uso", "/pt/politica-de-cookies", "/pt/politica-editorial", "/pt/disclaimer",
  ...["confirmar", "confirmado", "sucesso", "erro", "expirado"].map(s => `/pt?newsletter=${s}`),
  ...records.filter(r => r.status === "PUBLISHED").map(r => `/pt/artigos/${r.slug}`)];
const results = [];
for (const path of routes) {
  const response = await fetch(base + path);
  const html = await response.text();
  assert.equal(response.status, 200, path);
  assert.doesNotMatch(html, /id="newsletter"|href="(?:\/pt)?#newsletter"|Enviamos um e-mail|Inscrição confirmada com sucesso|Quer receber mais conteúdos como este|Inscreva-se na newsletter|Receba conteúdos para construir/i, path);
  assert.match(html, /<footer\b/, path);
  const legal = /politica-de-privacidade|termos-de-uso|politica-de-cookies/.test(path);
  const visible = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  if (!legal) assert.doesNotMatch(visible, /newsletter/i, path);
  else if (!path.includes("cookies")) assert.match(visible, /captura pública da newsletter está temporariamente desativada/i);
  results.push({ path, status: response.status, footer: true, publicOffer: false, residualNewsletterMention: legal });
}
for (const path of ["/api/newsletter/confirm", "/api/newsletter/confirm?token=invalid"]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 503);
  assert.match(response.headers.get("cache-control"), /(?:^|,\s*)no-store(?:,|$)/);
  assert.match(response.headers.get("x-robots-tag"), /noindex/);
  assert.match(await response.text(), /Nenhuma inscrição foi confirmada/);
  results.push({ path, status: response.status, writes: false });
}
for (const path of ["/pt/newsletter", "/api/newsletter", "/api/newsletter/subscribe", "/api/newsletter/unsubscribe"]) {
  const response = await fetch(base + path);
  assert.equal(response.status, 404, path);
  results.push({ path, status: response.status });
}
const post = await fetch(base + "/api/newsletter/confirm", { method: "POST" });
assert.equal(post.status, 405);
results.push({ path: "/api/newsletter/confirm", method: "POST", status: post.status });
fs.writeFileSync(root + "newsletter-http-local.json", JSON.stringify({ checkedAt: new Date().toISOString(), environment: "local production build; no JavaScript or form submission", results }, null, 2) + "\n");
console.log(JSON.stringify({ passed: results.length, articles: records.filter(r => r.status === "PUBLISHED").length }));
