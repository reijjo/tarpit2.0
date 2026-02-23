import "./AddbetFeature.css";
import Image from "next/image";

export default function AddbetFeature() {
  return (
    <article className="add-bet-feature">
      <div className="add-bet-feature-wrapper wrapper">
        <div className="add-bet-image-container">
          <p>
            <strong>Add Bet</strong> has many different bet types to choose
            from. <strong>Single</strong>, <strong>Over</strong>,{" "}
            <strong>Under</strong>, <strong>Bet Builder</strong> and more!
          </p>
          <Image
            src="/images/homepage/add1.png"
            width={800}
            height={450}
            alt="Add bet types"
          />
        </div>
        <div className="add-bet-image-container">
          <p>
            You can also add a <strong>Single Bet</strong> or a{" "}
            <strong>Parlay</strong> and your favorite <strong>Tipper</strong>{" "}
            and <strong>Sport/League</strong> that helps analyze the bets.
          </p>
          <Image
            src="/images/homepage/add2.png"
            width={800}
            height={450}
            alt="Add bet finish"
          />
        </div>
      </div>
    </article>
  );
}
