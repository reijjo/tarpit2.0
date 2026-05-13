import "./SummaryCard.css";

import { Card } from "@/components/ui/cards/Card";

const headers = ["at risk", "profit/loss", "total bets"];
const value = 0;

export function SummaryCard() {
  return (
    <Card className="summary-card">
      <h6>summary</h6>
      <table className="summary-table">
        <thead>
          <tr>
            <th></th>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="row-header">Today</td>
            <td>{value.toFixed(2)} €</td>
            <td>{value.toFixed(2)} €</td>
            <td>{value}</td>
          </tr>
          <tr>
            <td className="row-header">Yesterday</td>
            <td>{value.toFixed(2)} €</td>
            <td>{value.toFixed(2)} €</td>
            <td>{value}</td>
          </tr>
          <tr>
            <td className="row-header">last 7 days</td>
            <td>{value.toFixed(2)} €</td>
            <td>{value.toFixed(2)} €</td>
            <td>{value}</td>
          </tr>
          <tr>
            <td className="row-header">last 30 days</td>
            <td>{value.toFixed(2)} €</td>
            <td>{value.toFixed(2)} €</td>
            <td>{value}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}
