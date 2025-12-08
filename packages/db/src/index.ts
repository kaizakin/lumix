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

  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof createPrismaClient> | undefined }

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma; // singleton pattern.