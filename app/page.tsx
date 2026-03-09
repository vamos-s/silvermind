'use client'

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const categories = [
  { id: 'memory', icon: '🧠', color: 'bg-indigo-500', games: 7 },
  { id: 'pattern', icon: '🔮', color: 'bg-amber-500', games: 4 },
  { id: 'logic', icon: '🧩', color: 'bg-emerald-500', games: 5 },
  { id: 'reaction', icon: '⚡', color: 'bg-rose-500', games: 4 },
  { id: 'spatial', icon: '🎯', color: 'bg-cyan-500', games: 7 },
  { id: 'attention', icon: '👁️', color: 'bg-violet-500', games: 5 },
  { id: 'language', icon: '📝', color: 'bg-orange-500', games: 5 },
]

export default function Home() {
  const { t } = useTranslation()
  const { darkMode, toggleDarkMode } = useGameStore()

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <header className="p-6 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-800 dark:text-white"
          >
            🧠 SilverMind
          </motion.h1>
          <div className="flex items-center gap-3">
            <Link href="/leaderboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
              >
                🏆 Leaderboard
              </motion.button>
            </Link>
            <Link href="/achievements">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
              >
                ⭐ Achievements
              </motion.button>
            </Link>
            <Link href="/challenges">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
              >
                📅 Challenges
              </motion.button>
            </Link>
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`p-3 rounded-full transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
            >
              {darkMode ? '☀️' : '🌙'}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-xl text-gray-600 mb-12"
        >
          {t('welcome')}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {categories.map((cat, i) => (
            <Link key={cat.id} href={`/${cat.id}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * (i + 1) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`${cat.color} rounded-2xl p-8 text-white shadow-lg cursor-pointer min-h-[200px] flex flex-col items-center justify-center`}
              >
                <span className="text-6xl mb-4">{cat.icon}</span>
                <h2 className="text-3xl font-bold mb-2 capitalize">{t(cat.id)}</h2>
                <p className="text-lg opacity-90">{cat.games} Games</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
