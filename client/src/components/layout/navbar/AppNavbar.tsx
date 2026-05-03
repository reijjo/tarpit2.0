import "./AppNavbar.css";
import "./Navbar.css";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button/Button";

export default function AppNavbar() {
  return (
    <nav className="app-navbar">
      <div className="app-nav-content wrapper">
        <div className="app-nav-toggle">
          <Button variant="outline" size="icon" type="button">
            <Menu size={20} />
          </Button>
        </div>
        <div className="">
          <button>logout</button>
        </div>
      </div>
    </nav>
  );
}
