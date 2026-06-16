import { BetDetailsWithTempId } from "@/features/bets/types";

import { getFinalOdds } from "@/lib/utils/betHelpers";

import { PrefixSuffixTextInput } from "@/components/ui/inputs/PrefixSuffixTextInput";

type StakeCardProps = { details: BetDetailsWithTempId[] };

export const StakeCard = ({ details }: StakeCardProps) => {
  console.log("details", details);
  const finalOdds = getFinalOdds(details);
  return (
    <div className="stake-card">
      <PrefixSuffixTextInput
        label="stake"
        name="stake"
        id="stake"
        errors={[]}
        placeholder="10"
        prefix={finalOdds.toFixed(2)}
        suffix="€"
      />
    </div>
  );
};
