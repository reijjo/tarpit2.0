import "./Checkbox.css";
import { InputHTMLAttributes } from "react";

type CheckboxProps = {
  label: string;
  id: string;
  name: string;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Checkbox = ({
  label,
  id,
  name,
  className = "",
  ...rest
}: CheckboxProps) => {
  return (
    <div className={`checkbox ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input type="checkbox" id={id} name={name} {...rest} />
    </div>
  );
};
