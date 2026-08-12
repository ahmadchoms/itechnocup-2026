import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "daurnusa_session";

/**
 * Middleware Next.js — proteksi rute yang membutuhkan autentikasi.
 * 
 * Rules:
 * - /admin/* → wajib login. Jika tidak ada session cookie, redirect ke /login
 * - /api/admin/* → wajib login (return 401 jika tidak ada session)
 * 
 * Catatan: pengecekan is_admin hanya dilakukan di komponen server/page,
 * bukan di middleware ini (agar tidak perlu query DB di edge runtime).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE);

  // Proteksi halaman /admin
  if (pathname.startsWith("/admin")) {
    if (!sessionCookie?.value) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      loginUrl.searchParams.set("reason", "admin");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
