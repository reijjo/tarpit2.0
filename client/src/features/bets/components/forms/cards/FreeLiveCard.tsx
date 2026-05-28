import { Checkbox } from "@/components/ui/inputs/Checkbox";

type FreeLiveCardProps = {
  draft: {
    freeBet: boolean;
    liveBet: boolean;
  };
  handleCheckboxChange: (
    e: React.ChangeEvent<HTMLInputElement, Element>,
  ) => void;
};

export const FreeLiveCard = ({
  draft,
  handleCheckboxChange,
}: FreeLiveCardProps) => {
  return (
    <div className="bet-form-card free-card">
      <Checkbox
        label="Free Bet"
        id="freeBet"
        name="freeBet"
        onChange={handleCheckboxChange}
        checked={draft.freeBet}
      />
      <Checkbox
        label="Live Bet"
        id="liveBet"
        name="liveBet"
        onChange={handleCheckboxChange}
        checked={draft.liveBet}
      />
    </div>
  );
};
