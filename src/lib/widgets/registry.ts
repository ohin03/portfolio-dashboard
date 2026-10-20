import type { WidgetType } from "@/types/dashboard";

export interface WidgetDefinition {
  type: WidgetType;
  title: string;
  description: string;
  category: "portfolio" | "performance" | "risk" | "activity";
  defaultVisible: boolean;
  defaultOrder: number;
}

export const widgetRegistry: Record<WidgetType, WidgetDefinition> = {
  "portfolio-summary": {
    type: "portfolio-summary",
    title: "Portfolio Summary",
    description: "View total portfolio value and key metrics.",
    category: "portfolio",
    defaultVisible: true,
    defaultOrder: 0,
  },

  performance: {
    type: "performance",
    title: "Portfolio Performance",
    description: "Track portfolio performance over time.",
    category: "performance",
    defaultVisible: true,
    defaultOrder: 1,
  },

  "asset-allocation": {
    type: "asset-allocation",
    title: "Asset Allocation",
    description: "Review portfolio allocation by sector.",
    category: "portfolio",
    defaultVisible: true,
    defaultOrder: 2,
  },

  "risk-analysis": {
    type: "risk-analysis",
    title: "Risk Analysis",
    description: "Monitor portfolio risk indicators.",
    category: "risk",
    defaultVisible: true,
    defaultOrder: 3,
  },

  "market-status": {
    type: "market-status",
    title: "Market Status",
    description: "Review market indicators and account activity.",
    category: "activity",
    defaultVisible: true,
    defaultOrder: 4,
  },

  "top-holdings": {
    type: "top-holdings",
    title: "Top Holdings",
    description: "Review the largest portfolio holdings.",
    category: "portfolio",
    defaultVisible: true,
    defaultOrder: 5,
  },

  "recent-transactions": {
    type: "recent-transactions",
    title: "Recent Transactions",
    description: "Review recent portfolio transactions.",
    category: "activity",
    defaultVisible: true,
    defaultOrder: 6,
  },

  "sector-exposure": {
    type: "sector-exposure",
    title: "Sector Exposure",
    description: "Analyze exposure across market sectors.",
    category: "portfolio",
    defaultVisible: true,
    defaultOrder: 7,
  },

  "benchmark-comparison": {
    type: "benchmark-comparison",
    title: "Benchmark Comparison",
    description: "Compare portfolio performance against benchmarks.",
    category: "performance",
    defaultVisible: true,
    defaultOrder: 8,
  },

  "dividend-income": {
    type: "dividend-income",
    title: "Dividend Income",
    description: "Track dividend income over time.",
    category: "performance",
    defaultVisible: true,
    defaultOrder: 9,
  },
  "drawdown-analysis": {
    type: "drawdown-analysis",
    title: "Drawdown Analysis",
    description: "Track portfolio declines from previous peaks.",
    category: "risk",
    defaultVisible: true,
    defaultOrder: 10,
  },
  "risk-metrics": {
    type: "risk-metrics",
    title: "Risk Metrics",
    description: "Monitor risk-adjusted returns and portfolio risk metrics.",
    category: "risk",
    defaultVisible: true,
    defaultOrder: 11,
  },
  "correlation-matrix": {
    type: "correlation-matrix",
    title: "Correlation Matrix",
    description: "Compare correlations between portfolio assets.",
    category: "risk",
    defaultVisible: true,
    defaultOrder: 12,
  },

  "brinson-attribution": {
    type: "brinson-attribution",
    title: "Brinson Performance Attribution",
    description: "Analyze allocation, selection, and interaction effects versus a benchmark.",
    category: "performance",
    defaultVisible: true,
    defaultOrder: 13,
  },
};

export function getWidgetDefinition(type: WidgetType) {
  return widgetRegistry[type];
}

export function getAllWidgetDefinitions() {
  return Object.values(widgetRegistry);
}