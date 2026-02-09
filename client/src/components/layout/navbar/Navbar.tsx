import "./Navbar.css";
import Link from "next/link";

import { LinkButton } from "@/components/ui/button/LinkButton";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-wrapper wrapper">
        <Link href="/">Tärpit</Link>
        <div className="nav-buttons">
          <LinkButton href="/login" variant="outline">
            Login
          </LinkButton>
          <LinkButton href="/register">Register</LinkButton>
        </div>
      </div>
    </nav>
  );
}
