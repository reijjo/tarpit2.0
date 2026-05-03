import "./Navbar.css";
import Image from "next/image";
import Link from "next/link";

import { LinkButton } from "@/components/ui/button/LinkButton";

export default function Navbar() {
  return (
    <nav className="navbar public-nav">
      <div className="nav-wrapper wrapper">
        <Link href="/" className="nav-logo">
          <Image
            src="/icons/fishing.png"
            alt="logo"
            height={24}
            width={24}
            loading="eager"
          />
        </Link>
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
