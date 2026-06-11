import type { Metadata } from "next";
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
import { getHomeSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Nutrição em Movimento",
  description:
    "Nutrição real para uma vida em movimento. Conteúdos sobre comportamento alimentar, emagrecimento sustentável e nutrição esportiva.",

  alternates: {
    canonical: "/pt",
  },

  openGraph: {
    title: "Nutrição em Movimento",
    description:
      "Nutrição real para uma vida em movimento. Conteúdos sobre comportamento alimentar, emagrecimento sustentável e nutrição esportiva.",
    url: "/pt",
    type: "website",
    images: [
      {
        url: "/images/og/nutricao-em-movimento.jpg",
        width: 1200,
        height: 630,
        alt: "Nutrição em Movimento",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Nutrição em Movimento",
    description:
      "Nutrição real para uma vida em movimento. Conteúdos sobre comportamento alimentar, emagrecimento sustentável e nutrição esportiva.",
    images: ["/images/og/nutricao-em-movimento.jpg"],
  },
};

type HomePageProps = {
  searchParams?: Promise<{
    newsletter?: string;
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const nutritionistSettings = await getNutritionistSettings();
  const categories = await getActiveCategories();
  const articleOfWeek = await getArticleOfWeek();
  const latestArticles = await getLatestPublishedPosts(3);
  const mostViewedPosts = await getMostViewedPosts(8);
  const homeSettings = await getHomeSettings();
  const nutritionistSchema = {
    "@context": "https://schema.org",
    "@type": "Person",

    name: nutritionistSettings.name,
    jobTitle: nutritionistSettings.role,
    description: nutritionistSettings.bio,

    image: `https://nutricaoemovimento.com${nutritionistSettings.photoUrl}`,
    url: "https://nutricaoemovimento.com/pt/sobre",

    telephone: "+55-21-97976-2589",

    sameAs: [nutritionistSettings.instagramUrl],

    knowsAbout: nutritionistSettings.specialties,

    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
      addressRegion: "RJ",
    },

    areaServed: [
      {
        "@type": "Country",
        name: "Brasil",
      },
      {
        "@type": "State",
        name: "Rio de Janeiro",
      },
    ],

    availableLanguage: ["Portuguese"],
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Nutrição em Movimento",
    description:
      "Conteúdos sobre comportamento alimentar, emagrecimento sustentável e nutrição esportiva.",
    url: "https://nutricaoemovimento.com",
    publisher: {
      "@type": "Person",
      name: nutritionistSettings.name,
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Nutrição em Movimento",
    url: "https://nutricaoemovimento.com",
    inLanguage: "pt-BR",
    publisher: {
      "@type": "Person",
      name: nutritionistSettings.name,
    },
  };

  return (
    <PublicLayout>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(nutritionistSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(blogSchema),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />

        <HomeHero settings={homeSettings} />
        <HomePillars settings={homeSettings} />
        <ArticleOfWeek article={articleOfWeek} />
        <FeaturedArticles articles={latestArticles} />
        <ArticleCarousel articles={mostViewedPosts} />
        <VisualCategories categories={categories} />
        <NutritionistSection settings={nutritionistSettings} />
        <NewsletterSection status={params?.newsletter} />
      </main>
    </PublicLayout>
  );
}
