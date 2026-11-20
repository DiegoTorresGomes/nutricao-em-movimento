"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createCategoryAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const order = Number(formData.get("order") || 0);

  if (!name) {
    return;
  }

  const slug = slugify(name, {
    lower: true,
    strict: true,
    locale: "pt",
  });

  await prisma.category.create({
    data: {
      name,
      slug,
      description,
      order,
      isActive: true,
    },
  });

  revalidatePath("/administracao/categorias");
  revalidatePath("/pt");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const order = Number(formData.get("order") || 0);
  const isActive = formData.get("isActive") === "on";

  if (!name) {
    return;
  }

  const slug = slugify(name, {
    lower: true,
    strict: true,
    locale: "pt",
  });

  await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      slug,
      description,
      order,
      isActive,
    },
  });

  revalidatePath("/administracao/categorias");
  revalidatePath("/pt");
}

export async function deleteCategoryAction(id: string) {
  const postsCount = await prisma.post.count({
    where: {
      categoryId: id,
    },
  });

  if (postsCount > 0) {
    redirect(
      "/administracao/categorias?erro=categoria-com-artigos"
    );
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });

  revalidatePath("/administracao/categorias");
  revalidatePath("/pt");

  redirect("/administracao/categorias?sucesso=categoria-excluida");
}