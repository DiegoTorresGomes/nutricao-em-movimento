import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { articleBody } from "../src/lib/editor/article-body";

test("static previews retain the approved rendered bodies and do not record approval", () => {
  const root = "docs/editorial/validacao-cms/previas/";
  const manifest = JSON.parse(readFileSync(root + "manifesto.json", "utf8"));
  const prepared = JSON.parse(readFileSync("docs/editorial/revisao-lote-2/pacote-aplicacao.json", "utf8"));
  const saved = JSON.parse(readFileSync("docs/editorial/revisao-lote-2/antes-aplicacao.json", "utf8"));
  assert.equal(manifest.visualReview, "PENDING_HUMAN_REVIEW");
  assert.equal(manifest.databaseAccess, false);
  assert.equal(manifest.pages.length, 2);
  for (const page of manifest.pages) {
    const proposal = prepared.articles.find((a: { number: number }) => a.number === page.number);
    const article = saved.articles.find((a: { id: string }) => a.id === proposal.id);
    const html = readFileSync(root + page.file, "utf8");
    assert.ok(html.includes(articleBody(proposal.content, article.slug)));
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /CRN 24101524/);
    assert.match(html, /\/pt\/autora\/weverlyn-alves/);
    assert.doesNotMatch(html, /<form\b|fetch\(|sendBeacon|api\/posts|lastPreviewAt|Reviewed\s*=/);
  }
  const index = readFileSync(root + "index.html", "utf8");
  for (const width of [1440, 1023, 768, 375, 320]) assert.ok(index.includes(`data-width="${width}"`));
});

test("preview server serves fixtures and CSS, refuses writes and private project files", { timeout: 10000 }, async () => {
  const child = spawn(process.execPath, ["scripts/serve-editorial-preview.mjs"], { stdio: ["ignore", "pipe", "pipe"], windowsHide: true, env: { ...process.env, EDITORIAL_PREVIEW_PORT: "0" } });
  try {
    const [message] = await once(child.stdout, "data", { signal: AbortSignal.timeout(5000) });
    const address = String(message).match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
    assert.ok(address);
    const get = (path: string, method = "GET") => fetch(address + path, { method, signal: AbortSignal.timeout(2000) });
    for (const path of ["/", "/comer-por-emocao.html", "/alimentacao-consciente.html"]) {
      const response = await get(path);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
      await response.arrayBuffer();
    }
    const manifest = JSON.parse(readFileSync("docs/editorial/validacao-cms/previas/manifesto.json", "utf8"));
    const css = await get("/_next/static/css/" + manifest.cssFiles[0]);
    assert.equal(css.status, 200);
    await css.arrayBuffer();
    for (const path of ["/.env", "/prisma/schema.prisma", "/api/posts/test/view", "/docs/editorial/revisao-lote-2/antes-aplicacao.json", "/_next/static/%2e%2e%2f%2e%2e%2f.env"]) {
      const response = await get(path);
      assert.equal(response.status, 404, path);
      await response.arrayBuffer();
    }
    const post = await get("/", "POST");
    assert.equal(post.status, 405);
    await post.arrayBuffer();
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      const exited = once(child, "exit");
      child.kill();
      await exited;
    }
  }
});
