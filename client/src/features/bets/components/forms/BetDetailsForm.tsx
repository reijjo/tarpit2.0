"use client";
import "./AddBetForm.css";
import "./BetDetailsForm.css";
import { BetTypeCard } from "./cards/BetTypeCard";
import { DateCard } from "./cards/DateCard";
import { FreeLiveCard } from "./cards/FreeLiveCard";
import { MatchCard } from "./cards/MatchCard";
import { OddsCard } from "./cards/OddsCard";
import { SelectionCard } from "./cards/SelectionCard";
import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button/Button";

import { INITIAL_BET_DETAILS } from "../../constants";
import { useBetFormDraft } from "../../hooks";
import { BetDetailsFormValues, BetDetailsWithTempId } from "../../types";
import { parseBetDetailsDraft } from "../../utils";

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
