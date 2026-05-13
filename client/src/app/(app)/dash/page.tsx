import { MonthlyLatestCards } from "@/features/dashboard/components/big-cards/MonthlyLatestCards";
import { SummaryWinCards } from "@/features/dashboard/components/big-cards/SummaryWinCards";
import { MiniCards } from "@/features/dashboard/components/mini-cards/MiniCards";

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
