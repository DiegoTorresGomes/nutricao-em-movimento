import { test } from "node:test";
import assert from "node:assert/strict";
import { approvedMarkdownToHtml, visibleHtml, buildLote2Package, applyApprovedLote2 } from "./apply-editorial-lote2";

test("technical adaptation preserves bold, safe links, ordered and unordered lists",()=>{
 const html=approvedMarkdownToHtml('## Título\n\nUm **aviso** e [artigo](https://www.nutricaoemovimento.com/pt/artigos/teste).\n\n- Primeiro\n- Segundo\n\n### Passos\n\n1. Fazer\n2. Rever');
 assert.match(html,/<strong>aviso<\/strong>/);assert.match(html,/<ul><li>Primeiro<\/li><li>Segundo/);assert.match(html,/<ol><li>Fazer<\/li><li>Rever/);
 assert.equal(visibleHtml(html),'Título Um aviso e artigo. Primeiro Segundo Passos Fazer Rever');
});
test("references separated by blank lines retain a single numbered list",()=>{
 const html=approvedMarkdownToHtml('## Referências\n\n1. Fonte A.\n\n2. Fonte B.');assert.equal((html.match(/<ol>/g)||[]).length,1);assert.equal((html.match(/<li>/g)||[]).length,2);
});
test("unapproved structures and unsafe links stop preparation",()=>{
 assert.throws(()=>approvedMarkdownToHtml('# H1 proibido'));assert.throws(()=>approvedMarkdownToHtml('## Título\n\n[ruim](javascript:bad)'));assert.throws(()=>approvedMarkdownToHtml('## Título\n\n<script>bad</script>'));
});
test("approved package matches every Markdown body and reference registry",()=>{
 const p=buildLote2Package();assert.equal(p.articles.length,6);assert.equal(p.articles.reduce((n:number,a:{references:unknown[]})=>n+a.references.length,0),22);assert.deepEqual(p.articles.map((a:{internalLinkCount:number})=>a.internalLinkCount),[2,3,3,3,3,3]);for(const a of p.articles){assert.deepEqual(a.contentBlocks,[]);assert.doesNotMatch(a.content,/<h1\b|localhost|127\.0\.0\.1/);assert.match(a.content,/Referências/);}
});

test("interruption refuses application before any database access",async()=>{
 const unreachable = new Proxy({}, {get(){throw Error("Database must not be accessed");}}) as Parameters<typeof applyApprovedLote2>[0];
 await assert.rejects(applyApprovedLote2(unreachable), /Application stopped by the user-defined compatibility rule/);
});
