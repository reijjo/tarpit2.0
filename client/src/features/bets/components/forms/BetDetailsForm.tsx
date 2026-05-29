"use client";
import "./AddBetForm.css";
import "./BetDetailsForm.css";
import { BetTypeCard } from "./cards/BetTypeCard";
import { DateCard } from "./cards/DateCard";
import { FreeLiveCard } from "./cards/FreeLiveCard";
import { MatchCard } from "./cards/MatchCard";
import { OddsCard } from "./cards/OddsCard";
import { SelectionCard } from "./cards/SelectionCard";
import { Dispatch, SetStateAction } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button/Button";

import { INITIAL_BET_DETAILS } from "../../constants";
import { useBetFormDraft } from "../../hooks";
import { BetDetailsFormValues, BetDetailsWithTempId } from "../../types";
import { parseBetDetailsDraft } from "../../utils";

type BetDetailsFormProps = {
  betDetails: BetDetailsWithTempId[];
  setBetDetails: Dispatch<SetStateAction<BetDetailsWithTempId[]>>;
};

export default function BetDetailsForm({
  betDetails,
  setBetDetails,
}: BetDetailsFormProps) {
  const {
    draft,
    setDraft,
    fieldErrors,
    setFieldErrors,
    handleChange,
    handleCheckboxChange,
  } = useBetFormDraft(INITIAL_BET_DETAILS);

  // Adds the bet details to parlay with temp id
  const addDetailsToParlay = (draft: BetDetailsFormValues) => {
    const result = parseBetDetailsDraft(draft);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setFieldErrors(fieldErrors);
      return;
    }

    setFieldErrors({});
    setBetDetails((prev) => [
      ...prev,
      {
        ...result.data,
        temp_id: crypto.randomUUID(),
      },
    ]);
    setDraft(INITIAL_BET_DETAILS);
  };

  console.log("betDetails", betDetails);

  return (
    <form className="add-bet-form">
      <h2>Bet details</h2>
      <MatchCard
        draft={draft}
        fieldErrors={fieldErrors}
        handleChange={handleChange}
      />
      <BetTypeCard draft={draft} handleChange={handleChange} />
      <FreeLiveCard draft={draft} handleCheckboxChange={handleCheckboxChange} />
      <SelectionCard
        fieldErrors={fieldErrors}
        draft={draft}
        handleChange={handleChange}
      />
      <OddsCard
        fieldErrors={fieldErrors}
        draft={draft}
        handleChange={handleChange}
      />
      <DateCard
        fieldErrors={fieldErrors}
        draft={draft}
        handleChange={handleChange}
      />
      <div className="add-bet-form-buttons">
        <Button size="md">Next</Button>
        <Button
          size="md"
          variant="outline"
          className="add-selection-button"
          onClick={() => addDetailsToParlay(draft)}
        >
          <p>+</p>
          <p>Add Selection</p>
        </Button>
      </div>
    </form>
  );
}
