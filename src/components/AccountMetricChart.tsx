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
  subscribers: number;
  views: number;
};

type Props = {
  data: DataPoint[];
};

type MetricType = "subscribers" | "views";
type RangeType = 7 | 14 | 30;

export default function AccountMetricChart({ data }: Props) {
  const [metric, setMetric] = useState<MetricType>("subscribers");
  const [range, setRange] = useState<RangeType>(14);

  /* ---------------- FILTER RANGE ---------------- */

  const filteredData = useMemo(() => {
    if (!data?.length) return [];
    return data.slice(-range);
  }, [data, range]);

  /* ---------------- KPI CALCULATIONS ---------------- */

  const kpis = useMemo(() => {
    if (!filteredData.length) {
      return {
        latest: 0,
        difference: 0,
        percent: null as number | null,
        isPositive: true,
      };
    }

    const latest = filteredData.at(-1)?.[metric] ?? 0;
    const first = filteredData[0]?.[metric] ?? 0;

    const difference = latest - first;

    if (first === 0) {
      return {
        latest,
        difference,
        percent: null,
        isPositive: difference >= 0,
      };
    }

    const percent = Number(((difference / first) * 100).toFixed(1));

    return {
      latest,
      difference,
      percent,
      isPositive: difference >= 0,
    };
  }, [filteredData, metric]);

  /* ---------------- FORMATTERS ---------------- */

  const formatCompact = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString("en-US");
  };

  const metricLabel =
    metric === "subscribers" ? "Subscribers" : "Views";

  /* ---------------- EMPTY STATE ---------------- */

  if (!filteredData.length) {
    return (
      <div className="rounded-2xl border bg-white dark:bg-zinc-900 p-6 shadow-sm">
        <p className="text-gray-500 text-sm">
          No historical data available yet.
        </p>
      </div>
    );
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="rounded-2xl border bg-white dark:bg-zinc-900 p-6 shadow-sm space-y-6">

      {/* KPI HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

        <div>
          <p className="text-sm text-gray-500">{metricLabel}</p>

          <h2 className="text-3xl font-bold">
            {kpis.latest.toLocaleString("en-US")}
          </h2>

          <div
            className={`flex items-center gap-2 text-sm font-medium ${
              kpis.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {kpis.percent !== null && (
              <span>
                {kpis.isPositive ? "▲" : "▼"} {kpis.percent}%
              </span>
            )}

            <span className="text-gray-500">
              ({kpis.difference.toLocaleString("en-US")} in last {range} days)
            </span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap gap-3">

          <div className="flex rounded-lg bg-gray-100 dark:bg-zinc-800 p-1">
            {(["subscribers", "views"] as MetricType[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1 text-sm rounded-md transition ${
                  metric === m
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {m === "subscribers" ? "Subscribers" : "Views"}
              </button>
            ))}
          </div>

          <div className="flex rounded-lg bg-gray-100 dark:bg-zinc-800 p-1">
            {[7, 14, 30].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r as RangeType)}
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
      </div>

      {/* CHART */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              interval="preserveStartEnd"
            />

            <YAxis
              width={80}
              tickFormatter={(value) =>
                typeof value === "number"
                  ? formatCompact(value)
                  : ""
              }
            />

            <Tooltip
              formatter={(value: number | string | undefined) => {
                if (typeof value === "number") {
                  return value.toLocaleString();
                }
                return value ?? "";
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
              }}
            />

            <Line
              type="monotone"
              dataKey={metric}
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              animationDuration={350}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
