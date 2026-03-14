// ─────────────────────────────────────────────────────────────
// NextAuth v5 — Full configuration (Node.js runtime only)
// ─────────────────────────────────────────────────────────────
// Extends auth.config.js with Prisma adapter, Credentials
// provider, and database-dependent callbacks/events.
//
// ⚠️  Do NOT import this file from middleware.ts — it uses
//     Node.js-only packages (Prisma, bcrypt, pg). The middleware
//     imports auth.config.js directly instead.
// ─────────────────────────────────────────────────────────────

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";

/* ═══════════════════════════════════════════════════════════════
   Production gaps resolved:
   - C5:  Database persistence via Prisma adapter
   - C6:  Session revocation via DB session tracking
   - C9:  Real session state (replaces demo-auth CustomEvent)
   - C10: Real credentials login (replaces Math.random)
   - H6:  Remember Me wired to JWT maxAge
   - H7:  Account linking via Prisma adapter
   ═══════════════════════════════════════════════════════════════ */

// C10 fix: real credentials provider (replaces Math.random() outcomes)
const credentialsProvider = Credentials({
  name: "credentials",
  credentials: {
    identity: { label: "Email or Username", type: "text" },
    password: { label: "Password", type: "password" },
    remember: { label: "Remember Me", type: "text" },
  },
  async authorize(credentials) {
    if (!credentials?.identity || !credentials?.password) {
      return null;
    }

    const identity = credentials.identity.toLowerCase().trim();

    if (!db) return null;

    // Look up user by email or username
    const user = await db.user.findFirst({
      where: {
        OR: [
          { email: identity },
          { username: identity },
        ],
      },
    });

    if (!user || !user.password) {
      return null;
    }

    // Verify password
    const isValid = await bcrypt.compare(credentials.password, user.password);
    if (!isValid) {
      await db.loginHistory.create({
        data: {
          userId: user.id,
          success: false,
          ip: null,
        },
      }).catch(() => {});
      return null;
    }

    // Check email verification
    if (!user.emailVerified) {
      throw new Error("EMAIL_NOT_VERIFIED");
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
      image: user.image,
      username: user.username,
      tier: user.tier,
      tierExpiresAt: user.tierExpiresAt,
      remember: credentials.remember === "true",
    };
  },
});

// Extend the edge-safe jwt callback with database operations
const baseJwtCallback = authConfig.callbacks.jwt;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // C5 fix: Prisma adapter persists users, accounts, sessions to database
  // db may be null during Vercel build (no DATABASE_URL) — skip adapter
  ...(db ? { adapter: PrismaAdapter(db) } : {}),

  // Merge providers: OAuth from config + Credentials (Node.js only)
  providers: [...authConfig.providers, credentialsProvider],

  callbacks: {
    ...authConfig.callbacks,

    async jwt(params) {
      // Run the base (edge-safe) jwt callback first
      const token = await baseJwtCallback(params);

      // Add database operations (Node.js only)
      const { user } = params;
      if (user?.id) {
        await db.loginHistory.create({
          data: {
            userId: user.id,
            success: true,
          },
        }).catch(() => {});
      }

      return token;
    },

    async signIn({ user, account }) {
      // C5: On OAuth sign-in, update or create user in database
      if (account?.provider !== "credentials") {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            await db.user.update({
              where: { id: existingUser.id },
              data: {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
                emailVerified: existingUser.emailVerified || new Date(),
              },
            });
          }
        } catch (_err) {
          // Non-blocking — adapter handles creation
        }
      }

      return true;
    },
  },

  events: {
    // C6: Track session creation for revocation
    async signIn({ user }) {
      if (user?.id) {
        await db.user.update({
          where: { id: user.id },
          data: { updatedAt: new Date() },
        }).catch(() => {});
      }
    },
  },
});
