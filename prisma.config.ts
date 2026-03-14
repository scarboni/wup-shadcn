// ─────────────────────────────────────────────────────────────
// Prisma 7 Config — Required for CLI tools (migrate, db push, etc.)
// The datasource URL moved here from schema.prisma in Prisma 7
// ─────────────────────────────────────────────────────────────

import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrate: {
    async url() {
      // Load .env.local manually since Prisma 7 doesn't auto-load env files
      const dotenv = await import("dotenv");
      dotenv.config({ path: path.join(__dirname, ".env.local") });
      return process.env.DATABASE_URL ?? "";
    },
  },
});
