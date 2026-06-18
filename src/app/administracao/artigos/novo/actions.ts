"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import slugify from "slugify";
import { prisma } from "@/lib/prisma";
import type { EditorBlock } from "@/lib/editor/blocks";
import { renderBlocksToHtml } from "@/lib/editor/render-blocks-to-html";

type CreatePostState = {
  error?: string;
};

function parseContentBlocks(value: FormDataEntryValue | null): EditorBlock[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(String(value));

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as EditorBlock[];
  } catch {
    return [];
  }
}

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const rawContent = String(formData.get("content") || "").trim();
  const categoryId = String(formData.get("categoryId") || "").trim();
  const readTime = String(formData.get("readTime") || "").trim();
  const status = String(formData.get("status") || "DRAFT");
  const isArticleOfWeek = formData.get("isArticleOfWeek") === "on";
  const coverImage = String(formData.get("coverImage") || "").trim();
  const coverImageAlt = String(formData.get("coverImageAlt") || "").trim();

  const seoTitle = String(formData.get("seoTitle") || "").trim();
  const seoDescription = String(formData.get("seoDescription") || "").trim();
  const focusKeyword = String(formData.get("focusKeyword") || "").trim();
  const scheduledAtValue = String(formData.get("scheduledAt") || "").trim();

  const contentBlocks = parseContentBlocks(formData.get("contentBlocks"));
  const generatedContent =
    contentBlocks.length > 0 ? renderBlocksToHtml(contentBlocks) : rawContent;

  if (!title || !description || !generatedContent || !categoryId) {
    return {
      error: "Preencha título, descrição, conteúdo e categoria.",
    };
  }

  if (status === "SCHEDULED" && !scheduledAtValue) {
    return {
      error: "Para agendar o artigo, informe data e horário de publicação.",
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

  const normalizedStatus =
    status === "PUBLISHED" || status === "REVIEW" || status === "SCHEDULED" || status === "ARCHIVED"
      ? status
      : "DRAFT";

  await prisma.post.create({
    data: {
      title,
      slug,
      description,
      subtitle: description,
      content: generatedContent,
      contentBlocks:
        contentBlocks.length > 0 ? (contentBlocks as unknown as Prisma.InputJsonValue) : undefined,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      focusKeyword: focusKeyword || null,
      readTime: readTime || "5 min de leitura",
      status: normalizedStatus,
      language: "pt",
      publishedAt: normalizedStatus === "PUBLISHED" ? new Date() : null,
      scheduledAt:
        normalizedStatus === "SCHEDULED" && scheduledAtValue ? new Date(scheduledAtValue) : null,
      authorId: author.id,
      categoryId,
      isArticleOfWeek,
      coverImage: coverImage || null,
      coverImageAlt: coverImageAlt || null,
    },
  });

  redirect("/administracao/artigos");
}
