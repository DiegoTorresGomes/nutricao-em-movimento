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

export async function getArticleOfWeek() {
  const articleOfWeek = await prisma.post.findFirst({
    where: {
      status: "PUBLISHED",
      language: "pt",
      isArticleOfWeek: true,
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (articleOfWeek) {
    return articleOfWeek;
  }

  return prisma.post.findFirst({
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

export async function getLatestPublishedPosts(limit = 3) {
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
    take: limit,
  });
}

export async function getMostViewedPosts(limit = 8) {
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      language: "pt",
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: [
      {
        views: "desc",
      },
      {
        publishedAt: "desc",
      },
    ],
    take: limit,
  });
}