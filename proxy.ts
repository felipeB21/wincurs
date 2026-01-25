import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const PROTECTED_ROUTES = ["/upload-cursor", "/settings", "/success"];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((route) => path.startsWith(route));

  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionToken = getSessionCookie(request);

  if (!sessionToken) {
    return NextResponse.redirect(new URL("/?auth=true", request.url));
  }

  if (path.startsWith("/success")) {
    try {
      const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });
      
      const session = await res.json();

      if (session?.user?.tier !== "premium") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};