// Static review fixtures only. Reads approved local evidence and build CSS;
// never imports Prisma, actions, analytics or the view-counting component.
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { nutritionistConfig as author } from "../src/config/nutritionist";
import { articleBody } from "../src/lib/editor/article-body";

type Saved = {
  id: string; title: string; slug: string; description: string;
  category?: { name: string }; coverImage: string | null; coverImageAlt: string | null;
  readTime: string | null; publishedAt: string | null;
  relatedObserved?: { href: string; anchor: string }[];
};
type Proposal = { id: string; number: number; title: string; description: string; content: string; contentSha256: string };
const base = "docs/editorial/revisao-lote-2/";
const snapshot = JSON.parse(readFileSync(base + "antes-aplicacao.json", "utf8")) as {
  articles: Saved[]; outsideBatch: Saved[]; approvedFilesSha256: Record<string, string>;
};
const prepared = JSON.parse(readFileSync(base + "pacote-aplicacao.json", "utf8")) as { articles: Proposal[] };
const sha = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
for (const [file, hash] of Object.entries(snapshot.approvedFilesSha256)) {
  assert.equal(sha(readFileSync("docs/editorial/lote-2/" + file)), hash, file);
}
const cssFiles = readdirSync(".next/static/css").filter(file => file.endsWith(".css"));
assert.ok(cssFiles.length, "Execute npm run build antes de gerar as prévias.");
const css = cssFiles.map(file => readFileSync(".next/static/css/" + file, "utf8")).join("\n");
const fontClasses = Array.from(css.matchAll(/\.([\w_]+)\{--font-(?:lato|playfair):/g), m => m[1]).join(" ");
assert.ok(fontClasses, "Variáveis de fonte do build não encontradas.");
const styleLinks = cssFiles.map(file => `<link rel="stylesheet" href="/_next/static/css/${file}">`).join("");
const esc = (value: unknown) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const all = [...snapshot.articles, ...snapshot.outsideBatch];
const folder = "docs/editorial/validacao-cms/previas";
mkdirSync(folder, { recursive: true });
const pages = [];
for (const proposal of prepared.articles.filter(a => [1, 2].includes(a.number))) {
  const saved = snapshot.articles.find(a => a.id === proposal.id);
  assert.ok(saved);
  assert.ok(saved.category);
  const categoryName = saved.category.name;
  assert.equal(sha(proposal.content), proposal.contentSha256);
  const related = (saved.relatedObserved || []).map(link => all.find(a => link.href.endsWith("/" + a.slug))).filter((a): a is Saved => Boolean(a));
  // Mirror the public template's classes. Snapshot cards are examples of the
  // existing automatic selection, not a promise of its future live ordering.
  const cards = related.map(a => `<a href="/pt/artigos/${esc(a.slug)}" class="group flex min-h-[460px] min-w-[300px] max-w-[340px] flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:min-w-[340px]">
    <div class="h-48 shrink-0 overflow-hidden bg-[#E9DCC9]">${a.coverImage ? `<img src="${esc(a.coverImage)}" alt="${esc(a.title)}" class="h-full w-full object-cover">` : ""}</div>
    <div class="relative z-10 flex flex-1 flex-col bg-white p-6"><p class="line-clamp-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#D67A5A]">${esc(a.category?.name || categoryName)}</p><h3 class="mt-4 line-clamp-3 text-2xl font-semibold leading-tight">${esc(a.title)}</h3><p class="mt-4 line-clamp-4 flex-1 text-sm leading-7 text-neutral-700">${esc(a.description)}</p><span class="mt-5 inline-flex text-sm font-bold text-[#556B2F]">Ler artigo</span></div></a>`).join("");
  const file = proposal.number === 2 ? "comer-por-emocao.html" : "alimentacao-consciente.html";
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>PRÉVIA — ${esc(proposal.title)}</title>${styleLinks}</head><body class="${fontClasses}">
  <div style="padding:12px;background:#fff3cd;font:14px/1.5 Arial,sans-serif">PRÉVIA LOCAL — sem publicação, contagem de views ou gravação de revisão. Miolo do artigo, autoria e cards do snapshot; não inclui cabeçalho/rodapé do site, newsletter ou consentimento. Links de conteúdo abrem o site público. Imagens da capa/cards usam a rede.</div>
  <article><header class="bg-[#FAF8F4] px-4 py-16 sm:px-6 md:py-24"><div class="mx-auto max-w-4xl">
  <p class="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">${esc(categoryName)}</p>
  <h1 class="mt-5 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">${esc(proposal.title)}</h1>
  <p class="mt-6 text-lg leading-8 text-neutral-700">${esc(proposal.description)}</p>
  <div class="mt-7 flex flex-wrap gap-3 text-sm text-neutral-500"><a href="${author.authorPath}" class="font-bold text-[#465a28] underline underline-offset-4">Por ${esc(author.displayName)} · ${esc(author.credential)}</a><span>${saved.publishedAt ? esc(new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(saved.publishedAt))) : "Sem data"}</span><span>•</span><span>${esc(saved.readTime)}</span></div></div></header>
  <section class="px-4 py-10 sm:px-6 md:py-14"><div class="mx-auto max-w-5xl"><div class="overflow-hidden rounded-[2rem] bg-[#FAF8F4]">${saved.coverImage ? `<img src="${esc(saved.coverImage)}" alt="${esc(saved.coverImageAlt || saved.title)}" class="h-auto w-full object-contain">` : ""}</div></div></section>
  <section class="px-4 py-8 sm:px-6 md:py-14"><div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_320px]"><div class="min-w-0 max-w-3xl"><div class="article-content space-y-6 text-base leading-8 text-neutral-800 sm:text-lg sm:leading-9">${articleBody(proposal.content, saved.slug)}</div></div>
  <aside class="h-fit rounded-[2rem] bg-[#111111] p-6 text-white lg:sticky lg:top-28"><p class="text-xs font-bold uppercase tracking-[0.3em] text-[#E9DCC9]">Sobre a autora</p><div class="mt-5 flex items-center gap-4"><div class="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#E9DCC9]"><img src="${esc(author.photoUrl)}" alt="${esc(author.photoAlt)}" class="h-full w-full object-cover"></div><div><h3 class="text-xl font-semibold leading-tight"><a href="${author.authorPath}" class="underline underline-offset-4">${esc(author.displayName)}</a></h3><p class="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/45">${esc(author.crn)}</p></div></div><p class="mt-5 text-sm leading-7 text-white/70">${esc(author.bio)}</p><div class="mt-6"><a href="${esc(author.instagramUrl)}" class="text-sm underline">Instagram</a></div></aside></div></section>
  <section class="px-4 pb-16 sm:px-6 md:pb-20"><div class="mx-auto max-w-4xl rounded-[2rem] border border-black/5 bg-[#FAF8F4] p-6 text-sm leading-7 text-neutral-700"><strong>Aviso importante:</strong> as informações deste artigo têm caráter educativo e não substituem avaliação individualizada com nutricionista.</div></section></article>
  <section class="px-4 pb-16 sm:px-6 md:pb-20"><div class="mx-auto max-w-6xl"><h2 class="mt-4 text-2xl font-semibold leading-tight sm:text-3xl">Artigos relacionados — snapshot</h2><div class="mt-8 flex flex-wrap justify-center gap-6 sm:justify-start">${cards}</div></div></section>
  <script>document.addEventListener('click', function(event) { const a=event.target.closest('a'); if(!a)return; event.preventDefault(); const target=new URL(a.getAttribute('href'),'https://www.nutricaoemovimento.com'); if(['http:','https:','mailto:','tel:'].includes(target.protocol))window.open(target.href,'_blank','noopener,noreferrer'); });</script>
  </body></html>`;
  writeFileSync(folder + "/" + file, html);
  pages.push({ number: proposal.number, file, contentSha256: proposal.contentSha256, containsTables: /<table\b/i.test(proposal.content), relatedCards: related.length });
}
writeFileSync(folder + "/manifesto.json", JSON.stringify({ generatedAt: new Date().toISOString(), pages, cssFiles, templateSha256: sha(readFileSync("src/app/pt/artigos/[slug]/page.tsx")), visualReview: "PENDING_HUMAN_REVIEW", databaseAccess: false }, null, 2) + "\n");
writeFileSync(folder + "/index.html", `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Revisão manual — Lote 2</title><style>body{margin:0;font:16px/1.5 Arial;background:#eee;color:#111;overflow:auto}header{padding:16px;background:white}button,select{font:inherit;padding:8px;margin:4px}iframe{display:block;border:1px solid #aaa;height:1000px;max-width:none;margin:16px}p{max-width:900px}</style></head><body><header><h1>Revisão manual — Lote 2</h1><p>Esta ferramenta não salva aprovação nem altera artigos. Confira as duas propostas nas cinco larguras. Role o conteúdo da prévia até as referências, autora e cards. Em 320 px, observe especialmente a largura mínima dos cards.</p><label>Artigo <select id="article">${pages.map(p => `<option value="${p.file}">${p.number === 2 ? "Comer por emoção" : "Alimentação consciente"}</option>`).join("")}</select></label><div>${[1440, 1023, 768, 375, 320].map(w => `<button type="button" data-width="${w}">${w} px</button>`).join("")}</div><p id="size">375 px — largura do viewport da prévia</p><p>Diagnóstico de overflow: no DevTools do frame, compare document.documentElement.scrollWidth e innerWidth. O CSS do projeto oculta overflow horizontal; por isso, confira também cortes visuais. Não há revisão humana registrada.</p></header><iframe title="Proposta editorial para revisão" id="preview" src="${pages[0].file}" style="width:375px"></iframe><script>const frame=document.getElementById('preview');document.getElementById('article').addEventListener('change',e=>frame.src=e.target.value);document.querySelectorAll('[data-width]').forEach(button=>button.addEventListener('click',()=>{frame.style.width=button.dataset.width+'px';document.getElementById('size').textContent=button.dataset.width+' px — largura do viewport da prévia';}));</script></body></html>`);
console.log("Prévias geradas. Execute node scripts/serve-editorial-preview.mjs e abra http://127.0.0.1:4182/");
