// Offline conversion only. The approved Markdown is immutable.
import fs from "node:fs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import path from "node:path";
import type { EditorBlock } from "../src/lib/editor/blocks";
import type { ScientificReference } from "../src/lib/editor/references";
import { renderBlocksToHtml } from "../src/lib/editor/render-blocks-to-html";
import { weightConsolidation } from "../src/lib/editorial-consolidation";

export const consolidationRoot = "docs/editorial/consolidacao-emagrecimento";
export const approvedSourceHash = "7b40fe3b3071ed312a761e7f0f3035a542ae99bae5e88514cfa5f1ba5b1e1c77";
export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export function buildConsolidation() {
  const source = fs.readFileSync(`${consolidationRoot}/versao-consolidada.md`, "utf8");
  assert.equal(sha256(source), approvedSourceHash, "Approved source changed; stop");
  const title = source.match(/^# (.+)$/m)![1];
  const description = source.match(/\*\*Excerpt sugerido:\*\* (.+)/)![1];
  const seoDescription = source.match(/\*\*Meta description sugerida:\*\* (.+)/)![1];
  const complete = source.split("<!-- BEGIN ARTICLE BODY -->")[1].split("<!-- END ARTICLE BODY -->")[0].trim();
  const [body, bibliography] = complete.split("\n## Referências\n");
  assert.ok(body && bibliography);
  const publications = ["Medical Clinics of North America. 102(1):183–197", "NIH/NIDDK. Revisado em maio", "Healthcare (Basel). 12(23):2488", "2ª edição, 1ª reimpressão. Brasília: Ministério da Saúde", "Geneva: WHO. ISBN 9789240015128", "JAMA Internal Medicine. 182(4):365–374", "NIH Publication No. 24-MH-4901. Revisado em"];
  const years = ["2018", "2023", "2024", "2014", "2020", "2022", "2024"];
  const references: ScientificReference[] = bibliography.trim().split("\n").map((line, i) => {
    const match = line.match(/^\d+\. (.+?)\. \*\*(.+?)\*\*\..+\]\((https:\/\/[^)]+)\)/);
    assert.ok(match, `Reference ${i + 1}`);
    assert.ok(line.includes(years[i]));
    const url = match[3];
    return { author: match[1], title: match[2], publication: publications[i], year: years[i], ...(url.startsWith("https://doi.org/") ? { doi: url.slice(16) } : { url }) };
  });
  assert.equal(references.length, 7);
  const blocks: EditorBlock[] = body.trim().split(/\n\s*\n/).map((part, i) => {
    const id = `consolidacao-peso-${i + 1}`;
    if (part.startsWith("### ")) return { id, type: "heading", data: { level: 3, text: part.slice(4) } };
    if (part.startsWith("## ")) return { id, type: "heading", data: { level: 2, text: part.slice(3) } };
    if (part.startsWith("- ")) return { id, type: "unorderedList", data: { items: part.split("\n").map(s => s.slice(2)) } };
    assert.ok(!part.includes("\n"), "Unexpected Markdown structure");
    return { id, type: "paragraph", data: { text: part, inlineEditorialLinks: true } };
  });
  const renderedBody = renderBlocksToHtml(blocks);
  const expectedText = body.replace(/^#{2,3} |^- /gm, "").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1").replace(/\s+/g, " ").trim();
  const actualText = renderedBody.replace(/<\/(?:p|h[23]|li)>/g, " ").replace(/<[^>]*>/g, "").replaceAll("&amp;", "&").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&quot;", '"').replaceAll("&#039;", "'").replace(/\s+/g, " ").trim();
  assert.ok(actualText === expectedText, "Conversion changed approved visible text; stop");
  const bodyLinks = [...renderedBody.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  assert.equal(bodyLinks.length, 5);
  assert.ok(bodyLinks.every(href => href.startsWith("/pt/") && !href.includes(weightConsolidation.sourceSlug)));
  assert.equal((renderedBody.match(/<h1\b/g) || []).length, 0);
  blocks.push({ id: "consolidacao-peso-references", type: "references", data: { title: "Referências", items: references } });
  const content = renderBlocksToHtml(blocks).trim();
  return { approvedSourceHash, title, description, seoDescription, content, contentBlocks: blocks, references, bodyLinks, targetId: weightConsolidation.targetId, targetSlug: weightConsolidation.targetSlug };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const result = buildConsolidation();
  if (process.argv.includes("--write")) {
    fs.writeFileSync(`${consolidationRoot}/pacote-aplicacao.json`, JSON.stringify(result, null, 2) + "\n");
    fs.writeFileSync(`${consolidationRoot}/previa-aprovada.html`, `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Prévia local</title><main><h1>${result.title}</h1>${result.content}</main></html>`);
  } else {
    assert.deepEqual(JSON.parse(fs.readFileSync(`${consolidationRoot}/pacote-aplicacao.json`, "utf8")), result);
  }
  console.log("Approved text preserved; seven structured references, four contextual links and contact CTA. No database access.");
}
