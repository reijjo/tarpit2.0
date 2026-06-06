"use client";
import "./AddBetForm.css";
import "./FinishBetForm.css";
import { ArrowLeft } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button/Button";

import { BetDetailsWithTempId } from "../../types";
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
  return (
    <form className="add-bet-form">
      <h2>Finish bet</h2>
      <BetDetailsDraft
        details={betDetails}
        setBetDetails={setBetDetails}
        onEdit={onEdit}
      />

      <div className="add-bet-form-buttons">
        <Button>add bet</Button>
        <Button variant="outline" className="button-with-icon" onClick={goBack}>
          <ArrowLeft size={16} />
          <p>go back</p>
        </Button>
      </div>
    </form>
  );
}
