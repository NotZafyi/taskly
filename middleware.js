import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt"

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();

  // return NextResponse.redirect(new URL("/", req.url));
};
// See "Matching Paths" below to learn more
export const config = {
  matcher: "/dashboard/:path*",
};
