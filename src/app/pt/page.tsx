import { PublicLayout } from "@/components/layout/PublicLayout";
import { ArticleCarousel } from "@/components/sections/ArticleCarousel";
import { ArticleOfWeek } from "@/components/sections/ArticleOfWeek";
import { FeaturedArticles } from "@/components/sections/FeaturedArticles";
import { HomeHero } from "@/components/sections/HomeHero";
import { HomePillars } from "@/components/sections/HomePillars";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { NutritionistSection } from "@/components/sections/NutritionistSection";
import { VisualCategories } from "@/components/sections/VisualCategories";
import { getNutritionistSettings } from "@/lib/site-settings";
import { getActiveCategories } from "@/lib/categories";
import { getArticleOfWeek } from "@/lib/posts";
import { getLatestPublishedPosts } from "@/lib/posts";
import { getMostViewedPosts } from "@/lib/posts";

export default async function HomePage() {
  const nutritionistSettings = await getNutritionistSettings();
  const categories = await getActiveCategories();
  const articleOfWeek = await getArticleOfWeek();
  const latestArticles = await getLatestPublishedPosts(3);
  const mostViewedPosts = await getMostViewedPosts(8);

  return (
    <PublicLayout>
      <main>
        <HomeHero />
        <HomePillars />
        <ArticleOfWeek article={articleOfWeek} />
        <FeaturedArticles articles={latestArticles} />
        <ArticleCarousel articles={mostViewedPosts} />
        <VisualCategories categories={categories} />
        <NutritionistSection settings={nutritionistSettings} />
        <NewsletterSection />
      </main>
    </PublicLayout>
  );
}