import { ArticleCard } from "@/components/ui/ArticleCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatShortDate } from "./format";
import { RevealCard } from "./RevealCard";
import type { ArticleListItem } from "@/lib/posts";

type RecentArticlesProps = {
  articles: ArticleListItem[];
};

export function RecentArticles({ articles }: RecentArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="bg-white px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <SectionLabel>Atualizações</SectionLabel>
        <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
          Mais recentes
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <RevealCard key={article.id} delayMs={Math.min(index, 5) * 70}>
              <ArticleCard
                variant="compact"
                slug={article.slug}
                title={article.title}
                description={article.description}
                category={article.category.name}
                coverImage={article.coverImage}
                date={formatShortDate(article.publishedAt)}
                className="h-full"
              />
            </RevealCard>
          ))}
        </div>
      </div>
    </section>
  );
}
