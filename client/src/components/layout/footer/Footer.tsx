import BottomFooter from "./BottomFooter";
import "./Footer.css";
import TopFooter from "./TopFooter";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wrapper wrapper">
        <TopFooter />
        <BottomFooter />
      </div>
    </footer>
  );
}
