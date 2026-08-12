import { prisma } from "@/lib/prisma";

// Campos mínimos para telas de listagem/descoberta (Hero, destaque, mais
// recentes, mais lidos, explorar por tema, todos os artigos). Deliberadamente
// SEM `content`/`contentBlocks` (LongText/Json pesados, só necessários na
// página do artigo individual) — evita over-fetch dos 27+ artigos de uma vez.
const listingSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  coverImage: true,
  coverImageAlt: true,
  publishedAt: true,
  views: true,
  isArticleOfWeek: true,
  category: {
    select: { id: true, name: true, slug: true },
  },
} as const;

export type ArticleListItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  coverImageAlt: string | null;
  publishedAt: Date | null;
  views: number;
  isArticleOfWeek: boolean;
  category: { id: string; name: string; slug: string };
};

// Uma única query leve para toda a página /pt/artigos. Destaque, mais
// recentes, mais lidos e contagem por categoria são derivados EM MEMÓRIA a
// partir deste array — evita disparar 4-5 queries separadas (e N+1) para
// seções que, no fundo, particionam o mesmo conjunto de posts publicados.
export async function getArticlesForListing(): Promise<ArticleListItem[]> {
  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      language: "pt",
    },
    select: listingSelect,
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

export async function getPublishedPostsCount() {
  // Conta apenas artigos realmente publicados (exclui rascunhos e agendados
  // ainda não publicados). Usa COUNT no banco, sem carregar os registros.
  return prisma.post.count({
    where: {
      status: "PUBLISHED",
      language: "pt",
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
