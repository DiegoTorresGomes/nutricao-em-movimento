"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function reschedulePostAction(formData: FormData) {
  const postId = String(formData.get("postId") || "");
  const scheduledAtValue = String(formData.get("scheduledAt") || "");

  if (!postId || !scheduledAtValue) {
    return;
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      slug: true,
    },
  });

  await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      status: "SCHEDULED",
      scheduledAt: new Date(scheduledAtValue),
      publishedAt: null,
    },
  });

  revalidatePath("/administracao/calendario");
  revalidatePath("/administracao/artigos");
  revalidatePath("/pt");
  revalidatePath("/pt/artigos");

  if (post?.slug) {
    revalidatePath(`/pt/artigos/${post.slug}`);
  }
}
