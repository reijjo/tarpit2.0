import "./Features.css";
import AddbetFeature from "./features/AddbetFeature";
import DashboardFeature from "./features/DashboardFeature";
import FeatureCards from "./features/FeatureCards";
import WhyRegister from "./features/WhyRegister";

export default function Features() {
  return (
    <section className="features-section">
      <DashboardFeature />
      <AddbetFeature />
      <WhyRegister />
      <FeatureCards />
    </section>
  );
}
