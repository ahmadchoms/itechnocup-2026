import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "daurnusa_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari dalam detik

const SECRET_KEY_STRING =
  process.env.SESSION_SECRET || "daurnusa_super_secure_fallback_secret_key_2026_itechnocup";

async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(SECRET_KEY_STRING),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Membuat token session yang ditandatangani secara kriptografis (HMAC-SHA256)
 */
export async function signSessionToken(userId: string): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${userId}.${expiresAt}`;
  const key = await getCryptoKey();
  const encoder = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const signatureHex = bufferToHex(signatureBuffer);
  return `${payload}.${signatureHex}`;
}

/**
 * Memverifikasi integritas dan masa berlaku token session (Edge-compatible)
 */
export async function verifySessionToken(token: string | undefined | null): Promise<string | null> {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) {
    // Fallback migration jika cookie lama masih plain userId (hanya jika valid format)
    if (token.length >= 10 && !token.includes(".")) {
      return token;
    }
    return null;
  }

  const [userId, expiresAtStr, signatureHex] = parts;
  const expiresAt = Number(expiresAtStr);

  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return null; // Token kedaluwarsa
  }

  try {
    const payload = `${userId}.${expiresAtStr}`;
    const key = await getCryptoKey();
    const encoder = new TextEncoder();
    const signatureBytes = hexToBuffer(signatureHex);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      encoder.encode(payload)
    );

    return isValid ? userId : null;
  } catch (error) {
    console.error("[verifySessionToken] Error verifying signature:", error);
    return null;
  }
}

/** Simpan session bertanda tangan ke cookie HttpOnly (server-side only) */
export async function setSession(userId: string): Promise<void> {
  const token = await signSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

/** Hapus cookie session (logout) */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/** Baca dan verifikasi userId dari cookie, atau null jika tidak ada/tidak valid */
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE);
  return verifySessionToken(cookie?.value);
}

/** Ambil data user lengkap dari session terverifikasi, atau null */
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
        activeRole: true,
      },
    });
    if (!user) return null;
    return {
      ...user,
      activeRole: (user.activeRole as "seller" | "buyer") || "seller",
    };
  } catch (error) {
    console.error("[getSessionUser] Error fetching user:", error);
    return null;
  }
}
