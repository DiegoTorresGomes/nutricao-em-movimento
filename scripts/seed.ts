import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  connectionLimit: 1,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const adminEmail = "admin@nutricaoemovimento.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "change-me-before-production";

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
    create: {
      name: "Administrador",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const categories = [
    {
      name: "Comportamento alimentar",
      slug: "comportamento-alimentar",
      description: "Fome, emoções, hábitos e relação com a comida.",
    },
    {
      name: "Emagrecimento sustentável",
      slug: "emagrecimento-sustentavel",
      description: "Estratégias possíveis para constância sem efeito sanfona.",
    },
    {
      name: "Bem-Estar Nutricional",
      slug: "bem-estar-nutricional",
      description: "Equilíbrio, energia e qualidade de vida através da alimentação.",
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
  }

  const comportamento = await prisma.category.findUniqueOrThrow({
    where: { slug: "comportamento-alimentar" },
  });

  const emagrecimento = await prisma.category.findUniqueOrThrow({
    where: { slug: "emagrecimento-sustentavel" },
  });

  const bemEstar = await prisma.category.findUniqueOrThrow({
    where: { slug: "bem-estar-nutricional" },
  });

  const posts = [
    {
      title: "Como diferenciar fome física de fome emocional",
      slug: "como-diferenciar-fome-fisica-de-fome-emocional",
      description:
        "Entenda os sinais do corpo e da mente para construir uma relação mais consciente com a comida.",
      categoryId: comportamento.id,
      readTime: "5 min de leitura",
    },
    {
      title: "Por que dietas restritivas falham",
      slug: "por-que-dietas-restritivas-falham",
      description:
        "A constância nasce de estratégias possíveis, não de regras extremas que não cabem na rotina.",
      categoryId: emagrecimento.id,
      readTime: "6 min de leitura",
    },
    {
      title: "O que comer antes do treino",
      slug: "o-que-comer-antes-do-treino",
      description:
        "Aprenda princípios simples para melhorar sua disposição sem complicar sua alimentação.",
      categoryId: bemEstar.id,
      readTime: "4 min de leitura",
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        subtitle: post.description,
        content: `
<p>Este é um conteúdo inicial demonstrativo para validar o template premium de artigo do Nutrição e Movimento.</p>

<h2>Uma relação mais consciente com a alimentação</h2>

<p>Construir hábitos alimentares sustentáveis não depende apenas de força de vontade. Envolve rotina, emoções, ambiente, clareza e estratégias possíveis para o dia a dia.</p>

<p>A proposta deste blog é transformar conhecimento técnico em uma linguagem acessível, acolhedora e aplicável, respeitando a individualidade de cada pessoa.</p>

<blockquote>Corpo ativo, mente alinhada, vida em construção.</blockquote>

<h2>Educação alimentar não é prescrição individual</h2>

<p>Os conteúdos publicados aqui possuem caráter educativo. Para orientações individualizadas, avaliação clínica e condutas específicas, procure acompanhamento com nutricionista.</p>
        `,
        status: "PUBLISHED",
        language: "pt",
        publishedAt: new Date(),
        authorId: admin.id,
      },
    });
  }

  console.log("Seed concluído com sucesso.");
  console.log(`Login admin inicial: ${adminEmail}`);
  console.log("Senha inicial configurada via SEED_ADMIN_PASSWORD.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
