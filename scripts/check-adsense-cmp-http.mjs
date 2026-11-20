import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';

const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3107';
const publisher = 'ca-pub-3638053236344020';
const adsenseUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
const denied = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
};
const listing = await (await fetch(base + '/pt/artigos')).text();
const article = [...listing.matchAll(/href="(\/pt\/artigos\/[^"?#]+)"/g)].map(m => m[1])[0];
assert.ok(article, 'A published article must be available for the route check');
const publicPages = ['/pt', '/pt?fc=alwaysshow&fctype=gdpr', '/pt/artigos', article, '/pt/autora/weverlyn-alves', '/pt/sobre', '/pt/contato', '/pt/politica-de-cookies', '/pt/politica-de-privacidade', '/pt/termos-de-uso', '/pt/politica-editorial', '/pt/disclaimer'];
const technicalResponses = ['/feed.xml', '/sitemap.xml', '/robots.txt', '/ads.txt', '/manifest.webmanifest', '/images/og/nutricao-em-movimento.jpg'];
const unmatched = ['/not-a-real-page-adsense-audit', '/pt/not-a-real-page-adsense-audit', '/pt/artigos/not-a-real-article-adsense-audit', '/api/adsense-audit-not-found'];
const paths = ['/', ...publicPages, '/login', '/login/2fa', '/administracao', '/administracao/artigos', '/administracao/seguranca', '/administracao/logout', '/api/newsletter/confirm', ...unmatched, ...technicalResponses];

for (const path of paths) {
  const response = await fetch(base + path, { redirect: 'manual' });
  const contentType = response.headers.get('content-type') ?? '';
  const body = contentType.startsWith('image/') ? '' : await response.text();
  const html = contentType.includes('text/html') ? body : '';
  const head = /<head(?:\s[^>]*)?>[\s\S]*?<\/head>/i.exec(html);
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const ads = scripts.filter(([, attributes]) => attributes.includes(adsenseUrl));
  const isPublic = publicPages.includes(path);
  assert.equal(ads.length, isPublic ? 1 : 0, path);
  assert.ok(!html.includes('nem-adsense'), `Old loader descriptor: ${path}`);
  if (!isPublic && !unmatched.includes(path)) {
    assert.ok(!body.includes(adsenseUrl), `Unexpected AdSense URL: ${path}`);
  }
  if (path === '/') {
    assert.equal(response.status, 307, 'Root must preserve its redirect');
    assert.equal(response.headers.get('location'), '/pt');
    assert.ok(head?.[0].includes('<link rel="canonical" href="https://www.nutricaoemovimento.com/pt"'));
  }
  if (isPublic) {
    assert.equal(response.status, 200, path);
    assert.ok(head, `Missing initial head: ${path}`);
    const [tag, attributes] = ads[0];
    assert.ok(head[0].includes(tag), `AdSense must be in the initial head: ${path}`);
    assert.match(attributes, /\sasync(?:=""|(?=\s|$))/i);
    assert.match(attributes, /\scrossorigin="anonymous"/i);
    assert.doesNotMatch(attributes, /\sdata-nscript\b/i);
    assert.ok(attributes.includes(` src="${adsenseUrl}?client=${publisher}"`), path);
    assert.equal((head[0].match(/<meta name="google-adsense-account"[^>]*>/g) || []).length, 1, path);
    assert.ok(head[0].includes(`name="google-adsense-account" content="${publisher}"`), path);
    if (path === '/pt') {
      assert.ok(head[0].includes('<title>Nutrição &amp; Movimento | Nutrição &amp; Movimento</title>'));
    }

    const defaults = scripts.filter(([, , body]) => body.trimStart().startsWith('window.dataLayer ='));
    assert.equal(defaults.length, 1, `Expected a single inline default: ${path}`);
    const [inline, inlineAttributes, source] = defaults[0];
    assert.equal(inlineAttributes, '', `Consent defaults must run synchronously: ${path}`);
    assert.ok(head[0].includes(inline) && defaults[0].index < ads[0].index, path);
    const window = {};
    runInNewContext(source, { window });
    const commands = Array.from(window.dataLayer, args => Array.from(args));
    assert.equal(commands.length, 1, path);
    assert.deepEqual(commands[0].slice(0, 2), ['consent', 'default']);
    assert.deepEqual({ ...commands[0][2] }, denied);
  }
  if (technicalResponses.includes(path)) {
    assert.equal(response.status, 200, path);
    assert.ok(!html, `Unexpected HTML for technical response: ${path}`);
  }
  if (path === '/login' || path === '/administracao/logout') assert.equal(response.status, 200, path);
  if (unmatched.includes(path)) assert.equal(response.status, 404, path);
  if (path === '/api/newsletter/confirm') {
    assert.ok([307, 503].includes(response.status), path);
    assert.ok(!html, path);
  }
  assert.ok(!scripts.some(([, attrs]) => /googletagmanager|google-analytics/i.test(attrs)), path);
  console.log(JSON.stringify({ path, status: response.status, location: response.headers.get('location'), initialHeadAdsenseScripts: ads.length }));
}
