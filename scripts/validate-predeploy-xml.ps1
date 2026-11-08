param([string]$EvidenceRoot = 'docs/monetizacao/pre-deploy-final')
$ErrorActionPreference = 'Stop'
$expected = Get-Content -Encoding UTF8 -Raw -LiteralPath (Join-Path $EvidenceRoot 'xml-esperado.json') | ConvertFrom-Json
$rss = New-Object System.Xml.XmlDocument
$rss.LoadXml((Get-Content -Encoding UTF8 -Raw -LiteralPath (Join-Path $EvidenceRoot 'feed-local.xml')))
$sitemap = New-Object System.Xml.XmlDocument
$sitemap.LoadXml((Get-Content -Encoding UTF8 -Raw -LiteralPath (Join-Path $EvidenceRoot 'sitemap-local.xml')))
$namespaces = New-Object System.Xml.XmlNamespaceManager($sitemap.NameTable)
$namespaces.AddNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9')
$items = @($rss.SelectNodes('/rss/channel/item'))
if ($items.Count -ne 30) { throw "RSS item count: $($items.Count)" }
if ($rss.SelectSingleNode('/rss/channel/title').InnerText -cne $expected.channelTitle) { throw 'Channel name changed or double-escaped' }
$ids = @($items | ForEach-Object { $_.SelectSingleNode('guid').InnerText })
if (@($ids | Select-Object -Unique).Count -ne 30) { throw 'Duplicate RSS identity' }
foreach ($article in $expected.published) {
  $item = @($items | Where-Object { $_.SelectSingleNode('guid').InnerText -ceq $article.url })
  if ($item.Count -ne 1) { throw "Missing/duplicate identity: $($article.url)" }
  if ($item[0].SelectSingleNode('link').InnerText -cne $article.url) { throw 'Non-canonical item link' }
  if ($item[0].SelectSingleNode('title').InnerText -cne $article.title) { throw 'RSS title differs from stored title' }
  if ($item[0].SelectSingleNode('description').InnerText -cne $article.description) { throw 'RSS description differs from stored excerpt' }
  if ($item[0].SelectSingleNode('pubDate').InnerText -cne $article.pubDate) { throw 'Publication date changed' }
  $entry = @($sitemap.SelectNodes('/s:urlset/s:url', $namespaces) | Where-Object { $_.SelectSingleNode('s:loc', $namespaces).InnerText -ceq $article.url })
  if ($entry.Count -ne 1) { throw "Missing/duplicate sitemap URL: $($article.url)" }
  $lastmod = $entry[0].SelectSingleNode('s:lastmod', $namespaces).InnerText
  if ($lastmod -cne $article.lastmod) { throw "Editorial lastmod differs: $($article.url)" }
}
foreach ($url in $expected.archived) {
  if ($ids -contains $url) { throw 'Archived item in RSS' }
  if (@($sitemap.SelectNodes('/s:urlset/s:url/s:loc', $namespaces) | Where-Object { $_.InnerText -ceq $url }).Count -gt 0) { throw 'Archived URL in sitemap' }
}
$result = @{ checkedAt = (Get-Date).ToUniversalTime().ToString('o'); parser = 'System.Xml.XmlDocument'; feedValid = $true; sitemapValid = $true; feedItems = $items.Count; uniqueIdentities = $true; channelNameRoundTrip = $true; canonicalUrls = $true; publicationDatesPreserved = $true; all30EditorialLastmodsCorrect = $true; archivedAbsent = $true; sitemapUrls = @($sitemap.SelectNodes('/s:urlset/s:url', $namespaces)).Count }
$result | ConvertTo-Json | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $EvidenceRoot 'validacao-xml.json')
$result | ConvertTo-Json
