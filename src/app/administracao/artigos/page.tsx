import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/prisma";
import { DeletePostButton } from "@/components/admin/DeletePostButton";

export default async function AdminArticlesPage() {
  const posts = await prisma.post.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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

      <div className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-sm">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex flex-col gap-4 border-b border-black/5 p-6 last:border-b-0 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D67A5A]">
                {post.category.name}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
              <p className="mt-1 text-sm text-neutral-500">{post.status}</p>
            </div>

            <div className="flex gap-4">
              <Link href={`/pt/artigos/${post.slug}`} className="text-sm font-bold text-[#556B2F]">
                Ver
              </Link>

              <Link
                href={`/administracao/artigos/${post.id}/editar`}
                className="text-sm font-bold text-[#111111]"
              >
                Editar
              </Link>

              <DeletePostButton postId={post.id} />
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
