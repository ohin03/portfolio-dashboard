export type WidgetType =
  | "portfolio-summary"
  | "performance"
  | "asset-allocation"
  | "risk-analysis"
  | "market-status"
  | "top-holdings"
  | "recent-transactions"
  | "sector-exposure"
  | "benchmark-comparison"
  | "dividend-income"
  | "drawdown-analysis"
  | "risk-metrics"
  | "risk-metrics";

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  visible: boolean;
  order: number;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  updatedAt: number;
}