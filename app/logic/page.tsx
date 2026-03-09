'use client'

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { ThemeToggle } from '@/components/ThemeToggle'

const games = [
  {
    id: 'math-operations',
    title: { ko: '수학 연산', en: 'Math Operations' },
    description: { ko: '수학 문제를 풀으세요', en: 'Solve math problems' },
    icon: '➕',
  },
  {
    id: 'sudoku',
    title: { ko: '스도쿠', en: 'Sudoku' },
    description: { ko: '숫자를 채우세요', en: 'Fill in the numbers' },
    icon: '🔢',
  },
  {
    id: 'number-sequence',
    title: { ko: '숫자 시퀀스', en: 'Number Sequence' },
    description: { ko: '다음 숫자를 찾으세요', en: 'Find the next number' },
    icon: '📊',
  },
  {
    id: 'logic-grid',
    title: { ko: '논리 그리드', en: 'Logic Grid' },
    description: { ko: '논리 퍼즐을 풀으세요', en: 'Solve logical puzzles' },
    icon: '🧩',
  },
  {
    id: 'logic-puzzle',
    title: { ko: '논리 퍼즐', en: 'Logic Puzzle' },
    description: { ko: '단서를 사용하여 상자를 정렬하세요', en: 'Arrange boxes using clues' },
    icon: '📦',
  },
]

export default function LogicPage() {
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
          <h1 className={`text-4xl font-bold mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🧩 Logic & Reasoning</h1>
        </div>
      </header>

      {/* Theme Toggle - Fixed Position */}
      <ThemeToggle />

      <main className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, i) => (
            <Link key={game.id} href={`/logic/${game.id}`}>
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
