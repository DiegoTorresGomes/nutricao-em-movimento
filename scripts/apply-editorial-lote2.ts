// Applies only the explicitly approved six-record package. Default mode is offline preparation.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import type { PrismaClient, Prisma } from "@prisma/client";
import { articleBody } from "../src/lib/editor/article-body";
import { hasEditorialChanges } from "../src/lib/editorial-dates";
import { validatePostBeforePublish } from "../src/lib/editor/validate-post";
import { assertBaselineCompatible } from "./editorial-lote2-guards";

export const revisionRoot = "docs/editorial/revisao-lote-2";
const proposalRoot = "docs/editorial/lote-2";
export const sha256 = (value: string | Buffer) => createHash("sha256").update(value).digest("hex");
const read = (file: string) => JSON.parse(fs.readFileSync(file, "utf8"));
export function saveRevision(name: string, value: unknown, exclusive = false) {
  fs.mkdirSync(revisionRoot, { recursive: true });
  fs.writeFileSync(path.join(revisionRoot, name), JSON.stringify(value, null, 2) + "\n", { flag: exclusive ? "wx" : "w" });
}
function escape(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function inline(value: string) {
  const pattern = /\*\*([^*\n]+)\*\*|\[([^\]\n]+)\]\(([^\s)]+)\)/g;
  let result = "", offset = 0;
  for (const match of value.matchAll(pattern)) {
    result += escape(value.slice(offset, match.index));
    if (match[1] !== undefined) result += "<strong>" + escape(match[1]) + "</strong>";
    else {
      const url = new URL(match[3]);
      assert.ok(["https:", "tel:"].includes(url.protocol) && !url.username && !url.password, "Unexpected approved URL");
      result += '<a href="' + escape(url.href) + '"' + (url.protocol === "https:" && url.hostname !== "www.nutricaoemovimento.com" ? ' target="_blank" rel="noopener noreferrer"' : "") + '>' + escape(match[2]) + '</a>';
    }
    offset = match.index! + match[0].length;
  }
  return result + escape(value.slice(offset));
}
/** Only the Markdown constructs actually present in the approved package. Fail closed on new constructs. */
export function approvedMarkdownToHtml(markdown: string) {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const html: string[] = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    const heading = line.match(/^(#{2,3}) (.+)$/);
    if (heading) { html.push('<h' + heading[1].length + '>' + inline(heading[2]) + '</h' + heading[1].length + '>'); i++; continue; }
    assert.ok(!/^(# |>|\||```)|<\/?[a-z]/i.test(line), "Unsupported structure in approved body");
    const list = line.match(/^(- |(\d+)\. )(.+)$/);
    if (list) {
      const ordered = list[2] !== undefined, tag = ordered ? "ol" : "ul";
      const items: string[] = []; let expected = ordered ? Number(list[2]) : 0;
      while (i < lines.length) {
        if (!lines[i].trim()) {
          let next = i + 1; while (next < lines.length && !lines[next].trim()) next++;
          if ((ordered ? /^\d+\. / : /^- /).test(lines[next]?.trim() || "")) { i = next; continue; }
          break;
        }
        const item = lines[i].trim().match(ordered ? /^(\d+)\. (.+)$/ : /^(-) (.+)$/);
        if (!item) break;
        if (ordered) assert.equal(Number(item[1]), expected++, "Ordered-list numbering changed");
        items.push("<li>" + inline(item[2]) + "</li>"); i++;
      }
      html.push('<' + tag + (ordered && Number(list[2]) !== 1 ? ' start="' + list[2] + '"' : '') + '>' + items.join("") + '</' + tag + '>');
      continue;
    }
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim() && !/^(#{2,3} |[-] |\d+\. )/.test(lines[i].trim())) { paragraph.push(lines[i].trim()); i++; }
    html.push("<p>" + inline(paragraph.join(" ")) + "</p>");
  }
  return html.join("\n\n");
}
export function visibleHtml(html: string) {
  return html.replace(/<\/(?:p|h[1-6]|li|ol|ul|section)>/g, "\n").replace(/<[^>]*>/g, "").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&").replace(/\s+/g, " ").trim();
}
function visibleMarkdown(markdown: string) {
  return markdown.replace(/\[([^\]\n]+)\]\([^\s)]+\)/g, "$1").replaceAll("**", "").replace(/^(?:#{2,3} |[-] |\d+\. )/gm, "").replace(/\s+/g, " ").trim();
}
export function buildLote2Package() {
  const authorization = read(revisionRoot + "/autorizacao-aplicacao.json");
  for (const [name, digest] of Object.entries(authorization.approvedFilesSha256)) assert.equal(sha256(fs.readFileSync(proposalRoot + "/" + name)), digest, "Approved file changed: " + name);
  const proposals = read(proposalRoot + "/propostas.json");
  assert.deepEqual(proposals.articles.map((a: {number:number}) => a.number), [30,22,18,9,2,1]);
  const sourceRegistry = read(proposalRoot + "/fontes.json").sources;
  const articles = proposals.articles.map((a: {number:number;file:string;recordId:string;body:string;sourceKeys:string[];proposedReferences:Record<string,unknown>[];proposedTitle:string;excerpt:string;metaTitle:string;metaDescription:string;internalNumbers:number[];relatedNumbers:number[]}) => {
    const document = fs.readFileSync(proposalRoot + "/" + a.file, "utf8");
    const markdown = document.split("<!-- BEGIN ARTICLE BODY -->")[1]?.split("<!-- END ARTICLE BODY -->")[0]?.trim();
    assert.ok(markdown && markdown.startsWith(a.body.trim() + "\n\n## Referências"));
    assert.ok(!/^# /m.test(markdown));
    a.sourceKeys.forEach((key, i) => assert.deepEqual(a.proposedReferences[i], { key, ...sourceRegistry[key] }));
    const references = a.sourceKeys.map(key => sourceRegistry[key]);
    const content = articleBody(approvedMarkdownToHtml(markdown));
    assert.equal(visibleHtml(content), visibleMarkdown(markdown), "Any visible text change is forbidden");
    assert.match(content, /^<h2>/); assert.doesNotMatch(content, /<h1\b|localhost|127\.0\.0\.1/);
    assert.equal(articleBody(content), content);
    const sourceLinks = [...markdown.matchAll(/\[[^\]\n]+\]\(([^\s)]+)\)/g)].map(m=>new URL(m[1]).href.replace(/^https:\/\/www\.nutricaoemovimento\.com/, ""));
    const renderedLinks = [...content.matchAll(/href="([^"]+)"/g)].map(m=>m[1].replaceAll("&amp;", "&"));
    assert.deepEqual(renderedLinks, sourceLinks, "Approved links/ordering changed");
    return { number:a.number,id:a.recordId,markdownFile:a.file,approvedMarkdownSha256:sha256(markdown),contentSha256:sha256(content),content,contentBlocks:[],title:a.proposedTitle,description:a.excerpt,seoTitle:a.metaTitle,seoDescription:a.metaDescription,references,sourceKeys:a.sourceKeys,internalLinkCount:[...content.matchAll(/href="\/pt\/artigos\//g)].length,relatedException:"Automatic cards retained; approved suggestions not implemented as a new architecture" };
  });
  assert.equal(articles.reduce((n:number,a:{references:unknown[]})=>n+a.references.length,0),22);
  assert.equal(new Set(articles.flatMap((a:{sourceKeys:string[]})=>a.sourceKeys)).size,19);
  assert.equal(new Set(articles.flatMap((a:{references:{doi?:string}[]})=>a.references.map(r=>r.doi).filter(Boolean))).size,12);
  assert.deepEqual(articles.map((a:{id:string})=>a.id),authorization.allowedIds);
  return { approvedPackageSha256:authorization.approvedPackageSha256,technicalAdaptation:"Existing CMS legacy HTML mode preserves bold, ordered lists, DOI/source links and approved tel link. Empty contentBlocks prevents stale block content; no application code changed.",articles };
}

export async function applyApprovedLote2(prisma: PrismaClient) {
  assert.ok(process.argv.includes("--resume-approved"), "Application stopped by the user-defined compatibility rule; explicit resumption required.");
  const resume = read(revisionRoot + "/autorizacao-retomada-final.json");
  assert.equal(resume.allowMonotonicViews, true);
  assert.equal(resume.compatibilityResolved, true);
  assert.deepEqual(resume.humanVisualApprovalNumbers, [2,1]);
  const pack = buildLote2Package();
  const authorization = read(revisionRoot + "/autorizacao-aplicacao.json");
  const target = sha256(JSON.stringify([process.env.DB_HOST?.toLowerCase(),process.env.DB_PORT||"3306",process.env.DB_NAME]));
  assert.ok(process.argv.includes("--apply-approved"));
  assert.ok(process.argv.includes("--target-sha256=" + target));
  assert.ok(process.argv.includes("--package-sha256=" + pack.approvedPackageSha256));
  assert.equal(target,authorization.targetSha256);
  assert.equal(target,resume.targetSha256);
  assert.equal(pack.approvedPackageSha256,resume.approvedPackageSha256);
  assert.deepEqual(authorization.allowedIds,resume.allowedIds);
  const previousResultPath = revisionRoot + "/depois-aplicacao.json";
  if(fs.existsSync(previousResultPath)){
    const prior=read(previousResultPath);
    assert.equal(prior.writeCount,0,"Never reapply a completed batch");
    assert.notEqual(prior.state,"APPLIED_ALL_SIX");
  }
  const snapshot = read(revisionRoot + "/antes-aplicacao.json");
  const database = await prisma.$queryRaw<{selectedDatabase:string}[]>`SELECT DATABASE() AS selectedDatabase`;
  assert.equal(database[0].selectedDatabase,process.env.DB_NAME);
  const result = await executeLote2Transaction(prisma,pack,snapshot,authorization,resume);
  saveRevision("depois-aplicacao.json",result);
  return result;
}
export async function executeLote2Transaction(
  prisma: PrismaClient,
  pack: ReturnType<typeof buildLote2Package>,
  snapshot: {articles: Record<string,unknown>[];outsideBatch: Record<string,unknown>[]},
  authorization: {allowedIds:string[]},
  resume: {humanVisualApprovalNumbers:number[]},
) {
  const originals = [...snapshot.articles,...snapshot.outsideBatch];
  const plain = (value:unknown) => JSON.parse(JSON.stringify(value));
  const compareAll = (rows: Awaited<ReturnType<typeof prisma.post.findMany>>) => {
    assert.equal(rows.length,originals.length);
    for(const row of rows){const before=originals.find((p)=>p.id===row.id);assert.ok(before);assertBaselineCompatible(plain(row),before);}
  };
  compareAll(await prisma.post.findMany({orderBy:{id:"asc"}}));
  const result = await prisma.$transaction(async tx => {
    // Lock the existing Post rows for this short transaction, including the
    // outside-batch comparison. View increments wait and are never overwritten.
    await tx.$queryRaw`SELECT id FROM Post ORDER BY id FOR UPDATE`;
    compareAll(await tx.post.findMany({orderBy:{id:"asc"}}));
    const transactionBefore = plain(await tx.post.findMany({orderBy:{id:"asc"}}));
    const after = [];
    for(const article of pack.articles){
      const previous = await tx.post.findUniqueOrThrow({where:{id:article.id}});
      const fields = {title:article.title,description:article.description,seoTitle:article.seoTitle,seoDescription:article.seoDescription,content:article.content};
      assert.ok(hasEditorialChanges(previous,fields));
      const editorialUpdatedAt = new Date();
      const visual = resume.humanVisualApprovalNumbers.includes(article.number)
        ? {desktopReviewed:true,tabletReviewed:true,mobileReviewed:true,lastPreviewAt:editorialUpdatedAt}
        : {};
      const validation=validatePostBeforePublish({...previous,...fields,...visual,blocks:[],useLegacyHtml:true,hasOtherPublishedPosts:true});
      assert.equal(validation.canPublish,true,"Real checklist remains blocked: "+validation.missingRequired.join(", "));
      const changed = await tx.post.updateMany({where:{id:previous.id,updatedAt:previous.updatedAt,content:previous.content,views:previous.views,publishedAt:previous.publishedAt,editorialUpdatedAt:previous.editorialUpdatedAt,scheduledAt:previous.scheduledAt,status:previous.status,slug:previous.slug},data:{...fields,...visual,contentBlocks:[] as Prisma.InputJsonValue,editorialUpdatedAt}});
      assert.equal(changed.count,1,"Concurrent update; roll back entire batch");
      const current = await tx.post.findUniqueOrThrow({where:{id:article.id}});
      const allowed = ["title","description","seoTitle","seoDescription","content","contentBlocks","editorialUpdatedAt","updatedAt",...Object.keys(visual)];
      for(const key of Object.keys(previous) as (keyof typeof previous)[])if(!allowed.includes(key))assert.deepEqual(current[key],previous[key],"Protected field changed: "+key);
      assert.equal(current.content,article.content); assert.equal(current.editorialUpdatedAt?.getTime(),editorialUpdatedAt.getTime());
      for(const [key,value] of Object.entries(fields))assert.equal(current[key as keyof typeof fields],value);
      for(const [key,value] of Object.entries(visual))assert.deepEqual(current[key as keyof typeof current],value);
      after.push({number:article.number,...plain(current)});
    }
    const final = await tx.post.findMany({orderBy:{id:"asc"}});
    for(const row of final.filter(p=>!authorization.allowedIds.includes(p.id))){const before=transactionBefore.find((p:{id:string})=>p.id===row.id);assert.deepEqual(plain(row),before,"Article outside batch changed");}
    return {state:"APPLIED_ALL_SIX",completedAt:new Date().toISOString(),approvedPackageSha256:pack.approvedPackageSha256,writeCount:6,articles:after,transactionBefore,allRecordsAfter:plain(final),outsideBatchUnchanged:true,protectedFieldsPreserved:true,humanVisualApprovalRecordedFor:[2,1],viewsNeverWritten:true};
  },{timeout:30000,isolationLevel:"Serializable"});
  return result;
}
async function main(){
  if(!process.argv.includes("--apply-approved")){const pack=buildLote2Package();saveRevision("pacote-aplicacao.json",pack);console.log("Offline package checked: six exact bodies, visible text/links, 22 entries, 19 sources, 12 DOIs. No database access.");return;}
  await import("dotenv/config");
  const {prisma}=await import("../src/lib/prisma");
  try{const result=await applyApprovedLote2(prisma);console.log(result.state,"— six records; protected histories and all other articles preserved.");}
  finally{await prisma.$disconnect();}
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main().catch(error=>{console.error(error.message);process.exitCode=1;});
