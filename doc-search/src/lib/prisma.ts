import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },

  previewFeatures: ['postgresqlExtensions'],
});

if (process.env.NODE_ENV !== 'development') {
  globalForPrisma.prisma = prisma;
}

export default prisma;