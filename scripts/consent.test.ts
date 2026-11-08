import { test } from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
import React from "react";
import ts from "typescript";
import * as consentModule from "../src/lib/consent";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import { buildConsent, readConsent, saveConsent, CONSENT_STORAGE_KEY, CONSENT_COOKIE_NAME, CONSENT_MAX_AGE, CONSENT_CHANGED, OPEN_CONSENT, openConsentPreferences, syncGoogleConsentMode } from "../src/lib/consent";
import { applyConsentServices, leavePublicPage, isPublicPath } from "../src/lib/consent-services";
import { CONSENT_DEFAULT_SCRIPT } from "../src/components/analytics/ConsentModeInit";
import { CookieConsentPanel } from "../src/components/consent/CookieConsent";
import { ADSENSE_CLIENT, ADSENSE_PUBLISHER } from "../src/config/monetization";

type FakeScript = { id: string; src: string; async: boolean };
function browser() {
  const storage = new Map<string, string>(); const cookies = new Map<string, string>();
  const scripts: FakeScript[] = []; const events = new EventTarget(); const calls: unknown[][] = [];
  let reloads = 0;
  const win = Object.assign(events, { localStorage: { getItem: (k: string) => storage.get(k) ?? null, setItem: (k: string, v: string) => storage.set(k, v), removeItem: (k: string) => storage.delete(k) }, location: { protocol: "https:", hostname: "www.example.com", pathname: "/pt", href: "https://www.example.com/pt", reload: () => { reloads++; } }, gtag: (...args: unknown[]) => calls.push(args) });
  const doc = { get cookie() { return [...cookies].map(([k,v]) => k + "=" + v).join("; "); }, set cookie(value: string) { const pair = value.split(";")[0]; const index = pair.indexOf("="); const key = pair.slice(0,index); if(value.includes("Max-Age=0")) cookies.delete(key); else cookies.set(key, pair.slice(index+1)); }, head: { appendChild: (s: FakeScript) => scripts.push(s) }, createElement: () => ({ id: "", src: "", async: false }), getElementById: (id: string) => scripts.find(s=>s.id===id) ?? null };
  Object.defineProperty(globalThis, "window", { value: win, configurable: true }); Object.defineProperty(globalThis, "document", { value: doc, configurable: true });
  readConsent(true);
  return { storage, cookies, scripts, calls, win, get reloads() { return reloads; } };
}

