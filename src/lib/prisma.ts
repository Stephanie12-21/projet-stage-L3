import { PrismaClient } from "@/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prisma: PrismaClient | undefined;
}

// Crée le client Prisma avec l'extension
const client = new PrismaClient().$extends(
  withAccelerate()
) as unknown as PrismaClient;

export const prisma = global.prisma || client;

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
