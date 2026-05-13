import { LatestBet } from "./LatestBet";
import "./LatestCard.css";
import { Bet } from "@/lib/types/bets";

import { Card } from "@/components/ui/cards/Card";

const latestPlaceholder: Bet[] = [
  {
    id: 1,
    date: "16 May",
    home: "Vancouver",
    away: "Florida",
    selection: "Florida",
    stake: 5,
    odds: 1.91,
    status: "pending",
  },
  {
    id: 2,
    date: "16 May",
    home: "Chelsea",
    away: "Liverpool",
    selection: "Draw",
    stake: 2,
    odds: 4,
    status: "won",
  },
  {
    id: 3,
    date: "16 May",
    home: "Celtics",
    away: "Brooklyn",
    selection: "Celtics -13.5",
    stake: 23.27,
    odds: 10,
    status: "lost",
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
