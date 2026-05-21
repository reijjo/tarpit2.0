import "./layout.css";

import BetDetailsForm from "@/features/bets/components/forms/BetDetailsForm";

export default function AddPage() {
  return (
    <div className="add-page wrapper">
      <h1 className="like-h2 uppercase">Add bet</h1>
      <BetDetailsForm />
    </div>
  );
}
