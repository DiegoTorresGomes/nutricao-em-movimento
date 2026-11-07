import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
const client = new PrismaClient({ adapter: new PrismaMariaDb({
  host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER, password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, connectionLimit: 1,
}) });
try {
  await client.$queryRaw`SELECT 1 AS connection_check`;
  console.log('PASS: Prisma 7.10.1 + MariaDB 3.5.4: SELECT 1 (read-only)');
} finally {
  await client.$disconnect();
}
