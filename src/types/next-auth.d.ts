/* ═══════════════════════════════════════════════════════════
   NextAuth Type Augmentation
   Extends the default Session and JWT types with custom fields
   that are set in src/auth.js callbacks (jwt + session).
   ═══════════════════════════════════════════════════════════ */

import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username?: string;
      tier?: string;
      tierExpiresAt?: string | null;
      provider?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username?: string;
    tier?: string;
    tierExpiresAt?: Date | null;
    remember?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    username?: string;
    tier?: string;
    tierExpiresAt?: string | null;
    provider?: string;
    maxAge?: number;
  }
}
