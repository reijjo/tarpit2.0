import { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/cards/Card";

type MiniSummaryCardProps = {
  icon: LucideIcon;
  value: number | string;
  label: string;
};

export function MiniSummaryCard({
  icon: Icon,
  value,
  label,
}: MiniSummaryCardProps) {
  return (
    <Card className="mini-summary-card">
      <Icon size={40} />
      <div className="mini-summary-card-values">
        <h2>{value}</h2>
        <p>{label}</p>
      </div>
    </Card>
  );
}
