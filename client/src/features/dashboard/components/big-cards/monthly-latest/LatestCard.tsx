import { LatestBet } from "./LatestBet";
import "./LatestCard.css";
import { Bet } from "@/features/bets/schemas";

import { Card } from "@/components/ui/cards/Card";

const latestPlaceholder: Bet[] = [
  {
    id: 1,
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    stake: 5,
    bookmaker: "bet365",
    tipper: "john_doe",
    sport: "NHL",
    notes: "Good value pick",
    betFinalType: "single",
    betFinalOdds: 2.1,
    status: "pending",
    betDetails: [
      {
        id: 1,
        bet_id: 1,
        date: "2026-05-14",
        homeTeam: "Tampa Bay Lightning",
        awayTeam: "Boston Bruins",
        selection: "Tampa Bay Lightning",
        odds: 2.1,
        freeBet: false,
        liveBet: false,
        betType: "single",
      },
    ],
  },
  {
    id: 2,
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    stake: 2,
    bookmaker: "Unibet",
    tipper: "self",
    sport: "Football",
    betFinalType: "single",
    betFinalOdds: 4.0,
    status: "won",
    betDetails: [
      {
        id: 2,
        bet_id: 2,
        date: "2026-05-13",
        homeTeam: "Chelsea",
        awayTeam: "Liverpool",
        selection: "Draw",
        odds: 4.0,
        homeScore: 1,
        awayScore: 1,
        freeBet: false,
        liveBet: false,
        betType: "single",
      },
    ],
  },
  {
    id: 3,
    user_id: "550e8400-e29b-41d4-a716-446655440000",
    stake: 23.27,
    bookmaker: "Betway",
    tipper: "self",
    sport: "NBA",
    betFinalType: "single",
    betFinalOdds: 1.9,
    status: "lost",
    betDetails: [
      {
        id: 3,
        bet_id: 3,
        date: "2026-05-12",
        homeTeam: "Celtics",
        awayTeam: "Brooklyn",
        selection: "Celtics -13.5",
        odds: 1.9,
        homeScore: 108,
        awayScore: 97,
        freeBet: false,
        liveBet: false,
        betType: "single",
      },
    ],
  },
];

export function LatestCard() {
  return (
    <Card className="latest-card">
      <h6>latest bets</h6>
      <div className="latest-bets-group">
        {latestPlaceholder.map((bet) => (
          <LatestBet key={bet.id} bet={bet} />
        ))}
      </div>
    </Card>
  );
}
