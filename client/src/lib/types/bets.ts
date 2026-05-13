export type BetStatus =
  | "won"
  | "halfwon"
  | "lost"
  | "halflost"
  | "void"
  | "pending";

export type BetType =
  | "single"
  | "double"
  | "treble"
  | "over"
  | "under"
  | "betbuilder";

export type Bet = {
  id: number;
  date: string;
  home: string;
  away: string;
  selection: string;
  stake: number;
  odds: number;
  status: BetStatus;
};

export type BetDetails = {
  id: number;
  bet_id: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  selection: string;
  odds: number;
  homeScore?: number | string;
  awayScore?: number | string;
  betBuilderSelection?: string[];
  betBuilderScore?: string[];
  freeBet: boolean;
  liveBet: boolean;
  betType: BetType;
};
