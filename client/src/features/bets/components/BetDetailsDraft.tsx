import "./BetDetailsDraft.css";
import { PencilLine, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { BetDetailsWithTempId } from "../types";

type BetDetailsDraftProps = {
  details: BetDetailsWithTempId[];
  setBetDetails: Dispatch<SetStateAction<BetDetailsWithTempId[]>>;
  onEdit: (detail: BetDetailsWithTempId) => void;
};

export default function BetDetailsDraft({
  details,
  setBetDetails,
  onEdit,
}: BetDetailsDraftProps) {
  const removeDetail = (id: string) => {
    setBetDetails((prev) => prev.filter((d) => d.temp_id !== id));
  };

  return (
    <section className="details-draft">
      {details.map((d) => (
        <div className="details-draft-row" key={d.temp_id}>
          <div className="details-draft-content">
            <div className="details-draft-selection-odds">
              <p className="details-draft-selection">{d.selection}</p>
              <p className="details-draft-odds">{d.odds.toFixed(2)}</p>
            </div>
            <div className="details-draft-type">
              <p>{d.betType}</p>
              {d.liveBet && <p className="details-draft-live">Live</p>}
            </div>
            <div className="details-draft-match">
              <p>
                {d.homeTeam} - {d.awayTeam}
              </p>
              <button
                type="button"
                className="details-draft-modify"
                onClick={() => onEdit(d)}
              >
                <PencilLine size={14} />
                <p>Edit</p>
              </button>
            </div>
          </div>

          <button
            type="button"
            className="remove-bet-details"
            aria-label={`Remove ${d.selection}`}
            onClick={() => removeDetail(d.temp_id)}
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>
      ))}
    </section>
  );
}
