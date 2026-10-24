"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Settings,
  Bell,
  Search,
  ArrowUpRight,
  Wallet,
  Activity,
  TrendingUp,
  Menu,
  Eye,
  EyeOff,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

import {
  calculateBrinsonAttribution,
  type BrinsonSector,
} from "@/lib/analytics/brinson-attribution";

import PerformanceChart from "@/components/charts/PerformanceChart";
import StatCard from "@/components/dashboard/StatCard";
import SortableWidget from "@/components/dashboard/SortableWidget";
import { useDashboardStore } from "@/lib/dashboard-store";
import { useThemeStore } from "@/lib/theme-store";
import WidgetShell from "@/components/widgets/WidgetShell";
import { getAllWidgetDefinitions } from "@/lib/widgets/registry";
import DrawdownChart from "@/components/charts/DrawdownChart";
import type { WidgetType } from "@/types/dashboard";

const stats = [
  {
    title: "Total Portfolio Value",
    value: "$2,450,680",
    change: "+12.8%",
    trend: "up" as const,
    description: "vs. previous period",
    icon: Wallet,
  },
  {
    title: "Net Asset Value",
    value: "$1,845,230",
    change: "+8.4%",
    trend: "up" as const,
    description: "vs. previous period",
    icon: TrendingUp,
  },
  {
    title: "Portfolio Risk (VaR)",
    value: "4.28%",
    change: "-0.6%",
    trend: "up" as const,
    description: "risk reduced",
    icon: Activity,
  },
  {
    title: "Maximum Drawdown",
    value: "-6.32%",
    change: "+1.2%",
    trend: "neutral" as const,
    description: "historical metric",
    icon: ChartNoAxesCombined,
  },
];

const activities = [
  { name: "Technology", allocation: 35, color: "bg-blue-500" },
  { name: "Healthcare", allocation: 25, color: "bg-violet-500" },
  { name: "Financials", allocation: 20, color: "bg-emerald-500" },
  { name: "Energy", allocation: 12, color: "bg-amber-500" },
  { name: "Other", allocation: 8, color: "bg-pink-500" },
];

const performanceData = [
  { date: "Sep 16", value: 2180000, benchmark: 2000000 },
  { date: "Sep 20", value: 2210000, benchmark: 2020000 },
  { date: "Sep 24", value: 2195000, benchmark: 2015000 },
  { date: "Sep 28", value: 2260000, benchmark: 2050000 },
  { date: "Oct 02", value: 2290000, benchmark: 2070000 },
  { date: "Oct 06", value: 2315000, benchmark: 2090000 },
  { date: "Oct 10", value: 2380000, benchmark: 2120000 },
  { date: "Oct 16", value: 2450680, benchmark: 2150000 },
];

const implementedWidgetTypes: WidgetType[] = [
  "portfolio-summary",
  "performance",
  "asset-allocation",
  "risk-analysis",
  "market-status",
  "top-holdings",
  "recent-transactions",
  "sector-exposure",
  "benchmark-comparison",
  "dividend-income",
  "drawdown-analysis",
  "risk-metrics",
  "correlation-matrix",
  "brinson-attribution",
];

function PortfolioSummary() {
  return (
    <section
      aria-label="Portfolio summary"
      className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          description={stat.description}
          icon={stat.icon}
        />
      ))}
    </section>
  );
}

function PerformanceWidget() {
  return (
    <WidgetShell
      title="Portfolio Performance"
      description="Illustrative portfolio growth"
      action={
        <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-400">
          +12.8%
        </span>
      }
    >
      <div className="mt-2">
        <PerformanceChart data={performanceData} height={240} />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Illustrative demo values · Not live market data
      </p>
    </WidgetShell>
  );
}

function AssetAllocationWidget() {
  return (
    <WidgetShell
      title="Asset Allocation"
      description="Portfolio distribution"
    >
      <div className="my-8 flex justify-center">
        <div
          className="flex h-44 w-44 items-center justify-center rounded-full"
          style={{
            background:
              "conic-gradient(#3b82f6 0% 35%, #8b5cf6 35% 60%, #10b981 60% 80%, #f59e0b 80% 92%, #ec4899 92% 100%)",
          }}
        >
          <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-[#101522]">
            <span className="text-xs text-slate-500">Total Assets</span>
            <span className="mt-1 text-xl font-bold">$2.45M</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`h-2.5 w-2.5 rounded-sm ${item.color}`}
              />
              <span className="text-slate-400">{item.name}</span>
            </div>

            <span className="font-medium">{item.allocation}%</span>
          </div>
        ))}
      </div>
    </WidgetShell>
  );
}


