import { listingRepository, ListingRepository } from "@/repositories/listing.repository";
import { CreateListingInput, UpdateListingInput } from "@/validations/listing.schema";

export class ListingService {
  constructor(private repo: ListingRepository = listingRepository) {}

  private formatListingData(item: any) {
    if (!item) return item;
    const formatUser = (user: any) => {
      if (!user) return user;
      return {
        ...user,
        latitude: user.latitude ? Number(user.latitude) : null,
        longitude: user.longitude ? Number(user.longitude) : null,
      };
    };

    return {
      ...item,
      estimatedPrice: item.estimatedPrice ? Number(item.estimatedPrice) : null,
      estimatedWeightKg: item.estimatedWeightKg ? Number(item.estimatedWeightKg) : null,
      latitude: item.latitude ? Number(item.latitude) : null,
      longitude: item.longitude ? Number(item.longitude) : null,
      cvConfidence: item.cvConfidence ? Number(item.cvConfidence) : null,
      seller: formatUser(item.seller),
    };
  }

  async createListing(sellerId: string, data: CreateListingInput) {
    if (!sellerId) {
      throw new Error("ID penjual tidak valid");
    }
    const raw = await this.repo.createListing(sellerId, data);
    return this.formatListingData(raw);
  }

  async getListingById(id: string) {
    const listing = await this.repo.findListingById(id);
    if (!listing) {
      throw new Error("Listing tidak ditemukan");
    }
    return this.formatListingData(listing);
  }

  async updateListing(id: string, data: UpdateListingInput) {
    const raw = await this.repo.updateListing(id, data);
    return this.formatListingData(raw);
  }

  async deleteListing(id: string) {
    const raw = await this.repo.softDeleteListing(id);
    return this.formatListingData(raw);
  }

  async getListings(filters?: { categoryId?: string; search?: string }) {
    const rawListings = await this.repo.findManyListings(filters);

    return rawListings.map((item: any) => {
      const formatted = this.formatListingData(item);
      const reviews = item.seller?.receivedReviews || [];
      const avgRating =
        reviews.length > 0
          ? Number(
              (
                reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length
              ).toFixed(1)
            )
          : 4.8;

      return {
        ...formatted,
        seller: {
          ...formatted.seller,
          rating: avgRating,
        },
        distanceKm: item.title.includes("Kopi")
          ? 0.8
          : item.title.includes("Kardus")
          ? 2.4
          : item.title.includes("Kaleng")
          ? 5.1
          : 1.2,
      };
    });
  }
}

export const listingService = new ListingService();
