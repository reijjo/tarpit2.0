import "./BetStatusBall.css";

export const BetStatusBall = ({ status }: { status: string }) => {
  const statusColor = (status: string): string => {
    if (status === "lost" || status === "halflost") return "bet-ball-lost";
    if (status === "won" || status === "halfwon") return "bet-ball-won";
    if (status === "void") return "bet-ball-void";
    return "bet-ball-pending";
  };

  return <div className={`bet-status-ball ${statusColor(status)}`}></div>;
};
