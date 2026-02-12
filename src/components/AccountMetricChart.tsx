"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type DataPoint = {
  date: string;
  value: number;
};

type Props = {
  data: DataPoint[];
  metricLabel: string;
  color?: string;
};

export default function AccountMetricChart({
  data,
  metricLabel,
  color = "#6366f1",
}: Props) {
  const [range, setRange] = useState<7 | 14 | 30>(14);

  const filteredData = useMemo(() => {
    return data.slice(-range);
  }, [data, range]);

  const latest = filteredData.at(-1)?.value ?? 0;
  const first = filteredData[0]?.value ?? 0;

  const difference = latest - first;
  const percent =
    first !== 0 ? Number(((difference / first) * 100).toFixed(1)) : 0;

  const isPositive = difference >= 0;

  const formatCompact = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  if (!filteredData.length) {
    return (
      <div className="rounded-2xl border bg-white dark:bg-zinc-900 p-6">
        <p className="text-gray-500 text-sm">
          No historical data available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-6">

      {/* KPI HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

        <div>
          <p className="text-sm text-gray-500">{metricLabel}</p>

          <h2 className="text-3xl font-bold">
            {latest.toLocaleString()}
          </h2>

          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <span>
              {isPositive ? "▲" : "▼"} {percent}%
            </span>

            <span className="text-gray-500">
              ({difference.toLocaleString()} in last {range} days)
            </span>
          </div>
        </div>

        {/* RANGE SELECTOR */}
        <div className="flex rounded-lg bg-gray-100 dark:bg-zinc-800 p-1">
          {[7, 14, 30].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as 7 | 14 | 30)}
              className={`px-3 py-1 text-sm rounded-md transition ${
                range === r
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {/* CHART */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />

            <YAxis
              width={80}
              tickFormatter={(v) =>
                typeof v === "number" ? formatCompact(v) : ""
              }
            />

            <Tooltip
              formatter={(value: number | string | undefined) => {
                    if (typeof value === "number") {
                      return value.toLocaleString();
                    }
                    return value ?? "";
                  }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
