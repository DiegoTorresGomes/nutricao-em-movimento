// Read-only smoke checks against a local production server.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3100';
const official = 'https://www.nutricaoemovimento.com';
const authorPath = '/pt/autora/weverlyn-alves';
const authorUrl = official + authorPath;
const results = [];
async function read(path) {
  const response = await fetch(base + path, { signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, 200, path);
  results.push({ path, status: response.status });
  return response.text();
}
function schemas(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
}
const [author, policy, home, about, sitemap] = await Promise.all([authorPath, '/pt/politica-editorial', '/pt', '/pt/sobre', '/sitemap.xml'].map(read));
for (const [html, path] of [[author, authorPath], [policy, '/pt/politica-editorial']]) {
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.ok(html.includes(`<link rel="canonical" href="${official + path}"`));
  assert.ok(sitemap.includes(official + path));
  const footer = html.match(/<footer[\s\S]*?<\/footer>/)?.[0] || '';
  assert.ok(footer.includes('href="/pt/politica-editorial"'));
  assert.ok(!html.includes('content="noindex'));
}
const person = schemas(author).find(item => item['@type'] === 'Person');
assert.equal(person.name, 'Weverlyn da Cruz Alves Torres');
assert.equal(person.alternateName, 'Weverlyn Alves');
assert.equal(person.url, authorUrl);
assert.equal(person.identifier.value, '24101524');
for (const forbidden of ['medicalSpecialty', 'employer', 'worksFor', 'affiliation', 'address']) assert.ok(!(forbidden in person));
for (const page of [home, about]) assert.deepEqual(schemas(page).find(item => item['@type'] === 'Person'), person);
assert.equal((policy.match(/<h2(?:\s|>)/g) || []).length, 12);
assert.ok(policy.includes('A responsabilidade editorial final é humana'));
assert.ok(policy.includes('revisadas por Weverlyn Alves antes da publicação'));
const articlePaths = [...new Set([...author.matchAll(/href="(\/pt\/artigos\/[^"?#]+)"/g)].map(match => match[1]))];
assert.ok(articlePaths.length > 0 && articlePaths.length <= 12);
const article = await read(articlePaths[0]);
const posting = schemas(article).find(item => item['@type'] === 'BlogPosting');
assert.equal(posting.author.name, person.name);
assert.equal(posting.author.url, person.url);
assert.equal(posting.author['@id'], person['@id']);
assert.ok(article.includes(`href="${authorPath}"`));
const image = author.match(/<img[^>]+src="([^"]+)"/);
assert.ok(image);
await read(image[1].replaceAll('&amp;', '&'));
results.push({ checks: 'canonical, one H1, Person identity, Article author, 12 policy sections, AI disclosure, sitemap, footer, photo', pass: true, listedArticles: articlePaths.length });
await fs.mkdir('docs/editorial', { recursive: true });
await fs.writeFile('docs/editorial/http-checks.json', JSON.stringify(results, null, 2) + '\n');
await fs.writeFile('docs/editorial/person-schema.json', JSON.stringify(person, null, 2) + '\n');
await fs.writeFile('docs/editorial/article-author.json', JSON.stringify(posting.author, null, 2) + '\n');
console.log(JSON.stringify(results, null, 2));
