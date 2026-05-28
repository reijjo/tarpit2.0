import "./BetSelectionPill.css";
import { X } from "lucide-react";

import { BetType } from "../schemas";

type BetSelectionPillProps = {
  selection: string;
  betType: BetType;
};

export const BetSelectionPill = ({
  selection,
  betType,
}: BetSelectionPillProps) => {
  return (
    <div className="bet-selection-pill">
      <p>{selection}</p>
      {betType === "betbuilder" && (
        <button type="button" className="remove-bet-selection">
          <X size={14} strokeWidth={3} />
        </button>
      )}
    </div>
  );
};
