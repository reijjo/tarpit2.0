import { MiniCards } from "./_components/mini-cards/MiniCards";

function DashContent() {
  return (
    <div className="dash-page wrapper">
      <MiniCards />
      <div>summary win%</div>
      <div>monthly latest bets</div>
    </div>
  );
}

export default function Dashboard() {
  return <DashContent />;
}
