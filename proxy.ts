import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/auth-server";

export async function proxy(request: NextRequest) {
  const token = (await cookies()).get("better-auth.session_token")?.value;
  if (!token) return NextResponse.redirect(new URL("/", request.url));
  const session = await getSession();
  if (
    session?.user.tier !== "premium" &&
    request.nextUrl.pathname === "/success"
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/upload-cursor", "/pricing", "/settings", "/success"],
};
