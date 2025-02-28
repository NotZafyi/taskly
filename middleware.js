import { NextRequest, NextResponse } from "next/server";


export function middleware(req) {
    const token = req.cookies.get("next-auth.session-token");
    if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
        console.log("Redirecting to /...");
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next(); // Allow access if authenticated
}

export const config = {
    matcher: ["/dashboard/:path*"],
};