import { NextResponse } from "next/server";
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

  await prisma.post.delete({
    where: {
      id,
    },
  });

  return NextResponse.redirect(
    new URL("/administracao/artigos", request.url)
  );
}