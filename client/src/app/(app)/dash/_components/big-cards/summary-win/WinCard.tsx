"use client";

import "./WinCard.css";
import { useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import type { PieSectorShapeProps } from "recharts";

import { Card } from "@/components/ui/cards/Card";

type BetSummary = {
  won: number;
  lost: number;
  void: number;
};

type ChartSlice = {
  key: keyof BetSummary;
  label: string;
  value: number;
  fill: string;
  centerColor: string;
};

type WinCardProps = {
  summary?: BetSummary;
};

const defaultSummary: BetSummary = {
  won: 78,
  lost: 50,
  void: 10,
};

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function buildSlices(summary: BetSummary): ChartSlice[] {
  return [
    {
      key: "won",
      label: "Won",
      value: summary.won,
      fill: "var(--success-light)",
      centerColor: "white",
    },
    {
      key: "lost",
      label: "Lost",
      value: summary.lost,
      fill: "var(--error-light)",
      centerColor: "white",
    },
    {
      key: "void",
      label: "Void",
      value: summary.void,
      fill: "var(--warning-light)",
      centerColor: "white",
    },
  ];
}

function renderActiveShape(props: PieSectorShapeProps) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
}

export function WinCard({ summary = defaultSummary }: WinCardProps) {
  const slices = buildSlices(summary);
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlice = slices[activeIndex] ?? slices[0];
  const activePercent = total === 0 ? 0 : (activeSlice.value / total) * 100;

  return (
    <Card className="win-card">
      <h6>win %</h6>

      <div
        className="win-card__chart-shell"
        aria-label="bet result distribution"
      >
        {total > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="label"
                  shape={renderActiveShape}
                  cx="50%"
                  cy="50%"
                  innerRadius="62%"
                  outerRadius="88%"
                  startAngle={90}
                  endAngle={-270}
                  paddingAngle={4}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(0)}
                  onClick={(_, index) => setActiveIndex(index)}
                  stroke="var(--primary-xdark)"
                  strokeWidth={2}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="win-card__center">
              <span
                className="win-card__center-label"
                style={{ color: activeSlice.centerColor }}
              >
                {activeSlice.label}
              </span>
              <strong
                className="win-card__center-value"
                style={{ color: activeSlice.centerColor }}
              >
                {formatPercent(activePercent)}
              </strong>
            </div>
          </>
        ) : (
          <div className="win-card__empty">No settled bets yet</div>
        )}
      </div>
    </Card>
  );
}
