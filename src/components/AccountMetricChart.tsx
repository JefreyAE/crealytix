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
  Area,
  AreaChart,
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

  const filteredData = useMemo(() => {
    if (!data?.length) return [];

    // Group by local date (YYYY-MM-DD) and keep the max value for the current metric
    const dailyMaxMap = new Map<string, DataPoint>();

    data.forEach((point) => {
      if (!point.date) return;
      const d = new Date(point.date);
      if (isNaN(d.getTime())) return;

      // Generate a local YYYY-MM-DD key to avoid timezone shifts
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

      const existing = dailyMaxMap.get(dateKey);
      if (!existing || point[metric] > existing[metric]) {
        dailyMaxMap.set(dateKey, point);
      }
    });

    // Convert to sorted array
    const sorted = Array.from(dailyMaxMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return sorted.slice(-range);
  }, [data, range, metric]);

  const transformedData = useMemo<TransformedDataPoint[]>(() => {
    if (!filteredData.length) return [];
    if (viewMode === "absolute") return filteredData;
    const firstValue = filteredData[0]?.[metric] ?? 0;
    if (firstValue === 0) return filteredData;
    return filteredData.map((point) => ({
      ...point,
      percent: Number((((point[metric] - firstValue) / firstValue) * 100).toFixed(2)),
    }));
  }, [filteredData, metric, viewMode]);

  const yDomain = useMemo(() => {
    if (!transformedData.length) return [0, 100];
    const values = viewMode === "absolute"
      ? transformedData.map((d) => d[metric])
      : transformedData.map((d) => d.percent ?? 0);
    const min = Math.min(...values);
    const max = Math.max(...values);

    if (min === max) {
      if (min === 0) return [0, 100];
      const offset = Math.max(10, Math.abs(min) * 0.1);
      return [Math.max(0, Math.floor(min - offset)), Math.ceil(max + offset)];
    }

    const padding = (max - min) * 0.15;
    return [Math.max(0, Math.floor(min - padding)), Math.ceil(max + padding)];
  }, [transformedData, metric, viewMode]);

  const kpis = useMemo(() => {
    if (!filteredData.length) return { latest: 0, difference: 0, percent: null as number | null, isPositive: true };
    const latest = filteredData.at(-1)?.[metric] ?? 0;
    const first = filteredData[0]?.[metric] ?? 0;
    const difference = latest - first;
    const percent = first === 0 ? null : Number(((difference / first) * 100).toFixed(1));
    return { latest, difference, percent, isPositive: difference >= 0 };
  }, [filteredData, metric]);

  const formatCompact = (value: number) => {
    if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
    if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
    return value.toLocaleString("en-US");
  };

  const metricLabel = metric === "subscribers" ? "Subscribers" : "Views";

  if (!filteredData.length) {
    return (
      <div className="glass p-12 text-center rounded-[2.5rem] border-2 border-slate-200/50 dark:border-slate-800/50">
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Analytics Data</p>
        <p className="text-slate-400 mt-2">No historical data available for this range.</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 md:p-8 rounded-[2rem] border-2 border-slate-200/50 dark:border-slate-800/50 space-y-8 animate-fadeUp shadow-2xl shadow-indigo-500/5">

      {/* COMPACT HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{metricLabel} Growth</p>
          </div>

          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
              {kpis.latest.toLocaleString("en-US")}
            </h2>
            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black transition-colors ${kpis.isPositive ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
              }`}>
              {kpis.percent !== null && (
                <span>{kpis.isPositive ? "▲" : "▼"} {Math.abs(kpis.percent)}%</span>
              )}
            </div>
          </div>

          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
            {kpis.difference >= 0 ? "+" : ""}{kpis.difference.toLocaleString("en-US")} {metricLabel.toLowerCase()} last <span className="text-indigo-600 dark:text-indigo-400">{range} days</span>
          </p>
        </div>

        {/* COMPACT CONTROLS AREA */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-100/50 dark:bg-slate-800/20 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/30">

          {/* METRIC TOGGLE */}
          <div className="flex p-0.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
            {(["subscribers", "views"] as MetricType[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${metric === m ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
              >
                {m === "subscribers" ? "Subs" : "Views"}
              </button>
            ))}
          </div>

          {/* RANGE TOGGLE */}
          <div className="flex p-0.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-800/60">
            {[7, 14, 30].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r as RangeType)}
                className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${range === r ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400"
                  }`}
              >
                {r}D
              </button>
            ))}
          </div>

          {/* VIEW MODE */}
          <button
            onClick={() => setViewMode(viewMode === "absolute" ? "percent" : "absolute")}
            className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 border ${viewMode === "percent"
              ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
              }`}
          >
            {viewMode === "absolute" ? "% Growth" : "Abs"}
          </button>
        </div>
      </div>

      {/* CHART CONTAINER */}
      <div className="h-[400px] w-full pt-4 min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={transformedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradientColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.1)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              dy={15}
              tickFormatter={(str) => {
                if (!str) return "";
                const date = new Date(str);
                if (isNaN(date.getTime())) return "";
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 700 }}
              domain={yDomain}
              tickFormatter={(val) => viewMode === "percent" ? `${val}%` : formatCompact(val)}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "20px",
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                padding: "16px",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
              }}
              itemStyle={{ color: "#fff", fontWeight: 800, fontSize: "14px" }}
              labelStyle={{ color: "#94a3b8", fontWeight: 800, fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}
              cursor={{ stroke: "#6366f1", strokeWidth: 2, strokeDasharray: "5 5" }}
            />
            <Area
              type="monotone"
              dataKey={viewMode === "absolute" ? metric : "percent"}
              stroke="#6366f1"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#gradientColor)"
              animationDuration={1500}
              activeDot={{ r: 8, fill: "#6366f1", stroke: "#fff", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
