'use client'

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { ThemeToggle } from '@/components/ThemeToggle'

const games = [
  { id: 'sequence-completion', icon: '📊', title: 'Sequence Completion', description: 'Complete the pattern', difficulty: 'Medium' },
  { id: 'pattern-recognition', icon: '🔷', title: 'Pattern Recognition', description: 'Identify what comes next', difficulty: 'Hard' },
  { id: 'maze-navigation', icon: '🧩', title: 'Maze Navigation', description: 'Find your way through the maze', difficulty: 'Medium' },
  { id: 'jigsaw-puzzle', icon: '🖼️', title: 'Jigsaw Puzzle', description: 'Arrange the pieces', difficulty: 'Easy' },
]

export default function PatternPage() {
  const { t } = useTranslation()
  const { darkMode } = useGameStore()

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <header className={`p-6 shadow-sm ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className={`hover:underline mb-4 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              ← Back
            </Link>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>🔮 {t('pattern')}</h1>
          </div>
        </div>
      </header>

      {/* Theme Toggle - Fixed Position */}
      <ThemeToggle />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
                <span className={`absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full ${
                  darkMode
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {game.difficulty}
                </span>
                <span className="text-5xl block mb-4">{game.icon}</span>
                <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{game.title}</h2>
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{game.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
