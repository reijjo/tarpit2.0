import { TextInput } from "@/components/ui/inputs/TextInput";

type MatchCardProps = {
  draft: {
    homeTeam?: string;
    awayTeam?: string;
  };
  fieldErrors: {
    homeTeam?: string[];
    awayTeam?: string[];
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const MatchCard = ({
  draft,
  fieldErrors,
  handleChange,
}: MatchCardProps) => {
  return (
    <div className="bet-form-card match-card">
      <div className="match-label">
        <p className="labellike">Match</p>
        <p className="optional-field">(optional)</p>
      </div>
      <div className="match-input-container">
        <TextInput
          name="homeTeam"
          id="homeTeam"
          errors={fieldErrors.homeTeam ?? []}
          placeholder="Home Team"
          className="grow"
          aria-label="Home team"
          onChange={handleChange}
          value={draft.homeTeam ?? ""}
        />
        <div>-</div>
        <TextInput
          name="awayTeam"
          id="awayTeam"
          errors={fieldErrors.awayTeam ?? []}
          placeholder="Away Team"
          className="grow"
          aria-label="Away team"
          onChange={handleChange}
          value={draft.awayTeam ?? ""}
        />
      </div>
    </div>
  );
};
