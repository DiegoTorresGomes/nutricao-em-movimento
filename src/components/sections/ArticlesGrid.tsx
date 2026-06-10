import Link from "next/link";
import { articles } from "@/config/articles";

export function ArticlesGrid() {
  return (
    <section className="bg-white px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/pt/artigos/${article.slug}`}
            className="group overflow-hidden rounded-[2rem] border border-black/5 bg-[#FAF8F4] transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="h-56 bg-[#E9DCC9]" />

            <div className="p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D67A5A]">
                {article.category}
              </p>

              <h3 className="mt-4 text-2xl font-semibold leading-tight">
                {article.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-neutral-600">
                {article.description}
              </p>

              <span className="mt-6 inline-flex font-semibold text-[#556B2F]">
                Ler artigo
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}