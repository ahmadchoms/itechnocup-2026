import {
  buyerApplicationRepository,
  BuyerApplicationRepository,
} from "@/repositories/buyerApplicationRepository";

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
      user: {
        ...app.user,
        latitude: app.user.latitude ? Number(app.user.latitude) : null,
        longitude: app.user.longitude ? Number(app.user.longitude) : null,
      },
    }));
  }

  async submitApplication(userId: string, dto: SubmitBuyerAppDTO) {
    if (!dto.ktpPhotoUrl || !dto.outletPhotoUrl || !dto.address) {
      throw new Error("Foto KTP, Foto Outlet, dan Alamat wajib diisi");
    }

    const existingApp = await this.repo.findByUserId(userId);

    if (existingApp && existingApp.status === "menunggu") {
      throw new Error("Anda sudah memiliki pengajuan yang sedang diproses");
    }

    if (existingApp) {
      return this.repo.updateByUserId(userId, {
        ktpPhotoUrl: dto.ktpPhotoUrl,
        outletPhotoUrl: dto.outletPhotoUrl,
        npwp: dto.npwp || null,
        address: dto.address,
        status: "menunggu",
      });
    }

    return this.repo.create({
      userId,
      ktpPhotoUrl: dto.ktpPhotoUrl,
      outletPhotoUrl: dto.outletPhotoUrl,
      npwp: dto.npwp || null,
      address: dto.address,
    });
  }

  async approveApplication(applicationId: string) {
    const application = await this.repo.findById(applicationId);
    if (!application) {
      throw new Error("Aplikasi tidak ditemukan");
    }

    return this.repo.update(applicationId, { status: "disetujui" });
  }

  async rejectApplication(applicationId: string) {
    const application = await this.repo.findById(applicationId);
    if (!application) {
      throw new Error("Aplikasi tidak ditemukan");
    }

    return this.repo.update(applicationId, { status: "ditolak" });
  }
}

export const buyerApplicationService = new BuyerApplicationService();
