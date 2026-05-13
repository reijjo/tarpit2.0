import { SummaryCard } from "./summary-win/SummaryCard";
import { WinCard } from "./summary-win/WinCard";

export function SummaryWinCards() {
  return (
    <section className="dash-summary-win-cards">
      <SummaryCard />
      <WinCard />
    </section>
  );
}
