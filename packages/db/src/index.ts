import { PrismaClient } from './generated/prisma/client.js';

declare global {
  var prismaClient: PrismaClient | undefined;
}

const prisma = global.prismaClient || new (PrismaClient as unknown as new () => PrismaClient)();

if (process.env.NODE_ENV !== 'production') {
  global.prismaClient = prisma;
}

export default prisma;