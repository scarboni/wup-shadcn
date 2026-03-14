// ─────────────────────────────────────────────────────────────
// Next.js Middleware (Edge Runtime)
// ─────────────────────────────────────────────────────────────
// 🔧 PRODUCTION: Once database is connected, re-enable auth gating:
//    import NextAuth from "next-auth";
//    import { authConfig } from "./auth.config";
//    const { auth } = NextAuth(authConfig);
//    Then use auth() to check sessions in the middleware below.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/).*)",
  ],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Staging protection ─────
  const sitePassword = process.env.SITE_PASSWORD;
  if (sitePassword) {
    const authHeader = req.headers.get("authorization");
    if (authHeader) {
      try {
        const encoded = authHeader.replace(/^Basic\s+/i, "");
        if (encoded) {
          const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
          const decoded = new TextDecoder().decode(bytes);
          const parts = decoded.split(":");
          const pwd = parts.length > 1 ? parts.slice(1).join(":") : parts[0];
          if (pwd === sitePassword) {
            return NextResponse.next();
          }
        }
      } catch {
        // invalid base64
      }
    }

    // Allow register and auth API without password
    if (pathname.startsWith("/register") || pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="WholesaleUp Staging"' },
    });
  }

  return NextResponse.next();
}
