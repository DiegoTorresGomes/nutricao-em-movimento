import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  const requestSecret =
    request.headers.get("x-cron-secret") ??
    new URL(request.url).searchParams.get("secret");

  if (cronSecret && requestSecret !== cronSecret) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const now = new Date();

  const postsToPublish = await prisma.post.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: {
        lte: now,
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      scheduledAt: true,
    },
  });

  if (postsToPublish.length === 0) {
    return NextResponse.json({
      success: true,
      published: 0,
      posts: [],
    });
  }

  const where = {
    id: { in: postsToPublish.map((post) => post.id) },
    status: "SCHEDULED" as const,
    scheduledAt: { lte: now },
  };
  // A scheduled republication must retain its original publication date.
  // Neither branch marks an editorial review.
  const results = await prisma.$transaction([
    prisma.post.updateMany({
      where: { ...where, publishedAt: null },
      data: { status: "PUBLISHED", publishedAt: now },
    }),
    prisma.post.updateMany({
      where: { ...where, publishedAt: { not: null } },
      data: { status: "PUBLISHED" },
    }),
  ]);

  revalidatePath("/pt");
  revalidatePath("/pt/artigos");
  revalidatePath("/pt/sobre");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  revalidatePath("/administracao/calendario");
  revalidatePath("/administracao/artigos");

  for (const post of postsToPublish) {
    revalidatePath(`/pt/artigos/${post.slug}`);
  }

  return NextResponse.json({
    success: true,
    published: results.reduce((count, result) => count + result.count, 0),
    posts: postsToPublish.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      scheduledAt: post.scheduledAt,
    })),
  });
}
