import { homeRepository, HomeRepository } from "@/repositories/home.repository";
import type { Listing, WasteRequest } from "@/types";

export class HomeService {
  constructor(private repo: HomeRepository = homeRepository) {}

  private formatListing(item: any): Listing {
    const reviews = item.seller?.receivedReviews ?? [];
    const avgRating =
      reviews.length > 0
        ? Number(
            (reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
          )
        : 4.9;

    return {
      ...item,
      estimatedWeightKg: item.estimatedWeightKg ? Number(item.estimatedWeightKg) : null,
      estimatedPrice: item.estimatedPrice ? Number(item.estimatedPrice) : null,
      cvConfidence: item.cvConfidence ? Number(item.cvConfidence) : null,
      latitude: item.latitude ? Number(item.latitude) : null,
      longitude: item.longitude ? Number(item.longitude) : null,
      seller: {
        ...item.seller,
        latitude: item.seller?.latitude ? Number(item.seller.latitude) : null,
        longitude: item.seller?.longitude ? Number(item.seller.longitude) : null,
        rating: avgRating,
      },
    } as unknown as Listing;
  }

  private formatRequest(req: any): WasteRequest {
    return {
      ...req,
      offeredPrice: Number(req.offeredPrice),
      latitude: req.latitude ? Number(req.latitude) : null,
      longitude: req.longitude ? Number(req.longitude) : null,
      buyer: req.buyer
        ? {
            ...req.buyer,
            latitude: req.buyer.latitude ? Number(req.buyer.latitude) : null,
            longitude: req.buyer.longitude ? Number(req.buyer.longitude) : null,
          }
        : req.buyer,
    } as unknown as WasteRequest;
  }

  async getHomePageData(): Promise<{ listings: Listing[]; requests: WasteRequest[] }> {
    const [rawListings, rawRequests] = await Promise.all([
      this.repo.findRecentListings(6),
      this.repo.findRecentRequests(4),
    ]);

    return {
      listings: rawListings.map((item) => this.formatListing(item)),
      requests: rawRequests.map((req) => this.formatRequest(req)),
    };
  }
}

export const homeService = new HomeService();
