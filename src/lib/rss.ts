import { articleModifiedAt } from "./editorial-dates";

type RssPost = {
  title: string;
  slug: string;
  description: string;
  category: { name: string };
  publishedAt: Date | null;
  editorialUpdatedAt: Date | null;
};

type RssChannel = { title: string; url: string; description: string };

// Values are raw text, never previously escaped XML. Escape once at the
// serialization boundary; do not change the displayed name or stored content.
function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export function buildRss(posts: RssPost[], channel: RssChannel): string {
  const modifiedTimes = posts.flatMap(post => {
    const date = articleModifiedAt(post);
    return date ? [date.getTime()] : [];
  });
  const lastBuildDate = modifiedTimes.length ? new Date(Math.max(...modifiedTimes)) : undefined;
  const items = posts.map(post => {
    const url = escapeXml(`${channel.url}/pt/artigos/${post.slug}`);
    const pubDate = post.publishedAt?.toUTCString();
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.category.name)}</category>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
    </item>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channel.title)}</title>
    <link>${escapeXml(`${channel.url}/pt`)}</link>
    <atom:link href="${escapeXml(`${channel.url}/feed.xml`)}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(channel.description)}</description>
    <language>pt-BR</language>
    ${lastBuildDate ? `<lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>` : ""}
${items}
  </channel>
</rss>`;
}
