"use client";
import "./AddBetForm.css";
import "./FinishBetForm.css";
import { BookmakerCard } from "./cards/BookmakerCard";
import { NotesCard } from "./cards/NotesCard";
import { SportLeagueCard } from "./cards/SportLeagueCard";
import { TipperCard } from "./cards/TipperCard";
import { ArrowLeft } from "lucide-react";
import { Activity, Dispatch, SetStateAction, useEffect, useState } from "react";

import { Button } from "@/components/ui/button/Button";

import { INITIAL_BET } from "../../constants";
import { useBetFormDraft } from "../../hooks";
import { BetDetailsWithTempId, BetFormValues } from "../../types";
import BetDetailsDraft from "../BetDetailsDraft";
import FinishBet from "../FinishBet";

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
  const [finishBet, setFinishBet] = useState(false);

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
        disabled={finishBet}
      />
      <SportLeagueCard />
      <TipperCard
        draft={draft}
        fieldErrors={fieldErrors}
        handleChange={handleChange}
        disabled={finishBet}
      />
      <BookmakerCard />
      <NotesCard />

      <Activity mode={finishBet ? "hidden" : "visible"}>
        <div className="add-bet-form-buttons">
          <Button disabled={finishBet} onClick={() => setFinishBet(true)}>
            add stake
          </Button>
          <Button
            variant="outline"
            className="button-with-icon"
            onClick={goBack}
            disabled={finishBet}
          >
            <ArrowLeft size={16} />
            <p>go back</p>
          </Button>
        </div>
      </Activity>
      <Activity mode={finishBet ? "visible" : "hidden"}>
        <FinishBet setFinishBet={setFinishBet} details={betDetails} />
      </Activity>
    </form>
  );
}
