"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

type Post = {
  slug: string;
  title: string;
  description: string;
  coverImage?: string | null;
  category: {
    name: string;
  };
};

type ArticlesBrowserProps = {
  posts: Post[];
};

export function ArticlesBrowser({ posts }: ArticlesBrowserProps) {
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [search, setSearch] = useState("");

  const filters = useMemo(() => {
    const categories = posts
      .map((post) => post.category.name)
      .filter((category, index, array) => array.indexOf(category) === index);

    return ["Todos", ...categories];
  }, [posts]);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return posts.filter((article) => {
      const matchesFilter =
        activeFilter === "Todos" || article.category.name === activeFilter;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        article.title.toLowerCase().includes(normalizedSearch) ||
        article.description.toLowerCase().includes(normalizedSearch) ||
        article.category.name.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, search, posts]);

  return (
    <section className="bg-white px-4 py-12 sm:px-6 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-5 py-3 text-sm font-bold transition ${
                  activeFilter === filter
                    ? "border-[#111111] bg-[#111111] !text-white"
                    : "border-black/10 bg-white text-[#111111] hover:border-[#556B2F] hover:text-[#556B2F]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar artigos..."
              className="h-12 w-full rounded-full border border-black/10 bg-[#FAF8F4] pl-11 pr-5 text-sm outline-none transition focus:border-[#556B2F]"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/pt/artigos/${article.slug}`}
              className="group flex overflow-hidden rounded-[1.75rem] border border-black/5 bg-[#FAF8F4] transition hover:-translate-y-1 hover:shadow-md"
            >
              <article className="flex w-full flex-col">
                <div className="h-52 shrink-0 overflow-hidden bg-[#E9DCC9]">
                  {article.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : null}
                </div>

                <div className="relative z-10 flex flex-1 flex-col bg-[#FAF8F4] p-5 sm:p-6">
                  <p className="line-clamp-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#D67A5A]">
                    {article.category.name}
                  </p>

                  <h3 className="mt-4 line-clamp-3 text-xl font-semibold leading-tight sm:text-2xl">
                    {article.title}
                  </h3>

                  <p className="mt-4 line-clamp-4 flex-1 text-sm leading-7 text-neutral-600">
                    {article.description}
                  </p>

                  <span className="mt-6 inline-flex text-sm font-bold text-[#556B2F]">
                    Ler artigo
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="mt-10 rounded-[1.75rem] bg-[#FAF8F4] p-8 text-center text-neutral-600">
            Nenhum artigo encontrado para essa busca.
          </div>
        )}
      </div>
    </section>
  );
}