import "./SelectInput.css";
import { SelectHTMLAttributes } from "react";

type SelectInputProps = {
  label: string;
  id: string;
  name: string;
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const SelectInput = ({
  label,
  id,
  name,
  className = "",
  children,
  ...rest
}: SelectInputProps) => {
  return (
    <div className={`select-input ${className}`}>
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} {...rest}>
        {children}
      </select>
    </div>
  );
};
