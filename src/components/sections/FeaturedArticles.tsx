import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

type FeaturedArticle = {
  slug: string;
  title: string;
  description: string;
  coverImage?: string | null;
  category: {
    name: string;
  };
};

type FeaturedArticlesProps = {
  articles: FeaturedArticle[];
};

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel>Últimos artigos</SectionLabel>

            <h2 className="mt-5 text-3xl font-semibold sm:text-4xl md:text-5xl">
              Leituras para começar hoje.
            </h2>
          </div>

          <Button href="/pt/artigos" variant="outline">
            Ver todos os artigos
          </Button>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/pt/artigos/${article.slug}`}
              className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="h-48 bg-[#E9DCC9]">
                {article.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D67A5A]">
                  {article.category.name}
                </p>

                <h3 className="mt-4 text-2xl font-semibold leading-tight">
                  {article.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-neutral-700">
                  {article.description}
                </p>

                <span className="mt-6 inline-flex text-sm font-bold text-[#556B2F]">
                  Ler artigo
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}