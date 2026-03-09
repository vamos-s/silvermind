"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { darkMode, syncDarkMode } = useGameStore();

  useEffect(() => {
    // Listen for localStorage changes (from ThemeToggle)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'darkMode') {
        syncDarkMode();
      }
    };

    // Also check periodically (for same-tab changes)
    const interval = setInterval(() => {
      const storedDarkMode = localStorage.getItem('darkMode') === 'true';
      if (darkMode !== storedDarkMode) {
        syncDarkMode();
      }
    }, 500);

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [darkMode, syncDarkMode]);

  return <>{children}</>;
}
