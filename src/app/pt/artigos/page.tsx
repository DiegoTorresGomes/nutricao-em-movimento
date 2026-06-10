import { PublicLayout } from "@/components/layout/PublicLayout";
import { ArticlesBrowser } from "@/components/sections/ArticlesBrowser";
import { ArticlesFeaturedHero } from "@/components/sections/ArticlesFeaturedHero";
import { ArticlesHero } from "@/components/sections/ArticlesHero";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { getPublishedPosts } from "@/lib/posts";

export default async function ArticlesPage() {
  const posts = await getPublishedPosts();

  return (
    <PublicLayout>
      <ArticlesHero />
      <ArticlesFeaturedHero posts={posts} />
      <ArticlesBrowser posts={posts} />
      <NewsletterSection />
    </PublicLayout>
  );
}