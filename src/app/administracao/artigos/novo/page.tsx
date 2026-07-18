import { AdminLayout } from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/prisma";
import { CreatePostForm } from "./CreatePostForm";

export default async function NewPostPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Novo artigo</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Crie um novo conteúdo para o blog Nutrição & Movimento.
        </p>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <CreatePostForm categories={categories} />
      </div>
    </AdminLayout>
  );
}