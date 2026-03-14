// ─────────────────────────────────────────────────────────────
// Prisma Client — Singleton for Next.js (Prisma 7)
// Prevents multiple instances in development due to hot reload
// Uses PrismaPg driver adapter (required in Prisma 7)
// ─────────────────────────────────────────────────────────────

import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("DATABASE_URL not set — Prisma client will not connect to a database.");
    return new PrismaClient();
  }

  try {
    // Dynamic import avoids crashing if pg/adapter isn't available
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaPg } = require("@prisma/adapter-pg");
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  } catch (err) {
    // Database not available — return client without adapter
    // Queries will fail but import won't crash
    console.warn("Could not connect to database:", err.message);
    return new PrismaClient({
      log:
        process.env.NODE_ENV === "development"
          ? ["error", "warn"]
          : ["error"],
    });
  }
}

/** @type {PrismaClient} */
export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
