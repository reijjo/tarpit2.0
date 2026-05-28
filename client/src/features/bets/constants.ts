import { BetStatus, BetType } from "./schemas";
import { BetDetailsWithTempId } from "./types";

export const BET_STATUS_LABELS: Record<BetStatus, string> = {
  won: "Won",
  halfwon: "Half Won",
  lost: "Lost",
  halflost: "Half Lost",
  void: "Void",
  pending: "Pending",
};

export const BET_TYPE_LABELS: Record<BetType, string> = {
  single: "Single",
  double: "Double",
  treble: "Treble",
  foldx4: "4-Fold",
  bigparlay: "Big Parlay",
  over: "Over",
  under: "Under",
  betbuilder: "Bet Builder",
  other: "Other",
  btts: "Both Teams To Score",
  moniveto: "Multiple Scores",
  tulosveto: "Correct Score",
  tuplaus: "Ladder Challenge",
  props: "Player Props",
};

export const INITIAL_BET_DETAILS: BetDetailsWithTempId = {
  temp_id: "",
  date: new Date().toISOString().split("T")[0],
  homeTeam: "",
  awayTeam: "",
  selection: "",
  odds: 0,
  homeScore: 0,
  awayScore: 0,
  betBuilderSelection: [],
  betBuilderScore: [],
  freeBet: false,
  liveBet: false,
  betType: "single",
};
