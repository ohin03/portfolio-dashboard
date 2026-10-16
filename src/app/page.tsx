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

import PerformanceChart from "@/components/charts/PerformanceChart";
import StatCard from "@/components/dashboard/StatCard";
import SortableWidget from "@/components/dashboard/SortableWidget";
import { useDashboardStore } from "@/lib/dashboard-store";

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
{ date: "Sep 16", value: 2180000 },
{ date: "Sep 20", value: 2210000 },
{ date: "Sep 24", value: 2195000 },
{ date: "Sep 28", value: 2260000 },
{ date: "Oct 02", value: 2290000 },
{ date: "Oct 06", value: 2315000 },
{ date: "Oct 10", value: 2380000 },
{ date: "Oct 16", value: 2450680 },
];

const implementedWidgetIds = [
"portfolio-summary",
"performance",
"asset-allocation",
"risk-analysis",
"market-status",
];

function PortfolioSummary() {
return ( <section
   aria-label="Portfolio summary"
   className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
 >
{stats.map((stat) => ( <StatCard
       key={stat.title}
       title={stat.title}
       value={stat.value}
       change={stat.change}
       trend={stat.trend}
       description={stat.description}
       icon={stat.icon}
     />
))} </section>
);
}

function PerformanceWidget() {
return ( <article
   id="performance"
   className="h-full rounded-2xl border border-white/[0.08] bg-[#101522] p-5 sm:p-6"
 > <div className="flex flex-wrap items-center justify-between gap-3"> <div> <h3 className="font-semibold">Portfolio Performance</h3> <p className="mt-1 text-sm text-slate-500">
Illustrative portfolio growth </p> </div>


    <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-400">
      +12.8%
    </span>
  </div>

  <div className="mt-8">
    <PerformanceChart data={performanceData} height={240} />
  </div>

  <p className="mt-3 text-xs text-slate-500">
    Illustrative demo values · Not live market data
  </p>
</article>


);
}

function AssetAllocationWidget() {
return ( <article
   id="portfolio"
   className="h-full rounded-2xl border border-white/[0.08] bg-[#101522] p-5 sm:p-6"
 > <h3 className="font-semibold">Asset Allocation</h3> <p className="mt-1 text-sm text-slate-500">
Portfolio distribution </p>


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
          <span className={`h-2.5 w-2.5 rounded-sm ${item.color}`} />
          <span className="text-slate-400">{item.name}</span>
        </div>

        <span className="font-medium">{item.allocation}%</span>
      </div>
    ))}
  </div>
</article>


);
}

