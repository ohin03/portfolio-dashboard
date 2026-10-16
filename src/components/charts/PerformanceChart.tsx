"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export interface PerformanceDataPoint {
  date: string;
  value: number;
}

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
  height?: number;
  currency?: string;
}

export default function PerformanceChart({
  data,
  height = 280,
  currency = "$",
}: PerformanceChartProps) {
  return (
    <div
      className="w-full"
      role="img"
      aria-label="Portfolio performance over time"
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 12, right: 12, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="#ffffff10"
            strokeDasharray="4 4"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
          />

          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={75}
            tickFormatter={(value: number) =>
              `${currency}${new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 1,
              }).format(value)}`
            }
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#101522",
              border: "1px solid #ffffff20",
              borderRadius: "12px",
              color: "#f1f5f9",
            }}
            labelStyle={{ color: "#94a3b8" }}
            formatter={(value) => [
              `${currency}${Number(value).toLocaleString("en-US")}`,
              "Portfolio Value",
            ]}
          />

          <Area
            type="monotone"
            dataKey="value"
            name="Portfolio Value"
            stroke="#60a5fa"
            strokeWidth={2.5}
            fill="url(#performanceGradient)"
            activeDot={{ r: 5, fill: "#60a5fa", stroke: "#0f172a" }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

