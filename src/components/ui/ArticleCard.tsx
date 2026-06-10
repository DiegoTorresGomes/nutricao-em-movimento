type ArticleCardProps = {
  category: string;
  title: string;
  description: string;
  href?: string;
};

export function ArticleCard({
  category,
  title,
  description,
  href = "/pt/artigos",
}: ArticleCardProps) {
  return (
    <article className="group flex h-full min-w-[280px] max-w-[320px] flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:min-w-[340px]">
      <div className="h-48 bg-[#E9DCC9]" />

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D67A5A]">
          {category}
        </p>

        <h3 className="mt-4 text-2xl font-semibold leading-tight">{title}</h3>

        <p className="mt-4 flex-1 text-sm leading-7 text-neutral-700">{description}</p>

        <a href={href} className="mt-6 inline-flex text-sm font-bold text-[#556B2F]">
          Ler artigo
        </a>
      </div>
    </article>
  );
}