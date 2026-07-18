import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  connectionLimit: 1,
});

const prisma = new PrismaClient({ adapter });

const OLD_SLUG = "nutricao-esportiva";
const NEW_SLUG = "bem-estar-nutricional";

const NEW_NAME = "Bem-Estar Nutricional";
const NEW_DESCRIPTION = "Equilíbrio, energia e qualidade de vida através da alimentação.";

async function main() {
  const oldCategory = await prisma.category.findUnique({
    where: { slug: OLD_SLUG },
  });
  const newCategory = await prisma.category.findUnique({
    where: { slug: NEW_SLUG },
  });

  // Caso 1: já existe a categoria nova E a antiga (o seed criou uma duplicata).
  // Movemos os posts da antiga para a nova, apagamos a órfã e normalizamos a nova.
  if (oldCategory && newCategory) {
    const moved = await prisma.post.updateMany({
      where: { categoryId: oldCategory.id },
      data: { categoryId: newCategory.id },
    });
    await prisma.category.delete({ where: { id: oldCategory.id } });
    await prisma.category.update({
      where: { id: newCategory.id },
      data: { name: NEW_NAME, description: NEW_DESCRIPTION },
    });
    console.log(
      `Mesclado: ${moved.count} post(s) movido(s) para "${NEW_SLUG}"; categoria "${OLD_SLUG}" removida.`,
    );
    return;
  }

  // Caso 2: só existe a antiga -> renomeia in-place (preserva id e vínculos dos posts).
  if (oldCategory && !newCategory) {
    await prisma.category.update({
      where: { id: oldCategory.id },
      data: { slug: NEW_SLUG, name: NEW_NAME, description: NEW_DESCRIPTION },
    });
    console.log(`Renomeado: "${OLD_SLUG}" -> "${NEW_SLUG}" (id preservado, posts intactos).`);
    return;
  }

  // Caso 3: só existe a nova -> garante nome/descrição corretos (idempotente).
  if (!oldCategory && newCategory) {
    await prisma.category.update({
      where: { id: newCategory.id },
      data: { name: NEW_NAME, description: NEW_DESCRIPTION },
    });
    console.log(`Nada a migrar: "${NEW_SLUG}" já existe. Nome/descrição normalizados.`);
    return;
  }

  // Caso 4: nenhuma das duas existe.
  console.log(`Nenhuma categoria "${OLD_SLUG}" ou "${NEW_SLUG}" encontrada. Nada a fazer.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
