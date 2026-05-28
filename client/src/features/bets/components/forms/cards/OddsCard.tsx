import { TextInput } from "@/components/ui/inputs/TextInput";

type OddsCardProps = {
  fieldErrors: {
    odds?: string[];
  };
  draft: {
    odds: number;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const OddsCard = ({
  fieldErrors,
  draft,
  handleChange,
}: OddsCardProps) => {
  return (
    <div className="bet-form-card odds-card">
      <TextInput
        name="odds"
        id="odds"
        label="odds"
        errors={fieldErrors.odds ?? []}
        placeholder="1.91"
        onChange={handleChange}
        value={draft.odds === 0 ? "" : String(draft.odds)}
      />
    </div>
  );
};
