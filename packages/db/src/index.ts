import { PrismaClient } from './generated/prisma/client.js';
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const createPrismaClient = () => {
  // pool using the POOLED URL (DATABASE_URL)
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 2 //pool size for serverless 
  })

  const adapter = new PrismaPg(pool)
  console.log('PrismaPg adapter created:', !!adapter);

  try {
    const client = new PrismaClient({ adapter });
    console.log('PrismaClient instantiated successfully');
    return client;
  } catch (e) {
    console.error('Error instantiating PrismaClient:', e);
    throw e;
  }
}

const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof createPrismaClient> | undefined }

export const prisma: PrismaClient = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; // singleton pattern.