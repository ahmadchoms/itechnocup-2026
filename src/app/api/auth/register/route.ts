import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/session";

/**
 * POST /api/auth/register
 * Body: { fullName, email, password, phone?, address? }
 */
export async function POST(request: Request) {
  try {
    const { fullName, email, password, phone, address } = await request.json();

    // Validasi input
    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Nama lengkap, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // Cek email sudah terdaftar
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login." },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Buat user baru
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        phone: phone || null,
        address: address || null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        avatarUrl: true,
        isAdmin: true,
      },
    });

    // Set session cookie
    await setSession(user.id);

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error: any) {
    console.error("[/api/auth/register] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
