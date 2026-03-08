'use client'

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'

const games = [
  { id: 'sequence-completion', icon: '📊', title: 'Sequence Completion', description: 'Complete the pattern' },
  { id: 'pattern-recognition', icon: '🔷', title: 'Pattern Recognition', description: 'Identify what comes next' },
  { id: 'maze-navigation', icon: '🧩', title: 'Maze Navigation', description: 'Find your way through the maze' },
  { id: 'jigsaw-puzzle', icon: '🖼️', title: 'Jigsaw Puzzle', description: 'Arrange the pieces' },
]

export default function PatternPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="p-6 bg-white shadow-sm">
        <Link href="/" className="text-purple-500 hover:underline mb-4 block">
          ← Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">🔮 {t('pattern')}</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {games.map((game, i) => (
            <Link key={game.id} href={`/pattern/${game.id}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl p-6 shadow-lg cursor-pointer"
              >
                <span className="text-5xl block mb-4">{game.icon}</span>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{game.title}</h2>
                <p className="text-gray-600">{game.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
