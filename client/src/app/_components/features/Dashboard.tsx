import "./DashboardFeature.css";
import Image from "next/image";

export default function DashboardFeature() {
  return (
    <article className="dashboard-feature">
      <div className="dashboard-feature-wrapper wrapper">
        <div className="dashboard-feature-text">
          <p>
            <strong>Dashboard</strong> shows a recap of your betting.
          </p>
        </div>
        <Image
          src="/images/homepage/dash.png"
          alt="Dashboard"
          width={1600}
          height={900}
        />
      </div>
    </article>
  );
}
