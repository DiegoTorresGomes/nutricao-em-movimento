import Link from "next/link";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const [postsCount, categoriesCount, subscribersCount] = await Promise.all([
    prisma.post.count(),
    prisma.category.count(),
    prisma.newsletterSubscriber.count(),
  ]);

  return (
    <AdminLayout>
      <section>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-neutral-500">Artigos</p>
            <strong className="mt-3 block text-4xl font-semibold">{postsCount}</strong>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-neutral-500">Categorias</p>
            <strong className="mt-3 block text-4xl font-semibold">{categoriesCount}</strong>
          </div>

          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <p className="text-sm font-bold text-neutral-500">Newsletter</p>
            <strong className="mt-3 block text-4xl font-semibold">{subscribersCount}</strong>
          </div>
        </div>

        <div className="mt-8 rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-semibold">Artigos do blog</h3>
              <p className="mt-2 text-sm text-neutral-600">
                Crie, edite e publique conteúdos para o Nutrição & Movimento.
              </p>
            </div>

            <Link
              href="/administracao/artigos/novo"
              className="rounded-full bg-[#556B2F] px-6 py-3 text-sm font-bold !text-white transition hover:bg-[#465a28]"
            >
              Novo artigo
            </Link>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}
