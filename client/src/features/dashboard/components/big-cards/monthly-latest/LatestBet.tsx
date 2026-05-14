import "./LatestBet.css";
import { Bet } from "@/features/bets/schemas";

import { getBetStatusClass } from "@/lib/utils/betHelpers";

import { BetStatusBall } from "@/components/ui/bets/BetStatusBall";

type LatestBetProps = {
  bet: Bet;
};

export function LatestBet({ bet }: LatestBetProps) {
  const detail = bet.betDetails[0];

  const returnValue = (status: string): string => {
    if (status === "lost") return `- ${bet.stake.toFixed(2)} €`;
    if (status === "won")
      return `+ ${(bet.stake * bet.betFinalOdds).toFixed(2)} €`;
    return `${bet.stake.toFixed(2)} €`;
  };

  return (
    <button type="button" className="latest-bet">
      <p className="latest-bet-date">{detail?.date}</p>
      <div className="latest-bet-match">
        <p className="latest-home">{detail?.homeTeam}</p>
        <p className="latest-away">{detail?.awayTeam}</p>
        <p className="latest-selection">- {detail?.selection}</p>
      </div>
      <p className="latest-bet-amount">{bet.stake.toFixed(2)} €</p>
      <p className="latest-bet-odds">{bet.betFinalOdds.toFixed(2)}</p>
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
