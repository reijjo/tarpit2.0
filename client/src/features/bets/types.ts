import { Bet, BetDetails } from "./schemas";

export type BetDetailsFormValues = Omit<BetDetails, "id" | "bet_id">;
export type BetFormValues = Omit<Bet, "id" | "user_id">;
