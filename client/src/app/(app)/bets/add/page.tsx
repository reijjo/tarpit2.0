import "./layout.css";

import BetDetailsDraft from "@/features/bets/components/BetDetailsDraft";
import BetDetailsForm from "@/features/bets/components/forms/BetDetailsForm";

export default function AddPage() {
  return (
    <div className="add-page wrapper">
      <h1 className="like-h2 uppercase">Add bet</h1>
      <BetDetailsForm />
      <BetDetailsDraft />
    </div>
  );
}
