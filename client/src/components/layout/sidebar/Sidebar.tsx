import "./Sidebar.css";
import Image from "next/image";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <Link href="/dash" className="sidebar-logo">
          <Image
            src="/icons/fishing.png"
            alt="logo"
            height={24}
            width={24}
            loading="eager"
          />
          Tärpit
        </Link>
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
