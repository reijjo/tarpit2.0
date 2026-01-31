import "./TopFooter.css";
import Image from "next/image";

export default function TopFooter() {
  return (
    <div className="top-footer">
      <div className="footer-logo">
        <Image
          src="/icons/fishing.png"
          alt="logo"
          height={24}
          width={24}
          loading="eager"
        />
        <h3>Tärpit</h3>
      </div>
      <div className="top-footer-links">
        <div className="footer-link-group">
          <h4>Support</h4>
          <a>Contact / Feedback</a>
          <a>FAQ</a>
          <a>Support Me</a>
        </div>
        <div className="footer-link-group">
          <h4>Legal</h4>
          <a>Terms</a>
          <a>Privacy</a>
        </div>
      </div>
    </div>
  );
}
