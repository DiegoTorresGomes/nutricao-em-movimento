import Image from "next/image";
import Link from "next/link";
import { formatShortDate } from "./format";
import type { ArticleListItem } from "@/lib/posts";

type FeaturedArticleProps = {
  article: ArticleListItem;
};

// Destaque principal — "capa de revista", não banner publicitário. Único
// elemento da página com `priority` no next/image (é o LCP candidate real).
export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const date = formatShortDate(article.publishedAt);

  return (
    <section className="px-4 py-10 sm:px-6 md:py-12">
      <div className="mx-auto max-w-7xl">
        <Link
          href={`/pt/artigos/${article.slug}`}
          className="group grid overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition duration-300 hover:shadow-lg lg:grid-cols-2"
        >
          <div className="relative h-64 w-full overflow-hidden bg-[#E9DCC9] sm:h-80 lg:h-full">
            {article.coverImage ? (
              <Image
                src={article.coverImage}
                alt={article.coverImageAlt || article.title}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
              />
            ) : null}
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D67A5A]">
              Artigo em destaque
            </p>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#556B2F]">
              {article.category.name}
            </p>

            <h2 className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
              {article.title}
            </h2>

            <p className="mt-4 line-clamp-3 text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
              {article.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {date ? (
                <span className="text-sm font-medium text-neutral-500">{date}</span>
              ) : null}

              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-6 py-3 text-sm font-bold text-white transition group-hover:bg-[#556B2F]">
                Ler artigo
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
