import { auth } from "./auth";

export default auth(async (req) => {
  console.log(req.nextUrl.pathname);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
