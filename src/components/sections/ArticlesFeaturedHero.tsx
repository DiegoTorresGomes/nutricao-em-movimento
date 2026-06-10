import Link from "next/link";

type ArticlesFeaturedHeroProps = {
  posts: {
    slug: string;
    title: string;
    description: string;
  }[];
};

export function ArticlesFeaturedHero({ posts }: ArticlesFeaturedHeroProps) {
  const article = posts[0];

  if (!article) {
    return null;
  }

  return (
    <section className="px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
          <div className="grid lg:grid-cols-2">
            <div className="min-h-[340px] bg-[#E9DCC9]" />

            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">
                Artigo em destaque
              </p>

              <h2 className="mt-4 text-4xl font-semibold leading-tight">
                {article.title}
              </h2>

              <p className="mt-5 text-lg leading-8 text-neutral-700">
                {article.description}
              </p>

              <Link
                href={`/pt/artigos/${article.slug}`}
                className="mt-8 inline-flex w-fit rounded-full bg-[#111111] px-6 py-3 text-sm font-bold !text-white transition hover:bg-[#556B2F]"
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