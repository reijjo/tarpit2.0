import { betDetailsBaseSchema } from "./schemas";
import { BetDetailsFormValues } from "./types";

// Bet details fields validation
export function parseBetDetailsDraft(details: BetDetailsFormValues) {
  return betDetailsBaseSchema.safeParse(details);
}
