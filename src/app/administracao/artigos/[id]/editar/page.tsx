import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/prisma";
import { EditPostForm } from "./EditPostForm";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPostPage({
  params,
}: PageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">
          Editar artigo
        </h1>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <EditPostForm
          post={post}
          categories={categories}
        />
      </div>
    </AdminLayout>
  );
}