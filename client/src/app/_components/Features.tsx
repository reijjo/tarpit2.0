import "./Features.css";
import AddbetFeature from "./features/AddbetFeature";
import DashboardFeature from "./features/DashboardFeature";

export default function Features() {
  return (
    <section className="features-section">
      <DashboardFeature />
      <AddbetFeature />
    </section>
  );
}
