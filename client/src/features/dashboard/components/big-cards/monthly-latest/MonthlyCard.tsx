"use client";

import "./MonthlyCard.css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import { Card } from "@/components/ui/cards/Card";

type MonthlyProfitPoint = {
  label: string;
  value: number;
  fill: string;
};

type MonthlyCardProps = {
  data?: MonthlyProfitPoint[];
};

const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
});

function getMonthLabel(monthsAgo: number) {
  const date = new Date();
  date.setDate(1);
  date.setMonth(date.getMonth() - monthsAgo);
  return monthFormatter.format(date);
}

function buildDefaultData(): MonthlyProfitPoint[] {
  return [
    {
      label: getMonthLabel(0),
      value: 45,
      fill: "var(--success-light)",
    },
    {
      label: getMonthLabel(1),
      value: -30,
      fill: "var(--error-light)",
    },
    {
      label: getMonthLabel(2),
      value: 21,
      fill: "var(--success-light)",
    },
    {
      label: getMonthLabel(3),
      value: 67,
      fill: "var(--success-light)",
    },
  ];
}

function formatCurrency(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(0)}€`;
}

function buildChartData(data: MonthlyProfitPoint[]) {
  return data.map((point) => ({
    ...point,
    fill: point.value < 0 ? "var(--error-light)" : "var(--success-light)",
  }));
}

function MonthlyTooltip({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, NameType>) {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload as MonthlyProfitPoint | undefined;
  if (!point) return null;

  const isLoss = point.value < 0;
  const accentColor = isLoss ? "var(--error-xlight)" : "var(--success-xlight)";

  return (
    <div className="monthly-card__tooltip">
      <div className="monthly-card__tooltip-label">{String(label)}</div>
      <div
        className="monthly-card__tooltip-value"
        style={{ color: accentColor }}
      >
        {formatCurrency(point.value)}
      </div>
    </div>
  );
}

export function MonthlyCard({ data = buildDefaultData() }: MonthlyCardProps) {
  const chartData = buildChartData(data);

  return (
    <Card className="monthly-card">
      <h6>monthly</h6>

      <div className="monthly-card__chart-shell">
        <ResponsiveContainer width="100%" height={272}>
          <BarChart
            data={chartData}
            barCategoryGap="24%"
            margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="rgb(from var(--primary-light) r g b / 15%)"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-light-muted)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-light-muted)", fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip
              cursor={{ fill: "rgb(from var(--primary-light) r g b / 10%)" }}
              content={MonthlyTooltip}
              wrapperStyle={{ outline: "none" }}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
