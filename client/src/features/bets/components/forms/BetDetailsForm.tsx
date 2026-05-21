import "./AddBetForm.css";
import "./BetDetailsForm.css";

import { Button } from "@/components/ui/button/Button";
import { DateInput } from "@/components/ui/inputs/DateInput";
import { TextInput } from "@/components/ui/inputs/TextInput";

export default function BetDetailsForm() {
  const today = new Date().toISOString().split("T")[0];

  console.log("today", today);

  return (
    <form className="add-bet-form">
      <h2>Bet details</h2>
      <div className="bet-form-card match-card">
        <div className="match-label">
          <p className="labellike">Match</p>
          <p className="optional-field">(optional)</p>
        </div>
        <div className="match-input-container">
          <TextInput
            name="homeTeam"
            id="homeTeam"
            errors={[]}
            placeholder="Home Team"
            className="grow"
          />
          <div>-</div>
          <TextInput
            name="awayTeam"
            id="awayTeam"
            errors={[]}
            placeholder="Away Team"
            className="grow"
          />
        </div>
      </div>
      <div className="bet-form-card bet-type-card">bettype</div>
      <div className="bet-form-card free-card">free/live</div>
      <div className="bet-form-card selection-card">
        <TextInput
          name="selection"
          id="selection"
          label="selection"
          errors={[]}
          placeholder="Lakers -4.5"
        />
      </div>
      <div className="bet-form-card odds-card">
        <TextInput
          name="odds"
          id="odds"
          label="odds"
          errors={[]}
          placeholder="1.91"
        />
      </div>
      <div className="bet-form-card date-card">
        <DateInput
          name="date"
          id="date"
          label="date"
          errors={[]}
          defaultValue={today}
        />
      </div>
      <div className="add-bet-form-buttons">
        <Button size="md">Add to betslip</Button>
        <Button size="md" variant="outline">
          Add to parlay
        </Button>
      </div>
    </form>
  );
}
