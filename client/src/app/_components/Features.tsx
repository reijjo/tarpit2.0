import "./Features.css";
import DashboardFeature from "./features/Dashboard";

export default function Features() {
  return (
    <section className="features-section">
      <DashboardFeature />
      <article className="add-bet-feature">
        <div className="add-bet-feature-wrapper wrapper">
          <p>ADD BET COMIING</p>
        </div>
      </article>
    </section>
  );
}
