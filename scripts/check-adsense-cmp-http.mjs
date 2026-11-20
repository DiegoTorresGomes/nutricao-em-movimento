import assert from 'node:assert/strict';
import fs from 'node:fs';
const base = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3107';
const publisher = 'ca-pub-3638053236344020';
const listing = await (await fetch(base + '/pt/artigos')).text();
const article = [...listing.matchAll(/href="(\/pt\/artigos\/[^"?#]+)"/g)].map(m => m[1])[0];
const publicPages = ['/pt', '/pt/artigos', article, '/pt/autora/weverlyn-alves', '/pt/sobre', '/pt/contato', '/pt/politica-de-cookies', '/pt/politica-de-privacidade', '/pt/termos-de-uso', '/pt/politica-editorial', '/pt/disclaimer'];
const technicalResponses = ['/feed.xml', '/sitemap.xml', '/robots.txt', '/ads.txt', '/manifest.webmanifest', '/images/og/nutricao-em-movimento.jpg'];
const paths = ['/', ...publicPages, '/login', '/login/2fa', '/administracao', '/administracao/artigos', '/administracao/seguranca', '/api/adsense-audit-not-found', ...technicalResponses];
assert.ok(article, 'A published article must be available for the route check');
const results = [];
for (const path of paths) {
  const response = await fetch(base + path, { redirect: 'manual' });
  const html = await response.text();
  const head = html.split('</head>')[0];
  const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*>/g)].map(m => m[0]);
  const ads = scripts.filter(s => s.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'));
  const isPublic = publicPages.includes(path);
  // afterInteractive is serialized in the RSC stream; it executes after defaults.
  const descriptor = html.includes('nem-adsense');
  assert.equal(descriptor, isPublic, path);
  assert.equal((html.match(/nem-adsense/g) || []).length, isPublic ? 1 : 0, 'Exactly one loader descriptor');
  assert.equal(ads.length, 0, 'No parser-executed remote tag before defaults');
  if (path === '/') {
    assert.equal(response.status, 307, 'Root must preserve its redirect');
    assert.equal(response.headers.get('location'), '/pt');
    assert.ok(head.includes('<link rel="canonical" href="https://www.nutricaoemovimento.com/pt"'));
    const destination = await fetch(new URL(response.headers.get('location'), base), { redirect: 'manual' });
    assert.equal(destination.status, 200);
    assert.equal((await destination.text()).match(/nem-adsense/g)?.length, 1, 'Redirect destination must have exactly one loader');
  }
  if (isPublic) {
    assert.equal(response.status, 200, path);
    assert.ok(html.includes(publisher) && html.includes('afterInteractive'), path);
    assert.ok(head.includes("'consent', 'default'"), 'Defaults must execute before hydration');
    assert.equal((html.match(/<meta name="google-adsense-account"[^>]*>/g) || []).length, 1, 'Exactly one publisher metadata');
    assert.ok(html.includes('name="google-adsense-account" content="' + publisher + '"'));
  }
  if (technicalResponses.includes(path)) {
    assert.equal(response.status, 200, path);
    assert.ok(!response.headers.get('content-type')?.includes('text/html'), 'Technical response must not be an HTML page');
    assert.ok(!html.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'), 'No AdSense URL in technical response');
  }
  assert.equal(scripts.filter(s => /googletagmanager|google-analytics/.test(s)).length, 0, 'No ungated GA in HTML');
  const item = { path, status: response.status, location: response.headers.get('location'), adsenseDescriptor: descriptor, parserExecutedAdsenseScripts: ads.length, csp: response.headers.get('content-security-policy') };
  results.push(item);
  console.log(JSON.stringify(item));
}
fs.mkdirSync('docs/monetizacao/adsense-cmp-integracao', { recursive: true });
fs.writeFileSync('docs/monetizacao/adsense-cmp-integracao/http-local.json', JSON.stringify({ base, node: process.version, mode: 'GET HTML only; no JavaScript or Google network validation', results }, null, 2) + '\n');
