import "./FormMessages.css";
import { CircleX } from "lucide-react";

type FormErrorMessageProps = {
  message: string;
};

export const FormErrorMessage = ({ message }: FormErrorMessageProps) => {
  return (
    <div className="form-messages error-message" role="alert">
      <CircleX strokeWidth={1} size={16} />
      <small>{message}</small>
    </div>
  );
};
