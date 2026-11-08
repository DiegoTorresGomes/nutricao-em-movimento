import assert from 'node:assert/strict';
import fs from 'node:fs';
const base='http://127.0.0.1:3107';
const paths=['/ads.txt','/pt/politica-de-privacidade','/pt/politica-de-cookies','/pt/termos-de-uso','/pt/disclaimer','/pt/politica-editorial','/pt/contato','/login','/login/2fa','/administracao','/not-a-real-page-consent-audit'];
const results=[];
for(const path of paths){
  const response=await fetch(base+path,{redirect:'manual'});const text=await response.text();
  const scripts=[...text.matchAll(/<script\b[^>]*src=["']([^"']+)/g)].map(m=>m[1]);
  const item={path,status:response.status,contentType:response.headers.get('content-type'),location:response.headers.get('location'),optionalRemoteScripts:scripts.filter(s=>/pagead2|googletagmanager|clarity/.test(s)),adsenseMetadata:/name="google-adsense-account" content="ca-pub-3638053236344020"/.test(text),consentDefaults:text.includes("'consent', 'default'"),cookiePreferencesButton:text.includes('Preferências de cookies')};
  if(path==='/ads.txt'){assert.equal(response.status,200);assert.match(item.contentType,/text\/plain/);assert.equal(text,'google.com, pub-3638053236344020, DIRECT, f08c47fec0942fa0\n');item.body=text;}
  else if(path==='/administracao'){assert.equal(response.status,307);assert.match(item.location,/login/);}
  else if(path.includes('not-a-real'))assert.equal(response.status,404);
  else {assert.equal(response.status,200);assert.ok(item.consentDefaults);assert.ok(item.adsenseMetadata);}
  assert.equal(item.optionalRemoteScripts.length,0);
  if(path.startsWith('/pt/'))assert.ok(item.cookiePreferencesButton);
  if(path==='/pt/politica-de-cookies'){assert.ok(text.includes('Continuar navegando não é aceitação'));assert.ok(text.includes('Publicidade'));assert.ok(text.includes('publicidade está pausada'));}
  if(path==='/pt/politica-de-privacidade')assert.ok(text.includes('envio automático do e-mail ainda não está integrado'));
  results.push(item);console.log(path+': '+response.status);
}
fs.writeFileSync('docs/monetizacao/consentimento-adsense/http-local.json',JSON.stringify({capturedAt:new Date().toISOString(),base,mode:'GET only, no JavaScript execution or form submission',results},null,2)+'\n','utf8');
