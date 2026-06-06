"use client";
import "./layout.css";
import { INITIAL_BET_DETAILS } from "@/features/bets/constants";
import { useBetFormDraft } from "@/features/bets/hooks";
import {
  BetDetailsFormValues,
  BetDetailsWithTempId,
} from "@/features/bets/types";
import { useState } from "react";

import BetDetailsForm from "@/features/bets/components/forms/BetDetailsForm";
import FinishBetForm from "@/features/bets/components/forms/FinishBetForm";

export default function AddPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [betDetails, setBetDetails] = useState<BetDetailsWithTempId[]>([]);
  const betDetailsFormDraft =
    useBetFormDraft<BetDetailsFormValues>(INITIAL_BET_DETAILS);

  const goBack = () => {
    if (step === 2) setStep(1);
  };

  const editBet = (detail: BetDetailsWithTempId) => {
    setBetDetails((prev) => prev.filter((d) => d.temp_id !== detail.temp_id));
    betDetailsFormDraft.setDraft(detail);
    goBack();
  };

  return (
    <div className="add-page wrapper">
      <h1 className="like-h2 uppercase">Add bet</h1>
      {step === 1 ? (
        <BetDetailsForm
          betDetails={betDetails}
          setBetDetails={setBetDetails}
          setStep={setStep}
          betDetailsFormDraft={betDetailsFormDraft}
          onEdit={editBet}
        />
      ) : (
        <FinishBetForm
          betDetails={betDetails}
          goBack={goBack}
          setBetDetails={setBetDetails}
          onEdit={editBet}
        />
      )}
    </div>
  );
}