test("defaults deny four signals without fetching any resource", () => {
  const context = { window: {} }; vm.runInNewContext(CONSENT_DEFAULT_SCRIPT, context);
  const queue = (context.window as { dataLayer: IArguments[] }).dataLayer;
  assert.equal(queue[0][0], "consent"); assert.equal(queue[0][1], "default");
  assert.deepEqual(JSON.parse(JSON.stringify(queue[0][2])), { ad_storage:"denied", ad_user_data:"denied", ad_personalization:"denied", analytics_storage:"denied" });
});
test("new visitor: no optional script; no decision is persisted automatically", () => {
  const b=browser(); assert.equal(readConsent(), null); applyConsentServices(null, "G-TEST123"); assert.equal(b.scripts.length,0); assert.equal(b.storage.size,0);
});
test("accept: persists statistics, keeps advertising denied, loads GA once after update", () => {
  const b=browser(); saveConsent(buildConsent(true)); applyConsentServices(readConsent(), "G-TEST123"); applyConsentServices(readConsent(), "G-TEST123");
  assert.equal(readConsent()?.analytics,true); assert.equal(readConsent()?.ads,false); assert.equal(b.scripts.length,1); assert.equal(b.scripts[0].async,true); assert.match(b.scripts[0].src,/gtag/);
  const update=b.calls.findIndex(c=>c[0]==="consent"&&c[1]==="update"); const config=b.calls.findIndex(c=>c[0]==="config"); assert.ok(update>=0&&update<config);
  assert.equal((b.calls[update][2] as { ad_storage:string }).ad_storage,"denied");
});
test("reject: persisted denial survives a fresh storage read, no GA or AdSense", () => {
  const b=browser(); saveConsent(buildConsent(false)); assert.equal(readConsent(true)?.analytics,false); applyConsentServices(readConsent(), "G-TEST123"); assert.equal(b.scripts.length,0); assert.equal(b.reloads,0);
});
test("change accept to reject: replaces record, denies, cleans optional cookies and reloads", () => {
  const b=browser(); b.cookies.set("_ga","old"); b.cookies.set("session","keep"); saveConsent(buildConsent(true)); applyConsentServices(readConsent(),"G-TEST123"); saveConsent(buildConsent(false)); applyConsentServices(readConsent(),"G-TEST123");
  assert.equal(JSON.parse(b.storage.get(CONSENT_STORAGE_KEY)!).analytics,false); assert.equal(b.reloads,1); assert.equal(b.cookies.has("_ga"),false); assert.equal(b.cookies.get("session"),"keep"); assert.ok(b.cookies.has(CONSENT_COOKIE_NAME));
  assert.equal(Reflect.get(b.win,"ga-disable-G-TEST123"),true);
});
test("reload after acceptance restores decision before configuring GA", () => {
  const b=browser(); saveConsent(buildConsent(true)); const saved=b.storage.get(CONSENT_STORAGE_KEY)!; const next=browser(); next.storage.set(CONSENT_STORAGE_KEY,saved); applyConsentServices(readConsent(true),"G-TEST123"); assert.equal(next.scripts.length,1); assert.equal(next.reloads,0);
});
test("old, malformed, expired and forged consent cannot activate services", () => {
  for(const value of ["bad",JSON.stringify({...buildConsent(true),version:1}),JSON.stringify({...buildConsent(true),analytics:"true"}),JSON.stringify({...buildConsent(true),updatedAt:new Date(Date.now()-CONSENT_MAX_AGE*1000-100).toISOString()})]) {
    const b=browser(); b.storage.set(CONSENT_STORAGE_KEY,value); assert.equal(readConsent(true),null); applyConsentServices(readConsent(),"G-TEST123"); assert.equal(b.scripts.length,0);
  }
});
test("blocked localStorage falls back to the consent cookie", () => {
  const b=browser(); b.win.localStorage.setItem=()=>{throw Error("blocked");}; b.win.localStorage.getItem=()=>{throw Error("blocked");}; saveConsent(buildConsent(true)); assert.equal(readConsent(true)?.analytics,true); assert.equal(b.scripts.length,0);
});
test("storage deletion invalidates the in-memory decision", () => {
  const b=browser(); saveConsent(buildConsent(true)); b.storage.clear(); b.cookies.clear(); assert.equal(readConsent(true),null);
});
test("reopen signal and change event are observable without granting consent", () => {
  const b=browser(); let opened=0,changed=0; b.win.addEventListener(OPEN_CONSENT,()=>opened++); b.win.addEventListener(CONSENT_CHANGED,()=>changed++); openConsentPreferences(); assert.equal(opened,1); assert.equal(readConsent(),null); saveConsent(buildConsent(false)); assert.equal(changed,1);
});
test("public/private boundary: no loaded service means no reload; leaving with GA requires fresh document", () => {
  browser(); leavePublicPage(); const b=browser(); saveConsent(buildConsent(true)); applyConsentServices(readConsent(),"G-TEST123"); leavePublicPage(); assert.equal(b.reloads,1); assert.equal(isPublicPath("/login"),false); assert.equal(isPublicPath("/administracao/artigos"),false); assert.equal(isPublicPath("/pt/artigos"),true);
});
test("no GA identifier: acceptance creates no third-party request; ads always denied", () => {
  const b=browser(); syncGoogleConsentMode({...buildConsent(true),ads:true}); applyConsentServices(buildConsent(true),undefined); assert.equal(b.scripts.length,0); assert.equal((b.calls[0][2] as {ad_personalization:string}).ad_personalization,"denied");
});
test("panel first layer gives equal access to accept, reject and preferences; buttons call their actual handlers", () => {
  const choices:boolean[]=[];let preferences=0;
  const tree=CookieConsentPanel({preferences:false,analytics:false,onAnalytics:()=>{},onPreferences:()=>preferences++,onSave:v=>choices.push(v)});
  const html=renderToStaticMarkup(tree); assert.match(html,/Recusar opcionais/); assert.match(html,/Aceitar opcionais/); assert.match(html,/>Preferências</); assert.match(html,/role="dialog"/);
  const buttons:React.ReactElement<{onClick:()=>void;children:React.ReactNode}>[]=[];
  function walk(node:React.ReactNode):void { if(!React.isValidElement<{children?:React.ReactNode}>(node)) return; if(node.type==="button") buttons.push(node as typeof buttons[number]); React.Children.forEach(node.props.children,walk); }
  walk(tree); buttons.forEach(button=>button.props.onClick()); assert.deepEqual(choices,[false,true]); assert.equal(preferences,1);
});
test("preferences show current statistics and disabled advertising; saving uses the selected value", () => {
  let saved:boolean|undefined; const tree=CookieConsentPanel({preferences:true,analytics:true,onAnalytics:()=>{},onPreferences:()=>{},onSave:v=>{saved=v;}}); const html=renderToStaticMarkup(tree); assert.match(html,/Salvar preferências/); assert.match(html,/Publicidade — pausada/); assert.equal((html.match(/disabled=""/g)||[]).length,2);
  function walk(node:React.ReactNode):void { if(!React.isValidElement<{children?:React.ReactNode;onClick?:()=>void}>(node))return; if(node.type==="button"&&node.props.children==="Salvar preferências")node.props.onClick?.(); React.Children.forEach(node.props.children,walk); } walk(tree); assert.equal(saved,true);
});
test("static ads.txt and verification metadata use the confirmed publisher", () => {
  assert.equal(ADSENSE_CLIENT,"ca-pub-3638053236344020"); assert.equal(fs.readFileSync("public/ads.txt","utf8"),"google.com, "+ADSENSE_PUBLISHER+", DIRECT, f08c47fec0942fa0\n");
});

