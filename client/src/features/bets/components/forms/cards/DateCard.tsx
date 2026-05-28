import { DateInput } from "@/components/ui/inputs/DateInput";

type DateCardProps = {
  fieldErrors: {
    date?: string[];
  };
  draft: {
    date: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function DateCard({ fieldErrors, draft, handleChange }: DateCardProps) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bet-form-card date-card">
      <DateInput
        name="date"
        id="date"
        label="date"
        errors={fieldErrors.date ?? []}
        onChange={handleChange}
        value={draft.date ?? today}
      />
    </div>
  );
}
