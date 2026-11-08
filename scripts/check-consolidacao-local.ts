import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import mariadb from "mariadb";
import { SignJWT } from "jose";
import { Prisma } from "@prisma/client";
import { requireDisposable, consolidate } from "./apply-consolidacao-emagrecimento";
import { consolidationRoot, buildConsolidation } from "./build-consolidacao-emagrecimento";
import { weightConsolidation as spec, consolidationSourcePath, consolidationTargetPath, consolidationTargetUrl } from "../src/lib/editorial-consolidation";

async function main() {
  requireDisposable();
  const mode = process.argv[2];
  if (mode === "prepare") {
    const connection = await mariadb.createConnection({host:"127.0.0.1",port:33317,user:process.env.DB_USER,password:process.env.DB_PASSWORD});
    try { await connection.query("CREATE DATABASE IF NOT EXISTS nutricao_consolidacao_disposable CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"); }
    finally { await connection.end(); }
    console.log("Prepared separate disposable consolidation database.");
    return;
  }
  const { prisma } = await import("../src/lib/prisma");
  try {
    if (mode === "seed") {
      assert.equal(await prisma.post.count(), 0, "Local dataset already exists; do not reset it");
      const corpus = JSON.parse(fs.readFileSync("docs/editorial/auditoria-artigos/dados.json", "utf8")).articles;
      const captured = JSON.parse(fs.readFileSync(`${consolidationRoot}/antes-aplicacao.json`, "utf8")).articles;
      const model = Prisma.dmmf.datamodel.models.find(m => m.name === "Post")!;
      for (const article of corpus) {
        await prisma.category.upsert({ where: {id:article.category.id}, create:article.category, update:{} });
        await prisma.user.upsert({ where:{id:article.authorId},create:{id:article.authorId,name:"Administrador local de teste",email:`${article.authorId}@example.invalid`,passwordHash:"not-a-login-password"},update:{} });
        const original = captured.find((p: {id:string}) => p.id === article.id) || article;
        const data: Record<string, unknown> = {};
        for (const field of model.fields) if (["scalar","enum"].includes(field.kind) && original[field.name] !== undefined && !(field.name === "contentBlocks" && original[field.name] === null)) data[field.name] = field.type === "DateTime" && original[field.name] ? new Date(original[field.name]) : original[field.name];
        data.categoryId = original.categoryId || article.category.id;
        await prisma.post.create({data:data as Prisma.PostUncheckedCreateInput});
      }
      console.log("Seeded 31 public article copies and synthetic local account; existing local fixtures untouched.");
      return;
    }
    assert.ok(mode === "run" || mode === "verify" || mode === "production");
    await new Promise<void>((resolve,reject)=>{const probe=createServer();probe.once("error",reject);probe.listen({host:"127.0.0.1",port:33118,exclusive:true},()=>probe.close(error=>error?reject(error):resolve()));});
    const logRoot=path.join(os.tmpdir(),"nutricao-editorial-mariadb-11.4.13");
    const log=fs.openSync(path.join(logRoot,"consolidacao-next.log"),"w");
    const child=spawn(process.execPath, mode === "production" ? ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "33118"] : ["scripts/run-editorial-cms.mjs"],{env:process.env,stdio:["ignore",log,log],windowsHide:true});
    const base="http://127.0.0.1:33118";
    const token=await new SignJWT({userId:spec.targetId,email:"local@example.invalid",role:"ADMIN"}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("30m").sign(new TextEncoder().encode(process.env.AUTH_SECRET!));
    const request=(route:string,init:RequestInit={})=>fetch(base+route,{...init,redirect:"manual",headers:{Cookie:`admin_session=${token}`,Origin:base,...init.headers},signal:AbortSignal.timeout(120000)});
    const get=async(route:string)=>{const r=await request(route);assert.equal(r.status,200,route);return r.text();};
    try {
      for(let i=0;i<90;i++){try{if((await request("/login")).status===200)break;}catch{/* startup */}assert.equal(child.exitCode,null);await new Promise(resolve=>setTimeout(resolve,1000));}
      const initial=await prisma.post.findMany({orderBy:{id:"asc"}});
      const originalA=initial.find(p=>p.id===spec.sourceId)!;
      const originalB=initial.find(p=>p.id===spec.targetId)!;
      const beforeHtml=await get(consolidationTargetPath);
      if (mode === "run") assert.ok(beforeHtml.includes(spec.sourceSlug),"Warm cache with old automatic card");
      await get("/pt/artigos"); await get("/sitemap.xml"); await get("/feed.xml"); await get("/pt/autora/weverlyn-alves");
      const result=await consolidate(prisma,true);
      assert.equal(result.state,mode === "run" ? "APPLIED_LOCAL_ONLY" : "ALREADY_APPLIED");
      const pack=buildConsolidation();
      const edited=await prisma.post.findUniqueOrThrow({where:{id:spec.targetId}});
      // Exercise the real editor's no-change save and cache invalidation using
      // a token valid only for this disposable local process.
      const editPath=`/administracao/artigos/${spec.targetId}/editar`;
      const editor=await get(editPath);
      const form=new FormData();
      const decode=(value:string)=>value.replaceAll("&quot;",'"').replaceAll("&#x27;","'").replaceAll("&#39;","'").replaceAll("&amp;","&");
      for(const input of editor.matchAll(/<input\b[^>]*>/g)){const name=input[0].match(/name="([^"]*)"/)?.[1];if(name?.startsWith("$ACTION_"))form.set(decode(name),decode(input[0].match(/value="([^"]*)"/)?.[1]||""));}
      assert.ok([...form.keys()].some(k=>k.startsWith("$ACTION_")));
      const fields={title:edited.title,description:edited.description,content:edited.content,contentBlocks:JSON.stringify(edited.contentBlocks),categoryId:edited.categoryId,status:edited.status,coverImage:edited.coverImage||"",coverImageAlt:edited.coverImageAlt||"",seoTitle:edited.seoTitle||"",seoDescription:edited.seoDescription||"",focusKeyword:edited.focusKeyword||"",readTime:edited.readTime||"",scheduledAt:edited.scheduledAt?.toISOString()||""};
      for(const [key,value]of Object.entries(fields))form.set(key,value);
      for(const key of ["desktopReviewed","tabletReviewed","mobileReviewed","isArticleOfWeek"] as const)if(edited[key])form.set(key,"on");
      const saved=await request(editPath,{method:"POST",body:form});
      assert.equal(saved.status,303,(await saved.text()).slice(0,250));
      const b=await prisma.post.findUniqueOrThrow({where:{id:spec.targetId}});
      assert.equal(b.editorialUpdatedAt!.toISOString(),edited.editorialUpdatedAt!.toISOString(),"No-change editor save must preserve revision");
      assert.equal(b.content,pack.content);
      const a=await prisma.post.findUniqueOrThrow({where:{id:spec.sourceId}});
      assert.equal(a.status,"ARCHIVED");assert.equal(a.scheduledAt!.toISOString(),originalA.scheduledAt!.toISOString());assert.equal(a.editorialUpdatedAt,originalA.editorialUpdatedAt);
      assert.equal(b.publishedAt!.toISOString(),originalB.publishedAt!.toISOString());assert.equal(b.views,originalB.views);assert.equal(a.views,originalA.views);
      const routes=["/pt","/pt/artigos","/pt/artigos?categoria=emagrecimento-sustentavel","/pt/autora/weverlyn-alves","/sitemap.xml","/feed.xml",consolidationTargetPath,...initial.filter(p=>p.categoryId===a.categoryId&&p.id!==a.id&&p.id!==b.id).map(p=>`/pt/artigos/${p.slug}`)];
      const publicChecks=[];
      for(const route of routes){const html=await get(route);assert.ok(!html.includes(spec.sourceSlug),`${route} still contains A`);if(["/sitemap.xml","/feed.xml","/pt/artigos"].includes(route))assert.ok(html.includes(spec.targetSlug));publicChecks.push({route,status:200,sourceAbsent:true});}
      const html=await get(consolidationTargetPath);
      assert.ok(html.includes(pack.content));assert.equal((html.match(/<h1\b/g)||[]).length,1);
      assert.ok(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(html));
      assert.ok(!(await get("/robots.txt")).includes("Disallow: /pt"));
      const image=await fetch(b.coverImage!,{signal:AbortSignal.timeout(30000)});
      assert.equal(image.status,200);assert.ok(image.headers.get("content-type")?.startsWith("image/"));await image.body?.cancel();
      assert.ok(html.includes(`name="description" content="${pack.seoDescription}"`));assert.ok(html.includes(pack.description));
      const schemas=[...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
      const schema=schemas.find(p=>p["@type"]==="BlogPosting");
      assert.equal(schema.datePublished,b.publishedAt!.toISOString());assert.equal(schema.dateModified,b.editorialUpdatedAt!.toISOString());assert.equal(schema.author.name,"Weverlyn da Cruz Alves Torres");assert.equal(schema.author.url,spec.origin+"/pt/autora/weverlyn-alves");assert.equal(schema.mainEntityOfPage["@id"],consolidationTargetUrl);assert.equal(schema.headline,b.title);
      const sitemap=await get("/sitemap.xml");assert.ok(sitemap.includes(`<lastmod>${b.editorialUpdatedAt!.toISOString()}</lastmod>`));
      const redirects=[];
      for(const host of ["nutricaoemovimento.com","www.nutricaoemovimento.com"]){const response=await request(consolidationSourcePath+"?utm_source=teste",{headers:{"x-forwarded-host":host}});assert.equal(response.status,301);assert.equal(response.headers.get("location"),consolidationTargetUrl+"?utm_source=teste");const body=await response.text();assert.ok(!body.includes("BlogPosting"));redirects.push({host,status:301,location:response.headers.get("location")});}
      await get("/administracao");await get(editPath);
      assert.equal((await consolidate(prisma,true)).writes,0,"Idempotent rerun");
      const all=await prisma.post.findMany({orderBy:{id:"asc"}});
      assert.deepEqual(all.filter(p=>![a.id,b.id].includes(p.id)),initial.filter(p=>![a.id,b.id].includes(p.id)));
      fs.writeFileSync(`${consolidationRoot}/${mode === "production" ? "validacao-build-local" : "validacao-local"}.json`,JSON.stringify({checkedAt:new Date().toISOString(),mode,localOnly:true,connection:"127.0.0.1:33317/nutricao_consolidacao_disposable",publicChecks,redirects,jsonLd:schema,image:{status:200,url:b.coverImage,mime:image.headers.get("content-type")},indexable:true,admin:200,editor:200,realEditorNoChangeSave:303,originalPublicationPreserved:true,viewsPreserved:true,archivedSchedulePreserved:true,other29Unchanged:true,sourceArchived:true,sevenStructuredReferences:true,editorialRevisionPreservedOnResave:true,warmedCachesInvalidated:true,idempotentRerunWrites:0},null,2)+"\n");
      console.log("Local integration passed: 301, approved B, archive, original dates/views, seven references, real CMS save, refreshed caches and 29 unchanged articles.");
    } finally {
      if (child.exitCode === null) {
        child.kill("SIGTERM");
        await Promise.race([new Promise<void>(resolve => child.once("exit", () => resolve())), new Promise<void>(resolve => setTimeout(resolve, 10000))]);
        assert.ok(child.exitCode !== null || child.signalCode !== null, `Local server ${child.pid} did not terminate`);
      }
      fs.closeSync(log);
    }
  } finally {await prisma.$disconnect();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
