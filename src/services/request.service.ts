import { requestRepository, RequestRepository } from "@/repositories/request.repository";
import { CreateRequestInput, UpdateRequestInput } from "@/validations/request.schema";

export class RequestService {
  constructor(private repo: RequestRepository = requestRepository) {}

  private formatRequestData(r: any) {
    if (!r) return r;
    const formatUser = (user: any) => {
      if (!user) return user;
      return {
        ...user,
        latitude: user.latitude ? Number(user.latitude) : null,
        longitude: user.longitude ? Number(user.longitude) : null,
      };
    };

    return {
      ...r,
      offeredPrice: r.offeredPrice ? Number(r.offeredPrice) : null,
      latitude: r.latitude ? Number(r.latitude) : null,
      longitude: r.longitude ? Number(r.longitude) : null,
      buyer: formatUser(r.buyer),
    };
  }

  async createRequest(buyerId: string, data: CreateRequestInput) {
    if (!buyerId) {
      throw new Error("ID pembeli tidak valid");
    }
    const raw = await this.repo.createRequest(buyerId, data);
    return this.formatRequestData(raw);
  }

  async getRequestById(id: string) {
    const req = await this.repo.findRequestById(id);
    if (!req) {
      throw new Error("Permintaan tidak ditemukan");
    }
    return this.formatRequestData(req);
  }

  async updateRequest(id: string, data: UpdateRequestInput) {
    const raw = await this.repo.updateRequest(id, data);
    return this.formatRequestData(raw);
  }

  async deleteRequest(id: string) {
    const raw = await this.repo.softDeleteRequest(id);
    return this.formatRequestData(raw);
  }

  async getRequests(filters?: { categoryId?: string; search?: string }) {
    const rawRequests = await this.repo.findManyRequests(filters);
    return rawRequests.map((r: any) => this.formatRequestData(r));
  }
}

export const requestService = new RequestService();
