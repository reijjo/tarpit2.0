import { PrefixSuffixTextInput } from "@/components/ui/inputs/PrefixSuffixTextInput";

type StakeCardProps = { test?: string };

export const StakeCard = ({}: StakeCardProps) => {
  return (
    <div className="stake-card">
      <PrefixSuffixTextInput
        label="stake"
        name="stake"
        id="stake"
        errors={[]}
        placeholder="10"
        prefix="3.40"
        suffix="€"
      />
    </div>
  );
};
