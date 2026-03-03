import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const [scheme, encoded] = authHeader.split(" ");
    if (scheme === "Basic" && encoded) {
      const decoded = Buffer.from(encoded, "base64").toString("utf-8");
      // Format is "username:password" — extract everything after the first colon
      const colonIndex = decoded.indexOf(":");
      const password = colonIndex !== -1 ? decoded.slice(colonIndex + 1) : decoded;
      if (password === process.env.SITE_PASSWORD) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
