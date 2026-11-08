import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";
import { middleware } from "../src/middleware";
import { consolidationDescription, consolidationSourcePath, consolidationTargetUrl } from "../src/lib/editorial-consolidation";
import { renderInlineEditorialLinks, renderBlocksToHtml } from "../src/lib/editor/render-blocks-to-html";
import { buildConsolidation } from "./build-consolidacao-emagrecimento";

test("A redirects directly with 301 on both hosts, preserving query without open redirect", () => {
  for (const host of ["nutricaoemovimento.com", "www.nutricaoemovimento.com", "127.0.0.1:33118"]) {
    const response = middleware(new NextRequest(`https://${host}${consolidationSourcePath}?utm_source=teste&next=https://example.org`));
    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), `${consolidationTargetUrl}?utm_source=teste&next=https://example.org`);
    assert.equal(response.body, null);
  }
  const ordinary = middleware(new NextRequest("https://nutricaoemovimento.com/pt?origem=teste", { headers: { host: "nutricaoemovimento.com" } }));
  assert.equal(ordinary.status, 308);
  assert.equal(ordinary.headers.get("location"), "https://www.nutricaoemovimento.com/pt?origem=teste");
  assert.equal(middleware(new NextRequest(consolidationTargetUrl)).status, 200);
});

test("inline links escape HTML and cannot introduce an external host or script", () => {
  assert.equal(renderInlineEditorialLinks('<b>[leia](/pt/contato)</b>'), '&lt;b&gt;<a href="/pt/contato">leia</a>&lt;/b&gt;');
  for (const input of ["[x](//evil.example)", "[x](javascript:alert(1))", "[x](/\\evil.example)"]) assert.ok(!renderInlineEditorialLinks(input).includes("<a "));
  assert.equal(renderBlocksToHtml([{id:"plain",type:"paragraph",data:{text:"[literal](/pt/contato)"}}]), "<p>[literal](/pt/contato)</p>");
});

test("conversion retains approved prose and metadata scope excludes other posts", () => {
  const pack = buildConsolidation();
  assert.equal(pack.references.length, 7);
  assert.equal(pack.references[0].doi, "10.1016/j.mcna.2017.08.012");
  assert.equal(pack.bodyLinks.length, 5);
  assert.ok(pack.content.startsWith("<p>Começar a cuidar"));
  assert.equal(consolidationDescription({slug:pack.targetSlug,description:pack.description,seoDescription:pack.seoDescription}), pack.seoDescription);
  assert.equal(consolidationDescription({slug:"other",description:"excerpt",seoDescription:"stored SEO"}), "excerpt");
});
