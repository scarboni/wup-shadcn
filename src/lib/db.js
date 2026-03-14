// ─────────────────────────────────────────────────────────────
// Prisma Client — Singleton for Next.js (Prisma 7)
// Prevents multiple instances in development due to hot reload
// Uses PrismaPg driver adapter (required in Prisma 7)
//
// Build-safe: returns null when DATABASE_URL is missing
// (e.g. during Vercel static page collection). API routes
// must guard with `if (!db) return NextResponse.json(...)`.
// ─────────────────────────────────────────────────────────────

const globalForPrisma = globalThis;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("DATABASE_URL not set — Prisma client will not be created.");
    return null;
  }

  // Dynamic import so the module doesn't crash at import time
  // if Prisma generated client isn't available yet
  let PrismaClient;
  try {
    PrismaClient = require("@/generated/prisma").PrismaClient;
  } catch {
    console.warn("Prisma client not generated yet — skipping.");
    return null;
  }

  try {
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
    // Adapter not available — try without (Prisma < 7 fallback)
    console.warn("Could not create PrismaPg adapter:", err.message);
    try {
      return new PrismaClient({
        log:
          process.env.NODE_ENV === "development"
            ? ["error", "warn"]
            : ["error"],
      });
    } catch {
      console.warn("Could not create PrismaClient at all — returning null.");
      return null;
    }
  }
}

/** @type {import("@/generated/prisma").PrismaClient | null} */
export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && db) {
  globalForPrisma.prisma = db;
}
