import "./AddBetForm.css";
import "./BetDetailsForm.css";

import { Button } from "@/components/ui/button/Button";
import { Checkbox } from "@/components/ui/inputs/Checkbox";
import { DateInput } from "@/components/ui/inputs/DateInput";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import { TextInput } from "@/components/ui/inputs/TextInput";

import { BET_TYPE_LABELS } from "../../constants";

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
            aria-label="Home team"
          />
          <div>-</div>
          <TextInput
            name="awayTeam"
            id="awayTeam"
            errors={[]}
            placeholder="Away Team"
            className="grow"
            aria-label="Away team"
          />
        </div>
      </div>
      <div className="bet-form-card bet-type-card">
        <SelectInput
          label="Bet Type"
          id="betType"
          name="betType"
          defaultValue={BET_TYPE_LABELS.single}
        >
          {Object.entries(BET_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectInput>
      </div>
      <div className="bet-form-card free-card">
        <Checkbox label="Free Bet" id="freeBet" name="freeBet" />
        <Checkbox label="Live Bet" id="liveBet" name="liveBet" />
      </div>
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
