"use client";
import "./AddBetForm.css";
import "./FinishBetForm.css";
import { BookmakerCard } from "./cards/BookmakerCard";
import { NotesCard } from "./cards/NotesCard";
import { SportLeagueCard } from "./cards/SportLeagueCard";
// import { StakeCard } from "./cards/StakeCard";
import { TipperCard } from "./cards/TipperCard";
import { ArrowLeft } from "lucide-react";
import { Dispatch, SetStateAction, useEffect } from "react";

import { Button } from "@/components/ui/button/Button";

import { INITIAL_BET } from "../../constants";
import { useBetFormDraft } from "../../hooks";
import { BetDetailsWithTempId, BetFormValues } from "../../types";
import BetDetailsDraft from "../BetDetailsDraft";

type FinishBetFormProps = {
  betDetails: BetDetailsWithTempId[];
  setBetDetails: Dispatch<SetStateAction<BetDetailsWithTempId[]>>;
  onEdit: (detail: BetDetailsWithTempId) => void;
  goBack: () => void;
};

export default function FinishBetForm({
  betDetails,
  setBetDetails,
  onEdit,
  goBack,
}: FinishBetFormProps) {
  const { draft, fieldErrors, handleChange } =
    useBetFormDraft<BetFormValues>(INITIAL_BET);

  useEffect(() => {
    if (betDetails.length === 0) goBack();
  }, [betDetails.length, goBack]);

  return (
    <form className="add-bet-form">
      <h2>Finish bet</h2>
      <BetDetailsDraft
        details={betDetails}
        setBetDetails={setBetDetails}
        onEdit={onEdit}
      />
      <SportLeagueCard />
      <TipperCard
        draft={draft}
        fieldErrors={fieldErrors}
        handleChange={handleChange}
      />
      <BookmakerCard />
      <NotesCard />
      {/*<StakeCard />*/}

      <div className="add-bet-form-buttons">
        <Button>add stake</Button>
        <Button variant="outline" className="button-with-icon" onClick={goBack}>
          <ArrowLeft size={16} />
          <p>go back</p>
        </Button>
      </div>
    </form>
  );
}
