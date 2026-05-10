import "./MiniCards.css";
import { MiniSummaryCard } from "./MiniSummaryCard";
import { Pencil, Percent, PiggyBank } from "lucide-react";

export function MiniCards() {
  return (
    <section className="dash-mini-summary-cards">
      <MiniSummaryCard icon={Pencil} value={203} label="total bets" />
      <MiniSummaryCard icon={Percent} value={122} label="return %" />
      <MiniSummaryCard icon={PiggyBank} value={`203 €`} label="total profit" />
    </section>
  );
}
