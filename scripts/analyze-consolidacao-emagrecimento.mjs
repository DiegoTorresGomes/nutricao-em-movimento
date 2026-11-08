// Analysis only: Prisma findMany and public GET. No mutations or browser JavaScript.
import 'dotenv/config';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
const root = 'docs/editorial/consolidacao-emagrecimento';
const official = 'https://www.nutricaoemovimento.com';
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const decode = value => value.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase() === 'x' ? parseInt(n.slice(1), 16) : Number(n)));
const text = html => decode(html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')).trim();
const links = html => [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(m => ({ href: decode(m[1].match(/href\s*=\s*["']([^"']*)["']/i)?.[1] || ''), anchor: text(m[2]) }));
const slugs = ['emagrecimento-sustentavel-habitos-que-importam-mais-que-forca-de-vontade', 'emagrecimento-sustentavel-como-cuidar-do-corpo-com-equilibrio-nutricao-e-movimento'];
const db = new PrismaClient({adapter: new PrismaMariaDb({host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME, connectionLimit: 1})});
const get = async url => {
  try { const r = await fetch(url, {signal: AbortSignal.timeout(45000)}); return {url, finalUrl: r.url, status: r.status, headers: {robots: r.headers.get('x-robots-tag')}, html: await r.text()}; }
  catch (e) { return {url, error: e.message, html: ''}; }
};
await fs.mkdir(root, {recursive: true});
try {
  const select = {id:true,title:true,slug:true,description:true,subtitle:true,content:true,contentBlocks:true,publishedAt:true,editorialUpdatedAt:true,updatedAt:true,views:true,seoTitle:true,seoDescription:true,authorId:true,category:{select:{name:true,slug:true}}};
  const posts = await db.post.findMany({where:{status:'PUBLISHED'},select,orderBy:{publishedAt:'asc'}});
  const articles = slugs.map(slug => posts.find(p => p.slug === slug));
  if (articles.some(p => !p)) throw new Error('Exact two article identities not found');
  const live = [];
  for (let i = 0; i < posts.length; i += 3) {
    const batch = await Promise.all(posts.slice(i, i+3).map(async p => {
      const result = await get(`${official}/pt/artigos/${p.slug}`);
      const canonical = result.html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
      const schemas = [...result.html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(m => {try {return JSON.parse(m[1]);} catch {return null;}}).filter(Boolean);
      const allLinks = links(result.html);
      const normalized = p.content.replace(/(<a\b[^>]*\bhref\s*=\s*)(["'])(?:https?:)?\/\/(?:www\.)?nutricaoemovimento\.com(?=\/|\2)([^"']*)\2/gi, (_m, prefix, quote, path) => `${prefix}${quote}${path || '/'}${quote}`);
      return {id:p.id,title:p.title,slug:p.slug,url:result.url,status:result.status,error:result.error,canonical,bodyExact:result.html.includes(p.content),bodyMatchesAfterLinkNormalization:result.html.includes(normalized),bodyHash:hash(p.content),bodyLinks:links(p.content),related:links(result.html.slice(result.html.indexOf('Continue lendo'))).filter(a=>a.href.includes('/pt/artigos/')),incomingCandidates:allLinks.filter(a=>slugs.some(s=>a.href.includes(`/pt/artigos/${s}`))),...(slugs.includes(p.slug)?{html:result.html,schemas,publicTitle:text(result.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||''),publicDescription:decode(result.html.match(/<meta\b[^>]*name="description"[^>]*content="([^"]*)"/i)?.[1]||''),robots:result.headers?.robots,metaRobots:result.html.match(/<meta\b[^>]*name="robots"[^>]*content="([^"]*)"/i)?.[1]}:{})};
    }));
    live.push(...batch);
  }
  const surfaces = await Promise.all(['/sitemap.xml','/feed.xml','/robots.txt','/pt','/pt/artigos','/pt/autora/weverlyn-alves','/pt/artigos?categoria=emagrecimento-sustentavel'].map(async path => {
    const r = await get(official+path);
    return {path,status:r.status,error:r.error,mentions:slugs.map(slug=>({slug,present:r.html.includes(slug)})),links:links(r.html).filter(a=>slugs.some(s=>a.href.includes(`/pt/artigos/${s}`))),...(/xml|robots/.test(path)?{content:r.html}:{})};
  }));
  const historical = JSON.parse(await fs.readFile('docs/editorial/auditoria-artigos/dados.json','utf8'));
  const incomingBody = posts.flatMap(p=>links(p.content).filter(a=>slugs.some(s=>a.href.includes(`/pt/artigos/${s}`))).map(a=>({sourceTitle:p.title,sourceUrl:`${official}/pt/artigos/${p.slug}`,...a})));
  const final = await db.post.findMany({where:{id:{in:articles.map(p=>p.id)}},select,orderBy:{publishedAt:'asc'}});
  const evidence = {capturedAt:new Date().toISOString(),mode:'SELECT and HTTP GET only; no view counter or browser JS',totalPosts:posts.length,articles,live,surfaces,incomingBody,bodyInventory:posts.map(p=>({id:p.id,title:p.title,slug:p.slug,hash:hash(p.content),links:links(p.content)})),historicalMatch:articles.map(p=>({id:p.id,contentUnchangedSinceAudit:p.content===historical.articles.find(old=>old.id===p.id)?.content})),finalRead:final.map(p=>({id:p.id,identicalDuringAnalysis:JSON.stringify(p)===JSON.stringify(articles.find(a=>a.id===p.id))}))};
  await fs.writeFile(`${root}/evidencias.json`,JSON.stringify(evidence,null,2)+'\n');
  for (const [i,p] of articles.entries()) {
    await fs.writeFile(`${root}/artigo-${i===0?'a':'b'}-conteudo.html`,p.content);
    const old = historical.articles.find(a=>a.id===p.id);
    await fs.writeFile(`${root}/artigo-${i===0?'a':'b'}-leitura.txt`,old.contentText+'\n');
  }
  console.log(JSON.stringify({total:posts.length,identities:articles.map(p=>({id:p.id,title:p.title,views:p.views,publishedAt:p.publishedAt,editorialUpdatedAt:p.editorialUpdatedAt,updatedAt:p.updatedAt})),incomingBody,historicalMatch:evidence.historicalMatch,finalRead:evidence.finalRead,public:live.filter(p=>slugs.includes(p.slug)).map(p=>({url:p.url,status:p.status,canonical:p.canonical,bodyMatchesAfterLinkNormalization:p.bodyMatchesAfterLinkNormalization})),surfaces:surfaces.map(p=>({path:p.path,status:p.status,mentions:p.mentions,links:p.links.length}))},null,2));
} finally {await db.$disconnect();}
