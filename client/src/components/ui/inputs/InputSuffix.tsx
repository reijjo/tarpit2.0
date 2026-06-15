import { ReactNode } from "react";

import "@/components/ui/inputs/TextInput.css";

type InputSuffixProps = {
  children: ReactNode;
};

export const InputSuffix = ({ children }: InputSuffixProps) => {
  return <div className="input-suffix">{children}</div>;
};
