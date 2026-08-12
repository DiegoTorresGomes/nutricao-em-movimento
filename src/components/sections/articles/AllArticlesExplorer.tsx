"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArticleCard } from "@/components/ui/ArticleCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { formatShortDate } from "./format";
import type { ArticleListItem } from "@/lib/posts";

type AllArticlesExplorerProps = {
  articles: ArticleListItem[];
};

const PAGE_SIZE = 9;
const ALL_CATEGORIES = "todas";

export function AllArticlesExplorer({ articles }: AllArticlesExplorerProps) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_CATEGORIES);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Suporta o SearchAction do Schema.org (/pt/artigos?q=...) e os links de
  // "Explorar por tema" (/pt/artigos?categoria=<slug>#todos-os-artigos). Lido
  // no cliente para a página continuar estática/cacheável (sem searchParams
  // no servidor).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");
    const categorySlug = params.get("categoria");

    if (query) setSearch(query);
    if (categorySlug) setActiveCategory(categorySlug);
  }, []);

  const categories = useMemo(() => {
    const seen = new Map<string, string>(); // slug -> name
    for (const article of articles) {
      if (!seen.has(article.category.slug)) {
        seen.set(article.category.slug, article.category.name);
      }
    }
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesCategory =
        activeCategory === ALL_CATEGORIES || article.category.slug === activeCategory;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        article.title.toLowerCase().includes(normalizedSearch) ||
        article.description.toLowerCase().includes(normalizedSearch) ||
        article.category.name.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, search]);

  // Volta para a primeira página sempre que o resultado muda de conjunto.
  useEffect(() => {
    setPage(1);
  }, [activeCategory, search]);

  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <section
      id="todos-os-artigos"
      className="scroll-mt-24 bg-white px-4 py-16 sm:px-6 md:py-20"
    >
      <div className="mx-auto max-w-7xl">
        <SectionLabel>Acervo completo</SectionLabel>
        <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-4xl">
          Todos os artigos
        </h2>

        <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap gap-3"
            role="group"
            aria-label="Filtrar artigos por categoria"
          >
            <button
              type="button"
              onClick={() => setActiveCategory(ALL_CATEGORIES)}
              aria-pressed={activeCategory === ALL_CATEGORIES}
              className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                activeCategory === ALL_CATEGORIES
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "border-black/10 bg-white text-[#111111] hover:border-[#556B2F] hover:text-[#556B2F]"
              }`}
            >
              Todos
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveCategory(category.slug)}
                aria-pressed={activeCategory === category.slug}
                className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                  activeCategory === category.slug
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-black/10 bg-white text-[#111111] hover:border-[#556B2F] hover:text-[#556B2F]"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-sm">
            <label htmlFor="articles-search" className="sr-only">
              Buscar artigos
            </label>
            <Search
              size={18}
              aria-hidden="true"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              id="articles-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar artigos..."
              type="search"
              className="h-12 w-full rounded-full border border-black/10 bg-[#FAF8F4] pl-11 pr-5 text-sm outline-none transition focus:border-[#556B2F]"
            />
          </div>
        </div>

        {paginatedArticles.length > 0 ? (
          <div
            key={`${activeCategory}-${search}-${currentPage}`}
            className="mt-10 grid animate-[articles-fade-in_320ms_ease-out] gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {paginatedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                variant="compact"
                slug={article.slug}
                title={article.title}
                description={article.description}
                category={article.category.name}
                coverImage={article.coverImage}
                date={formatShortDate(article.publishedAt)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[1.75rem] bg-[#FAF8F4] p-8 text-center text-neutral-600">
            Nenhum artigo encontrado para esta busca.
          </div>
        )}

        {totalPages > 1 && (
          <nav
            aria-label="Paginação de artigos"
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-[#111111] transition hover:border-[#556B2F] hover:text-[#556B2F] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                aria-current={pageNumber === currentPage ? "page" : undefined}
                className={`h-10 w-10 rounded-full text-sm font-bold transition ${
                  pageNumber === currentPage
                    ? "bg-[#111111] text-white"
                    : "border border-black/10 bg-white text-[#111111] hover:border-[#556B2F] hover:text-[#556B2F]"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-[#111111] transition hover:border-[#556B2F] hover:text-[#556B2F] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
