"use client";

import { useState, useEffect } from "react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // Only run on client
    if (typeof window === 'undefined') return;

    // First check localStorage for saved preference
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(storedDarkMode);

    // Apply the saved theme to DOM
    if (storedDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    // Sync with localStorage for store compatibility
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', String(isDark));
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  if (!mounted) {
    return (
      <button
        className="cursor-pointer p-2 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 border border-purple-200 dark:border-purple-700"
        aria-label="Toggle theme"
      >
        <span className="w-6 h-6 block"></span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="cursor-pointer p-2 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-600/50 dark:to-pink-600/50 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-110 group border border-purple-200 dark:border-purple-500"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg
          className="w-6 h-6 text-yellow-400 group-hover:rotate-90 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6 text-purple-600 group-hover:-rotate-90 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
