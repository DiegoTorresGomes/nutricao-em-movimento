import Link from "next/link";

type ArticleCardVariant = "default" | "compact" | "horizontal";

type ArticleCardProps = {
  category: string;
  title: string;
  description: string;
  slug: string;
  coverImage?: string | null;
  // Opcional: quando informada, aparece no rodapé do card (variantes novas
  // apenas). Já formatada — ver src/components/sections/articles/format.ts.
  date?: string | null;
  variant?: ArticleCardVariant;
  className?: string;
  // Só relevante dentro de contextos arrastáveis (o carrossel "Mais lidos").
  // Default `true` preserva o comportamento nativo do <img> em todo o resto.
  imageDraggable?: boolean;
};

export function ArticleCard({
  category,
  title,
  description,
  slug,
  coverImage,
  date,
  variant = "default",
  className = "",
  imageDraggable = true,
}: ArticleCardProps) {
  // "default" preserva EXATAMENTE o visual original — usado pela Home
  // (ArticleCarousel) e pelos artigos individuais ("Artigos relacionados"),
  // ambos fora do escopo da Fase 3. Nada aqui foi alterado.
  if (variant === "default") {
    return (
      <Link
        href={`/pt/artigos/${slug}`}
        className={`group flex min-h-[460px] min-w-[300px] max-w-[340px] flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:min-w-[340px] ${className}`}
      >
        <div className="h-48 shrink-0 overflow-hidden bg-[#E9DCC9]">
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt={title}
              loading="lazy"
              decoding="async"
              draggable={imageDraggable}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : null}
        </div>

        <div className="relative z-10 flex flex-1 flex-col bg-white p-6">
          <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#D67A5A]">
            {category}
          </p>

          <h3 className="mt-4 line-clamp-3 text-2xl font-semibold leading-tight">
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

  // Variantes novas — exclusivas da página de Artigos redesenhada (Fase 3),
  // com as microinterações pedidas (hover mais expressivo, seta, data).
  if (variant === "horizontal") {
    return (
      <Link
        href={`/pt/artigos/${slug}`}
        className={`group flex h-full gap-4 overflow-hidden rounded-2xl border border-black/5 bg-white p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md sm:gap-5 sm:p-4 ${className}`}
      >
        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#E9DCC9] sm:h-28 sm:w-28">
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt={title}
              loading="lazy"
              decoding="async"
              draggable={imageDraggable}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : null}
        </div>

        <article className="flex min-w-0 flex-1 flex-col justify-center">
          <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#D67A5A]">
            {category}
          </p>
          <h3 className="mt-2 line-clamp-2 text-base font-semibold leading-snug text-[#111111] transition group-hover:text-[#556B2F] sm:text-lg">
            {title}
          </h3>
          {date ? (
            <p className="mt-2 text-xs font-medium text-neutral-500">{date}</p>
          ) : null}
        </article>
      </Link>
    );
  }

  // variant === "compact"
  return (
    <Link
      href={`/pt/artigos/${slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-lg ${className}`}
    >
      <article className="flex h-full w-full flex-col">
        <div className="h-44 shrink-0 overflow-hidden bg-[#E9DCC9]">
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverImage}
              alt={title}
              loading="lazy"
              decoding="async"
              draggable={imageDraggable}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : null}
        </div>

        <div className="relative z-10 flex flex-1 flex-col bg-white p-5">
          <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#D67A5A]">
            {category}
          </p>

          <h3 className="mt-3 line-clamp-2 text-xl font-semibold leading-tight transition group-hover:text-[#556B2F]">
            {title}
          </h3>

          <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-neutral-600">
            {description}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="inline-flex text-sm font-bold text-[#556B2F]">
              Ler artigo
            </span>
            {date ? (
              <span className="text-xs font-medium text-neutral-500">{date}</span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
