'use client'

import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useGameStore } from '@/lib/store'
import { ThemeToggle } from '@/components/ThemeToggle'

const games = [
  {
    id: 'rotated-shapes',
    title: { ko: '회전된 도형', en: 'Rotated Shapes' },
    description: { ko: '회전된 도형을 맞추세요', en: 'Match the rotated shapes' },
    icon: '🔷',
  },
  {
    id: 'distance-judgment',
    title: { ko: '거리 판단', en: 'Distance Judgment' },
    description: { ko: '거리를 추정하세요', en: 'Estimate distances' },
    icon: '📏',
  },
  {
    id: 'pattern-in-3d',
    title: { ko: '3D 패턴', en: 'Pattern in 3D' },
    description: { ko: '3D 패턴을 맞추세요', en: 'Match 3D patterns' },
    icon: '🧊',
  },
  {
    id: 'mental-rotation-advanced',
    title: { ko: '고급 정신 회전', en: 'Mental Rotation Advanced' },
    description: { ko: '복잡한 도형 회전', en: 'Advanced complex shapes rotation' },
    icon: '🔶',
  },
  {
    id: 'shape-reconstruction',
    title: { ko: '도형 재구성', en: 'Shape Reconstruction' },
    description: { ko: '부분에서 도형을 재구성하세요', en: 'Reconstruct shapes from parts' },
    icon: '🧩',
  },
  {
    id: 'perspective-matching',
    title: { ko: '관점 매칭', en: 'Perspective Matching' },
    description: { ko: '물체 관점을 맞추세요', en: 'Match object perspectives' },
    icon: '👁️',
  },
  {
    id: 'cube-navigation',
    title: { ko: '큐브 내비게이션', en: 'Cube Navigation' },
    description: { ko: '3D 큐브를 탐색하세요', en: 'Navigate through 3D cube' },
    icon: '🎲',
  },
]

export default function SpatialPage() {
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
          <h1 className={`text-4xl font-bold mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🎯 Spatial Reasoning</h1>
        </div>
      </header>

      {/* Theme Toggle - Fixed Position */}
      <ThemeToggle />

      <main className="p-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, i) => (
            <Link key={game.id} href={`/spatial/${game.id}`}>
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
