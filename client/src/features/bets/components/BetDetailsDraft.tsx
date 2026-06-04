import "./BetDetailsDraft.css";
import { X } from "lucide-react";

import { BetDetailsWithTempId } from "../types";

type BetDetailsDraftProps = {
  details: BetDetailsWithTempId[];
};

export default function BetDetailsDraft({ details }: BetDetailsDraftProps) {
  console.log("details", details);
  return (
    <section className="details-draft">
      {details.map((d) => (
        <div className="details-draft-row" key={d.temp_id}>
          <button
            type="button"
            className="details-draft-content"
            onClick={() => console.log("Modify: ", d.temp_id)}
          >
            <div className="details-draft-selection-odds">
              <p className="details-draft-selection">{d.selection}</p>
              <p className="details-draft-odds">{d.odds.toFixed(2)}</p>
            </div>
            <p className="details-draft-type">{d.betType}</p>
            <p className="details-draft-match">
              {d.homeTeam} - {d.awayTeam}
            </p>
          </button>

          <button
            type="button"
            className="remove-bet-details"
            aria-label={`Remove ${d.selection}`}
            onClick={() => console.log("Remove: ", d.temp_id)}
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>
      ))}
    </section>
  );
}
