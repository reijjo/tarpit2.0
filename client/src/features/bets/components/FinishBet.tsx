"use client";
import "./FinishBet.css";
import { StakeCard } from "./forms/cards/StakeCard";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/ui/button/Button";

type FinishBetProps = {
  setFinishBet: Dispatch<SetStateAction<boolean>>;
};

export default function FinishBet({ setFinishBet }: FinishBetProps) {
  return (
    <section className="finish-bet-section">
      <div className="stake-section">
        <StakeCard />
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
