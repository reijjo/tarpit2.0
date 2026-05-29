import "./Loading.css";

export type LoadingProps = {
  text?: string;
  size?: "sm" | "md" | "lg";
};

export const Loading = ({ text = "Loading", size = "md" }: LoadingProps) => (
  <div className="loading-component">
    <div className={`spinner spinner--${size}`} role="status" aria-label={text}>
      <div className="spinner-ring spinner-ring--outer" />
      <div className="spinner-ring spinner-ring--inner" />
    </div>
    <p className="loader-text">{text}...</p>
  </div>
);
