import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const PROTECTED_ROUTES = ["/upload-cursor", "/settings", "/success"];
const PUBLIC_ONLY_ROUTES = ["/login", "/signup"];

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some((route) => path.startsWith(route));
  const isPublicOnly = PUBLIC_ONLY_ROUTES.some((route) =>
    path.startsWith(route),
  );

  if (!isProtected && !isPublicOnly) {
    return NextResponse.next();
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;

  if (isProtected) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (path === "/success") {
      const res = await fetch(
        `${request.nextUrl.origin}/api/auth/get-session`,
        {
          headers: { cookie: `better-auth.session_token=${sessionToken}` },
        },
      );
      const session = await res.json();

      if (session?.user?.tier !== "premium") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }
  }

  if (isPublicOnly && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
