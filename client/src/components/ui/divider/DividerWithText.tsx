import "./Divider.css";

type DividerWithTextProps = {
  text: string;
  width?: string;
  margin?: string;
  color?: string;
};

export const DividerWithText = ({
  text,
  width = "75%",
  margin = "8px 0",
  color,
}: DividerWithTextProps) => (
  <div className="divider-with-text" style={{ margin, color, width }}>
    <span>{text}</span>
  </div>
);
