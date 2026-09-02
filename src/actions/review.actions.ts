"use server";

import { reviewService } from "@/services/review.service";
import { getSessionUser } from "@/lib/session";
import { createReviewSchema, CreateReviewInput } from "@/validations/review.schema";
import { revalidatePath } from "next/cache";

export async function createReviewAction(input: CreateReviewInput) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = createReviewSchema.parse(input);
    const review = await reviewService.createReview({
      ...validated,
      reviewerId: sessionUser.id,
    });

    revalidatePath("/profile");
    revalidatePath("/profile/reviews");
    revalidatePath("/chat");

    // Plain JSON object return
    return {
      success: true,
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memberikan ulasan";
    return { success: false, error: message };
  }
}

export async function getUserReviewsAction(userId: string) {
  try {
    const data = await reviewService.getUserReviews(userId);
    return { success: true, ...data };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil ulasan";
    return { success: false, error: message };
  }
}
