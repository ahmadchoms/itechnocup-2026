import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "daurnusa_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 hari

/** Simpan userId ke cookie HttpOnly (server-side only) */
export async function setSession(userId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

/** Hapus cookie session (logout) */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Baca userId dari cookie, atau null jika tidak ada */
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  return cookie?.value ?? null;
}

/** Ambil data user lengkap dari session, atau null */
export async function getSessionUser() {
  const userId = await getSessionUserId();
  if (!userId) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        avatarUrl: true,
        isAdmin: true,
        isBuyerApproved: true,
        activeRole: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}
