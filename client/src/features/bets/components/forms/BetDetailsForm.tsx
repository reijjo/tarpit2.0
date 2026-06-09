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
import { BetDetailsFormDraft } from "../../hooks";
import { BetDetailsFormValues, BetDetailsWithTempId } from "../../types";
import { normalizeMatchTeams, parseBetDetailsDraft } from "../../utils";
import BetDetailsDraft from "../BetDetailsDraft";

type BetDetailsFormProps = {
  betDetails: BetDetailsWithTempId[];
  setBetDetails: Dispatch<SetStateAction<BetDetailsWithTempId[]>>;
  setStep: Dispatch<SetStateAction<1 | 2>>;
  betDetailsFormDraft: BetDetailsFormDraft;
  onEdit: (detail: BetDetailsWithTempId) => void;
};

export default function BetDetailsForm({
  betDetails,
  setBetDetails,
  setStep,
  betDetailsFormDraft,
  onEdit,
}: BetDetailsFormProps) {
  const {
    draft,
    setDraft,
    fieldErrors,
    setFieldErrors,
    handleChange,
    handleCheckboxChange,
  } = betDetailsFormDraft;

  // Adds the bet details to parlay with temp id
  const addBetDetails = (draft: BetDetailsFormValues, nextStep?: boolean) => {
    const result = parseBetDetailsDraft(draft);

    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      setFieldErrors(fieldErrors);
      return;
    }

    const teams = normalizeMatchTeams(
      result.data.homeTeam,
      result.data.awayTeam,
    );

    setFieldErrors({});
    setBetDetails((prev) => [
      ...prev,
      {
        ...result.data,
        ...teams,
        temp_id: crypto.randomUUID(),
      },
    ]);
    setDraft(INITIAL_BET_DETAILS);
    if (nextStep) setStep(2);
  };

  const handleNextButton = () => {
    const hasValues =
      !!draft.homeTeam || !!draft.awayTeam || !!draft.selection || !!draft.odds;

    if (!hasValues && betDetails.length > 0) {
      setStep(2);
    } else {
      addBetDetails(draft, true);
    }
  };

  return (
    <form className="add-bet-form" action={handleNextButton}>
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
      {betDetails.length > 0 && (
        <BetDetailsDraft
          details={betDetails}
          setBetDetails={setBetDetails}
          onEdit={onEdit}
        />
      )}
      <div className="add-bet-form-buttons">
        <Button size="md" type="submit">
          Next
        </Button>
        <Button
          size="md"
          variant="outline"
          className="add-selection-button"
          onClick={() => addBetDetails(draft)}
        >
          <p>+</p>
          <p>Add Selection</p>
        </Button>
      </div>
    </form>
  );
}
