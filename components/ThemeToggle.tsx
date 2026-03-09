"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/lib/store";

export function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useGameStore();

  return (
    <motion.button
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 shadow-lg hover:scale-110 ${
        darkMode
          ? 'bg-gray-800/90 text-yellow-400'
          : 'bg-white/90 text-purple-600'
      } backdrop-blur-sm`}
      aria-label="Toggle theme"
    >
      <motion.div
        animate={{ rotate: darkMode ? 360 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {darkMode ? (
          // Sun icon
          <svg
            className="w-6 h-6"
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
          // Moon icon
          <svg
            className="w-6 h-6"
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
      </motion.div>
    </motion.button>
  );
}
