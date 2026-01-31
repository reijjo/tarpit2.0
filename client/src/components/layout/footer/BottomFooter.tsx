import "./BottomFooter.css";
import Image from "next/image";

export default function BottomFooter() {
  return (
    <div className="under-footer">
      <div className="copyright">
        <p>&copy; 2026 Reijjo.</p>
        <p>All rights reserved.</p>
      </div>
      <div className="footer-links">
        <a href="https://github.com/reijjo/" target="_blank">
          <Image
            src="/icons/github.svg"
            alt="github"
            width={24}
            height={24}
            loading="eager"
          />
        </a>
        <a href="https://www.linkedin.com/in/teemu-aitomeri/" target="_blank">
          <Image
            src="/icons/linkedin.svg"
            alt="linkedin"
            width={24}
            height={24}
            loading="eager"
          />
        </a>
      </div>
    </div>
  );
}
