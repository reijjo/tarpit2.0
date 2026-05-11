import "./BetStatusBall.css";
import { BetStatus } from "@/lib/types/bets";

import { getBetBallClass } from "@/lib/utils/betHelpers";

export const BetStatusBall = ({ status }: { status: BetStatus }) => {
  return <div className={`bet-status-ball ${getBetBallClass(status)}`}></div>;
};
