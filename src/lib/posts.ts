import { prisma } from "@/lib/prisma";

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      language: "pt",
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
  });
}

export async function getPublishedPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      language: "pt",
    },
    include: {
      category: true,
      author: true,
    },
  });
}