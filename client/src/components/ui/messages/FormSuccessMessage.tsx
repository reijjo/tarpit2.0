import "./FormMessages.css";
import { Check } from "lucide-react";

type FormSuccessMessageProps = {
  message: string;
};

export const FormSuccessMessage = ({ message }: FormSuccessMessageProps) => {
  return (
    <div className="form-messages success-message" role="alert">
      <Check strokeWidth={1} size={16} />
      <small>{message}</small>
    </div>
  );
};
