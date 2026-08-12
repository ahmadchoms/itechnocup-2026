import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { setSession } from "@/lib/session";

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        avatarUrl: true,
        isAdmin: true,
        passwordHash: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Email atau password tidak valid" },
        { status: 401 }
      );
    }

    // Jika user dari seed (tanpa password), izinkan login langsung dengan password default
    let isValid = false;
    if (user.passwordHash) {
      isValid = await bcrypt.compare(password, user.passwordHash);
    } else {
      // User lama dari seed: izinkan login jika password = "password123"
      isValid = password === "password123";
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Email atau password tidak valid" },
        { status: 401 }
      );
    }

    // Set session
    await setSession(user.id);

    // Jangan kembalikan passwordHash ke client
    const { passwordHash: _, ...safeUser } = user;

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    console.error("[/api/auth/login] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
