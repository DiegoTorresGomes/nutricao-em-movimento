import { prisma } from "@/lib/prisma";

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      {
        order: "asc",
      },
      {
        name: "asc",
      },
    ],
    take: 8,
  });
}