"use server";

import { matchService } from "@/services/match.service";

export async function getMatchesAction() {
  try {
    const matches = await matchService.getAllMatches();
    return { success: true, matches };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal mengambil rekomendasi match";
    return { success: false, error: message };
  }
}
