import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: Context
) {
  const { id } = await params;

  const deleted = await prisma.post.delete({
    where: {
      id,
    },
  });

  // Drop the deleted article from the cached public pages immediately.
  revalidatePath("/pt");
  revalidatePath("/pt/artigos");
  revalidatePath("/pt/sobre");
  revalidatePath(`/pt/artigos/${deleted.slug}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/feed.xml");
  revalidatePath("/administracao/artigos");

  return NextResponse.redirect(
    new URL("/administracao/artigos", request.url)
  );
}