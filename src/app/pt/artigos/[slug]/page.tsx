import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { NewsletterSection } from "@/components/sections/NewsletterSection";
import { Button } from "@/components/ui/Button";
import { getNutritionistSettings } from "@/lib/site-settings";
import { getPublishedPostBySlug } from "@/lib/posts";

type ArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublishedPostBySlug(slug);
  const nutritionistSettings = await getNutritionistSettings();

  if (!article) {
    notFound();
  }

  return (
    <PublicLayout>
      <main>
        <article>
          <header className="bg-[#FAF8F4] px-4 py-16 sm:px-6 md:py-24">
            <div className="mx-auto max-w-4xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">
                {article.category.name}
              </p>

              <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
                {article.title}
              </h1>

              <p className="mt-6 text-lg leading-8 text-neutral-700">
                {article.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3 text-sm text-neutral-500">
                <span>
                  {article.publishedAt
                    ? new Intl.DateTimeFormat("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }).format(article.publishedAt)
                    : "Sem data"}
                </span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          </header>

          <section className="px-4 py-10 sm:px-6 md:py-14">
            <div className="mx-auto max-w-5xl">
              <div className="h-[300px] rounded-[2rem] bg-[#E9DCC9] sm:h-[420px]" />
            </div>
          </section>

          <section className="px-4 py-10 sm:px-6 md:py-14">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="max-w-3xl">
                <div
                  className="article-content space-y-7 text-lg leading-9 text-neutral-800"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>

              <aside className="h-fit rounded-[2rem] bg-[#111111] p-6 text-white lg:sticky lg:top-28">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#E9DCC9]">
                  Autora
                </p>

                <div className="mt-5 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-[#E9DCC9]">
                    {nutritionistSettings.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={nutritionistSettings.photoUrl}
                        alt={nutritionistSettings.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold leading-tight">
                      {nutritionistSettings.name}
                    </h3>

                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/45">
                      {nutritionistSettings.crn}
                    </p>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-white/70">
                  {nutritionistSettings.bio}
                </p>

                <div className="mt-6">
                  <Button href={nutritionistSettings.instagramUrl} external variant="light">
                    Instagram
                  </Button>
                </div>
              </aside>
            </div>
          </section>

          <section className="px-4 pb-16 sm:px-6 md:pb-20">
            <div className="mx-auto max-w-4xl rounded-[2rem] border border-black/5 bg-[#FAF8F4] p-6 text-sm leading-7 text-neutral-700">
              <strong className="text-[#111111]">Aviso importante:</strong> as
              informações deste artigo têm caráter educativo e não substituem
              avaliação individualizada com nutricionista.
            </div>
          </section>
        </article>

        <NewsletterSection />
      </main>
    </PublicLayout>
  );
}
