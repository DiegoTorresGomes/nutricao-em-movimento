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
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
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
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getRelatedPosts(categoryId: string, excludeId: string, limit = 3) {
  // Prefer articles from the same category (excluding the current one).
  const sameCategory = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      language: "pt",
      categoryId,
      NOT: {
        id: excludeId,
      },
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: limit,
  });

  if (sameCategory.length >= limit) {
    return sameCategory;
  }

  // Backfill with the most recent articles from other categories so the
  // section is never empty (and never repeats the ones already picked).
  const alreadyPicked = [excludeId, ...sameCategory.map((post) => post.id)];

  const backfill = await prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      language: "pt",
      NOT: {
        id: {
          in: alreadyPicked,
        },
      },
    },
    include: {
      category: true,
      author: true,
    },
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: limit - sameCategory.length,
  });

  return [...sameCategory, ...backfill];
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
    orderBy: [
      {
        publishedAt: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
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
      {
        createdAt: "desc",
      },
    ],
    take: limit,
  });
}
