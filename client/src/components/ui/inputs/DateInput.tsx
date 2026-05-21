import "./DateInput.css";
import { CircleX } from "lucide-react";
import { InputHTMLAttributes } from "react";

type DateInputProps = {
  label: string;
  name: string;
  id: string;
  className?: string;
  errors: string[];
} & InputHTMLAttributes<HTMLInputElement>;

export const DateInput = ({
  label,
  name,
  id,
  className = "",
  errors,
  ...rest
}: DateInputProps) => {
  return (
    <div className={`date-input ${className}`}>
      <label htmlFor={id}>{label}</label>
      <input {...rest} type="date" name={name} id={id} />
      {errors.length > 0 && (
        <div className="form-error-messages">
          {errors.map((error, index) => (
            <small key={index} className="form-error-message" role="alert">
              <CircleX strokeWidth={1} size={16} />
              <span>{error}</span>
            </small>
          ))}
        </div>
      )}
    </div>
  );
};
