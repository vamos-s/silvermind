'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useGameStore } from '@/lib/store'
import { CATEGORY_COLORS } from '@/lib/game-data/colors'

const games = [
  {
    id: 'spotlight',
    title: { ko: '스포트라이트', en: 'Spotlight' },
    description: {
      ko: '제한된 시야로 숨겨진 물체를 찾으세요',
      en: 'Find hidden objects with limited visibility'
    },
    icon: '🔦',
    color: CATEGORY_COLORS.attention.primary,
  },
  {
    id: 'find-difference',
    title: { ko: '틀린그림찾기', en: 'Find Difference' },
    description: {
      ko: '두 이미지의 차이점을 빠르게 찾으세요',
      en: 'Find differences between two images quickly'
    },
    icon: '🔍',
    color: CATEGORY_COLORS.attention.primary,
  },
  {
    id: 'selective-search',
    title: { ko: '선택적 탐색', en: 'Selective Search' },
    description: {
      ko: '방해 요소 속에서 타겟을 찾으세요',
      en: 'Find targets among distractors'
    },
    icon: '🎯',
    color: CATEGORY_COLORS.attention.primary,
  },
  {
    id: 'concentration-grid',
    title: { ko: '집중력 그리드', en: 'Concentration Grid' },
    description: {
      ko: '숫자를 순서대로 빠르게 찾으세요',
      en: 'Find numbers in sequence quickly'
    },
    icon: '🔢',
    color: CATEGORY_COLORS.attention.primary,
  },
  {
    id: 'focus-tracker',
    title: { ko: '포커스 트래커', en: 'Focus Tracker' },
    description: {
      ko: '여러 움직이는 물체 중 하나를 추적하세요',
      en: 'Track one object among many moving objects'
    },
    icon: '👁️',
    color: CATEGORY_COLORS.attention.primary,
  },
]

export default function AttentionPage() {
  const { t } = useTranslation()
  const { darkMode } = useGameStore()

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className="p-6 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}
            >
              ← {t('back')}
            </motion.button>
          </Link>
          <h1 className="text-4xl font-bold mt-4">👁️ Attention & Focus</h1>
        </div>
      </header>

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
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow h-full`}>
                  <div className="text-5xl mb-4">{game.icon}</div>
                  <h2 className="text-xl font-bold mb-2">{game.title[ko] || game.title.en}</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {game.description[ko] || game.description.en}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${game.color} text-white`}>
                      Easy
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${game.color} text-white`}>
                      Medium
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${game.color} text-white`}>
                      Hard
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${game.color} text-white`}>
                      Expert
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${game.color} text-white`}>
                      Master
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
