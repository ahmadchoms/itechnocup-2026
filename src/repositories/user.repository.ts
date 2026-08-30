import { prisma } from "@/lib/prisma";

export interface CreateUserData {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  address?: string | null;
}

export interface UpdateUserProfileData {
  fullName?: string;
  phone?: string | null;
  address?: string | null;
  activeRole?: "seller" | "buyer";
  avatarUrl?: string | null;
}

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: CreateUserData) {
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
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findProfileByEmail(email: string) {
    let user = await prisma.user.findFirst({
      where: { email },
      include: {
        listings: {
          include: { category: true },
          orderBy: { createdAt: "desc" },
        },
        sellerTransactions: {
          include: {
            category: true,
            buyer: true,
            listing: true,
          },
          orderBy: { createdAt: "desc" },
        },
        buyerTransactions: {
          include: {
            category: true,
            seller: true,
            listing: true,
          },
          orderBy: { createdAt: "desc" },
        },
        receivedReviews: {
          include: {
            reviewer: true,
          },
          orderBy: { createdAt: "desc" },
        },
        buyerApplication: true,
      },
    });

    if (!user) {
      user = await prisma.user.findFirst({
        include: {
          listings: {
            include: { category: true },
            orderBy: { createdAt: "desc" },
          },
          sellerTransactions: {
            include: {
              category: true,
              buyer: true,
              listing: true,
            },
            orderBy: { createdAt: "desc" },
          },
          buyerTransactions: {
            include: {
              category: true,
              seller: true,
              listing: true,
            },
            orderBy: { createdAt: "desc" },
          },
          receivedReviews: {
            include: {
              reviewer: true,
            },
            orderBy: { createdAt: "desc" },
          },
          buyerApplication: true,
        },
      });
    }

    return user;
  }

  async updateUser(id: string, data: UpdateUserProfileData) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }
}

export const userRepository = new UserRepository();
