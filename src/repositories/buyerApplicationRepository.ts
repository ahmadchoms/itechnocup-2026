import { prisma } from "@/lib/prisma";

export interface CreateBuyerApplicationData {
  userId: string;
  ktpPhotoUrl: string;
  outletPhotoUrl: string;
  npwp?: string | null;
  address: string;
}

export interface UpdateBuyerApplicationData {
  ktpPhotoUrl?: string;
  outletPhotoUrl?: string;
  npwp?: string | null;
  address?: string;
  status?: string;
}

export class BuyerApplicationRepository {
  async findMany() {
    return prisma.buyerApplication.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.buyerApplication.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  async findByUserId(userId: string) {
    return prisma.buyerApplication.findUnique({
      where: { userId },
    });
  }

  async create(data: CreateBuyerApplicationData) {
    return prisma.buyerApplication.create({
      data: {
        userId: data.userId,
        ktpPhotoUrl: data.ktpPhotoUrl,
        outletPhotoUrl: data.outletPhotoUrl,
        npwp: data.npwp || null,
        address: data.address,
      },
    });
  }

  async update(id: string, data: UpdateBuyerApplicationData) {
    return prisma.buyerApplication.update({
      where: { id },
      data,
    });
  }

  async updateByUserId(userId: string, data: UpdateBuyerApplicationData) {
    return prisma.buyerApplication.update({
      where: { userId },
      data,
    });
  }
}

export const buyerApplicationRepository = new BuyerApplicationRepository();
