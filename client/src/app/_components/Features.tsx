import "./Features.css";
import AddBetFeature from "./features/AddbetFeature";
import DashboardFeature from "./features/DashboardFeature";

export default function Features() {
  return (
    <section className="features-section">
      <DashboardFeature />
      <AddBetFeature />
    </section>
  );
}
