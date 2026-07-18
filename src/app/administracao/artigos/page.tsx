import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/prisma";
import { DeletePostButton } from "@/components/admin/DeletePostButton";
import {
  buildPublicationSummary,
  getPublicationInfo,
  sortForAdmin,
} from "@/lib/admin/publication";

export default async function AdminArticlesPage() {
  const posts = await prisma.post.findMany({
    include: {
      category: true,
    },
  });

  // Editorial ordering: upcoming scheduled → drafts → recently published.
  const orderedPosts = sortForAdmin(posts);
  const summary = buildPublicationSummary(posts);

  const summaryCards = [
    { label: "Agendados hoje", value: summary.scheduledToday },
    { label: "Esta semana", value: summary.scheduledThisWeek },
    { label: "Este mês", value: summary.scheduledThisMonth },
    { label: "Publicados", value: summary.published },
    { label: "Rascunhos", value: summary.drafts },
  ];

  return (
    <AdminLayout>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-semibold">Artigos</h1>
          <p className="mt-2 text-sm text-neutral-600">Gerencie os conteúdos publicados no blog.</p>
        </div>

        <Link
          href="/administracao/artigos/novo"
          className="rounded-full bg-[#111111] px-6 py-3 text-sm font-bold !text-white"
        >
          Novo artigo
        </Link>
      </div>

      {/* Resumo da publicação */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-2xl font-semibold text-[#111111]">{card.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-[2rem] bg-white shadow-sm">
        {orderedPosts.map((post) => {
          const publication = getPublicationInfo(post);

          return (
            <div
              key={post.id}
              className="flex flex-col gap-4 border-b border-black/5 p-6 last:border-b-0 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D67A5A]">
                  {post.category.name}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-neutral-500">
                  <span>{post.views} visualizações</span>
                  {post.isArticleOfWeek && (
                    <>
                      <span>•</span>
                      <span className="font-bold text-[#556B2F]">Artigo da semana</span>
                    </>
                  )}
                </div>

                {/* Coluna Publicação */}
                <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                  <span className="inline-flex items-center gap-2 font-bold text-[#111111]">
                    <span className={`h-2.5 w-2.5 rounded-full ${publication.dotClass}`} />
                    {publication.label}
                  </span>

                  {publication.prefix && publication.datetime && (
                    <span className="text-neutral-600">
                      {publication.prefix} {publication.datetime}
                    </span>
                  )}

                  {publication.relative && (
                    <span className="rounded-full bg-[#FAF8F4] px-2.5 py-0.5 text-xs font-bold text-[#556B2F]">
                      {publication.relative}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                {post.status === "PUBLISHED" ? (
                  <Link
                    href={`/pt/artigos/${post.slug}`}
                    className="text-sm font-bold text-[#556B2F]"
                  >
                    Ver
                  </Link>
                ) : (
                  <Link
                    href={`/administracao/artigos/${post.id}/editar`}
                    className="text-sm font-bold text-[#556B2F]"
                  >
                    Continuar edição
                  </Link>
                )}

                <Link
                  href={`/administracao/artigos/${post.id}/editar`}
                  className="text-sm font-bold text-[#111111]"
                >
                  Editar
                </Link>

                <DeletePostButton postId={post.id} />
              </div>
            </div>
          );
        })}
      </div>
    </AdminLayout>
  );
}
