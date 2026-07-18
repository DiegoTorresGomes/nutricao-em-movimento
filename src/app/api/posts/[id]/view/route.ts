import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

// Increments an article's view counter. Called once per session from the
// client (see ArticleViewCounter). updateMany + status filter means an
// invalid/unpublished id is a silent no-op instead of an error.
export async function POST(_request: Request, { params }: Context) {
  const { id } = await params;

  try {
    await prisma.post.updateMany({
      where: {
        id,
        status: "PUBLISHED",
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  } catch {
    // Never surface counting errors to the reader.
  }

  return NextResponse.json({ ok: true });
}
