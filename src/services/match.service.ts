import { matchRepository, MatchRepository } from "@/repositories/match.repository";

export class MatchService {
  constructor(private repo: MatchRepository = matchRepository) {}

  async getAllMatches() {
    return this.repo.findAllMatches();
  }

  async getMatchById(id: string) {
    return this.repo.findMatchById(id);
  }
}

export const matchService = new MatchService();
