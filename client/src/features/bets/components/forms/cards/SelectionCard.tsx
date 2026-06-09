"use client";
import { BetType } from "@/features/bets/schemas";

import { TextInput } from "@/components/ui/inputs/TextInput";

import { BetSelectionPill } from "../../BetSelectionPill";

type SelectionCardProps = {
  fieldErrors: {
    selection?: string[];
  };
  draft: {
    selection: string;
    betType: BetType;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const SelectionCard = ({
  fieldErrors,
  draft,
  handleChange,
}: SelectionCardProps) => {
  return (
    <div className="bet-form-card selection-card">
      <TextInput
        name="selection"
        id="selection"
        label="selection"
        errors={fieldErrors.selection ?? []}
        placeholder="Lakers -4.5"
        onChange={handleChange}
        value={draft.selection ?? ""}
      />
      {draft.selection.trim().length > 0 && (
        <BetSelectionPill selection={draft.selection} betType={draft.betType} />
      )}
    </div>
  );
};
