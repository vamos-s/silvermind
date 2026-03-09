'use client'

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { ThemeToggle } from '@/components/ThemeToggle'

const games = [
  {
    id: 'sequence-completion',
    title: { ko: '시퀀스 완성', en: 'Sequence Completion' },
    description: { ko: '패턴을 완성하세요', en: 'Complete the pattern' },
    icon: '📊',
  },
  {
    id: 'pattern-recognition',
    title: { ko: '패턴 인식', en: 'Pattern Recognition' },
    description: { ko: '다음을 식별하세요', en: 'Identify what comes next' },
    icon: '🔷',
  },
  {
    id: 'maze-navigation',
    title: { ko: '미로 내비게이션', en: 'Maze Navigation' },
    description: { ko: '미로를 통해 길을 찾으세요', en: 'Find your way through the maze' },
    icon: '🧩',
  },
  {
    id: 'jigsaw-puzzle',
    title: { ko: '지그소 퍼즐', en: 'Jigsaw Puzzle' },
    description: { ko: '조각을 배열하세요', en: 'Arrange the pieces' },
    icon: '🖼️',
  },
]

export default function PatternPage() {
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
          <h1 className={`text-4xl font-bold mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🔮 Pattern Recognition</h1>
        </div>
      </header>

      {/* Theme Toggle - Fixed Position */}
      <ThemeToggle />

      <main className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, i) => (
            <Link key={game.id} href={`/pattern/${game.id}`}>
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
