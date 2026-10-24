"use client";

import { useMemo, useState } from "react";
import {
ResponsiveContainer,
AreaChart,
Area,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
ReferenceLine,
} from "recharts";

export interface PerformanceDataPoint {
date: string;
value: number;
benchmark?: number;
}

type TimeRange = "1M" | "3M" | "6M" | "1Y" | "ALL";

interface PerformanceChartProps {
data: PerformanceDataPoint[];
height?: number;
currency?: string;
}

const TIME_RANGES: TimeRange[] = ["1M", "3M", "6M", "1Y", "ALL"];

const numberFormatter = new Intl.NumberFormat("en-US", {
maximumFractionDigits: 2,
});

function formatCurrency(value: number, currency: string) {
return `${currency}${numberFormatter.format(value)}`;
}

function formatCompactCurrency(value: number, currency: string) {
return `${currency}${new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)}`;
}

function calculateReturn(start: number, end: number) {
if (!Number.isFinite(start) || start === 0 || !Number.isFinite(end)) {
return 0;
}

return ((end - start) / Math.abs(start)) * 100;
}

export default function PerformanceChart({
data,
height = 280,
currency = "$",
}: PerformanceChartProps) {
const [selectedRange, setSelectedRange] = useState<TimeRange>("ALL");

const chartData = useMemo(() => {
const validData = data.filter(
(point) =>
Number.isFinite(point.value) &&
(point.benchmark === undefined || Number.isFinite(point.benchmark)),
);


const rangeSizes: Record<TimeRange, number> = {
  "1M": 2,
  "3M": 3,
  "6M": 5,
  "1Y": 7,
  ALL: validData.length,
};

const selectedCount = rangeSizes[selectedRange];
const visibleData =
  selectedRange === "ALL"
    ? validData
    : validData.slice(-Math.min(selectedCount, validData.length));

if (visibleData.length === 0) {
  return [];
}

const firstPortfolioValue = visibleData[0].value;
const lastPortfolioValue = visibleData[visibleData.length - 1].value;

const firstBenchmarkValue =
  visibleData.find((point) => point.benchmark !== undefined)?.benchmark;

const lastBenchmarkValue =
  [...visibleData]
    .reverse()
    .find((point) => point.benchmark !== undefined)?.benchmark;

return visibleData.map((point) => ({
  ...point,
  portfolioReturn: calculateReturn(firstPortfolioValue, point.value),
  benchmarkReturn:
    firstBenchmarkValue !== undefined && point.benchmark !== undefined
      ? calculateReturn(firstBenchmarkValue, point.benchmark)
      : undefined,
  periodPortfolioReturn: calculateReturn(
    firstPortfolioValue,
    lastPortfolioValue,
  ),
  periodBenchmarkReturn:
    firstBenchmarkValue !== undefined && lastBenchmarkValue !== undefined
      ? calculateReturn(firstBenchmarkValue, lastBenchmarkValue)
      : undefined,
}));


}, [data, selectedRange]);

const firstPoint = chartData[0];
const lastPoint = chartData[chartData.length - 1];

const portfolioReturn =
firstPoint && lastPoint
? calculateReturn(firstPoint.value, lastPoint.value)
: 0;

const benchmarkPoints = chartData.filter(
(point) => point.benchmark !== undefined,
);

const benchmarkReturn =
benchmarkPoints.length >= 2
? calculateReturn(
benchmarkPoints[0].benchmark!,
benchmarkPoints[benchmarkPoints.length - 1].benchmark!,
)
: null;

const outperformance =
benchmarkReturn === null ? null : portfolioReturn - benchmarkReturn;

if (chartData.length === 0) {
return (
<div
className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-sm text-slate-400"
style={{ height }}
>
No performance data available. </div>
);
}

return ( <section className="w-full" aria-label="Portfolio performance analytics"> <div className="mb-5 flex flex-wrap items-center justify-between gap-3"> <div> <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
Selected period return </p>
<p
className={`mt-1 text-2xl font-bold ${
              portfolioReturn >= 0 ? "text-emerald-400" : "text-rose-400"
            }`}
>
{portfolioReturn >= 0 ? "+" : ""}
{portfolioReturn.toFixed(2)}% </p> </div>

```
    <div
      className="flex flex-wrap items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.025] p-1"
      aria-label="Performance chart time range"
    >
      {TIME_RANGES.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => setSelectedRange(range)}
          aria-pressed={selectedRange === range}
          className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
            selectedRange === range
              ? "bg-blue-700 text-white shadow-lg shadow-blue-500/20"
              : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  </div>

  <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
    <div className="flex items-center gap-2 text-slate-300">
      <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
      Portfolio NAV
    </div>

    {benchmarkReturn !== null && (
      <div className="flex items-center gap-2 text-slate-300">
        <span className="h-2.5 w-2.5 rounded-full bg-violet-400" />
        Benchmark
      </div>
    )}

    {outperformance !== null && (
      <span
        className={`ml-auto font-medium ${
          outperformance >= 0 ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        {outperformance >= 0 ? "+" : ""}
        {outperformance.toFixed(2)} pp vs benchmark
      </span>
    )}
  </div>

  <div className="w-full" role="img" aria-label="Portfolio NAV and benchmark performance chart">
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={chartData}
        margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient
            id="performanceGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          stroke="#ffffff10"
          strokeDasharray="4 4"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          minTickGap={24}
        />

        <YAxis
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          width={75}
          tickFormatter={(value: number) =>
            formatCompactCurrency(value, currency)
          }
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#101522",
            border: "1px solid #ffffff20",
            borderRadius: "12px",
            color: "#f1f5f9",
            padding: "12px",
          }}
          labelStyle={{
            color: "#94a3b8",
            marginBottom: "6px",
          }}
          formatter={(value, name) => [
            formatCurrency(Number(value), currency),
            name === "value"
              ? "Portfolio NAV"
              : name === "benchmark"
                ? "Benchmark NAV"
                : String(name),
          ]}
        />

        <ReferenceLine
          y={firstPoint.value}
          stroke="#ffffff25"
          strokeDasharray="3 5"
        />

        <Area
          type="monotone"
          dataKey="value"
          name="Portfolio NAV"
          stroke="#60a5fa"
          strokeWidth={2.5}
          fill="url(#performanceGradient)"
          activeDot={{
            r: 5,
            fill: "#60a5fa",
            stroke: "#0f172a",
          }}
          isAnimationActive={false}
        />

        {benchmarkReturn !== null && (
          <Line
            type="monotone"
            dataKey="benchmark"
            name="Benchmark NAV"
            stroke="#a78bfa"
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: "#a78bfa",
              stroke: "#0f172a",
            }}
            connectNulls
            isAnimationActive={false}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  </div>

  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
      <p className="text-xs text-slate-500">Portfolio NAV</p>
      <p className="mt-1 text-lg font-semibold text-white">
        {formatCurrency(lastPoint.value, currency)}
      </p>
      <p
        className={`mt-1 text-xs ${
          portfolioReturn >= 0 ? "text-emerald-400" : "text-rose-400"
        }`}
      >
        {portfolioReturn >= 0 ? "+" : ""}
        {portfolioReturn.toFixed(2)}% for selected data range
      </p>
    </div>

    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
      <p className="text-xs text-slate-500">Benchmark return</p>
      <p
        className={`mt-1 text-lg font-semibold ${
          benchmarkReturn === null
            ? "text-slate-500"
            : benchmarkReturn >= 0
              ? "text-emerald-400"
              : "text-rose-400"
        }`}
      >
        {benchmarkReturn === null
          ? "Not available"
          : `${benchmarkReturn >= 0 ? "+" : ""}${benchmarkReturn.toFixed(2)}%`}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {benchmarkReturn === null
          ? "Benchmark data has not been provided."
          : "Calculated from supplied benchmark values."}
      </p>
    </div>
  </div>

  <p className="mt-4 text-xs leading-relaxed text-slate-500">
    Illustrative demo data only. Time-range buttons select available data
    points; they do not represent verified calendar periods. Benchmark
    comparison appears only when benchmark values are supplied.
  </p>
</section>


);
}
