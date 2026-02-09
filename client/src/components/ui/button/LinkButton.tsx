import "./Button.css";
import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

interface LinkButtonProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const LinkButton = ({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}: LinkButtonProps) => {
  return (
    <Link
      href={href}
      className={`btn btn--${variant} btn--${size} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
};
