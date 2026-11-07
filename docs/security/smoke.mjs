// Read-only HTTP checks. Run against a local production server.
import { writeFile } from 'node:fs/promises';
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3100';
const results = [];
async function check(path, expected, options = {}) {
  const response = await fetch(base + path, { redirect: 'manual', signal: AbortSignal.timeout(45000), ...options });
  const body = await response.text();
  results.push({ path, status: response.status, expected, pass: response.status === expected,
    location: response.headers.get('location'), type: response.headers.get('content-type') });
  return body;
}
const home = await check('/pt', 200);
const articles = await check('/pt/artigos', 200);
const about = await check('/pt/sobre', 200);
for (const path of ['/pt/contato', '/sitemap.xml', '/robots.txt', '/feed.xml', '/login']) await check(path, 200);
await check('/administracao', 307);
await check('/administracao/artigos/novo', 307);
const article = articles.match(/href="(\/pt\/artigos\/[^"?#]+)"/);
if (article) await check(article[1], 200);
await check('/pt?smoke=canonical', 308, { headers: { 'x-forwarded-host': 'nutricaoemovimento.com' } });
await check('/pt', 200, { headers: { 'x-forwarded-host': 'www.nutricaoemovimento.com' } });
await check('/api/upload/image', 400, { method: 'POST', body: new FormData() });
const image = (articles + about).match(/src="([^" ]*\/_next\/image\?[^" ]+)"/);
if (image) await check(image[1].replaceAll('&amp;', '&'), 200);
else results.push({ check: 'next/image rendered URL found', pass: false });
const cloud = home.match(/https(?:%3A|:)(?:%2F|\/){2}res\.cloudinary\.com[^"&<> ]+/i);
results.push({ check: 'Cloudinary URL present in homepage', pass: Boolean(cloud) });
await writeFile(new URL('./smoke-results.json', import.meta.url), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
if (results.some(r => !r.pass)) process.exitCode = 1;
