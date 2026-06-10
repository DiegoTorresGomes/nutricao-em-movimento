"use server";

import { redirect } from "next/navigation";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";

type CreatePostState = {
  error?: string;
};

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const readTime = String(formData.get("readTime") || "").trim();
  const status = String(formData.get("status") || "DRAFT");
  const isArticleOfWeek = formData.get("isArticleOfWeek") === "on";
  const coverImage = String(formData.get("coverImage") || "").trim();
  const coverImageAlt = String(formData.get("coverImageAlt") || "").trim();

  if (!title || !description || !content || !categoryId) {
    return {
      error: "Preencha título, descrição, conteúdo e categoria.",
    };
  }

  const author = await prisma.user.findFirst({
    where: {
      role: "ADMIN",
    },
  });

  if (!author) {
    return {
      error: "Nenhum usuário administrador encontrado.",
    };
  }

  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    locale: "pt",
  });

  let slug = baseSlug;
  let counter = 1;

  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  if (isArticleOfWeek) {
    await prisma.post.updateMany({
      where: {
        isArticleOfWeek: true,
      },
      data: {
        isArticleOfWeek: false,
      },
    });
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      description,
      subtitle: description,
      content,
      readTime: readTime || "5 min de leitura",
      status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
      language: "pt",
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      authorId: author.id,
      categoryId,
      isArticleOfWeek,
      coverImage: coverImage || null,
      coverImageAlt: coverImageAlt || null,
    },
  });

  redirect(`/administracao/artigos`);
}
