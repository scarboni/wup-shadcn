// ─────────────────────────────────────────────────────────────
// NextAuth v5 — Edge-safe configuration
// ─────────────────────────────────────────────────────────────
// This file contains ONLY the config that is safe to run in
// the Edge runtime (Next.js middleware). No Prisma, no bcrypt,
// no Node.js-only imports.
//
// The full auth.js extends this config with the Prisma adapter,
// Credentials provider, and database-dependent callbacks.
// ─────────────────────────────────────────────────────────────

// ── Build providers dynamically based on available env vars ──

import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Facebook from "next-auth/providers/facebook";

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (process.env.APPLE_ID && process.env.APPLE_SECRET) {
  providers.push(
    Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    })
  );
}

/** @type {import("next-auth").NextAuthConfig} */
export const authConfig = {
  providers,

  pages: {
    signIn: "/register",
    error: "/register",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // First sign-in: persist user data to JWT
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.tier = user.tier || "free";
        token.tierExpiresAt = user.tierExpiresAt
          ? (typeof user.tierExpiresAt === "string" ? user.tierExpiresAt : user.tierExpiresAt.toISOString())
          : null;
        token.provider = account?.provider || "credentials";

        if (user.remember) {
          token.maxAge = 90 * 24 * 60 * 60;
        }
      }

      // Support session update from server-side profile edits
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.image) token.picture = session.image;
        if (session._serverVerified) {
          if (session.tier) token.tier = session.tier;
          if (session.tierExpiresAt !== undefined) token.tierExpiresAt = session.tierExpiresAt;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.tier = token.tier;
        session.user.tierExpiresAt = token.tierExpiresAt;
        session.user.provider = token.provider;
        session.user.image = token.picture;
      }
      return session;
    },
  },
};
