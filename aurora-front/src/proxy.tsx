import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  const protectedPaths = ["/cv"];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (!accessToken && isProtected) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirectTo", req.nextUrl.pathname); // add redirect info
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/cv/:path*"], // protect multiple paths
};
