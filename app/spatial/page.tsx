'use client'

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'

const games = [
  { id: 'rotated-shapes', icon: '🔷', title: 'Rotated Shapes', description: 'Match the rotated shapes', difficulty: 'Hard' },
  { id: 'distance-judgment', icon: '📏', title: 'Distance Judgment', description: 'Estimate distances', difficulty: 'Medium' },
  { id: 'pattern-in-3d', icon: '🧊', title: 'Pattern in 3D', description: 'Match 3D patterns', difficulty: 'Hard' },
  { id: 'mental-rotation-advanced', icon: '🔶', title: 'Mental Rotation Advanced', description: 'Advanced complex shapes rotation', difficulty: 'Hard' },
  { id: 'shape-reconstruction', icon: '🧩', title: 'Shape Reconstruction', description: 'Reconstruct shapes from parts', difficulty: 'Hard' },
  { id: 'perspective-matching', icon: '👁️', title: 'Perspective Matching', description: 'Match object perspectives', difficulty: 'Hard' },
  { id: 'cube-navigation', icon: '🎲', title: 'Cube Navigation', description: 'Navigate through 3D cube', difficulty: 'Hard' },
]

export default function SpatialPage() {
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-slate-50">🎯 {t('spatial')}</h1>
            <p className="text-gray-600 dark:text-slate-300 mt-2">
              {games.length} games available
            </p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {games.map((game, i) => (
            <Link key={game.id} href={`/spatial/${game.id}`}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ scale: 1.03 }}
                className={`${darkMode ? 'dark:bg-slate-700' : 'bg-white'} text-gray-800 rounded-xl p-6 shadow-lg dark:shadow-slate-900/50 cursor-pointer relative transition-colors`}
              >
                <span className={`absolute top-4 right-4 px-2 py-1 text-xs font-semibold rounded-full ${
                  game.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {game.difficulty}
                </span>
                <span className="text-5xl block mb-4">{game.icon}</span>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-slate-50 mb-2">{game.title}</h2>
                <p className="text-gray-600 dark:text-slate-300">{game.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
