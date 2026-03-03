import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

function decodeBase64(str: string): string {
  const bytes = Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function middleware(req: NextRequest) {
  const password = process.env.SITE_PASSWORD;

  // If no password is set, allow access
  if (!password) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    try {
      const encoded = authHeader.replace(/^Basic\s+/i, "");
      if (encoded) {
        const decoded = decodeBase64(encoded);
        // Basic auth format is "username:password"
        const parts = decoded.split(":");
        // Password is everything after the first colon
        const pwd = parts.length > 1 ? parts.slice(1).join(":") : parts[0];
        if (pwd === password) {
          return NextResponse.next();
        }
      }
    } catch {
      // invalid base64, fall through to 401
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
  });
}
