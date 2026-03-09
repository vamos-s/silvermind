'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useGameStore } from '@/lib/store'
import { CATEGORY_COLORS } from '@/lib/game-data/colors'
import { ThemeToggle } from '@/components/ThemeToggle'

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
          <h1 className={`text-4xl font-bold mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>👁️ {t('attention')}</h1>
        </div>
      </header>

      {/* Theme Toggle - Fixed Position */}
      <ThemeToggle />

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
                  <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{game.title[lang as keyof typeof game.title] || game.title.en}</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {game.description[lang as keyof typeof game.description] || game.description.en}
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
