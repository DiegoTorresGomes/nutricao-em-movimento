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

  await prisma.post.updateMany({
    where: {
      id: {
        in: postsToPublish.map((post) => post.id),
      },
    },
    data: {
      status: "PUBLISHED",
      publishedAt: now,
    },
  });

  revalidatePath("/pt");
  revalidatePath("/pt/artigos");
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  revalidatePath("/administracao/calendario");
  revalidatePath("/administracao/artigos");

  for (const post of postsToPublish) {
    revalidatePath(`/pt/artigos/${post.slug}`);
  }

  return NextResponse.json({
    success: true,
    published: postsToPublish.length,
    posts: postsToPublish.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      scheduledAt: post.scheduledAt,
    })),
  });
}