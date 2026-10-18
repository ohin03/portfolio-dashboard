"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const drawdownData = [
  { date: "Sep 16", drawdown: 0 },
  { date: "Sep 20", drawdown: -1.2 },
  { date: "Sep 24", drawdown: -2.8 },
  { date: "Sep 28", drawdown: -1.6 },
  { date: "Oct 02", drawdown: -4.1 },
  { date: "Oct 06", drawdown: -3.2 },
  { date: "Oct 10", drawdown: -6.32 },
  { date: "Oct 14", drawdown: -4.5 },
  { date: "Oct 18", drawdown: -2.4 },
];

export default function DrawdownChart() {
  const currentDrawdown =
    drawdownData[drawdownData.length - 1].drawdown;

  const maximumDrawdown = Math.min(
    ...drawdownData.map((item) => item.drawdown)
  );

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#101522] p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white">
            Portfolio Drawdown
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            Decline from previous portfolio peaks
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400">Current Drawdown</p>
          <p className="mt-1 text-xl font-bold text-rose-400">
            {currentDrawdown.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-xs text-gray-400">Maximum Drawdown</p>
          <p className="mt-2 text-lg font-semibold text-rose-400">
            {maximumDrawdown.toFixed(2)}%
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <p className="text-xs text-gray-400">Recovery</p>
          <p className="mt-2 text-lg font-semibold text-emerald-400">
            {(
              ((currentDrawdown - maximumDrawdown) /
                Math.abs(maximumDrawdown)) *
              100
            ).toFixed(1)}
            %
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={drawdownData}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="drawdownGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#f43f5e"
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor="#f43f5e"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#ffffff"
              strokeOpacity={0.06}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[-8, 0]}
              tickFormatter={(value: number) => `${value}%`}
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#101522",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#ffffff",
              }}
              formatter={(value) => [
                `${Number(value).toFixed(2)}%`,
                "Drawdown",
              ]}
            />

            <Area
              type="monotone"
              dataKey="drawdown"
              stroke="#f43f5e"
              strokeWidth={2}
              fill="url(#drawdownGradient)"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Illustrative historical data for demonstration only.
      </p>
    </section>
  );
}