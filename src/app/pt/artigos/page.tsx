import type { Metadata } from "next";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AllArticlesExplorer } from "@/components/sections/articles/AllArticlesExplorer";
import { ArticlesPageHero } from "@/components/sections/articles/ArticlesPageHero";
import { ExploreThemes } from "@/components/sections/articles/ExploreThemes";
import { FeaturedArticle } from "@/components/sections/articles/FeaturedArticle";
import { MostReadCarousel } from "@/components/sections/articles/MostReadCarousel";
import { RecentArticles } from "@/components/sections/articles/RecentArticles";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { getActiveCategories } from "@/lib/categories";
import { getArticlesForListing } from "@/lib/posts";

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

// Freshness: revalidatePath("/pt/artigos") já roda em toda mutação de post
// (criar/editar/excluir/agendar/publicar via cron) — cobre título, resumo,
// categoria etc. imediatamente. `views`, porém, é incrementado por uma rota
// de API sem revalidatePath (ver /api/posts/[id]/view) — chamar revalidatePath
// a cada leitura de artigo seria desproporcional (custo em cada visita). Um
// revalidate por tempo, moderado, cobre só a deriva de "Mais lidos" sem
// tornar a página dinâmica nem exigir SSR a cada request.
export const revalidate = 3600; // 1 hora

const RECENT_LIMIT = 6;
const MOST_READ_LIMIT = 8;

export default async function ArticlesPage() {
  const [articles, activeCategories] = await Promise.all([
    getArticlesForListing(),
    getActiveCategories(),
  ]);

  // --- Destaque principal -----------------------------------------------
  // Regra real: usa o artigo com isArticleOfWeek=true (mesma flag editorial
  // do restante do projeto — ver getArticleOfWeek em lib/posts.ts). Nenhum
  // artigo publicado tem essa flag no momento, então o fallback documentado
  // é o mais recente (articles já vem ordenado por publishedAt desc).
  const featured = articles.find((article) => article.isArticleOfWeek) ?? articles[0];

  // --- Mais recentes -------------------------------------------------------
  // publishedAt DESC, excluindo o destaque para não repetir o mesmo artigo
  // logo em seguida.
  const recentPool = featured
    ? articles.filter((article) => article.id !== featured.id)
    : articles;
  const recentArticles = recentPool.slice(0, RECENT_LIMIT);

  // --- Mais lidos ------------------------------------------------------
  // Métrica real: `views` (Int persistido no Post, incrementado uma vez por
  // sessão de leitor — ver ArticleViewCounter + /api/posts/[id]/view).
  // Exclui destaque + "mais recentes" para reduzir repetição entre seções;
  // se sobrarem poucos artigos (base pequena), completa com o restante.
  const usedIds = new Set([
    ...(featured ? [featured.id] : []),
    ...recentArticles.map((article) => article.id),
  ]);
  const mostReadPool = articles.filter((article) => !usedIds.has(article.id));
  const mostReadSource = mostReadPool.length >= 3 ? mostReadPool : articles.filter(
    (article) => article.id !== featured?.id,
  );
  const mostReadArticles = [...mostReadSource]
    .sort((a, b) => {
      if (b.views !== a.views) return b.views - a.views;
      const aTime = a.publishedAt?.getTime() ?? 0;
      const bTime = b.publishedAt?.getTime() ?? 0;
      return bTime - aTime;
    })
    .slice(0, MOST_READ_LIMIT);

  // --- Explorar por tema -----------------------------------------------
  // Categorias reais (ativas) com contagem real de posts publicados,
  // derivada do mesmo array já carregado — sem query extra. Só entram
  // categorias com pelo menos 1 artigo publicado.
  const themes = activeCategories
    .map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      count: articles.filter((article) => article.category.id === category.id).length,
    }))
    .filter((theme) => theme.count > 0);

  // ItemList: só artigos publicados, posição e URL absolutas corretas.
  // Complementa (não duplica) o Blog/WebSite já declarados na Home.
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Artigos | Nutrição & Movimento",
    url: "https://nutricaoemovimento.com/pt/artigos",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((article, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://nutricaoemovimento.com/pt/artigos/${article.slug}`,
        name: article.title,
      })),
    },
  };

  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <main>
        <ArticlesPageHero totalCount={articles.length} />

        {featured ? <FeaturedArticle article={featured} /> : null}

        <RecentArticles articles={recentArticles} />

        <MostReadCarousel articles={mostReadArticles} />

        <ExploreThemes themes={themes} />

        <AllArticlesExplorer articles={articles} />

        <NewsletterSection />
      </main>
    </PublicLayout>
  );
}
