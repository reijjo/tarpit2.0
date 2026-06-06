import { betDetailsBaseSchema } from "./schemas";
import { BetDetailsFormValues } from "./types";

// Bet details fields validation
export function parseBetDetailsDraft(details: BetDetailsFormValues) {
  return betDetailsBaseSchema.safeParse(details);
}

// Adds fallback Home/Away if team fields empty
export function normalizeMatchTeams(homeTeam?: string, awayTeam?: string) {
  return {
    homeTeam: homeTeam?.trim() || "Home",
    awayTeam: awayTeam?.trim() || "Away",
  };
}
