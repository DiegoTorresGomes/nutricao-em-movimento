import { AdminLayout } from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/prisma";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "./actions";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [
      {
        order: "asc",
      },
      {
        name: "asc",
      },
    ],
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Categorias</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Gerencie as categorias exibidas no blog e na Home.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <form
          action={createCategoryAction}
          className="h-fit rounded-[2rem] bg-white p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">Nova categoria</h2>

          <div className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-bold">Nome</label>
              <input
                name="name"
                required
                className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-bold">Descrição</label>
              <textarea
                name="description"
                rows={4}
                className="rounded-2xl border border-black/10 p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-bold">Ordem</label>
              <input
                name="order"
                type="number"
                defaultValue={0}
                className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
              />
            </div>

            <button
              type="submit"
              className="rounded-full bg-[#556B2F] px-7 py-3 text-sm font-bold !text-white transition hover:bg-[#465a28]"
            >
              Criar categoria
            </button>
          </div>
        </form>

        <div className="grid gap-4">
          {categories.map((category) => (
            <form
              key={category.id}
              action={updateCategoryAction.bind(null, category.id)}
              className="rounded-[2rem] bg-white p-6 shadow-sm"
            >
              <div className="grid gap-4 md:grid-cols-[1fr_120px_120px]">
                <div className="grid gap-2">
                  <label className="text-sm font-bold">Nome</label>
                  <input
                    name="name"
                    defaultValue={category.name}
                    className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-bold">Ordem</label>
                  <input
                    name="order"
                    type="number"
                    defaultValue={category.order}
                    className="h-12 rounded-2xl border border-black/10 px-4 text-sm outline-none focus:border-[#556B2F]"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex h-12 items-center gap-2 rounded-2xl border border-black/10 px-4 text-sm font-bold">
                    <input
                      name="isActive"
                      type="checkbox"
                      defaultChecked={category.isActive}
                    />
                    Ativa
                  </label>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <label className="text-sm font-bold">Descrição</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={category.description ?? ""}
                  className="rounded-2xl border border-black/10 p-4 text-sm leading-7 outline-none focus:border-[#556B2F]"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-4">
                <button
                  type="submit"
                  className="cursor-pointer rounded-full bg-[#111111] px-5 py-2.5 text-sm font-bold !text-white transition hover:bg-[#556B2F]"
                >
                  Salvar
                </button>

                <button
                  formAction={deleteCategoryAction.bind(null, category.id)}
                  className="cursor-pointer rounded-full border border-red-200 px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
                >
                  Excluir
                </button>
              </div>
            </form>
          ))}

          {categories.length === 0 && (
            <div className="rounded-[2rem] bg-white p-8 text-center text-neutral-600 shadow-sm">
              Nenhuma categoria cadastrada.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}