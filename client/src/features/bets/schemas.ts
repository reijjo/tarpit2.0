import { z } from "zod";

// Bet status
export const betStatusSchema = z.enum([
  "won",
  "halfwon",
  "lost",
  "halflost",
  "void",
  "pending",
]);

export type BetStatus = z.infer<typeof betStatusSchema>;

// Bet type
export const betTypeSchema = z.enum([
  "single",
  "double",
  "treble",
  "foldx4",
  "bigparlay",
  "over",
  "under",
  "betbuilder",
  "other",
  "btts",
  "moniveto",
  "tulosveto",
  "tuplaus",
  "props",
]);

export type BetType = z.infer<typeof betTypeSchema>;

// Bet details
export const betDetailsBaseSchema = z.object({
  date: z.string(),
  homeTeam: z.string().trim().max(50, "Max 50 characters").optional(),
  awayTeam: z.string().trim().max(50, "Max 50 characters").optional(),
  selection: z
    .string()
    .trim()
    .min(1, "Selection is required")
    .max(50, "Max 50 characters"),
  odds: z.preprocess((value) => {
    if (typeof value === "string") {
      return value.replace(",", ".").trim();
    }
    return value;
  }, z.coerce.number("Not a number").positive("Can't be empty")),
  homeScore: z.number().optional(),
  awayScore: z.number().optional(),
  betBuilderSelection: z
    .array(z.string().trim().max(50, "Max 50 characters"))
    .optional(),
  betBuilderScore: z
    .array(z.string().trim().max(50, "Max 50 characters"))
    .optional(),
  freeBet: z.boolean().default(false),
  liveBet: z.boolean().default(false),
  betType: betTypeSchema,
});

export type BetDetailsFormSchema = z.infer<typeof betDetailsBaseSchema>;

export const betDetailsSchema = betDetailsBaseSchema.extend({
  id: z.number(),
  bet_id: z.number(),
});

export type BetDetails = z.infer<typeof betDetailsSchema>;

// Bet
export const betSchema = z.object({
  id: z.number(),
  user_id: z.uuid(),
  stake: z.number().positive(),
  bookmaker: z.string().trim().min(1).max(30, "Max 30 characters"),
  tipper: z.string().trim().min(1).max(30, "Max 30 characters"),
  sport: z.string().trim().min(1).max(50, "Max 50 characters"),
  notes: z.string().trim().max(500, "Max 500 characters").optional(),
  betFinalType: betTypeSchema,
  betFinalOdds: z.number().positive(),
  status: betStatusSchema,
  betDetails: z
    .array(betDetailsSchema)
    .min(1, "At least one bet detail is required"),
});

export type Bet = z.infer<typeof betSchema>;
