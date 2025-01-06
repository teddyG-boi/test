import { PrismaClient } from "@prisma/client";
import { env } from "../env/server.mjs";

const prismaOptions = {
  log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  errorFormat: "pretty",
};

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

if (!global.prisma) {
  global.prisma = new PrismaClient(prismaOptions);
}

export const prisma = global.prisma;
