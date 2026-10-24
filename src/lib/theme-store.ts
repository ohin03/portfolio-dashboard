import { create } from "zustand";
import {
persist,
createJSONStorage,
type StateStorage,
} from "zustand/middleware";

export type DashboardTheme = "dark" | "light";

interface ThemeState {
theme: DashboardTheme;
brandName: string;
primaryColor: string;
accentColor: string;

hasHydrated: boolean;

setTheme: (theme: DashboardTheme) => void;
setBrandName: (name: string) => void;
setBrandColors: (primary: string, accent: string) => void;
setHasHydrated: (value: boolean) => void;
}

const isValidColor = (value: string) =>
/^#[0-9a-fA-F]{6}$/.test(value);

const storage: StateStorage = {
getItem: (name) => {
if (typeof window === "undefined") return null;
return window.localStorage.getItem(name);
},
setItem: (name, value) => {
window.localStorage.setItem(name, value);
},
removeItem: (name) => {
window.localStorage.removeItem(name);
},
};

export const useThemeStore = create<ThemeState>()(
persist(
(set) => ({
theme: "dark",
brandName: "Portfolio Analytics",
primaryColor: "#6366f1",
accentColor: "#22d3ee",


  hasHydrated: false,

  setTheme: (theme) => set({ theme }),

  setBrandName: (brandName) =>
    set({ brandName: brandName.trim().slice(0, 60) }),

  setBrandColors: (primaryColor, accentColor) => {
    if (!isValidColor(primaryColor) || !isValidColor(accentColor)) {
      return;
    }

    set({ primaryColor, accentColor });
  },

  setHasHydrated: (value) => set({ hasHydrated: value }),
}),
{
  name: "portfolio-theme-settings",
  storage: createJSONStorage(() => storage),
  skipHydration: true,

  partialize: (state) => ({
    theme: state.theme,
    brandName: state.brandName,
    primaryColor: state.primaryColor,
    accentColor: state.accentColor,
  }),

  onRehydrateStorage: () => (state, error) => {
    if (error) {
      console.error("Theme settings hydration failed:", error);
    }

    state?.setHasHydrated(true);
  },
},


),
);
