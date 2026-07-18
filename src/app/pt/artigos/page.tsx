import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { ArticlesBrowser } from "@/components/sections/ArticlesBrowser";
import { ArticlesFeaturedHero } from "@/components/sections/ArticlesFeaturedHero";
import { ArticlesHero } from "@/components/sections/ArticlesHero";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Artigos",
  description:
    "Artigos sobre comportamento alimentar, emagrecimento sustentável e Bem-Estar Nutricional. Conteúdo baseado em ciência, com linguagem acessível.",

  alternates: {
    canonical: "/pt/artigos",
  },

  openGraph: {
    title: "Artigos | Nutrição & Movimento",
    description:
      "Artigos sobre comportamento alimentar, emagrecimento sustentável e Bem-Estar Nutricional. Conteúdo baseado em ciência, com linguagem acessível.",
    url: "/pt/artigos",
    type: "website",
    images: [
      {
        url: "/images/og/nutricao-em-movimento.jpg",
        width: 1200,
        height: 630,
        alt: "Nutrição & Movimento",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Artigos | Nutrição & Movimento",
    description:
      "Artigos sobre comportamento alimentar, emagrecimento sustentável e Bem-Estar Nutricional.",
    images: ["/images/og/nutricao-em-movimento.jpg"],
  },
};

// Freshness is handled entirely by on-demand revalidation: every create/edit/
// delete Server Action and the scheduled-publish cron call revalidatePath for
// this route, so a change is reflected immediately on the next request. No
// time-based `revalidate` is used, per the chosen architecture.
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