import { MonthlyLatestCards } from "./_components/big-cards/MonthlyLatestCards";
import { SummaryWinCards } from "./_components/big-cards/SummaryWinCards";
import { MiniCards } from "./_components/mini-cards/MiniCards";

function DashContent() {
  return (
    <div className="dash-page wrapper">
      <MiniCards />
      <SummaryWinCards />
      <MonthlyLatestCards />
    </div>
  );
}

export default function Dashboard() {
  return <DashContent />;
}
