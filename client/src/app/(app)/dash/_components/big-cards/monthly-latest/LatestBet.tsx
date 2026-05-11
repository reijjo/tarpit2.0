import "./LatestBet.css";
import { Bet } from "@/lib/types/bets";

import { getBetStatusClass } from "@/lib/utils/betHelpers";

import { BetStatusBall } from "@/components/ui/bets/BetStatusBall";

type LatestBetProps = {
  bet: Bet;
};

export function LatestBet({ bet }: LatestBetProps) {
  const returnValue = (status: string): string => {
    if (status === "lost") return `- ${bet.stake.toFixed(2)} €`;
    if (status === "won") return `${(bet.stake * bet.odds).toFixed(2)} €`;
    return "- €";
  };

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
      <div className={`latest-status ${getBetStatusClass(bet.status)}`}>
        <div className="latest-bet-visu">
          <BetStatusBall status={bet.status} />
          <p className="latest-bet-status">{bet.status}</p>
        </div>
        <p className="latest-bet-return">{returnValue(bet.status)}</p>
      </div>
    </button>
  );
}
