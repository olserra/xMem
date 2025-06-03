declare module '../../../../prisma/prisma' {
  import { PrismaClient } from '@prisma/client';
  export const prisma: PrismaClient;
}

declare module 'prisma/prisma' {
  import { PrismaClient } from '@prisma/client';
  export const prisma: PrismaClient;
} 