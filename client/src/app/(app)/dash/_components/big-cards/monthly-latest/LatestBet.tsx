import "./LatestBet.css";
import { Bet } from "@/lib/types/bets";

type LatestBetProps = {
  bet: Bet;
};

export function LatestBet({ bet }: LatestBetProps) {
  const returnValue =
    bet.status === "lost"
      ? `- ${bet.stake.toFixed(2)} €`
      : `${(bet.stake * bet.odds).toFixed(2)} €`;

  return (
    <button type="button" className="latest-bet">
      <p className="latest-bet-date">{bet.date}</p>
      <div className="latest-bet-match">
        <p className="latest-home">{bet.home}</p>
        <p className="latest-away">{bet.away}</p>
        <p className="latest-selection">- {bet.selection}</p>
      </div>
      <p className="latest-bet-amount">{bet.stake.toFixed(2)} €</p>
      <p className="latest-bet-odds">{bet.odds.toFixed(2)}</p>
      <div className="latest-status">
        <div className="latest-bet-visu">
          <div className="latest-bet-ball" />
          <p className="latest-bet-status">{bet.status}</p>
        </div>
        <p className="latest-bet-return">{returnValue}</p>
      </div>
    </button>
  );
}
