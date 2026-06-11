import { prisma } from "@/lib/prisma";

export async function GET() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const csv = [
    ["Email", "Status", "DataCadastro"].join(","),
    ...subscribers.map((subscriber) =>
      [
        subscriber.email,
        subscriber.active ? "Ativo" : "Inativo",
        subscriber.createdAt.toISOString(),
      ].join(",")
    ),
  ].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition":
        'attachment; filename="newsletter-subscribers.csv"',
    },
  });
}