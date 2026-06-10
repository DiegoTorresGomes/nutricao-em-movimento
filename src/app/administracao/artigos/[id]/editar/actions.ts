"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export async function updatePostAction(id: string, formData: FormData) {
  const status = String(formData.get("status") || "DRAFT") as PostStatus;
  const isArticleOfWeek = formData.get("isArticleOfWeek") === "on";
  const coverImage = String(formData.get("coverImage") || "").trim();
  const coverImageAlt = String(formData.get("coverImageAlt") || "").trim();

  if (isArticleOfWeek) {
    await prisma.post.updateMany({
      where: {
        isArticleOfWeek: true,
        NOT: {
          id,
        },
      },
      data: {
        isArticleOfWeek: false,
      },
    });
  }

  await prisma.post.update({
    where: {
      id,
    },
    data: {
      title: String(formData.get("title") || ""),
      description: String(formData.get("description") || ""),
      content: String(formData.get("content") || ""),
      readTime: String(formData.get("readTime") || ""),
      categoryId: String(formData.get("categoryId") || ""),
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      isArticleOfWeek,
      coverImage: coverImage || null,
      coverImageAlt: coverImageAlt || null,
    },
  });

  redirect("/administracao/artigos");
}
