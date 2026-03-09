'use client'

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { ThemeToggle } from '@/components/SettingsPanel'

const games = [
  {
    id: 'timing-game',
    title: { ko: '타이밍 게임', en: 'Timing Game' },
    description: { ko: '색이 변할 때 클릭하세요', en: 'Click when the color changes' },
    icon: '⏱️',
  },
  {
    id: 'target-detection',
    title: { ko: '타겟 탐지', en: 'Target Detection' },
    description: { ko: '타겟을 빠르게 찾으세요', en: 'Find the targets quickly' },
    icon: '🎯',
  },
  {
    id: 'color-match',
    title: { ko: '컬러 매치', en: 'Color Match' },
    description: { ko: '색이나 단어를 일치시키세요', en: 'Match the color or word' },
    icon: '🌈',
  },
  {
    id: 'quick-reaction',
    title: { ko: '퀵 리액션', en: 'Quick Reaction' },
    description: { ko: '반응 속도를 테스트하세요', en: 'Test your reaction speed' },
    icon: '⚡',
  },
]

export default function ReactionPage() {
  const { t, i18n } = useTranslation()
  const { darkMode } = useGameStore()
  const lang = i18n.language

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <header className={`p-6 shadow-sm ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg ${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
            >
              ← {t('back')}
            </motion.button>
          </Link>
          <h1 className={`text-4xl font-bold mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>⚡ {t('reaction')}</h1>
        </div>
      </header>

      {/* Theme Toggle - Fixed Position */}
      <SettingsPanel />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {games.map((game, i) => (
            <Link key={game.id} href={`/reaction/${game.id}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.03 }}
                className={`rounded-xl p-6 shadow-lg cursor-pointer relative transition-colors ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-750'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <span className="text-5xl block mb-4">{game.icon}</span>
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {game.title[lang as keyof typeof game.title] || game.title.en}
                </h2>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {game.description[lang as keyof typeof game.description] || game.description.en}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
