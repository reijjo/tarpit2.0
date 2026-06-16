"use client";
import "./FinishBet.css";
import { StakeCard } from "./forms/cards/StakeCard";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button/Button";

import { BetDetailsWithTempId } from "../types";

type FinishBetProps = {
  setFinishBet: Dispatch<SetStateAction<boolean>>;
  details: BetDetailsWithTempId[];
};

export default function FinishBet({ setFinishBet, details }: FinishBetProps) {
  return (
    <section className="finish-bet-section">
      <div className="stake-section">
        <StakeCard details={details} />
        <div className="finish-bet-buttons">
          <Button type="submit">Add Bet</Button>
          <Button variant="outline" onClick={() => setFinishBet(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </section>
  );
}
