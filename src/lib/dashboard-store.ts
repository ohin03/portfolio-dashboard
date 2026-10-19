import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type {
  DashboardLayout,
  DashboardWidget,
} from "@/types/dashboard";

interface DashboardState {
  widgets: DashboardWidget[];

  toggleWidget: (id: string) => void;
  moveWidget: (activeId: string, overId: string) => void;
  resetLayout: () => void;
  setWidgets: (widgets: DashboardWidget[]) => void;
}

const initialWidgets: DashboardWidget[] = [
  {
    id: "portfolio-summary",
    type: "portfolio-summary",
    title: "Portfolio Summary",
    visible: true,
    order: 0,
  },
  {
    id: "performance",
    type: "performance",
    title: "Portfolio Performance",
    visible: true,
    order: 1,
  },
  {
    id: "asset-allocation",
    type: "asset-allocation",
    title: "Asset Allocation",
    visible: true,
    order: 2,
  },
  {
    id: "risk-analysis",
    type: "risk-analysis",
    title: "Risk Analysis",
    visible: true,
    order: 3,
  },
  {
    id: "market-status",
    type: "market-status",
    title: "Market Status",
    visible: true,
    order: 4,
  },
  {
    id: "top-holdings",
    type: "top-holdings",
    title: "Top Holdings",
    visible: true,
    order: 5,
  },
  {
    id: "recent-transactions",
    type: "recent-transactions",
    title: "Recent Transactions",
    visible: true,
    order: 6,
  },
  {
    id: "sector-exposure",
    type: "sector-exposure",
    title: "Sector Exposure",
    visible: true,
    order: 7,
  },
  {
    id: "benchmark-comparison",
    type: "benchmark-comparison",
    title: "Benchmark Comparison",
    visible: true,
    order: 8,
  },
  {
    id: "dividend-income",
    type: "dividend-income",
    title: "Dividend Income",
    visible: true,
    order: 9,
  },
  {
    id: "drawdown-analysis",
    type: "drawdown-analysis",
    title: "Drawdown Analysis",
    visible: true,
    order: 10,
  },
  {
    id: "risk-metrics",
    type: "risk-metrics",
    title: "Risk Metrics",
    visible: true,
    order: 11,
  },
];

const createInitialWidgets = (): DashboardWidget[] =>
  initialWidgets.map((widget) => ({ ...widget }));

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: createInitialWidgets(),

      toggleWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.map((widget) =>
            widget.id === id
              ? { ...widget, visible: !widget.visible }
              : widget,
          ),
        })),

      moveWidget: (activeId, overId) =>
        set((state) => {
          const sortedWidgets = [...state.widgets].sort(
            (a, b) => a.order - b.order,
          );

          const activeIndex = sortedWidgets.findIndex(
            (widget) => widget.id === activeId,
          );

          const overIndex = sortedWidgets.findIndex(
            (widget) => widget.id === overId,
          );

          if (
            activeIndex === -1 ||
            overIndex === -1 ||
            activeIndex === overIndex
          ) {
            return state;
          }

          const [movedWidget] = sortedWidgets.splice(activeIndex, 1);
          sortedWidgets.splice(overIndex, 0, movedWidget);

          return {
            widgets: sortedWidgets.map((widget, index) => ({
              ...widget,
              order: index,
            })),
          };
        }),

      resetLayout: () =>
        set({
          widgets: createInitialWidgets(),
        }),

      setWidgets: (widgets) =>
        set({
          widgets: widgets.map((widget, index) => ({
            ...widget,
            order: index,
          })),
        }),
    }),
    {
      name: "portfolio-analytics-dashboard-layout",
      storage: createJSONStorage(() => localStorage),

      partialize: (state): Pick<DashboardLayout, "widgets"> => ({
        widgets: state.widgets,
      }),

      // Add new widgets to older saved layouts without
      // resetting existing visibility and order preferences.
      merge: (persistedState, currentState) => {
        const persisted = persistedState as
          | Pick<DashboardState, "widgets">
          | undefined;

        if (!persisted?.widgets) {
          return currentState;
        }

        const savedWidgets = persisted.widgets.filter(
          (widget, index, widgets) =>
            widgets.findIndex(
              (candidate) => candidate.type === widget.type,
            ) === index,
        );

        const savedTypes = new Set(
          savedWidgets.map((widget) => widget.type),
        );

        const missingWidgets = createInitialWidgets().filter(
          (widget) => !savedTypes.has(widget.type),
        );

        const combinedWidgets = [
          ...savedWidgets,
          ...missingWidgets,
        ];

        return {
          ...currentState,
          widgets: combinedWidgets.map((widget, index) => ({
            ...widget,
            order: index,
          })),
        };
      },
    },
  ),
);
