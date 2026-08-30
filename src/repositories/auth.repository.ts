import { prisma } from "@/lib/prisma";

export interface CreateAuthUserData {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  address?: string | null;
}

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        address: true,
        avatarUrl: true,
        isAdmin: true,
        activeRole: true,
        passwordHash: true,
      },
    });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
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
  }

  async createUser(data: CreateAuthUserData) {
    return prisma.user.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        passwordHash: data.passwordHash,
        phone: data.phone || null,
        address: data.address || null,
      },
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
  }
}

export const authRepository = new AuthRepository();
