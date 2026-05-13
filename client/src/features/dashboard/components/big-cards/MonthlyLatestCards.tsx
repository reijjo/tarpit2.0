import "./BigCards.css";
import { LatestCard } from "./monthly-latest/LatestCard";
import { MonthlyCard } from "./monthly-latest/MonthlyCard";

export function MonthlyLatestCards() {
  return (
    <section className="dash-monthly-latest-cards">
      <MonthlyCard />
      <LatestCard />
    </section>
  );
}
