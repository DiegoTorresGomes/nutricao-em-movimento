// Read-only inventory. Does not call view-counter routes or execute browser JS.
// Usage: node scripts/audit-published-articles.mjs [--verify-live]
import 'dotenv/config';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
const root = 'docs/editorial/auditoria-artigos';
const official = 'https://www.nutricaoemovimento.com';
const db = new PrismaClient({adapter:new PrismaMariaDb({host:process.env.DB_HOST,port:Number(process.env.DB_PORT||3306),user:process.env.DB_USER,password:process.env.DB_PASSWORD,database:process.env.DB_NAME,connectionLimit:1})});
const decode = value => value.replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):Number(n))).replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const text = html => decode(html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,'').replace(/<\/(?:p|h[1-6]|li|div|section|blockquote|tr|ul|ol)>|<br\s*\/?>/gi,'\n').replace(/<[^>]*>/g,'')).replace(/[ \t]+/g,' ').replace(/\n\s*\n/g,'\n').trim();
const links = html => [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map(m => ({href:decode(m[1].match(/href\s*=\s*["']([^"']*)["']/i)?.[1]||''),text:text(m[2])}));
const headings = html => [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(m=>({level:Number(m[1]),text:text(m[2])}));
const attr = (html, name, value, result='content') => [...html.matchAll(/<(?:meta|link)\b[^>]*>/gi)].find(m=>new RegExp(`${name}=["']${value}["']`,'i').test(m[0]))?.[0].match(new RegExp(`${result}=["']([^"']*)["']`,'i'))?.[1] || null;
try {
  const posts = await db.post.findMany({where:{status:'PUBLISHED'},orderBy:[{publishedAt:'asc'},{id:'asc'}],select:{id:true,title:true,slug:true,subtitle:true,description:true,content:true,contentBlocks:true,status:true,language:true,publishedAt:true,updatedAt:true,createdAt:true,views:true,seoTitle:true,seoDescription:true,focusKeyword:true,coverImage:true,coverImageUrl:true,coverImageAlt:true,readTime:true,authorId:true,author:{select:{name:true}},category:{select:{id:true,name:true,slug:true}}}});
  const articles = posts.map((p,i)=>({...p,number:i+1,url:`${official}/pt/artigos/${p.slug}`,contentText:text(p.content),headings:headings(p.content),bodyLinks:links(p.content),bodyImages:[...p.content.matchAll(/<img\b[^>]*>/gi)].map(m=>({src:m[0].match(/src=["']([^"']*)["']/i)?.[1],alt:m[0].match(/alt=["']([^"']*)["']/i)?.[1]??null})),contentHash:crypto.createHash('sha256').update(p.content).digest('hex')}));
  if(process.argv.includes('--verify-live')) {
    for(let i=0;i<articles.length;i+=3) await Promise.all(articles.slice(i,i+3).map(async p=>{
      try {
        const response=await fetch(p.url,{signal:AbortSignal.timeout(45000)}); const html=await response.text();
        const schemas=[...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(m=>{try{return JSON.parse(m[1]);}catch{return null;}}).filter(Boolean);
        const body=html.match(/<div\b[^>]*class="article-content[^\"]*"[^>]*>([\s\S]*?)<\/div>/i)?.[1];
        p.live={checkedAt:new Date().toISOString(),status:response.status,url:response.url,bodyMatchesDatabase:html.includes(p.content),title:text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||''),h1:headings(html).filter(h=>h.level===1),canonical:attr(html,'rel','canonical','href'),description:decode(attr(html,'name','description')||''),schemas,authorProfileLink:html.includes('/pt/autora/weverlyn-alves'),crn:html.includes('24101524'),authorBlock:/Sobre a autora|Autora/.test(html),disclaimer:/caráter educativo|carácter educativo|não substituem avaliação|não substitui avaliação/.test(html),relatedLinks:links(html.slice(html.indexOf('Continue lendo'))).filter(a=>a.href.includes('/pt/artigos/')),renderedBodyHash:body?crypto.createHash('sha256').update(body).digest('hex'):null};
      } catch(error){p.live={error:error.message};}
      console.log(`${p.number}: ${p.live.status||p.live.error} ${p.slug}`);
    }));
  }
  await fs.mkdir(root,{recursive:true});
  await fs.writeFile(`${root}/dados.json`,JSON.stringify({capturedAt:new Date().toISOString(),source:'Prisma/MariaDB configured by the project; SELECT only; all PUBLISHED posts',total:articles.length,articles},null,2)+'\n');
  console.log(`Inventário: ${articles.length} artigos; ${articles.reduce((s,p)=>s+p.contentText.length,0)} caracteres de texto integral.`);
} finally { await db.$disconnect(); }
