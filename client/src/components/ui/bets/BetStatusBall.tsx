import "./BetStatusBall.css";
import { BetStatus } from "@/features/bets/schemas";

import { getBetBallClass } from "@/lib/utils/betHelpers";

export const BetStatusBall = ({ status }: { status: BetStatus }) => {
  return <div className={`bet-status-ball ${getBetBallClass(status)}`}></div>;
};
