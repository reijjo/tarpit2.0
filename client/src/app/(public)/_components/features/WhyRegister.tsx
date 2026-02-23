import "./WhyRegister.css";
import { Check, ChartSpline, Dumbbell, LucideIcon } from "lucide-react";

const whyBoxes: Array<{ id: number; icon: LucideIcon; text: string }> = [
  { id: 1, icon: Check, text: "Keep track of your bets" },
  { id: 2, icon: ChartSpline, text: "Analytics improves your betting" },
  { id: 3, icon: Dumbbell, text: "You learn your betting strengths" },
];

export default function WhyRegister() {
  return (
    <article className="why-register-feature">
      <div className="why-register-feature-wrapper wrapper">
        <h2>Why you should register?</h2>
        <div className="why-register-boxes">
          {whyBoxes.map((box) => {
            const Icon = box.icon;
            return (
              <div key={box.id} className="why-register-box">
                <Icon size={48} strokeWidth={1.5} aria-hidden />
                <p>{box.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
