"use client";
import "./layout.css";
import { BetDetailsWithTempId } from "@/features/bets/types";
import { useState } from "react";

import BetDetailsForm from "@/features/bets/components/forms/BetDetailsForm";

export default function AddPage() {
  const [betDetails, setBetDetails] = useState<BetDetailsWithTempId[]>([]);

  return (
    <div className="add-page wrapper">
      <h1 className="like-h2 uppercase">Add bet</h1>
      <BetDetailsForm betDetails={betDetails} setBetDetails={setBetDetails} />
    </div>
  );
}
