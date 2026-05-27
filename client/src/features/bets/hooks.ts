import { useState } from "react";

export function useBetFormDraft<T>(initial: T) {
  const [draft, setDraft] = useState<T>(initial);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setDraft((prev) => ({ ...prev, [name]: checked }));
  };

  return {
    draft,
    setDraft,
    fieldErrors,
    setFieldErrors,
    handleChange,
    handleCheckboxChange,
  };
}
