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
export const betDetailsSchema = z.object({
  id: z.number(),
  bet_id: z.number(),
  date: z.string(),
  homeTeam: z.string().optional(),
  awayTeam: z.string().optional(),
  selection: z.string(),
  odds: z.number(),
  homeScore: z.number().optional(),
  awayScore: z.number().optional(),
  betBuilderSelection: z.array(z.string()).optional(),
  betBuilderScore: z.array(z.string()).optional(),
  freeBet: z.boolean(),
  liveBet: z.boolean(),
  betType: betTypeSchema,
});

export type BetDetails = z.infer<typeof betDetailsSchema>;

// Bet
export const betSchema = z.object({
  id: z.number(),
  user_id: z.uuid(),
  stake: z.number(),
  bookmaker: z.string(),
  tipper: z.string(),
  sport: z.string(),
  notes: z.string().optional(),
  betFinalType: betTypeSchema,
  betFinalOdds: z.number(),
  status: betStatusSchema,
  betDetails: z.array(betDetailsSchema),
});

export type Bet = z.infer<typeof betSchema>;
