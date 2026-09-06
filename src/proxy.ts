import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/session";

/**
 * Proxy Next.js 16 — Proteksi rute dengan verifikasi token kriptografis & injeksi Security Headers.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value;
  const userId = await verifySessionToken(sessionCookie);
  const isAuthenticated = Boolean(userId);

  // 1. Auth routes (/login, /register) -> redirect jika sudah authenticated
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (isAuthenticated) {
      const redirectUrl = request.nextUrl.searchParams.get("redirect") || "/profile";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  // 2. Protected routes -> redirect ke login jika belum authenticated
  const protectedPrefixes = [
    "/admin",
    "/profile",
    "/listings/create",
    "/listings/match",
    "/chat",
    "/requests/create",
  ];

  const isProtected = protectedPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Tambahkan Security Headers ke response
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/listings/create",
    "/listings/match/:path*",
    "/chat/:path*",
    "/requests/create",
    "/login",
    "/register",
  ],
};
