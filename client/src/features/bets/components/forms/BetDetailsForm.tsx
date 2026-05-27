"use client";
import "./AddBetForm.css";
import "./BetDetailsForm.css";
import { useState } from "react";
import z from "zod";

import { Button } from "@/components/ui/button/Button";
import { Checkbox } from "@/components/ui/inputs/Checkbox";
import { DateInput } from "@/components/ui/inputs/DateInput";
import { SelectInput } from "@/components/ui/inputs/SelectInput";
import { TextInput } from "@/components/ui/inputs/TextInput";

import { BET_TYPE_LABELS, INITIAL_BET_DETAILS } from "../../constants";
import { useBetFormDraft } from "../../hooks";
import { betDetailsBaseSchema, betTypeSchema } from "../../schemas";
import { BetDetailsFormValues, BetDetailsWithTempId } from "../../types";

export default function BetDetailsForm() {
  const [betDetails, setBetDetails] = useState<BetDetailsWithTempId[]>([]);
  const {
    draft,
    setDraft,
    fieldErrors,
    setFieldErrors,
    handleChange,
    handleCheckboxChange,
  } = useBetFormDraft(INITIAL_BET_DETAILS);

  const today = new Date().toISOString().split("T")[0];

  const addDetailsToParlay = (draft: BetDetailsFormValues) => {
    const result = betDetailsBaseSchema.safeParse(draft);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setFieldErrors(fieldErrors);
      return;
    }

    setFieldErrors({});
    setBetDetails((prev) => [
      ...prev,
      {
        ...draft,
        temp_id: crypto.randomUUID(),
      },
    ]);
    setDraft(INITIAL_BET_DETAILS);
  };

  console.log("today", today);
  console.log("betDetails", betDetails);

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
            errors={fieldErrors.homeTeam ?? []}
            placeholder="Home Team"
            className="grow"
            aria-label="Home team"
            onChange={handleChange}
            value={draft.homeTeam ?? ""}
          />
          <div>-</div>
          <TextInput
            name="awayTeam"
            id="awayTeam"
            errors={fieldErrors.awayTeam ?? []}
            placeholder="Away Team"
            className="grow"
            aria-label="Away team"
            onChange={handleChange}
            value={draft.awayTeam ?? ""}
          />
        </div>
      </div>
      <div className="bet-form-card bet-type-card">
        <SelectInput
          label="Bet Type"
          id="betType"
          name="betType"
          defaultValue={betTypeSchema.enum.single}
          onChange={handleChange}
          value={draft.betType}
        >
          {Object.entries(BET_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </SelectInput>
      </div>
      <div className="bet-form-card free-card">
        <Checkbox
          label="Free Bet"
          id="freeBet"
          name="freeBet"
          onChange={handleCheckboxChange}
          checked={draft.freeBet}
        />
        <Checkbox
          label="Live Bet"
          id="liveBet"
          name="liveBet"
          onChange={handleCheckboxChange}
          checked={draft.liveBet}
        />
      </div>
      <div className="bet-form-card selection-card">
        <TextInput
          name="selection"
          id="selection"
          label="selection"
          errors={fieldErrors.selection ?? []}
          placeholder="Lakers -4.5"
          onChange={handleChange}
          value={draft.selection ?? ""}
        />
      </div>
      <div className="bet-form-card odds-card">
        <TextInput
          name="odds"
          id="odds"
          label="odds"
          errors={fieldErrors.odds ?? []}
          placeholder="1.91"
          onChange={handleChange}
          value={draft.odds === 0 ? "" : String(draft.odds)}
        />
      </div>
      <div className="bet-form-card date-card">
        <DateInput
          name="date"
          id="date"
          label="date"
          errors={fieldErrors.date ?? []}
          onChange={handleChange}
          value={draft.date ?? today}
        />
      </div>
      <div className="add-bet-form-buttons">
        <Button size="md">Add to betslip</Button>
        <Button
          size="md"
          variant="outline"
          onClick={() => addDetailsToParlay(draft)}
        >
          Add to parlay
        </Button>
      </div>
    </form>
  );
}
