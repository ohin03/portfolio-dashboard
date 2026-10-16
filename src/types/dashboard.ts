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
  | "dividend-income";

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