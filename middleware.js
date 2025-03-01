import { NextResponse } from "next/server";

export function middleware(req) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader?.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

  const { pathname } = req.nextUrl;

  // Redirect unauthenticated users from /dashboard to /
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect authenticated users from / to /dashboard
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
