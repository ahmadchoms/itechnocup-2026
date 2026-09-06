import { prisma } from "@/lib/prisma";
import { CreateReviewInput } from "@/validations/review.schema";

export class ReviewRepository {
  async createReview(data: CreateReviewInput) {
    return prisma.review.create({
      data: {
        transactionId: data.transactionId,
        reviewerId: data.reviewerId,
        revieweeId: data.revieweeId,
        rating: data.rating,
        comment: data.comment || null,
      },
      include: {
        reviewer: { select: { id: true, fullName: true, avatarUrl: true } },
        reviewee: { select: { id: true, fullName: true } },
      },
    });
  }

  async findExistingReview(transactionId: string, reviewerId: string) {
    return prisma.review.findFirst({
      where: { transactionId, reviewerId },
    });
  }

  async findReviewsByUserId(userId: string) {
    return prisma.review.findMany({
      where: { revieweeId: userId },
      include: {
        reviewer: { select: { id: true, fullName: true, avatarUrl: true } },
        transaction: { select: { id: true, status: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const reviewRepository = new ReviewRepository();
