import { reviewRepository, ReviewRepository } from "@/repositories/review.repository";
import { CreateReviewInput } from "@/validations/review.schema";

export class ReviewService {
  constructor(private repo: ReviewRepository = reviewRepository) {}

  async createReview(data: CreateReviewInput) {
    const existing = await this.repo.findExistingReview(data.transactionId, data.reviewerId);
    if (existing) {
      throw new Error("Anda sudah memberikan ulasan untuk transaksi ini");
    }

    return this.repo.createReview(data);
  }

  async getUserReviews(userId: string) {
    const reviews = await this.repo.findReviewsByUserId(userId);
    const avgRating =
      reviews.length > 0
        ? Number(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          )
        : 0;

    return { reviews, avgRating, total: reviews.length };
  }
}

export const reviewService = new ReviewService();
