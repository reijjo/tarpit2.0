import { InputSuffix } from "./InputSuffix";
import "./TextInput.css";
import { CircleX } from "lucide-react";
import { InputHTMLAttributes, ReactNode } from "react";

type PrefixSuffixTextInputProps = {
  label?: string;
  name: string;
  id: string;
  type?: string;
  errors: string[];
  className?: string;
  optional?: boolean;
  prefix?: string | number;
  suffix?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export const PrefixSuffixTextInput = ({
  label,
  name,
  id,
  type = "text",
  className = "",
  optional = false,
  errors,
  prefix,
  suffix,
  ...rest
}: PrefixSuffixTextInputProps) => {
  return (
    <div className={`text-input ${className}`}>
      <div className="label-container">
        <label htmlFor={id}>{label}</label>
        {optional && <p className="optional-field">(optional)</p>}
      </div>
      <div className="prefix-suffix-input-container">
        {prefix && (
          <div className="input-prefix">
            <p>{prefix}x</p>
          </div>
        )}
        <input {...rest} type={type} name={name} id={id} />
        {suffix && <InputSuffix>{suffix}</InputSuffix>}
      </div>
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