function RiskAnalysisWidget() {
const risks = [
{ label: "Value at Risk (VaR)", value: 42, text: "4.28%" },
{ label: "Portfolio Volatility", value: 58, text: "12.6%" },
{ label: "Risk Exposure", value: 34, text: "Moderate" },
];

return ( <article className="h-full rounded-2xl border border-white/[0.08] bg-[#101522] p-5 sm:p-6"> <div className="flex items-center justify-between"> <h3 className="font-semibold">Risk Analysis</h3> <Activity size={19} className="text-blue-400" /> </div>

```
  <div className="mt-6 space-y-5">
    {risks.map((risk) => (
      <div key={risk.label}>
        <div className="mb-2 flex justify-between gap-3 text-sm">
          <span className="text-slate-400">{risk.label}</span>
          <span className="font-medium">{risk.text}</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
          <div
            style={{ width: `${risk.value}%` }}
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
          />
        </div>
      </div>
    ))}
  </div>
</article>


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

return ( <article className="h-full rounded-2xl border border-white/[0.08] bg-[#101522] p-5 sm:p-6"> <div className="flex items-center justify-between"> <h3 className="font-semibold">Market Status</h3>


    <span className="flex items-center gap-2 text-xs text-emerald-400">
      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
      Demo Mode
    </span>
  </div>

  <div className="mt-6 grid grid-cols-2 gap-4">
    {marketItems.map((item) => (
      <div
        key={item.label}
        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
      >
        <p className="text-xs text-slate-500">{item.label}</p>
        <p className="mt-2 text-xl font-semibold">{item.value}</p>

        {item.change && (
          <p className="mt-2 flex items-center gap-1 text-sm text-emerald-400">
            <ArrowUpRight size={15} />
            {item.change}
          </p>
        )}
      </div>
    ))}
  </div>
</article>


);
}

export default function Home() {
const [showWidgetSettings, setShowWidgetSettings] = useState(false);

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

const visibleWidgets = sortedWidgets.filter(
(widget) =>
widget.visible && implementedWidgetIds.includes(widget.id),
);

function handleDragEnd(event: DragEndEvent) {
const { active, over } = event;


if (over && active.id !== over.id) {
  moveWidget(String(active.id), String(over.id));
}


}

function renderWidget(widgetId: string) {
switch (widgetId) {
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

  default:
    return null;
}


}

return ( <main className="min-h-screen bg-[#080b14] text-slate-100"> <div className="flex min-h-screen"> <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#0c101c] p-6 lg:flex lg:flex-col"> <div className="mb-12 flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600"> <ChartNoAxesCombined size={23} /> </div>


        <div>
          <h1 className="text-lg font-bold tracking-wide">PORTFOLIO</h1>
          <p className="text-xs text-slate-500">ANALYTICS DASHBOARD</p>
        </div>
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        Workspace
      </p>

      <nav className="space-y-2">
        <a
          className="flex items-center gap-3 rounded-xl bg-blue-600/15 px-4 py-3 text-sm font-medium text-blue-400 ring-1 ring-blue-500/20"
          href="#overview"
        >
          <LayoutDashboard size={19} />
          Overview
        </a>

        <a
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          href="#portfolio"
        >
          <BriefcaseBusiness size={19} />
          Portfolio
        </a>

        <a
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          href="#performance"
        >
          <ChartNoAxesCombined size={19} />
          Performance
        </a>
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          onClick={() => setShowWidgetSettings((current) => !current)}
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
            <p className="text-xs text-slate-500">Workspace / Dashboard</p>
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
            className="relative rounded-xl border border-white/10 p-2.5 text-slate-400 hover:text-white"
          >
            <Bell size={19} />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-400" />
          </button>

          <button
            type="button"
            onClick={() => setShowWidgetSettings((current) => !current)}
            aria-label="Customize dashboard widgets"
            aria-expanded={showWidgetSettings}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2.5 text-sm font-medium text-blue-300 transition hover:bg-blue-500/20 sm:px-4"
          >
            <SlidersHorizontal size={17} />
            <span className="hidden sm:inline">Customize</span>
          </button>

          <div
            aria-label="User avatar"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold"
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
            className="rounded-2xl border border-blue-500/20 bg-[#101522] p-5 sm:p-6"
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={19} className="text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">
                    Customize Dashboard
                  </h3>
                </div>

                <p className="mt-2 text-sm text-slate-400">
                  Choose which widgets you want to display.
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

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sortedWidgets.map((widget) => {
                const isImplemented = implementedWidgetIds.includes(
                  widget.id,
                );

                return (
                  <button
                    key={widget.id}
                    type="button"
                    onClick={() => {
                      if (isImplemented) toggleWidget(widget.id);
                    }}
                    disabled={!isImplemented}
                    aria-pressed={widget.visible}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
                      isImplemented
                        ? "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
                        : "cursor-not-allowed border-white/5 bg-white/[0.01] opacity-50"
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-medium text-slate-200">
                        {widget.title}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {isImplemented
                          ? widget.visible
                            ? "Visible"
                            : "Hidden"
                          : "Coming in a future step"}
                      </span>
                    </span>

                    {widget.visible && isImplemented ? (
                      <Eye
                        size={18}
                        className="shrink-0 text-emerald-400"
                      />
                    ) : (
                      <EyeOff
                        size={18}
                        className="shrink-0 text-slate-500"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-start gap-2 rounded-xl bg-blue-500/5 p-3">
              <Settings size={16} className="mt-0.5 shrink-0 text-blue-400" />
              <p className="text-xs leading-5 text-slate-400">
                Widget visibility and order are saved in this browser.
                Five additional widget types are planned for later steps.
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
                    {renderWidget(widget.id)}
                  </SortableWidget>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <footer className="flex flex-wrap justify-between gap-2 border-t border-white/[0.08] pt-5 text-xs text-slate-500">
          <span>Portfolio Analytics Dashboard</span>
          <span>Demo data · Not real-time market information</span>
        </footer>
      </div>
    </section>
  </div>
</main>


);
}
