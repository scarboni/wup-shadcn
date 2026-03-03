import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export function middleware(req: NextRequest) {
  const password = process.env.SITE_PASSWORD;

  // If no password is set, allow access
  if (!password) {
    return NextResponse.next();
  }

  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    try {
      const [scheme, encoded] = authHeader.split(" ");
      if (scheme === "Basic" && encoded) {
        const decoded = atob(encoded);
        const colonIndex = decoded.indexOf(":");
        const pwd = colonIndex !== -1 ? decoded.slice(colonIndex + 1) : decoded;
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
