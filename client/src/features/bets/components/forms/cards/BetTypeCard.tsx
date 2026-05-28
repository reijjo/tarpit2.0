import { BET_TYPE_LABELS } from "@/features/bets/constants";
import { BetDetailsFormValues } from "@/features/bets/types";

import { SelectInput } from "@/components/ui/inputs/SelectInput";

type BetTypeCardProps = {
  draft: Pick<BetDetailsFormValues, "betType">;
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export const BetTypeCard = ({ draft, handleChange }: BetTypeCardProps) => {
  return (
    <div className="bet-form-card bet-type-card">
      <SelectInput
        label="Bet Type"
        id="betType"
        name="betType"
        onChange={handleChange}
        value={draft.betType}
      >
        {Object.entries(BET_TYPE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </SelectInput>
    </div>
  );
};
