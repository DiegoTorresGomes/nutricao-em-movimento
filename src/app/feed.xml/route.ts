import { getPublishedPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { buildRss } from "@/lib/rss";

// Next 15 GET Route Handlers are dynamic by default. Prisma reads the current
// published rows; this handler does not opt into a static/fetch cache.
export async function GET() {
  const posts = await getPublishedPosts();
  const xml = buildRss(posts, {
    title: siteConfig.name,
    url: siteConfig.url,
    description: "Conteúdos sobre comportamento alimentar, emagrecimento sustentável e Bem-Estar Nutricional.",
  });
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
