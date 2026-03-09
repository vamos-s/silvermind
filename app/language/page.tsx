'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useGameStore } from '@/lib/store'
import { CATEGORY_COLORS } from '@/lib/game-data/colors'
import { ThemeToggle } from '@/components/ThemeToggle'

const games = [
  {
    id: 'word-scramble',
    title: { ko: '워드 스크램블', en: 'Word Scramble' },
    description: {
      ko: '섞인 글자로 올바른 단어를 만드세요',
      en: 'Create correct words from scrambled letters'
    },
    icon: '🔤',
    color: CATEGORY_COLORS.language.primary,
  },
  {
    id: 'anagrams',
    title: { ko: '아나그램', en: 'Anagrams' },
    description: {
      ko: '같은 글자로 다른 단어 만들기',
      en: 'Create different words from same letters'
    },
    icon: '🔄',
    color: CATEGORY_COLORS.language.primary,
  },
  {
    id: 'synonym-matcher',
    title: { ko: '유의어 매칭', en: 'Synonym Matcher' },
    description: {
      ko: '같은 의미의 단어를 매칭하세요',
      en: 'Match words with same meaning'
    },
    icon: '🔗',
    color: CATEGORY_COLORS.language.primary,
  },
  {
    id: 'idiom-riddle',
    title: { ko: '속담 수수께끼', en: 'Idiom Riddle' },
    description: {
      ko: '속담과 관용사의 뜻을 맞추세요',
      en: 'Guess meanings of idioms and proverbs'
    },
    icon: '📚',
    color: CATEGORY_COLORS.language.primary,
  },
  {
    id: 'word-chain',
    title: { ko: '워드 체인', en: 'Word Chain' },
    description: {
      ko: '끝말잇기로 단어 체인을 만드세요',
      en: 'Chain words where each starts with last letter'
    },
    icon: '⛓️',
    color: CATEGORY_COLORS.language.primary,
  },
]

export default function LanguagePage() {
  const { t } = useTranslation()
  const { darkMode } = useGameStore()

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
          <h1 className={`text-4xl font-bold mt-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>📝 Language & Verbal</h1>
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
              <Link href={`/language/${game.id}`}>
                <div className={`rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow h-full ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                }`}>
                  <div className="text-5xl mb-4">{game.icon}</div>
                  <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{game.title.ko || game.title.en}</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {game.description.ko || game.description.en}
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
