import "./Sidebar.css";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button/Button";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <Link href="/dash" className="sidebar-logo">
          <Image
            src="/icons/fishing.png"
            alt="logo"
            height={28}
            width={28}
            loading="eager"
          />
          Tärpit
        </Link>
        <Button variant="outline" size="icon">
          <X size={20} />
        </Button>
      </div>
      <ul>
        <li>
          <a href="#">Home</a>
        </li>
        <li>
          <a href="#">Profile</a>
        </li>
        <li>
          <a href="#">Settings</a>
        </li>
        <li>
          <a href="#">Logout</a>
        </li>
      </ul>
    </div>
  );
}
