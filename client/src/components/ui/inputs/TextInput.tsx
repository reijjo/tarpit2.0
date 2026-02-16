import "./TextInput.css";
import { CircleX } from "lucide-react";
import { InputHTMLAttributes } from "react";

type TextInputProps = {
  label: string;
  name: string;
  id: string;
  type?: string;
  errors: string[];
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const TextInput = ({
  label,
  name,
  id,
  type = "text",
  className = "",
  errors,
  ...rest
}: TextInputProps) => {
  return (
    <div className={`${className} text-input`}>
      <label htmlFor={id}>{label}</label>
      <input {...rest} type={type} name={name} id={id} />
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, index) => (
            <small key={index} className="error-message" role="alert">
              <CircleX strokeWidth={1} size={16} />
              <span>{error}</span>
            </small>
          ))}
        </div>
      )}
    </div>
  );
};
