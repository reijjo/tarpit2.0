import "./FeatureCards.css";
import { List, ChartSpline, Landmark, User, LucideIcon } from "lucide-react";

const featureCards: Array<{
  id: number;
  icon: LucideIcon;
  header: string;
  text: string;
}> = [
  {
    id: 1,
    icon: List,
    header: "bets",
    text: "Shows all your bets in one place with couple of filters and sorting options",
  },
  {
    id: 2,
    icon: ChartSpline,
    header: "Analytics",
    text: "Has a lot of different filters and sorting features and charts to learn from your bets",
  },
  {
    id: 3,
    icon: Landmark,
    header: "transactions",
    text: "Keeps track on your deposits and withdrawals",
  },
  {
    id: 4,
    icon: User,
    header: "profile",
    text: "Here you can find different settings for your profile",
  },
];

export default function FeatureCards() {
  return (
    <article className="feature-cards">
      <div className="feature-cards-wrapper wrapper">
        {featureCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.id} className="feature-card">
              <div className="feature-card-header">
                <Icon size={24} strokeWidth={1.5} aria-hidden />
                <h4>{card.header}</h4>
              </div>
              <p>{card.text}</p>
            </div>
          );
        })}
      </div>
    </article>
  );
}
