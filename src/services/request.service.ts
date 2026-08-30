import { requestRepository, RequestRepository } from "@/repositories/request.repository";
import { CreateRequestInput, UpdateRequestInput } from "@/validations/request.schema";

export class RequestService {
  constructor(private repo: RequestRepository = requestRepository) {}

  async createRequest(buyerId: string, data: CreateRequestInput) {
    if (!buyerId) {
      throw new Error("ID pembeli tidak valid");
    }
    return this.repo.createRequest(buyerId, data);
  }

  async getRequestById(id: string) {
    const req = await this.repo.findRequestById(id);
    if (!req) {
      throw new Error("Permintaan tidak ditemukan");
    }
    return req;
  }

  async updateRequest(id: string, data: UpdateRequestInput) {
    return this.repo.updateRequest(id, data);
  }

  async deleteRequest(id: string) {
    return this.repo.softDeleteRequest(id);
  }

  async getRequests(filters?: { categoryId?: string; search?: string }) {
    const rawRequests = await this.repo.findManyRequests(filters);

    return rawRequests.map((r: any) => ({
      ...r,
      offeredPrice: Number(r.offeredPrice),
      latitude: r.latitude ? Number(r.latitude) : null,
      longitude: r.longitude ? Number(r.longitude) : null,
      buyer: r.buyer
        ? {
            ...r.buyer,
            latitude: r.buyer.latitude ? Number(r.buyer.latitude) : null,
            longitude: r.buyer.longitude ? Number(r.buyer.longitude) : null,
          }
        : r.buyer,
    }));
  }
}

export const requestService = new RequestService();
