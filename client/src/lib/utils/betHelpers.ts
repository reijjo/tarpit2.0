import { BetStatus } from "@/features/bets/schemas";
import { BetDetailsWithTempId } from "@/features/bets/types";

export function getBetStatusClass(status: BetStatus): string {
  if (status === "lost" || status === "halflost") return "betstatus-lost";
  if (status === "won" || status === "halfwon") return "betstatus-won";
  if (status === "void") return "betstatus-void";
  return "betstatus-pending";
}

export function getBetBallClass(status: BetStatus): string {
  if (status === "lost" || status === "halflost") return "bet-ball-lost";
  if (status === "won" || status === "halfwon") return "bet-ball-won";
  if (status === "void") return "bet-ball-void";
  return "bet-ball-pending";
}

// Bet parsers
export const getFinalOdds = (odds: BetDetailsWithTempId[]): number => {
  return odds.reduce((acc, value) => acc * value.odds, 1);
};
