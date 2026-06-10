import Link from "next/link";

type ArticleCardProps = {
  category: string;
  title: string;
  description: string;
  slug: string;
  coverImage?: string | null;
};

export function ArticleCard({
  category,
  title,
  description,
  slug,
  coverImage,
}: ArticleCardProps) {
  return (
    <Link
      href={`/pt/artigos/${slug}`}
      className="group flex h-[460px] min-w-[280px] max-w-[320px] flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:min-w-[340px]"
    >
      <div className="h-40 shrink-0 bg-[#E9DCC9]">
        {coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#D67A5A]">
          {category}
        </p>

        <h3 className="mt-4 line-clamp-3 text-[1.45rem] font-semibold leading-[1.12]">
          {title}
        </h3>

        <p className="mt-4 line-clamp-4 flex-1 text-sm leading-7 text-neutral-700">
          {description}
        </p>

        <span className="mt-5 inline-flex text-sm font-bold text-[#556B2F]">
          Ler artigo
        </span>
      </div>
    </Link>
  );
}