$ErrorActionPreference = 'Stop'
$root = 'docs/monetizacao/auditoria-final-adsense'
$baseline = Get-Content -Encoding UTF8 -Raw -LiteralPath (Join-Path $root 'integridade-antes.json') | ConvertFrom-Json
$results = @{}
foreach ($kind in @('feed', 'sitemap')) {
  $raw = Get-Content -Encoding UTF8 -Raw -LiteralPath (Join-Path $root ($kind + '.xml'))
  try {
    $doc = New-Object System.Xml.XmlDocument
    $doc.LoadXml($raw)
    if ($kind -eq 'feed') {
      $items = @($doc.SelectNodes('/rss/channel/item'))
      $guids = @($items | ForEach-Object { $_.SelectSingleNode('guid').InnerText })
      $itemIssues = @()
      foreach ($post in @($baseline.records | Where-Object status -eq 'PUBLISHED')) {
        $url = 'https://www.nutricaoemovimento.com/pt/artigos/' + $post.slug
        $item = @($items | Where-Object { $_.SelectSingleNode('guid').InnerText -ceq $url })
        if ($item.Count -ne 1) { $itemIssues += "Missing or duplicate: $url"; continue }
        $pubDate = [DateTimeOffset]::Parse($post.publishedAt).ToUniversalTime().ToString('r', [System.Globalization.CultureInfo]::InvariantCulture)
        if ($item[0].SelectSingleNode('link').InnerText -cne $url) { $itemIssues += "Noncanonical: $url" }
        if ($item[0].SelectSingleNode('pubDate').InnerText -cne $pubDate) { $itemIssues += "Publication differs: $url" }
        if ($item[0].SelectSingleNode('description').InnerText -cne $post.description) { $itemIssues += "Excerpt differs: $url" }
      }
      $archivedInFeed = @($baseline.records | Where-Object status -eq 'ARCHIVED' | Where-Object { $guids -contains ('https://www.nutricaoemovimento.com/pt/artigos/' + $_.slug) })
      $results.feed = @{ validXml = $true; rssVersion = $doc.DocumentElement.GetAttribute('version'); items = $items.Count; uniqueIdentities = @($guids | Select-Object -Unique).Count -eq $items.Count; title = $doc.SelectSingleNode('/rss/channel/title').InnerText; itemIssues = $itemIssues; archivedAbsent = $archivedInFeed.Count -eq 0 }
    } else {
      $ns = New-Object System.Xml.XmlNamespaceManager($doc.NameTable)
      $ns.AddNamespace('s', 'http://www.sitemaps.org/schemas/sitemap/0.9')
      $entries = @($doc.SelectNodes('/s:urlset/s:url', $ns))
      $urls = @($entries | ForEach-Object { $_.SelectSingleNode('s:loc', $ns).InnerText })
      $differences = @()
      foreach ($post in @($baseline.records | Where-Object status -eq 'PUBLISHED')) {
        $url = 'https://www.nutricaoemovimento.com/pt/artigos/' + $post.slug
        $entry = @($entries | Where-Object { $_.SelectSingleNode('s:loc', $ns).InnerText -ceq $url })
        $expected = $(if ($post.editorialUpdatedAt) { $post.editorialUpdatedAt } else { $post.publishedAt })
        $actual = $(if ($entry.Count -eq 1) { $entry[0].SelectSingleNode('s:lastmod', $ns).InnerText } else { $null })
        if ($actual -cne $expected) { $differences += @{ slug = $post.slug; actual = $actual; expected = $expected } }
      }
      $archived = @($baseline.records | Where-Object status -eq 'ARCHIVED' | ForEach-Object { 'https://www.nutricaoemovimento.com/pt/artigos/' + $_.slug })
      $results.sitemap = @{ validXml = $true; urls = $urls.Count; uniqueUrls = @($urls | Select-Object -Unique).Count -eq $urls.Count; allWwwHttps = @($urls | Where-Object { $_ -notlike 'https://www.nutricaoemovimento.com/*' }).Count -eq 0; published30Present = @($baseline.records | Where-Object status -eq 'PUBLISHED' | Where-Object { $urls -notcontains ('https://www.nutricaoemovimento.com/pt/artigos/' + $_.slug) }).Count -eq 0; archivedAbsent = @($archived | Where-Object { $urls -contains $_ }).Count -eq 0; lastmodDifferences = $differences }
    }
  } catch {
    $results[$kind] = @{ validXml = $false; error = $_.Exception.Message; lexicalItemsOnly = [regex]::Matches($raw, '<item>').Count }
  }
}
$results.checkedAt = (Get-Date).ToUniversalTime().ToString('o')
$results | ConvertTo-Json -Depth 6 | Set-Content -Encoding UTF8 -LiteralPath (Join-Path $root 'validacao-xml-publica.json')
$results | ConvertTo-Json -Depth 6
