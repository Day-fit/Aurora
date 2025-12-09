// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken && (req.nextUrl.pathname.startsWith("/create") || req.nextUrl.pathname.startsWith("/edit"))) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/create/:path*", "/edit/:path*"], // protect multiple paths
};