// Hook harness: exercises the actual controller effects and state, without a browser or external network.
test("controller: new user, rejection, reopen, category change, accept and reload", () => {
  browser();
  const values: unknown[]=[]; const dependencies: (unknown[]|undefined)[]=[]; const cleanups:(void|(()=>void))[]=[];
  let index=0,dirty=true;let pending:(()=>void)[]=[];
  const ReactHooks={...React,useState:(initial:unknown)=>{const i=index++; if(!(i in values))values[i]=initial;return [values[i],(value:unknown)=>{values[i]=value;dirty=true;}];},useRef:(initial:unknown)=>{const i=index++;if(!(i in values))values[i]={current:initial};return values[i];},useEffect:(effect:()=>void|(()=>void),deps:unknown[])=>{const i=index++;if(!dependencies[i]||deps.some((v,n)=>!Object.is(v,dependencies[i]![n]))) {dependencies[i]=deps;pending.push(()=>{cleanups[i]?.();cleanups[i]=effect();});}}};
  const testModule={exports:{} as {CookieConsent:()=>React.ReactElement<React.ComponentProps<typeof CookieConsentPanel>>|null}};
  const HTMLElementMock=class {};
  const context={module:testModule,exports:testModule.exports,require:(id:string)=>id==="react"?ReactHooks:id==="react/jsx-runtime"?jsxRuntime:id==="next/link"?{default:"a",__esModule:true}:id==="@/lib/consent"?consentModule:(()=>{throw Error(id);})(),window,document,HTMLElement:HTMLElementMock};
  const output=ts.transpileModule(fs.readFileSync("src/components/consent/CookieConsent.tsx","utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  vm.runInNewContext(output,context);
  let tree:ReturnType<typeof testModule.exports.CookieConsent>=null;
  function flush(){for(let n=0;dirty&&n<20;n++){dirty=false;index=0;tree=testModule.exports.CookieConsent();const effects=pending;pending=[];effects.forEach(e=>e());}if(dirty)throw Error("render loop");return tree;}
  assert.ok(flush()); assert.equal(readConsent(),null);
  tree!.props.onSave(false);assert.equal(flush(),null);assert.equal(readConsent()?.analytics,false);
  openConsentPreferences();flush();assert.equal(tree!.props.preferences,true);assert.equal(tree!.props.analytics,false);
  tree!.props.onAnalytics(true);flush();tree!.props.onSave(tree!.props.analytics);assert.equal(flush(),null);assert.equal(readConsent()?.analytics,true);
  openConsentPreferences();flush();assert.equal(tree!.props.analytics,true);assert.ok(tree!.props.onClose);tree!.props.onClose!();assert.equal(flush(),null);assert.equal(readConsent()?.analytics,true);
  cleanups.forEach(cleanup=>cleanup?.());
});
