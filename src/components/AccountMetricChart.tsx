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

type TransformedDataPoint = DataPoint & {
  percent?: number;
};


type Props = {
  data: DataPoint[];
};

type MetricType = "subscribers" | "views";
type RangeType = 7 | 14 | 30;
type ViewMode = "absolute" | "percent";

export default function AccountMetricChart({ data }: Props) {


  const [viewMode, setViewMode] = useState<ViewMode>("absolute");
  const [metric, setMetric] = useState<MetricType>("subscribers");
  const [range, setRange] = useState<RangeType>(14);

  /* ---------------- FILTER RANGE ---------------- */

  const filteredData = useMemo(() => {
    if (!data?.length) return [];
    return data.slice(-range);
  }, [data, range]);

  /* ---------------- TRANSFORM DATA (PERCENT MODE) ---------------- */
  const transformedData = useMemo<TransformedDataPoint[]>(() => {
    if (!filteredData.length) return [];

    if (viewMode === "absolute") return filteredData;

    const firstValue = filteredData[0]?.[metric] ?? 0;

    if (firstValue === 0) return filteredData;

    return filteredData.map((point) => {
      const currentValue = point[metric];
      const percentChange =
        ((currentValue - firstValue) / firstValue) * 100;

      return {
        ...point,
        percent: Number(percentChange.toFixed(2)),
      };
    });
  }, [filteredData, metric, viewMode]);

  /* ---------------- Y AXIS DOMAIN ---------------- */

  const yDomain = useMemo(() => {
    if (!transformedData.length) return [0, 0];

    const values =
      viewMode === "absolute"
        ? transformedData.map((d) => d[metric])
        : transformedData.map((d) => d.percent ?? 0);


    const min = Math.min(...values);
    const max = Math.max(...values);

    if (min === max) return [min - 1, max + 1];

    const padding = (max - min) * 0.15;

    return [
      Math.floor(min - padding),
      Math.ceil(max + padding),
    ];
  }, [transformedData, metric, viewMode]);

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
            className={`flex items-center gap-2 text-sm font-medium ${kpis.isPositive ? "text-green-600" : "text-red-600"
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
                className={`px-3 py-1 text-sm rounded-md transition ${metric === m
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
                className={`px-3 py-1 text-sm rounded-md transition ${range === r
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-400"
                  }`}
              >
                {r}d
              </button>
            ))}
          </div>
          <div className="flex rounded-lg bg-gray-100 dark:bg-zinc-800 p-1">
            {(["absolute", "percent"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-sm rounded-md transition ${viewMode === mode
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 dark:text-gray-400"
                  }`}
              >
                {mode === "absolute" ? "Absolute" : "% Growth"}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* CHART */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={transformedData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              interval="preserveStartEnd"
            />

            <YAxis
              width={80}
              domain={yDomain}
              tickFormatter={(value) =>
                typeof value === "number"
                  ? viewMode === "percent"
                    ? `${value.toFixed(0)}%`
                    : formatCompact(value)
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
              dataKey={viewMode === "absolute" ? metric : "percent"}
              stroke="#6366f1"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
              animationDuration={350}
            />

          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
