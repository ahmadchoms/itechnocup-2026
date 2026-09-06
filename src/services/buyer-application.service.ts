import { prisma } from "@/lib/prisma";
import {
  buyerApplicationRepository,
  BuyerApplicationRepository,
} from "@/repositories/buyer-application.repository";

export interface SubmitBuyerAppDTO {
  ktpPhotoUrl: string;
  outletPhotoUrl: string;
  npwp?: string | null;
  address: string;
}

export class BuyerApplicationService {
  constructor(private repo: BuyerApplicationRepository = buyerApplicationRepository) {}

  async getAllApplications() {
    const buyerApplications = await this.repo.findMany();

    return buyerApplications.map((app) => ({
      ...app,
      createdAt: app.createdAt.toISOString(),
      updatedAt: app.updatedAt.toISOString(),
      user: {
        ...app.user,
        createdAt: app.user.createdAt.toISOString(),
        updatedAt: app.user.updatedAt.toISOString(),
        latitude: app.user.latitude ? Number(app.user.latitude) : null,
        longitude: app.user.longitude ? Number(app.user.longitude) : null,
      },
    }));
  }

  async submitApplication(userId: string, dto: SubmitBuyerAppDTO) {
    if (!dto.ktpPhotoUrl || !dto.outletPhotoUrl || !dto.address) {
      throw new Error("Foto KTP, Foto Tempat Usaha, dan Alamat wajib diisi");
    }

    const existingApp = await this.repo.findByUserId(userId);

    if (existingApp && existingApp.status === "menunggu") {
      throw new Error("Anda sudah memiliki pengajuan yang sedang diproses");
    }

    let app;
    if (existingApp) {
      app = await this.repo.updateByUserId(userId, {
        ktpPhotoUrl: dto.ktpPhotoUrl,
        outletPhotoUrl: dto.outletPhotoUrl,
        npwp: dto.npwp || null,
        address: dto.address,
        status: "menunggu",
      });
    } else {
      app = await this.repo.create({
        userId,
        ktpPhotoUrl: dto.ktpPhotoUrl,
        outletPhotoUrl: dto.outletPhotoUrl,
        npwp: dto.npwp || null,
        address: dto.address,
      });
    }

    return {
      id: app.id,
      userId: app.userId,
      ktpPhotoUrl: app.ktpPhotoUrl,
      outletPhotoUrl: app.outletPhotoUrl,
      npwp: app.npwp,
      address: app.address,
      status: app.status,
      createdAt: app.createdAt ? app.createdAt.toISOString() : null,
      updatedAt: app.updatedAt ? app.updatedAt.toISOString() : null,
    };
  }

  async approveApplication(applicationId: string) {
    const application = await this.repo.findById(applicationId);
    if (!application) {
      throw new Error("Aplikasi tidak ditemukan");
    }

    await prisma.user.update({
      where: { id: application.userId },
      data: { isBuyerApproved: true },
    });

    return this.repo.update(applicationId, { status: "disetujui" });
  }

  async rejectApplication(applicationId: string) {
    const application = await this.repo.findById(applicationId);
    if (!application) {
      throw new Error("Aplikasi tidak ditemukan");
    }

    await prisma.user.update({
      where: { id: application.userId },
      data: { isBuyerApproved: false },
    });

    return this.repo.update(applicationId, { status: "ditolak" });
  }
}

export const buyerApplicationService = new BuyerApplicationService();
