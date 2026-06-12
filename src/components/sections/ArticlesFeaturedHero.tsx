import Link from "next/link";

type ArticlesFeaturedHeroProps = {
  posts: {
    slug: string;
    title: string;
    description: string;
    coverImage?: string | null;
  }[];
};

export function ArticlesFeaturedHero({ posts }: ArticlesFeaturedHeroProps) {
  const article = posts[0];

  if (!article) {
    return null;
  }

  return (
    <section className="px-4 py-10 sm:px-6 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="h-64 bg-[#E9DCC9] sm:h-80 lg:h-auto">
              {article.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#D67A5A]">
                Artigo em destaque
              </p>

              <h2 className="mt-4 text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
                {article.title}
              </h2>

              <p className="mt-4 text-base leading-7 text-neutral-700 sm:text-lg sm:leading-8">
                {article.description}
              </p>

              <Link
                href={`/pt/artigos/${article.slug}`}
                className="mt-7 inline-flex w-fit rounded-full bg-[#111111] px-6 py-3 text-sm font-bold !text-white transition hover:bg-[#556B2F]"
              >
                Ler artigo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}