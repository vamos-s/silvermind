'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useGameStore } from '@/lib/store'
import { CATEGORY_COLORS } from '@/lib/game-data/colors'
import { SettingsPanel } from '@/components/SettingsPanel'

const games = [
  { id: 'spotlight', icon: '🔦', color: CATEGORY_COLORS.attention.primary },
  { id: 'find-difference', icon: '🔍', color: CATEGORY_COLORS.attention.primary },
  { id: 'selective-search', icon: '🎯', color: CATEGORY_COLORS.attention.primary },
  { id: 'concentration-grid', icon: '🔢', color: CATEGORY_COLORS.attention.primary },
  { id: 'focus-tracker', icon: '👁️', color: CATEGORY_COLORS.attention.primary },
]

export default function AttentionPage() {
  const { t } = useTranslation()
  const { darkMode } = useGameStore()

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <header className={`p-4 md:p-6 shadow-sm ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <Link href="/">
            <motion.button
              whileHover={ scale: 1.05 }
              whileTap={ scale: 0.95 }
              className={`px-3 py-2 md:px-4 rounded-lg text-sm md:text-base ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
            >
              ← {t('back')}
            </motion.button>
          </Link>
          <h1 className={`text-2xl md:text-4xl font-bold mt-3 md:mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>👁️ {t('attention')}</h1>
        </div>
      </header>

      <SettingsPanel />

      <main className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={`/attention/${game.id}`}>
                <div className={`rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow h-full ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                }`}>
                  <div className="text-5xl mb-4">{game.icon}</div>
                  <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{t(`gameInfo.${game.id}.title`)}</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t(`gameInfo.${game.id}.description`)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
