import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import * as jsx from "react/jsx-runtime";
import { withoutInactiveNewsletterPromotions } from "../src/lib/newsletter/public-display";

function load(file: string, mocks: Record<string, unknown>) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(source, { exports, require: (name: string) => {
    assert.ok(name in mocks, `Unexpected dependency: ${name}`);
    return mocks[name];
  }, Response, URL });
  return exports as Record<string, (...args: never[]) => unknown>;
}
const flag = { NEWSLETTER_AVAILABLE: false };
const forbidden = new Proxy({}, { get() { throw Error("Unexpected database/header/provider access"); } });

test("direct subscription action redirects before reading form, IP, database or adapter", async () => {
  const loaded = load("src/app/pt/newsletter/actions.ts", {
    "node:crypto": forbidden, "next/headers": forbidden,
    "next/navigation": { redirect: (path: string) => { throw Error(`REDIRECT:${path}`); } },
    "@/lib/prisma": { prisma: forbidden }, "@/lib/rate-limit": forbidden,
    "@/lib/newsletter/send-confirmation": forbidden, "@/config/newsletter": flag,
  });
  await assert.rejects(() => loaded.subscribeNewsletterAction(forbidden as never) as Promise<unknown>, /REDIRECT:\/pt\/artigos/);
});

test("old, missing and forged tokens cannot read or update subscriber records", async () => {
  const loaded = load("src/app/api/newsletter/confirm/route.ts", {
    "next/server": forbidden, "next/cache": forbidden,
    "@/lib/prisma": { prisma: forbidden }, "@/config/newsletter": flag,
    "@/config/legal": {},
  });
  for (const token of ["", "?token=old", "?token=forged"]) {
    const response = await loaded.GET(new Request(`https://example.test/api/newsletter/confirm${token}`) as never) as Response;
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.match(response.headers.get("x-robots-tag")!, /noindex/);
    assert.match(await response.text(), /Nenhuma inscrição foi confirmada/);
  }
});

test("all status parameters render no section, form, success message or empty wrapper", () => {
  const loaded = load("src/components/sections/NewsletterSection.tsx", {
    "react/jsx-runtime": jsx, "@/config/newsletter": flag,
    "@/app/pt/newsletter/actions": forbidden,
  });
  for (const status of [undefined, "sucesso", "confirmar", "confirmado", "expirado", "erro"]) {
    assert.equal(loaded.NewsletterSection({ status } as never), null);
  }
});

test("only inventoried dedicated promo blocks disappear; every other byte remains", () => {
  const root = "docs/monetizacao/auditoria-final-adsense/";
  const { records } = JSON.parse(fs.readFileSync(root + "newsletter-integridade-antes.json", "utf8"));
  const inventory = JSON.parse(fs.readFileSync(root + "newsletter-ctas-inventario.json", "utf8"));
  for (const row of records) {
    const entry = inventory.articles.find((r: { id: string }) => r.id === row.id);
    const expected = (entry?.blocks ?? []).reduce((html: string, block: string) => html.replace(block, ""), row.content);
    assert.equal(withoutInactiveNewsletterPromotions(row.content), expected, row.slug);
    assert.doesNotMatch(expected, /newsletter/i, row.slug);
  }
  const unrelated = '<div><h2>Conteúdo educativo</h2><p>Uma menção à newsletter não é um card.</p></div>';
  assert.equal(withoutInactiveNewsletterPromotions(unrelated), unrelated);
});
