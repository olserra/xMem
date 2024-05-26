import { PrismaClient } from "@prisma/client";

// Declare a global variable for the Prisma client
declare global {
  var prisma: PrismaClient | undefined;
}

// Check if the Prisma client has already been initialized
// If not, initialize it and store it in the global variable
if (typeof global.prisma === "undefined") {
  global.prisma = new PrismaClient();
}

// Export the Prisma client
export const prisma = global.prisma;
