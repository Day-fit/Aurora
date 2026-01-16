import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  // We only need the refresh token cookie to allow protected routes.
  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isProtected = req.nextUrl.pathname.startsWith("/cv");

  // If the user has NO tokens and is trying to access /cv, redirect them.
  if (isProtected && !refreshToken) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// This config tells Next.js exactly which paths to run this logic on
export const config = {
  matcher: ["/cv/:path*"],
};
