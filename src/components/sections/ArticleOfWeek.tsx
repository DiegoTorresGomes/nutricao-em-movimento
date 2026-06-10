import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

type ArticleOfWeekProps = {
  article: {
    slug: string;
    title: string;
    description: string;
    coverImage?: string | null;
    category: {
      name: string;
    };
  } | null;
};

export function ArticleOfWeek({ article }: ArticleOfWeekProps) {
  if (!article) {
    return null;
  }

  return (
    <section className="bg-white px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <SectionLabel>Artigo da semana</SectionLabel>

          <h2 className="mt-5 text-3xl font-semibold sm:text-4xl md:text-5xl">
            {article.title}
          </h2>
        </div>

        <div className="grid overflow-hidden rounded-[2rem] border border-black/5 bg-[#FAF8F4] md:grid-cols-[1.05fr_0.95fr]">
          <div className="min-h-72 bg-[#E9DCC9] md:min-h-[460px]">
            {article.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={article.coverImage}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#D67A5A]">
              {article.category.name}
            </p>

            <h3 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
              {article.description}
            </h3>

            <div className="mt-8">
              <Button href={`/pt/artigos/${article.slug}`}>Ler artigo</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}