import { getPublishedPosts } from "@/lib/posts";

const baseUrl = "https://nutricaoemovimento.com";

// Freshness comes from on-demand revalidation: the create/edit/delete Server
// Actions and the scheduled-publish cron all call revalidatePath("/feed.xml"),
// so the feed regenerates immediately after any change (no time-based cache).

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getPublishedPosts();

  const lastBuildDate = posts[0]?.publishedAt ?? posts[0]?.updatedAt ?? new Date();

  const items = posts
    .map((post) => {
      const url = `${baseUrl}/pt/artigos/${post.slug}`;
      const pubDate = (post.publishedAt ?? post.updatedAt ?? new Date()).toUTCString();

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.category.name)}</category>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nutrição & Movimento</title>
    <link>${baseUrl}/pt</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Conteúdos sobre comportamento alimentar, emagrecimento sustentável e Bem-Estar Nutricional.</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date(lastBuildDate).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