function RiskAnalysisWidget() {
  const varPercentage = 4.28;
  const volatility = 12.6;
  const riskLevel = "Moderate";

  const risks = [
    {
      label: "Portfolio Volatility",
      value: 58,
      text: `${volatility}%`,
      color: "from-cyan-500 to-blue-400",
    },
    {
      label: "Risk Exposure",
      value: 34,
      text: riskLevel,
      color: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <WidgetShell
      title="Risk Analysis"
      description="Portfolio risk indicators"
      action={<Activity size={19} className="text-blue-400" />}
    >
      <div className="mt-5">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-slate-400">
                Value at Risk (VaR)
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {varPercentage.toFixed(2)}%
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Illustrative portfolio risk estimate
              </p>
            </div>

            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
              Moderate
            </span>
          </div>

          <div className="mt-5">
            <div className="relative h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-emerald-500/80" />
              <div className="absolute inset-y-0 left-1/3 w-1/3 bg-amber-400/80" />
              <div className="absolute inset-y-0 right-0 w-1/3 bg-rose-500/80" />

              <div
                className="absolute inset-y-0 z-10 w-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                style={{ left: "42.8%" }}
                title="Illustrative VaR indicator"
              />
            </div>

            <div className="mt-2 flex justify-between text-[11px] text-slate-500">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3 text-xs">
            <span className="text-slate-500">Risk indicator</span>
            <span className="font-medium text-amber-300">
              Within moderate zone
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {risks.map((risk) => (
          <div key={risk.label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="text-slate-400">{risk.label}</span>
              <span className="font-medium text-white">{risk.text}</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                style={{ width: `${risk.value}%` }}
                className={`h-full rounded-full bg-gradient-to-r ${risk.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs leading-5 text-slate-500">
        Illustrative demo values · Not live risk data or financial advice.
        VaR interpretation depends on the model, confidence level, and time
        horizon.
      </p>
    </WidgetShell>
  );
}

const correlationAssets = [
  "Technology",
  "Healthcare",
  "Financials",
  "Energy",
  "Bonds",
];

const correlationValues = [
  [1.00, 0.62, 0.48, 0.21, -0.18],
  [0.62, 1.00, 0.35, 0.12, -0.08],
  [0.48, 0.35, 1.00, 0.41, -0.22],
  [0.21, 0.12, 0.41, 1.00, -0.31],
  [-0.18, -0.08, -0.22, -0.31, 1.00],
];

function CorrelationMatrixWidget() {
  function cellStyle(value: number): React.CSSProperties {
    if (value >= 0) {
      const intensity = Math.round(35 + value * 40);
      return {
        backgroundColor: `rgba(6, 78, 59, ${intensity / 100})`,
        color: "#ffffff",
      };
    }

    const intensity = Math.round(35 + Math.abs(value) * 40);
    return {
      backgroundColor: `rgba(136, 19, 55, ${intensity / 100})`,
      color: "#ffffff",
    };
  }

  return (
    <WidgetShell
      title="Correlation Matrix"
      description="Illustrative relationships between asset classes"
      action={<Activity size={19} className="text-cyan-400" />}
    >
      <div className="mt-5 overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400" tabIndex={0} role="region" aria-label="Scrollable data table">
        <table
          className="w-full min-w-[440px] border-separate border-spacing-1 text-center text-xs"
          aria-label="Illustrative portfolio asset correlation matrix"
        >
          <thead>
            <tr>
              <th scope="col" className="p-2 text-left text-slate-500">
                Asset
              </th>
              {correlationAssets.map((asset) => (
                <th
                  key={asset}
                  scope="col"
                  className="p-2 font-medium text-slate-400"
                >
                  {asset}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {correlationAssets.map((asset, rowIndex) => (
              <tr key={asset}>
                <th
                  scope="row"
                  className="whitespace-nowrap p-2 text-left font-medium text-slate-300"
                >
                  {asset}
                </th>
                {correlationValues[rowIndex].map((value, columnIndex) => (
                  <td
                    key={`${asset}-${correlationAssets[columnIndex]}`}
                    title={`${asset} / ${correlationAssets[columnIndex]}: ${value.toFixed(2)}`}
                    className="rounded-md p-3 font-semibold tabular-nums"
                    style={cellStyle(value)}
                  >
                    {value.toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-emerald-500" />
          Positive
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-slate-500" />
          Near zero
        </span>
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-rose-500" />
          Negative
        </span>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Demo correlation values for UI demonstration only. These are not
        calculated from historical market returns or live portfolio data.
      </p>
    </WidgetShell>
  );
}

function BrinsonAttributionWidget() {
  const sectors: BrinsonSector[] = [
    { sector: "Technology", portfolioWeight: 0.35, benchmarkWeight: 0.30, portfolioReturn: 0.12, benchmarkReturn: 0.09 },
    { sector: "Healthcare", portfolioWeight: 0.20, benchmarkWeight: 0.22, portfolioReturn: 0.07, benchmarkReturn: 0.08 },
    { sector: "Financials", portfolioWeight: 0.18, benchmarkWeight: 0.20, portfolioReturn: 0.10, benchmarkReturn: 0.06 },
    { sector: "Energy", portfolioWeight: 0.12, benchmarkWeight: 0.13, portfolioReturn: -0.02, benchmarkReturn: 0.01 },
    { sector: "Consumer & Other", portfolioWeight: 0.15, benchmarkWeight: 0.15, portfolioReturn: 0.06, benchmarkReturn: 0.05 },
  ];

  const attribution = calculateBrinsonAttribution(sectors);

  const {
    rows,
    portfolioReturn,
    benchmarkReturn,
    totalAllocation,
    totalSelection,
    totalInteraction,
    activeReturn,
  } = attribution;

  const formatEffect = (value: number) =>
    `${value >= 0 ? "+" : ""}${(value * 100).toFixed(2)}%`;

  const summary = [
    { label: "Allocation Effect", value: totalAllocation, color: "text-cyan-300" },
    { label: "Selection Effect", value: totalSelection, color: "text-emerald-300" },
    { label: "Interaction Effect", value: totalInteraction, color: "text-violet-300" },
    { label: "Active Return", value: activeReturn, color: activeReturn >= 0 ? "text-emerald-300" : "text-rose-300" },
  ];

  return (
    <WidgetShell
      title="Brinson Performance Attribution"
      description="Break down portfolio return relative to its benchmark"
      action={<Activity size={19} className="text-cyan-400" />}
    >
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-slate-400">{item.label}</p>
            <p className={`mt-2 text-xl font-semibold tabular-nums ${item.color}`}>
              {formatEffect(item.value)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300">
        <span>Portfolio return: <strong>{(portfolioReturn * 100).toFixed(2)}%</strong></span>
        <span>Benchmark return: <strong>{(benchmarkReturn * 100).toFixed(2)}%</strong></span>
      </div>

      <div className="mt-5 overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400" tabIndex={0} role="region" aria-label="Scrollable data table">
        <table className="w-full min-w-[680px] text-left text-xs">
          <caption className="sr-only">Illustrative Brinson sector attribution effects</caption>
          <thead>
            <tr className="border-b border-white/10 text-slate-400">
              <th scope="col" className="px-3 py-3">Sector</th>
              <th scope="col" className="px-3 py-3 text-right">Portfolio Wt.</th>
              <th scope="col" className="px-3 py-3 text-right">Benchmark Wt.</th>
              <th scope="col" className="px-3 py-3 text-right">Allocation</th>
              <th scope="col" className="px-3 py-3 text-right">Selection</th>
              <th scope="col" className="px-3 py-3 text-right">Interaction</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.sector} className="border-b border-white/5">
                <th scope="row" className="px-3 py-3 font-medium text-slate-200">{item.sector}</th>
                <td className="px-3 py-3 text-right tabular-nums">{(item.portfolioWeight * 100).toFixed(0)}%</td>
                <td className="px-3 py-3 text-right tabular-nums">{(item.benchmarkWeight * 100).toFixed(0)}%</td>
                <td className={`px-3 py-3 text-right tabular-nums ${item.allocation >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{formatEffect(item.allocation)}</td>
                <td className={`px-3 py-3 text-right tabular-nums ${item.selection >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{formatEffect(item.selection)}</td>
                <td className={`px-3 py-3 text-right tabular-nums ${item.interaction >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{formatEffect(item.interaction)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Illustrative demo data only, not live investment data or financial advice.
        Attribution uses the Brinson-Fachler allocation formula and standard selection
        and interaction effects. Sector weights and returns are sample inputs.
      </p>
    </WidgetShell>
  );
}

function RiskMetricsWidget() {
  const metrics = [
    {
      label: "Sharpe Ratio",
      value: "1.42",
      description: "Risk-adjusted return",
      progress: 71,
      color: "from-blue-500 to-cyan-400",
    },
    {
      label: "Maximum Drawdown",
      value: "-6.32%",
      description: "Peak-to-trough decline",
      progress: 42,
      color: "from-rose-500 to-orange-400",
    },
    {
      label: "Portfolio Volatility",
      value: "12.6%",
      description: "Return fluctuation indicator",
      progress: 58,
      color: "from-violet-500 to-blue-400",
    },
  ];

  return (
    <WidgetShell
      title="Risk Metrics"
      description="Risk-adjusted returns and portfolio risk"
      action={<Activity size={19} className="text-blue-400" />}
    >
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
          >
            <p className="text-sm text-slate-400">{metric.label}</p>

            <p className="mt-3 text-2xl font-semibold tracking-tight text-white">
              {metric.value}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {metric.description}
            </p>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${metric.color}`}
                style={{ width: `${metric.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-amber-400/10 bg-amber-400/[0.04] p-3">
        <div>
          <p className="text-sm font-medium text-white">
            Illustrative Risk Profile
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Demo metrics only; not a live risk assessment.
          </p>
        </div>

        <span className="shrink-0 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-300">
          Moderate
        </span>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        Sharpe Ratio interpretation depends on the return period, risk-free
        rate, and calculation method. All displayed metrics are illustrative.
      </p>
    </WidgetShell>
  );
}









function MarketStatusWidget() {
  const marketItems = [
    {
      label: "S&P 500",
      value: "5,842.47",
      change: "+0.84%",
    },
    {
      label: "NASDAQ",
      value: "18,420.15",
      change: "+1.12%",
    },
    {
      label: "Active Positions",
      value: "24",
    },
    {
      label: "Cash Balance",
      value: "$184.5K",
    },
  ];

  return (
    <WidgetShell
      title="Market Status"
      description="Market overview and portfolio activity"
      action={
        <span className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Demo Mode
        </span>
      }
    >
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {marketItems.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.04]"
          >
            <p className="text-xs text-slate-500">{item.label}</p>

            <p className="mt-2 text-xl font-semibold text-white">
              {item.value}
            </p>

            {item.change && (
              <p className="mt-2 flex items-center gap-1 text-sm text-emerald-400">
                <ArrowUpRight size={15} />
                {item.change}
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-slate-500">
        Illustrative demo values · Not live market data
      </p>
    </WidgetShell>
  );
}

function TopHoldingsWidget() {
  const holdings = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      shares: "1,250",
      price: "$235.45",
      value: "$294,312.50",
      change: "+2.45%",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      shares: "820",
      price: "$511.20",
      value: "$419,184.00",
      change: "+1.82%",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      shares: "1,100",
      price: "$178.26",
      value: "$196,086.00",
      change: "+3.67%",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      shares: "650",
      price: "$221.30",
      value: "$143,845.00",
      change: "-0.64%",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      shares: "900",
      price: "$245.10",
      value: "$220,590.00",
      change: "+1.24%",
    },
  ];

  return (
    <WidgetShell
      title="Top Holdings"
      description="Your largest stock positions"
      action={
        <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
          5 Assets
        </span>
      }
    >
      <div className="space-y-4">
        {holdings.map((holding) => (
          <div
            key={holding.symbol}
            className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-4 last:border-0 last:pb-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.06] text-xs font-bold text-slate-200">
                {holding.symbol.slice(0, 2)}
              </div>

              <div className="min-w-0">
                <p className="font-semibold text-white">
                  {holding.symbol}
                </p>

                <p className="truncate text-xs text-slate-500">
                  {holding.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {holding.shares} shares · {holding.price}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-white">
                {holding.value}
              </p>

              <p
                className={`mt-1 text-xs font-medium ${
                  holding.change.startsWith("+")
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {holding.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Illustrative holdings · Not live market data
      </p>
    </WidgetShell>
  );
}

function RecentTransactionsWidget() {
  const transactions = [
    {
      id: "TXN-001",
      symbol: "AAPL",
      type: "BUY",
      quantity: 120,
      price: 235.45,
      date: "Oct 17, 2026",
    },
    {
      id: "TXN-002",
      symbol: "MSFT",
      type: "SELL",
      quantity: 45,
      price: 511.2,
      date: "Oct 16, 2026",
    },
    {
      id: "TXN-003",
      symbol: "NVDA",
      type: "BUY",
      quantity: 200,
      price: 178.26,
      date: "Oct 15, 2026",
    },
    {
      id: "TXN-004",
      symbol: "AMZN",
      type: "BUY",
      quantity: 75,
      price: 221.3,
      date: "Oct 14, 2026",
    },
    {
      id: "TXN-005",
      symbol: "GOOGL",
      type: "SELL",
      quantity: 30,
      price: 245.1,
      date: "Oct 13, 2026",
    },
  ];

  return (
    <WidgetShell
      title="Recent Transactions"
      description="Your latest portfolio activity"
      action={
        <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
          {transactions.length} Transactions
        </span>
      }
    >
      <div className="space-y-4">
        {transactions.map((transaction) => {
          const total =
            transaction.quantity * transaction.price;

          const isBuy = transaction.type === "BUY";

          return (
            <div
              key={transaction.id}
              className="flex flex-col gap-3 border-b border-white/[0.06] pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    isBuy
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {isBuy ? "BUY" : "SELL"}
                </div>

                <div>
                  <p className="font-semibold text-white">
                    {transaction.symbol}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {transaction.quantity} shares × $
                    {transaction.price.toFixed(2)}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {transaction.date}
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-sm font-semibold text-white">
                  $
                  {total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>

                <p
                  className={`mt-1 text-xs font-medium ${
                    isBuy
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {transaction.type}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Illustrative transactions · Demo data only
      </p>
    </WidgetShell>
  );
}

function SectorExposureWidget() {
  const sectors = [
    { name: "Technology", percentage: 35, value: "$857,738" },
    { name: "Healthcare", percentage: 25, value: "$612,670" },
    { name: "Financials", percentage: 20, value: "$490,136" },
    { name: "Energy", percentage: 12, value: "$294,082" },
    { name: "Other", percentage: 8, value: "$196,054" },
  ];

  return (
    <WidgetShell
      title="Sector Exposure"
      description="Portfolio allocation by industry sector"
      action={
        <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
          5 Sectors
        </span>
      }
    >
      <div className="space-y-5">
        {sectors.map((sector) => (
          <div key={sector.name}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm text-slate-300">
                {sector.name}
              </span>

              <div className="text-right">
                <span className="text-sm font-semibold text-white">
                  {sector.percentage}%
                </span>

                <span className="ml-3 text-xs text-slate-500">
                  {sector.value}
                </span>
              </div>
            </div>

            <div
              className="h-2 overflow-hidden rounded-full bg-white/[0.06]"
              role="progressbar"
              aria-label={`${sector.name} allocation`}
              aria-valuenow={sector.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{ width: `${sector.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Illustrative allocation · Demo data only
      </p>
    </WidgetShell>
  );
}

function BenchmarkComparisonWidget() {
  const benchmarks = [
    {
      name: "My Portfolio",
      return: 12.8,
      color: "bg-blue-500",
    },
    {
      name: "S&P 500",
      return: 9.4,
      color: "bg-emerald-500",
    },
    {
      name: "NASDAQ",
      return: 11.2,
      color: "bg-purple-500",
    },
  ];

  return (
    <article className="h-full rounded-2xl border border-white/[0.08] bg-[#101522] p-5 sm:p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white">
          Benchmark Comparison
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          Portfolio returns vs market benchmarks
        </p>
      </div>

      <div className="mb-5 flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div>
          <p className="text-sm text-gray-400">Period Return</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            +12.8%
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-400">vs S&P 500</p>
          <p className="mt-1 text-lg font-semibold text-emerald-400">
            +3.4%
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {benchmarks.map((benchmark) => (
          <div key={benchmark.name}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm text-gray-300">
                {benchmark.name}
              </span>

              <span className="text-sm font-semibold text-white">
                +{benchmark.return.toFixed(1)}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className={`h-full rounded-full ${benchmark.color}`}
                style={{
                  width: `${(benchmark.return / 15) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-gray-500">
        Illustrative demo data — not live market performance.
      </p>
    </article>
  );
}



function DividendIncomeWidget() {
  const dividendData = [
    { month: "May", amount: 320 },
    { month: "Jun", amount: 450 },
    { month: "Jul", amount: 380 },
    { month: "Aug", amount: 520 },
    { month: "Sep", amount: 610 },
    { month: "Oct", amount: 480 },
  ];

  const totalIncome = dividendData.reduce(
    (total, item) => total + item.amount,
    0
  );

  const averageIncome = totalIncome / dividendData.length;

  return (
    <article className="h-full rounded-2xl border border-white/[0.08] bg-[#101522] p-5 sm:p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white">
          Dividend Income
        </h3>
        <p className="mt-1 text-sm text-gray-400">
          Monthly dividend income overview
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-sm text-gray-400">Total Income</p>
          <p className="mt-2 text-xl font-bold text-emerald-400">
            ${totalIncome.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <p className="text-sm text-gray-400">Monthly Average</p>
          <p className="mt-2 text-xl font-bold text-white">
            ${averageIncome.toFixed(0)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {dividendData.map((item) => (
          <div key={item.month}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm text-gray-300">
                {item.month}
              </span>
              <span className="text-sm font-medium text-white">
                ${item.amount}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${(item.amount / 700) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs text-gray-500">
        Illustrative demo data — not actual dividend earnings.
      </p>
    </article>
  );
}



export default function Home() {
  const [showWidgetSettings, setShowWidgetSettings] = useState(false);

  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const brandName = useThemeStore((state) => state.brandName);
  const setBrandName = useThemeStore((state) => state.setBrandName);
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const accentColor = useThemeStore((state) => state.accentColor);
  const setBrandColors = useThemeStore((state) => state.setBrandColors);

  const widgets = useDashboardStore((state) => state.widgets);
  const toggleWidget = useDashboardStore((state) => state.toggleWidget);
  const resetLayout = useDashboardStore((state) => state.resetLayout);
  const moveWidget = useDashboardStore((state) => state.moveWidget);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  const widgetDefinitions = getAllWidgetDefinitions();

  const visibleWidgets = sortedWidgets.filter(
    (widget) =>
      widget.visible && implementedWidgetTypes.includes(widget.type),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      moveWidget(String(active.id), String(over.id));
    }
  }

  function renderWidget(widgetType: WidgetType) {
    switch (widgetType) {
      case "portfolio-summary":
        return <PortfolioSummary />;

      case "performance":
        return <PerformanceWidget />;

      case "asset-allocation":
        return <AssetAllocationWidget />;

      case "risk-analysis":
        return <RiskAnalysisWidget />;

      case "market-status":
        return <MarketStatusWidget />;

      case "top-holdings":
        return <TopHoldingsWidget />;

      case "recent-transactions":
        return <RecentTransactionsWidget />;

      case "sector-exposure":
        return <SectorExposureWidget />;

      case "benchmark-comparison":
        return <BenchmarkComparisonWidget />;

      case "dividend-income":
        return <DividendIncomeWidget />;

      case "drawdown-analysis":
        return <DrawdownChart />;

      case "risk-metrics":
        return <RiskMetricsWidget />;

      case "correlation-matrix":
        return <CorrelationMatrixWidget />;

      case "brinson-attribution":
        return <BrinsonAttributionWidget />;

      default:
        return null;
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] p-6 lg:flex lg:flex-col">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: primaryColor }}>
              <ChartNoAxesCombined size={23} />
            </div>

            <div>
              <h1 className="max-w-44 truncate text-lg font-bold tracking-wide">
                {brandName || "Portfolio Analytics"}
              </h1>
              <p className="text-xs text-slate-500">
                ANALYTICS DASHBOARD
              </p>
            </div>
          </div>

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>

          <nav className="space-y-2">
            <a
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ring-1 transition-colors" style={{ color: "#ffffff", backgroundColor: `${primaryColor}20`, boxShadow: `inset 0 0 0 1px ${primaryColor}35` }}
              href="#overview"
            >
              <LayoutDashboard size={19} />
              Overview
            </a>

            <a
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
              href="#portfolio"
            >
              <BriefcaseBusiness size={19} />
              Portfolio
            </a>

            <a
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]"
              href="#performance"
            >
              <ChartNoAxesCombined size={19} />
              Performance
            </a>
          </nav>

          <div className="mt-auto">
            <button
              type="button"
              onClick={() =>
                setShowWidgetSettings((current) => !current)
              }
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <Settings size={19} />
              Dashboard Settings
            </button>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                System Operational
              </div>

              <p className="text-xs leading-5 text-slate-500">
                Dashboard services are running normally.
              </p>
            </div>
          </div>
        </aside>

        <section id="overview" className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-lg border border-white/10 p-2 lg:hidden"
                aria-label="Menu"
              >
                <Menu size={20} />
              </button>

              <div>
                <p className="text-xs text-slate-500">
                  Workspace / Dashboard
                </p>
                <h2 className="mt-1 text-xl font-semibold sm:text-2xl">
                  Portfolio Overview
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 sm:flex">
                <Search size={16} className="text-slate-500" />
                <input
                  aria-label="Search dashboard"
                  placeholder="Search..."
                  className="w-28 bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>

              <button
                type="button"
                aria-label="Notifications"
                className="relative rounded-xl border border-white/10 p-2.5 text-slate-400 transition hover:text-white"
                style={{ borderColor: `${accentColor}55` }}
              >
                <Bell size={19} />
                <span
                  className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: accentColor }}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowWidgetSettings((current) => !current)
                }
                aria-label="Customize dashboard widgets"
                aria-expanded={showWidgetSettings}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition sm:px-4"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}55`,
                  backgroundColor: `${accentColor}18`,
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.backgroundColor = `${accentColor}30`;
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.backgroundColor = `${accentColor}18`;
                }}
              >
                <SlidersHorizontal size={17} />
                <span className="hidden sm:inline">Customize</span>
              </button>

              <div
                aria-label="User avatar"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                }}
              >
                OH
              </div>
            </div>
          </header>

          <div className="space-y-8 p-5 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Welcome back</p>
                <h3 className="mt-1 text-2xl font-bold sm:text-3xl">
                  Investment Dashboard
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Monitor portfolio performance and risk indicators.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-[#111625] px-4 py-2.5 text-sm text-slate-300">
                Last 30 days <span className="ml-2">⌄</span>
              </div>
            </div>

            {showWidgetSettings && (
              <section
                id="settings"
                aria-label="Dashboard widget settings"
                className="rounded-2xl border p-5 sm:p-6" style={{ borderColor: `color-mix(in srgb, var(--brand-primary) 25%, transparent)`, backgroundColor: "var(--surface)" }}
              >
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal
                        size={19}
                        style={{ color: accentColor }}
                      />
                      <h3 className="text-lg font-semibold text-white">
                        Customize Dashboard
                      </h3>
                    </div>

                    <p className="mt-2 text-sm text-slate-400">
                      Choose which widgets you want to display and review
                      their details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={resetLayout}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5"
                  >
                    <RotateCcw size={15} />
                    Reset Layout
                  </button>
                </div>

                <div className="mb-6 rounded-xl border p-4 sm:p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-elevated)" }}>
                  <div className="mb-4">
                    <h4 className="text-base font-semibold text-white">
                      White-label Branding
                    </h4>
                    <p className="mt-1 text-sm text-slate-400">
                      Customize the dashboard appearance and brand identity.
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <label
                        htmlFor="dashboard-theme"
                        className="mb-2 block text-sm font-medium text-slate-300"
                      >
                        Appearance
                      </label>
                      <select
                        id="dashboard-theme"
                        value={theme}
                        onChange={(event) =>
                          setTheme(event.target.value as "dark" | "light")
                        }
                        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)", "--tw-ring-color": "var(--brand-primary)" } as React.CSSProperties}
                      >
                        <option value="dark">Dark mode</option>
                        <option value="light">Light mode</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="dashboard-brand-name"
                        className="mb-2 block text-sm font-medium text-slate-300"
                      >
                        Brand name
                      </label>
                      <input
                        id="dashboard-brand-name"
                        type="text"
                        maxLength={60}
                        value={brandName}
                        onChange={(event) => setBrandName(event.target.value)}
                        className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)", color: "var(--foreground)", "--tw-ring-color": "var(--brand-primary)" } as React.CSSProperties}
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="dashboard-primary-color"
                        className="mb-2 block text-sm font-medium text-slate-300"
                      >
                        Primary color
                      </label>
                      <div className="flex items-center gap-3 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
                        <input
                          id="dashboard-primary-color"
                          type="color"
                          value={primaryColor}
                          onChange={(event) =>
                            setBrandColors(event.target.value, accentColor)
                          }
                          aria-label="Choose primary brand color"
                          className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
                        />
                        <span className="text-sm text-slate-300">
                          {primaryColor.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="dashboard-accent-color"
                        className="mb-2 block text-sm font-medium text-slate-300"
                      >
                        Accent color
                      </label>
                      <div className="flex items-center gap-3 rounded-lg border px-3 py-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--background)" }}>
                        <input
                          id="dashboard-accent-color"
                          type="color"
                          value={accentColor}
                          onChange={(event) =>
                            setBrandColors(primaryColor, event.target.value)
                          }
                          aria-label="Choose accent brand color"
                          className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
                        />
                        <span className="text-sm text-slate-300">
                          {accentColor.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {sortedWidgets.map((widget) => {
                    const definition = widgetDefinitions.find(
                      (item) => item.type === widget.type,
                    );

                    const isImplemented = implementedWidgetTypes.includes(
                      widget.type,
                    );

                    return (
                      <button
                        key={widget.id}
                        type="button"
                        onClick={() => {
                          if (isImplemented) {
                            toggleWidget(widget.id);
                          }
                        }}
                        disabled={!isImplemented}
                        aria-pressed={widget.visible}
                        className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-4 text-left transition ${
                          isImplemented
                            ? "border-white/10 bg-white/[0.03] hover:border-blue-500/30 hover:bg-white/[0.06]"
                            : "cursor-not-allowed border-white/5 bg-white/[0.01] opacity-60"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block text-sm font-medium text-slate-200">
                            {definition?.title ?? widget.title}
                          </span>

                          <span className="mt-2 block text-xs leading-5 text-slate-400">
                            {definition?.description ?? "Dashboard widget"}
                          </span>

                          <span className="mt-2 block text-xs capitalize text-slate-500">
                            {definition?.category ?? "other"}
                          </span>

                          <span
                            className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs ${
                              !isImplemented
                                ? "bg-white/5 text-slate-500"
                                : widget.visible
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-amber-500/10 text-amber-400"
                            }`}
                          >
                            {!isImplemented
                              ? "Coming Soon"
                              : widget.visible
                                ? "Visible"
                                : "Hidden"}
                          </span>
                        </span>

                        {widget.visible && isImplemented ? (
                          <Eye
                            size={18}
                            className="mt-1 shrink-0 text-emerald-400"
                          />
                        ) : (
                          <EyeOff
                            size={18}
                            className="mt-1 shrink-0 text-slate-500"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-start gap-2 rounded-xl bg-blue-500/5 p-3">
                  <Settings
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-400"
                  />

                  <p className="text-xs leading-5 text-slate-400">
                    Widget visibility and order are saved in this browser.
                    All {implementedWidgetTypes.length} widget types are
                    currently implemented.
                  </p>
                </div>
              </section>
            )}

            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium text-slate-400">
                  Dashboard Widgets
                </h3>
                <span className="text-xs text-slate-500">
                  Drag using the handle to reorder
                </span>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={visibleWidgets.map((widget) => widget.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
                    {visibleWidgets.map((widget) => (
                      <SortableWidget key={widget.id} id={widget.id}>
                        {renderWidget(widget.type)}
                      </SortableWidget>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>

            <footer className="flex flex-wrap justify-between gap-2 border-t border-white/[0.08] pt-5 text-xs text-slate-500">
              <span>{brandName || "Portfolio Analytics"} Dashboard</span>
              <span>Demo data · Not real-time market information</span>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
