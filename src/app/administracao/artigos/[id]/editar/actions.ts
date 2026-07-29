"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { EditorBlock } from "@/lib/editor/blocks";
import { renderBlocksToHtml } from "@/lib/editor/render-blocks-to-html";

type PostStatus = "DRAFT" | "REVIEW" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";

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

export async function updatePostAction(id: string, formData: FormData) {
  const status = String(formData.get("status") || "DRAFT") as PostStatus;
  const isArticleOfWeek = formData.get("isArticleOfWeek") === "on";
  const coverImage = String(formData.get("coverImage") || "").trim();
  const coverImageAlt = String(formData.get("coverImageAlt") || "").trim();
  const desktopReviewed = formData.get("desktopReviewed") === "on";
  const tabletReviewed = formData.get("tabletReviewed") === "on";
  const mobileReviewed = formData.get("mobileReviewed") === "on";

  const rawContent = String(formData.get("content") || "").trim();
  const contentBlocks = parseContentBlocks(formData.get("contentBlocks"));
  const generatedContent =
    contentBlocks.length > 0 ? renderBlocksToHtml(contentBlocks) : rawContent;

  const seoTitle = String(formData.get("seoTitle") || "").trim();
  const seoDescription = String(formData.get("seoDescription") || "").trim();
  const focusKeyword = String(formData.get("focusKeyword") || "").trim();
  const scheduledAtValue = String(formData.get("scheduledAt") || "").trim();

  if (status === "SCHEDULED" && !scheduledAtValue) {
    throw new Error("Para agendar o artigo, informe data e horário de publicação.");
  }

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

  const updated = await prisma.post.update({
    where: {
      id,
    },
    data: {
      title: String(formData.get("title") || ""),
      desktopReviewed,
      tabletReviewed,
      mobileReviewed,
      description: String(formData.get("description") || ""),
      content: generatedContent,
      contentBlocks:
        contentBlocks.length > 0 ? (contentBlocks as unknown as Prisma.InputJsonValue) : undefined,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      focusKeyword: focusKeyword || null,
      readTime: String(formData.get("readTime") || ""),
      categoryId: String(formData.get("categoryId") || ""),
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      scheduledAt: status === "SCHEDULED" && scheduledAtValue ? new Date(scheduledAtValue) : null,
      isArticleOfWeek,
      coverImage: coverImage || null,
      coverImageAlt: coverImageAlt || null,
    },
  });

  // Keep the cached public pages in sync after an edit (status change,
  // content update, cover swap, etc.).
  revalidatePath("/pt");
  revalidatePath("/pt/artigos");
  revalidatePath("/pt/sobre");
  revalidatePath(`/pt/artigos/${updated.slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  revalidatePath("/administracao/artigos");

  redirect("/administracao/artigos");
}
