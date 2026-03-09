'use client'

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const games = [
  { id: 'pattern-matching', icon: '🎨', title: 'Pattern Matching', description: 'Remember and reproduce patterns', difficulty: 'Easy' },
  { id: 'word-association', icon: '🔗', title: 'Word Association', description: 'Find words in the same category', difficulty: 'Medium' },
  { id: 'number-recall', icon: '🔢', title: 'Number Recall', description: 'Remember number sequences', difficulty: 'Medium' },
  { id: 'sequence-memory', icon: '🔔', title: 'Sequence Memory', description: 'Watch and repeat the sequence', difficulty: 'Easy' },
  { id: 'word-recall', icon: '📝', title: 'Word Recall', description: 'Remember and type the words', difficulty: 'Hard' },
  { id: 'card-flip', icon: '🃏', title: 'Card Flip', description: 'Match the pairs of cards', difficulty: 'Easy' },
  { id: 'location-memory', icon: '📍', title: 'Location Memory', description: 'Remember item positions', difficulty: 'Medium' },
]

export default function MemoryPage() {
  const { t } = useTranslation()
  const { darkMode, toggleDarkMode } = useGameStore()

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
      <header className="p-6 bg-white dark:bg-slate-800 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="hover:underline mb-4 block">
              ← Back
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-50">🧠 {t('memory')}</h1>
          </div>
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-full transition-colors ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </motion.button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {games.map((game, i) => (
            <Link key={game.id} href={`/memory/${game.id}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.03 }}
                className={`${darkMode ? 'dark:bg-slate-700' : 'bg-white'} text-gray-800 rounded-xl p-6 shadow-lg dark:shadow-slate-900/50 cursor-pointer relative transition-colors`}
              >
                <span className={`absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-slate-200`}>
                  {game.difficulty}
                </span>
                <span className="text-5xl block mb-4">{game.icon}</span>
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-slate-50">{game.title}</h2>
                <p className="text-gray-600 dark:text-slate-300">{game.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
