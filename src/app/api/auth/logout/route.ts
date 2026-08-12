import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

/**
 * POST /api/auth/logout
 * Hapus cookie session.
 */
export async function POST() {
  await clearSession();
  return NextResponse.json({ success: true });
}
