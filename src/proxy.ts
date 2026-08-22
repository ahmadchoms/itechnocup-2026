import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "daurnusa_session";

/**
 * Proxy Next.js 16 — proteksi ringan untuk rute yang membutuhkan autentikasi.
 * 
 * Rules:
 * - /admin/*, /profile/*, /listings/*, /chat/*, /requests/create → wajib login. Jika tidak ada session cookie, redirect ke /login
 * 
 * Catatan: pengecekan activeRole atau isAdmin dilakukan di komponen server (layout.tsx/page.tsx),
 * BUKAN di sini sesuai anjuran mitigasi CVE-2025-29927.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE);

  const protectedPrefixes = ["/admin", "/profile", "/listings", "/chat", "/requests/create"];
  
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (isProtected) {
    if (!sessionCookie?.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/listings/:path*", "/chat/:path*", "/requests/create"],
};
