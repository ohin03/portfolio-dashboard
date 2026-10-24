"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useThemeStore } from "@/lib/theme-store";

export default function ThemeProvider({
children,
}: {
children: ReactNode;
}) {
const [mounted, setMounted] = useState(false);

const theme = useThemeStore((state) => state.theme);
const brandName = useThemeStore((state) => state.brandName);
const primaryColor = useThemeStore((state) => state.primaryColor);
const accentColor = useThemeStore((state) => state.accentColor);
const hasHydrated = useThemeStore((state) => state.hasHydrated);

useEffect(() => {
let active = true;

const hydrate = async () => {
  try {
    await useThemeStore.persist.rehydrate();
  } catch (error) {
    console.error("Unable to load saved theme settings:", error);
  } finally {
    if (active) {
      useThemeStore.getState().setHasHydrated(true);
      setMounted(true);
    }
  }
};

void hydrate();

return () => {
  active = false;
};


}, []);

useEffect(() => {
if (!mounted || !hasHydrated) return;


const root = document.documentElement;

root.dataset.theme = theme;
root.style.setProperty("--brand-primary", primaryColor);
root.style.setProperty("--brand-accent", accentColor);
root.dataset.brand = brandName;


}, [mounted, hasHydrated, theme, brandName, primaryColor, accentColor]);

if (!mounted || !hasHydrated) {
return null;
}

return <>{children}</>;
}
