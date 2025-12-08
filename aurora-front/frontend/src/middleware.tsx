// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken && req.nextUrl.pathname.startsWith("/create")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/create/:path*", "/settings/:path*"], // protect multiple paths
};
