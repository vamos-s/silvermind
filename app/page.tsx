'use client'

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'

const categories = [
  { id: 'memory', icon: '🧠', color: 'bg-blue-500', games: 5 },
  { id: 'pattern', icon: '🔮', color: 'bg-purple-500', games: 4 },
  { id: 'logic', icon: '🧩', color: 'bg-green-500', games: 4 },
  { id: 'reaction', icon: '⚡', color: 'bg-yellow-500', games: 3 },
  { id: 'spatial', icon: '🎯', color: 'bg-red-500', games: 2 },
]

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="p-6 bg-white shadow-sm">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-gray-800"
        >
          🧠 SilverMind
        </motion.h1>
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
