export type BetStatus =
  | "won"
  | "halfwon"
  | "lost"
  | "halflost"
  | "void"
  | "pending";

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
