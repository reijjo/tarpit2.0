import { Bet, BetDetailsFormSchema } from "./schemas";

export type BetDetailsFormValues = BetDetailsFormSchema;
export type BetFormValues = Omit<Bet, "id" | "user_id">;
export type BetDetailsWithTempId = BetDetailsFormValues & { temp_id: string };
