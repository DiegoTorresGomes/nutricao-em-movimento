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

export default async function HomePage() {
  const nutritionistSettings = await getNutritionistSettings();

  return (
    <PublicLayout>
      <main>
        <HomeHero />
        <HomePillars />
        <ArticleOfWeek />
        <FeaturedArticles />
        <ArticleCarousel />
        <VisualCategories />
        <NutritionistSection settings={nutritionistSettings} />
        <NewsletterSection />
      </main>
    </PublicLayout>
  );
}