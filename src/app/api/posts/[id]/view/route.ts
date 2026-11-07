import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

// Increments an article's view counter. Called once per session from the
// client (see ArticleViewCounter). The status filter means an
// invalid/unpublished id is a silent no-op instead of an error.
export async function POST(_request: Request, { params }: Context) {
  const { id } = await params;

  try {
    // Parameterized SQL changes only the counter, bypassing Prisma's @updatedAt.
    await prisma.$executeRaw`
      UPDATE Post SET views = views + 1 WHERE id = ${id} AND status = 'PUBLISHED'
    `;
  } catch {
    // Never surface counting errors to the reader.
  }

  return NextResponse.json({ ok: true });
}
