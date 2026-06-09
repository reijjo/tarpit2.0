import { useAuthStore } from "@/lib/stores/authStore";

import { TextInput } from "@/components/ui/inputs/TextInput";

type TipperCardProps = {
  draft: {
    tipper: string;
  };
  fieldErrors: {
    tipper?: string[];
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const TipperCard = ({
  draft,
  fieldErrors,
  handleChange,
}: TipperCardProps) => {
  const me = useAuthStore((state) => state.me);

  return (
    <div className="bet-form-card">
      <TextInput
        label="tipper"
        name="tipper"
        id="tipper"
        errors={fieldErrors.tipper ?? []}
        placeholder="Tipper name"
        aria-label="tipper"
        value={draft.tipper ?? me?.username}
        onChange={handleChange}
      />
    </div>
  );
};
